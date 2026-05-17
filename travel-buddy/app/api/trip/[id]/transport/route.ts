import { connectDB } from "@/lib/db";
import Trip from "@/models/trip";
import { getIataCode, searchFlightsAeroDataBox } from "@/lib/api/flight";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const { id } = await params;
    const trip = await Trip.findById(id);

    if (!trip) {
      return Response.json({ success: false, error: "Trip not found" }, { status: 404 });
    }

    const fromName = trip.startLocation || "Delhi";
    const toName = trip.destination || "Mumbai";

    // 1. Get IATA codes from AI plan if available
    const aiTransport = trip.plan?.transportOptions || [];
    const aiFlight = aiTransport.find((t: any) => t.type.toLowerCase() === "flight" && t.fromIata && t.toIata);
    
    let fromIata = aiFlight?.fromIata;
    let toIata = aiFlight?.toIata;

    if (!fromIata || !toIata) {
        console.log(`AI IATA missing, falling back to lookup for ${fromName} -> ${toName}`);
        fromIata = fromIata || await getIataCode(fromName);
        toIata = toIata || await getIataCode(toName);
    }

    console.log(`Resolved IATA: ${fromIata} -> ${toIata}`);

    let realFlights: any[] = [];

    // 2. Search real flights if IATA codes are found
    if (fromIata && toIata) {
      const flightData = await searchFlightsAeroDataBox(fromIata, toIata);
      console.log(`Flight Data received:`, !!flightData);
      
      if (flightData) {
        const departures = flightData.departures || [];

        const filteredFlights = departures.filter((f: any) => {
            const arrivalIata = f.movement?.airport?.iata;
            return arrivalIata?.toLowerCase() === toIata.toLowerCase();
        });
        
        if (filteredFlights.length > 0) {
            realFlights = filteredFlights.map((f: any) => {
                const depTime = f.movement?.scheduledTime?.local || f.movement?.scheduledTime?.utc;
                
                const airlineName = typeof f.airline === 'string' ? f.airline : (f.airline?.name || "Unknown Airline");

                return {
                    type: "Flight",
                    airline: airlineName,
                    flightNumber: f.number || "N/A",
                    departureTime: depTime ? new Date(depTime.replace(' ', 'T')).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "N/A",
                    arrivalTime: "Check Live",
                    fromCity: fromName,
                    toCity: toName,
                    cost: 0,
                    bookingUrl: `https://www.google.com/travel/flights?q=Flights%20to%20${toName}%20from%20${fromName}`,
                    status: f.status || "Scheduled",
                    isRealTime: true
                };
            });
        }
      }
  }

    return Response.json({
      success: true,
      data: {
        aiTransport,
        realFlights,
        startLocation: fromName,
        destination: toName
      }
    });
  } catch (error) {
    console.error(error);
    return Response.json({ success: false, error: "Server error" }, { status: 500 });
  }

}