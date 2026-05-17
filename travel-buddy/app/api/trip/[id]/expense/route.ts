import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Trip from "@/models/trip";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const { title, amount, category } = await req.json();

    if (!title || !amount) {
      return NextResponse.json({ success: false, message: "Title and amount are required" }, { status: 400 });
    }

    const trip = await Trip.findById(params.id);
    if (!trip) {
      return NextResponse.json({ success: false, message: "Trip not found" }, { status: 404 });
    }

    const newExpense = { title, amount, category: category || "general", createdAt: new Date() };
    
    // Add to expenses array
    if (!trip.expenses) trip.expenses = [];
    trip.expenses.push(newExpense);
    
    await trip.save();

    return NextResponse.json({ success: true, data: newExpense, expenses: trip.expenses });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
