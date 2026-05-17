import { connectDB } from "@/lib/db";
import Trip from "@/models/trip";
import { getUserId } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    await connectDB();
    const userId = await getUserId();
    
    let recentTrip: any = null;
    if (userId) {
      recentTrip = await Trip.findOne({ userId }).sort({ createdAt: -1 });
    }

    const defaultRecommended = [
      {
        name: "Rishikesh, Uttarakhand",
        tagline: "SPIRITUAL RETREAT & RIVER RAFTING",
        price: "Leisure & Peace • 4 Days",
        img: "https://images.unsplash.com/photo-1545638870-155491791a0b?w=800",
      },
      {
        name: "Goa, Sandy Beaches",
        tagline: "BEACH PARTY & SEAFOOD",
        price: "Fun & Adventure • 5 Days",
        img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800",
      },
      {
        name: "Udaipur, Rajasthan",
        tagline: "ROYAL LAKES & PALACES",
        price: "Luxury & Heritage • 3 Days",
        img: "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800",
      },
      {
        name: "Leh Ladakh, Himalayas",
        tagline: "MOUNTAIN BIKING & MONASTERIES",
        price: "Adventure & High Pass • 7 Days",
        img: "https://images.unsplash.com/photo-1524661135-423995f22d0b?w=800",
      }
    ];

    if (!recentTrip) {
      return Response.json({ success: true, data: defaultRecommended });
    }

    const destination = recentTrip.destination?.toLowerCase() || "";
    
    let customRecommended = [...defaultRecommended];

    if (destination.includes("goa") || destination.includes("beach") || destination.includes("mumbai") || destination.includes("ocean")) {
      customRecommended = [
        {
          name: "Varkala, Kerala",
          tagline: "CLIFFSIDE BEACHES & SUNSETS",
          price: "Coastal Leisure • 4 Days",
          img: "https://images.unsplash.com/photo-1563294371-fa55c48b29df?w=800",
        },
        {
          name: "Gokarna, Karnataka",
          tagline: "SACRED TEMPLES & CALM SEAS",
          price: "Peaceful Beachfront • 3 Days",
          img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800",
        },
        {
          name: "Pondicherry, Tamil Nadu",
          tagline: "FRENCH QUARTERS & BEACH BREEZE",
          price: "Heritage & Cafe Hopping • 4 Days",
          img: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800",
        },
        {
          name: "Havelock Island, Andamans",
          tagline: "BLUE LAGOONS & SCUBA DIVING",
          price: "Adventure Tropical • 6 Days",
          img: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800",
        }
      ];
    } else if (destination.includes("kathmandu") || destination.includes("rishikesh") || destination.includes("leh") || destination.includes("mount") || destination.includes("himalaya") || destination.includes("nepal")) {
      customRecommended = [
        {
          name: "Dharamshala, Himachal",
          tagline: "BUDDHIST MONASTERIES & TREKS",
          price: "Mountain Serenity • 5 Days",
          img: "https://images.unsplash.com/photo-1544025162-d76694265947?w=800",
        },
        {
          name: "Pokhara, Nepal",
          tagline: "ANNAPURNA LAKES & PARAGLIDING",
          price: "Lake Adventure • 4 Days",
          img: "https://images.unsplash.com/photo-1545638870-155491791a0b?w=800",
        },
        {
          name: "Munnar, Western Ghats",
          tagline: "TEA PLANTATIONS & HILL VIEWS",
          price: "Green Serenity • 3 Days",
          img: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800",
        },
        {
          name: "Manali, Solang Valley",
          tagline: "SNOW PEAKS & RIVER CROSSING",
          price: "High Adventure • 5 Days",
          img: "https://images.unsplash.com/photo-1524661135-423995f22d0b?w=800",
        }
      ];
    } else if (destination.includes("udaipur") || destination.includes("jaipur") || destination.includes("raj") || destination.includes("heritage") || destination.includes("fort")) {
      customRecommended = [
        {
          name: "Jodhpur, The Blue City",
          tagline: "MEHRANGARH FORT & SPICES",
          price: "Royal Heritage • 3 Days",
          img: "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800",
        },
        {
          name: "Hampi, Karnataka",
          tagline: "RUINS OF EMPIRE & BOULDERS",
          price: "Historic Exploration • 4 Days",
          img: "https://images.unsplash.com/photo-1600100397608-f010e42fa48f?w=800",
        },
        {
          name: "Jaisalmer, Golden Desert",
          tagline: "SAND DUNES & FORT STAYS",
          price: "Desert Adventure • 3 Days",
          img: "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=800",
        },
        {
          name: "Varanasi, Uttar Pradesh",
          tagline: "GANGA AARTI & ANCIENT STREETS",
          price: "Spiritual Heritage • 3 Days",
          img: "https://images.unsplash.com/photo-1561361513-2d000a50f0db?w=800",
        }
      ];
    }

    return Response.json({ success: true, data: customRecommended });
  } catch (error: any) {
    console.error(error);
    return Response.json({ success: false, error: error.message || "Failed to load recommendations" }, { status: 500 });
  }
}
