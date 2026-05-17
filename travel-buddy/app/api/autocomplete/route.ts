import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const text = searchParams.get("text");

    if (!text || text.trim().length < 2) {
      return NextResponse.json({ success: true, data: [] });
    }

    const apiKey = process.env.GEOAPIFY_API_KEY;
    if (!apiKey) {
      console.error("GEOAPIFY_API_KEY is not configured in environment variables.");
      return NextResponse.json({ success: false, error: "Configuration Error" }, { status: 500 });
    }

    const url = `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(text)}&apiKey=${apiKey}`;
    const res = await fetch(url);
    const data = await res.json();

    const suggestions = data.features?.map((f: any) => f.properties?.formatted) || [];

    return NextResponse.json({ success: true, data: suggestions });
  } catch (error) {
    console.error("Geoapify Autocomplete API Route Error:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
