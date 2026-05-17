import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Trip from "@/models/trip";
import { generateTripPlanGemini } from "@/lib/gemini";
import { getTodayPlan, getCurrentActivity, budgetStatus } from "@/lib/journey-engine";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const { id } = await params;
    const body = await req.json();
    const { action, prompt, weather, currentTime } = body;

    const trip = await Trip.findById(id);
    if (!trip) {
      return NextResponse.json({ success: false, message: "Trip not found" }, { status: 404 });
    }

    // Prepare context
    const budgetInfo = budgetStatus(trip.budget, trip.expenses || []);
    const todayPlanObj = getTodayPlan(trip);
    const currentAct = getCurrentActivity(trip, todayPlanObj);
    
    // Construct the LLM Prompt
    const replanPrompt = `
      You are an AI Travel Assistant operating a live travel app. 
      The user is currently on a trip to ${trip.destination}. 
      Total Budget: ${trip.budget}, Spent: ${budgetInfo.spent}, Remaining: ${budgetInfo.remaining}.
      Travel Mode: ${trip.mode}, Travel Type: ${trip.travelType}.
      
      Current Date/Time (System): ${new Date().toISOString()} (User provided time: ${currentTime || 'N/A'})
      Current Day Index: ${todayPlanObj.dayIndex}
      Current Activity Status: ${JSON.stringify(currentAct)}
      
      User Request / Situation: "${prompt || action}"
      Weather context: ${weather || "Clear"}
      
      The user needs to replan the REST of their itinerary for Day ${todayPlanObj.dayIndex + 1} and beyond.
      Do NOT modify days before Day ${todayPlanObj.dayIndex + 1}.
      If the user is over budget, suggest free/cheap activities.
      If delayed, compress or skip upcoming activities.
      
      Return ONLY a JSON array representing the updated itinerary for the remaining days. 
      Format exactly like the original itinerary array:
      [
        {
          "day": "Day X",
          "theme": "Theme of day",
          "plan": [
            { "time": "10:00 AM - 12:00 PM", "activity": "Name", "details": "Desc", "type": "Food/Activity/Stay" }
          ]
        }
      ]
      No markdown wrapping, just raw JSON.
    `;

    const aiResponse = await generateTripPlanGemini(replanPrompt);
    
    if (aiResponse.error || !Array.isArray(aiResponse)) {
      return NextResponse.json({ success: false, message: "Failed to generate valid replan from AI", error: aiResponse }, { status: 500 });
    }

    // Merge logic: preserve past days, overwrite current and future days
    const currentItinerary = trip.plan.itinerary;
    const newItinerary = [...currentItinerary];
    
    // The AI returns an array of updated days. Let's map them.
    // Assuming AI returns days matching the remaining days.
    aiResponse.forEach((newDay: any, i: number) => {
       const targetIndex = todayPlanObj.dayIndex + i;
       if (targetIndex < newItinerary.length) {
          newItinerary[targetIndex] = newDay;
       }
    });

    trip.plan.itinerary = newItinerary;
    // We mark the trip as modified
    trip.markModified('plan');
    await trip.save();

    return NextResponse.json({ success: true, data: trip });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
