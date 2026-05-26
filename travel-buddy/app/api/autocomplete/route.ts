import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const text = searchParams.get("text");

    if (!text || text.trim().length < 2) {
      return NextResponse.json({ success: true, data: [] });
    }

    // Try Geoapify first
    try {
      const apiKey = process.env.GEOAPIFY_API_KEY;
      if (apiKey) {
        const url = `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(text)}&apiKey=${apiKey}`;
        
        // Add a timeout to prevent hanging
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 4000);
        
        const res = await fetch(url, { signal: controller.signal });
        clearTimeout(timeoutId);

        if (res.ok) {
          const data = await res.json();
          const suggestions = data.features?.map((f: any) => f.properties?.formatted) || [];
          if (suggestions.length > 0) {
            return NextResponse.json({ success: true, data: suggestions });
          }
        }
      }
    } catch (err) {
      console.error("Geoapify fetch failed, falling back to Nominatim...");
    }

    // Fallback to Nominatim (OpenStreetMap)
    const nominatimUrl = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(text)}&format=json&addressdetails=1&limit=5`;
    const fallbackRes = await fetch(nominatimUrl, {
      headers: {
        "User-Agent": "TravelBuddyApp/1.0"
      }
    });
    
    if (fallbackRes.ok) {
      const fallbackData = await fallbackRes.json();
      const suggestions = fallbackData.map((item: any) => item.display_name);
      return NextResponse.json({ success: true, data: suggestions });
    }

    return NextResponse.json({ success: true, data: [] });
  } catch (error) {
    console.error("Autocomplete API Route Error:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
