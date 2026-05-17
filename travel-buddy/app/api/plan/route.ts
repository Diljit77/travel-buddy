import { generateTripPlan } from "@/lib/ai";
import { getPexelsImage } from "@/lib/pexels";
import { getWeather } from "@/lib/Weather";
import { connectDB } from "@/lib/db";
import Trip from "@/models/trip";
import { getUserId } from "@/lib/auth";


export async function POST(req: Request) {
  try {
    await connectDB();
    const userId = await getUserId();

    if (!userId) {
       return Response.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    const {
      budget,
      days,
      mode,
      destination,
      userLocation,
      travelType,
    } = body;

    const city = destination || "Rishikesh";

    const weather = await getWeather(city);

    // 🤖 AI plan (with imageQuery)
    const plan = await generateTripPlan({
      budget,
      days,
      mode,
      weather,
      destination,
      userLocation,
      travelType,
    });


    const destinationImage = await getPexelsImage(
      plan.destinationImageQuery || plan.destination
    );

    const travelImage = await getPexelsImage(
      plan.travel?.imageQuery || plan.travel?.mode
    );

    const itineraryWithImages = await Promise.all(
      plan.itinerary.map(async (day: any) => {
        const plans = await Promise.all(
          day.plan.map(async (item: any) => {
            const image = await getPexelsImage(
              item.imageQuery || item.activity
            );

            return {
              ...item,
              image,
            };
          })
        );

        return { ...day, plan: plans };
      })
    );

    const finalPlan = {
      ...plan,
      destinationImage,
      travel: {
        ...plan.travel,
        image: travelImage,
      },
      itinerary: itineraryWithImages,
    };

    // 💾 Automatically save the trip
    const trip = await Trip.create({
      userId: userId,
      destination: finalPlan.destination,
      destinationImage: finalPlan.destinationImage,
      startLocation: finalPlan.transportOptions?.[0]?.fromCity || "Delhi",
      travelType: travelType,
      budget: Number(budget),
      days: Number(days),
      mode: Array.isArray(mode) ? mode.join(", ") : mode,
      plan: finalPlan,
    });

    return Response.json({ success: true, data: finalPlan, trip });
  } catch (error) {
    console.error(error);
    return Response.json({ success: false, error: "AI failed" });
  }
}