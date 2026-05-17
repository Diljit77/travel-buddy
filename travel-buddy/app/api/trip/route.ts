import { connectDB } from "@/lib/db";
import Trip from "@/models/trip";
import { getUserId } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    await connectDB();
    const userId = await getUserId();

    if (!userId) {
      return Response.json({ success: false, error: "Unauthorized - Please login" }, { status: 401 });
    }

    const body = await req.json();

    const trip = await Trip.create({
      ...body,
      userId: userId,
    });
   
    return Response.json({ success: true, trip });
  } catch (error) {
    console.error("Save trip error:", error);
    return Response.json({ success: false, error: "Failed to save trip" }, { status: 500 });
  }
}

export async function GET() {
  try {
    await connectDB();
    const userId = await getUserId();

    if (!userId) {
      return Response.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const trips = await Trip.find({ userId }).sort({ createdAt: -1 });

    return Response.json({ success: true, data: trips });
  } catch (error) {
    console.error("Fetch trips error:", error);
    return Response.json({ success: false, error: "Server error" }, { status: 500 });
  }
}