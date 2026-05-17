import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Trip from "@/models/trip";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const { id } = await params;
    const { day, activityIndex } = await req.json();

    if (day === undefined || activityIndex === undefined) {
      return NextResponse.json({ success: false, message: "Day and activityIndex are required" }, { status: 400 });
    }

    const trip = await Trip.findById(id);
    if (!trip) {
      return NextResponse.json({ success: false, message: "Trip not found" }, { status: 404 });
    }

    // Initialize if not exists
    if (!trip.completedActivities) {
      trip.completedActivities = [];
    }

    // Prevent duplicates
    const alreadyCompleted = trip.completedActivities.some(
      (a: any) => a.day === day && a.activityIndex === activityIndex
    );

    if (!alreadyCompleted) {
      trip.completedActivities.push({
        day,
        activityIndex,
        completedAt: new Date()
      });
      await trip.save();
    }

    return NextResponse.json({ success: true, completedActivities: trip.completedActivities });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
