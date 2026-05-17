import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Trip from "@/models/trip";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const { id } = await params;
    const { status, lastKnownLocation } = await req.json();

    const trip = await Trip.findById(id);
    if (!trip) {
      return NextResponse.json({ success: false, message: "Trip not found" }, { status: 404 });
    }

    if (status) {
      const validStatuses = ["planned", "ongoing", "paused", "completed"];
      if (!validStatuses.includes(status)) {
        return NextResponse.json({ success: false, message: "Invalid status" }, { status: 400 });
      }
      trip.status = status;

      // Handle journey state initialization
      if (status === "ongoing" && !trip.journeyState?.startedAt) {
        trip.journeyState = {
          ...trip.journeyState,
          startedAt: new Date(),
          currentDay: 1
        };
      }
    }

    if (lastKnownLocation) {
       trip.journeyState = {
          ...trip.journeyState,
          lastKnownLocation
       };
    }

    await trip.save();

    return NextResponse.json({ success: true, status: trip.status, journeyState: trip.journeyState });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
