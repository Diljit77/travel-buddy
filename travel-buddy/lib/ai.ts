import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export const generateTripPlan = async ({
  budget,
  days,
  mode,
  weather,
  destination,
  userLocation,
  travelType,
}: any) => {
  const prompt = `
You are a real-world travel planner for India.

USER INPUT:
- Budget: ₹${budget}
- Days: ${days}
- Mode: ${mode}
- Travel Type: ${travelType}
- User Location: ${userLocation}
- Destination: ${destination || "Suggest best option"}

WEATHER DATA:
- Condition: ${weather.condition}
- Description: ${weather.description}
- Temperature: ${weather.temperature}°C
- Feels Like: ${weather.feelsLike}°C
- Humidity: ${weather.humidity}%

---

INSTRUCTIONS:

1. Destination:
- If destination is NOT provided → suggest best place within budget
- Consider distance from user's location

2. Transport Planning (VERY IMPORTANT):

- Analyze the user's current location and destination carefully.
- For long-distance travel, intelligently compare:
  - Flights
  - Trains
  - Buses
  - Cab/Taxi (only if practical)
- Find the nearest major airport, railway station, or bus hub from the user's location.
- Use realistic Indian transport routes.
- FOR FLIGHTS: Always include the 3-letter IATA code for departure and arrival airports.

Examples:
- Kurali, Punjab → nearest airport = Chandigarh (IXC)
- Shimla → nearest airport = Shimla (SLV) or Chandigarh (IXC)
- Manali → nearest airport = Kullu (KUU) or Chandigarh (IXC)

- If flights are too expensive for the budget:
  - prefer train or bus
- If the trip is short distance:
  - avoid flights
- If destination is mountainous:
  - explain last-mile travel
For EACH transport option ALSO include:
- operatorName
- departureTime
- arrivalTime
- fromCity
- toCity
- fromIata (VERY IMPORTANT for flights, e.g., "DEL")
- toIata (VERY IMPORTANT for flights, e.g., "BOM")
- bookingPlatform
- imageQuery
Generate MULTIPLE transport options when possible.

bookingPlatform examples:
- RedBus
- ixigo
- MakeMyTrip
- IRCTC
For EACH transport option include:
- mode
- route
- nearest station/airport/bus stop
- estimated duration
- realistic Indian cost
- comfort level
- recommendation reason
- imageQuery
Generate MULTIPLE transport options when possible.

Example:
{
  "transportOptions": [
    {
      "type": "Flight",
      "route": "Chandigarh Airport → Delhi Airport",
      "nearestHub": "Chandigarh International Airport",
      "fromIata": "IXC",
      "toIata": "DEL",
      "duration": "1h 10m",
      "cost": 4875,
      "comfort": "High",
      "recommended": false,
      "reason": "Fastest but expensive for budget travelers",
      "imageQuery": "India domestic airport"
    },
    {
      "type": "Train",
      "route": "Chandigarh → New Delhi",
      "nearestHub": "Chandigarh Railway Station",
      "duration": "4h 30m",
      "cost": 845,
      "comfort": "Medium",
      "recommended": true,
      "reason": "Best balance of budget and comfort",
      "imageQuery": "Indian train travel"
    },
    {
      "type": "Bus",
      "operatorName": "Zingbus",
      "departureTime": "10:30 PM",
      "arrivalTime": "05:00 AM",
      "route": "Kurali → Delhi",
      "nearestHub": "Kurali Bus Stand",
      "duration": "6h 30m",
      "cost": 620,
      "comfort": "Medium",
      "recommended": false,
      "reason": "Cheapest option but slower",
      "imageQuery": "Volvo bus India"
    }
  ]
}

3. Budget:
- DO NOT use rounded numbers
- Example: 1875, 3260
- Total must be ≤ budget

4. Itinerary:
- Day-wise
- Include time (morning/afternoon/evening)

5. Smart Behavior:
- Adjust for mode (spiritual, adventure, etc.)

6. Weather Awareness:
- Adjust activities based on weather

7. Food:
- Local food + realistic cost

8. Misc:
- network issues, safety tips

9. Images (VERY IMPORTANT):
- DO NOT return image URLs
- Instead return "imageQuery"
- Keep it short and specific

Examples:
"destinationImageQuery": "Jaipur city palace"
"imageQuery": "Amber Fort Jaipur"
"imageQuery": "bus travel India highway"

---

UPDATED JSON STRUCTURE:
---

RETURN STRICT JSON:

{
  "destination": "",
  "destinationImageQuery": "",
  "transportOptions": [
    {
      "type": "",
      "operatorName": "",
      "departureTime": "",
      "arrivalTime": "",
      "fromCity": "",
      "toCity": "",
      "fromIata": "",
      "toIata": "",
      "route": "",
      "nearestHub": "",
      "duration": "",
      "cost": 0,
      "comfort": "",
      "recommended": false,
      "reason": "",
      "bookingPlatform": "",
      "imageQuery": ""
    }
  ],
  "weatherSummary": { "condition": "", "temperature": 0, "impact": "" },
  "itinerary": [
    {
      "day": 1,
      "plan": [
        {
          "time": "",
          "activity": "",
          "details": "",
          "cost": 0,
          "imageQuery": ""
        }
      ]
    }
  ],
  "budgetBreakdown":
    { "travel": 0, "stay": 0, "food": 0, "activities": 0, "misc": 0, "total": 0 },
  "insights": 
    { "crowdLevel": "", "network": "", "safety": "" }
}

IMPORTANT:
- No text outside JSON
- No ₹ symbol
- Ensure total ≤ budget
`;

  try {
  

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash", // fast + free
    });

    const result = await model.generateContent(prompt);
    const response = await result.response;
let text = response.text();

// 🔥 VERY IMPORTANT (Gemini fix)
text = text.replace(/```json|```/g, "").trim();

const parsed = JSON.parse(text);

// Add booking URLs
parsed.transportOptions =
  parsed.transportOptions?.map((transport: any) => {
    const fromSlug = transport.fromCity
      ?.toLowerCase()
      .replace(/,/g, "")
      .replace(/\s+/g, "-");

    const toSlug = transport.toCity
      ?.toLowerCase()
      .replace(/,/g, "")
      .replace(/\s+/g, "-");

    let bookingUrl = "#";

    switch (transport.type.toLowerCase()) {
      case "bus":
        bookingUrl = `https://www.redbus.in/bus-tickets/${fromSlug}-to-${toSlug}`;
        break;

      case "train":
        bookingUrl = `https://www.ixigo.com/search/result/train/`;
        break;

      case "flight":
        bookingUrl = `https://www.makemytrip.com/flights/`;
        break;
      
      case "car":
      case "cab":
        bookingUrl = `https://www.uber.com/`;
        break;
    }

    return {
      ...transport,
      bookingUrl,
    };
  }) || [];

return parsed;
  } catch (error) {
    console.error("Gemini error:", error);
    return { error: "AI failed" };
  }
};