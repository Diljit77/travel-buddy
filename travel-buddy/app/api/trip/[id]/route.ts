import { connectDB } from "@/lib/db";
import Trip from "@/models/trip";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const trip = await Trip.findById(id);

    if (!trip) {
      return Response.json({ success: false, error: "Trip not found" }, { status: 404 });
    }

    return Response.json({ success: true, data: trip });
  } catch (error) {
    console.error(error);
    return Response.json({ success: false, error: "Server error" }, { status: 500 });
  }
}
