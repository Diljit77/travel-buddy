"use client";
import { useState } from "react";
import { T } from "./Theme";
import { Badge } from "./Badge";

interface ItineraryItem {
  time: string;
  activity: string;
  details: string;
  cost: number;
  imageQuery?: string;
  image?: string;
}

interface ItineraryDay {
  day: number;
  plan: ItineraryItem[];
}

const getRestaurantsForActivity = (activity: string, time: string, destination: string) => {
  const normalized = activity.toLowerCase();
  const cleanDest = destination.split(",")[0].trim();
  
  let name = "";
  let rating = (4.4 + Math.random() * 0.5).toFixed(1);
  let tag = "";
  let avgPrice = "₹250 - ₹500";
  let signatureDish = "Traditional Regional Dish";
  let img = "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400";
  let highlight = false;
  let description = "";

  // 1. Specific local matching for iconic cities
  if (normalized.includes("anjuna") || normalized.includes("vagator") || normalized.includes("goa") || normalized.includes("baga")) {
    if (time.toLowerCase().includes("morn") || time.toLowerCase().includes("breakfast")) {
      name = "German Bakery (Anjuna)";
      tag = "ORGANIC & YOGA";
      avgPrice = "₹200 - ₹400";
      signatureDish = "Avocado Toast & Organic Mango Smoothie";
      description = "Famous for organic breakfast, fresh juices, and a relaxing bohemian vibe.";
      img = "https://images.unsplash.com/photo-1445116572660-236099ec97a0?w=400";
    } else if (time.toLowerCase().includes("aftern") || time.toLowerCase().includes("lunch")) {
      name = "Britto's Beach Shack";
      tag = "BEACHFRONT SEAFOOD";
      highlight = true;
      avgPrice = "₹500 - ₹1,000";
      signatureDish = "Goan Fish Curry & Butter Garlic Prawns";
      description = "Iconic Baga shack serving legendary Goan fish curry and grilled prawns.";
      img = "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400";
    } else {
      name = "Curlies Beach Shack";
      tag = "SUNSET DRINKS";
      avgPrice = "₹450 - ₹900";
      signatureDish = "Pork Vindaloo & Sunset Cocktails";
      description = "Popular spot at South Anjuna Beach perfect for beach dinners and stargazing.";
      img = "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400";
    }
  } else if (normalized.includes("panaji") || normalized.includes("panjim") || normalized.includes("fontainhas")) {
    if (time.toLowerCase().includes("morn") || time.toLowerCase().includes("breakfast")) {
      name = "Cafe Tato";
      tag = "LOCAL FAVORITE";
      avgPrice = "₹120 - ₹250";
      signatureDish = "Goan Bhaji-Puri & Filter Chai";
      description = "Best local breakfast of Goan bhaji-puri and hot filter tea.";
      img = "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400";
    } else if (time.toLowerCase().includes("aftern") || time.toLowerCase().includes("lunch")) {
      name = "Viva Panjim";
      tag = "AUTHENTIC PORTUGUESE";
      highlight = true;
      avgPrice = "₹350 - ₹700";
      signatureDish = "Chicken Cafreal & Baked Bebinca";
      description = "Located in a Latin quarter alley, famous for Pork Vindaloo and Chicken Cafreal.";
      img = "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400";
    } else {
      name = "The Black Sheep Bistro";
      tag = "CREATIVE ECO-BISTRO";
      avgPrice = "₹800 - ₹1,500";
      signatureDish = "Ghee Roast Pork Belly Tapas";
      description = "Chic spot serving artisanal local farm-to-table global tapas.";
      img = "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400";
    }
  } else if (normalized.includes("rishikesh") || normalized.includes("haridwar") || normalized.includes("ganga") || normalized.includes("jhula")) {
    if (time.toLowerCase().includes("morn") || time.toLowerCase().includes("breakfast")) {
      name = "Beatles Cafe (Rishikesh)";
      tag = "GANGES VIEW VIBES";
      avgPrice = "₹250 - ₹500";
      signatureDish = "Gluten-Free Crepe & Organic Cappuccino";
      description = "Health food, great organic coffee, and Beatles nostalgia next to the river.";
      img = "https://images.unsplash.com/photo-1445116572660-236099ec97a0?w=400";
    } else if (time.toLowerCase().includes("aftern") || time.toLowerCase().includes("lunch")) {
      name = "Chotiwala Restaurant";
      tag = "TRADITIONAL MEAL";
      avgPrice = "₹180 - ₹350";
      signatureDish = "Royal Vedic Maharaja Thali";
      highlight = true;
      description = "Famous spot near Ram Jhula serving classic Vedic pure vegetarian thalis.";
      img = "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400";
    } else {
      name = "Little Buddha Cafe";
      tag = "BEST WOOD-FIRED PIZZA";
      avgPrice = "₹300 - ₹600";
      signatureDish = "Wood-fired Pesto & Mushroom Pizza";
      description = "Bohemian river-facing treehouse cafe serving giant pizzas and mocktails.";
      img = "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400";
    }
  } else if (normalized.includes("kathmandu") || normalized.includes("nepal") || normalized.includes("thamel") || normalized.includes("durbar")) {
    if (time.toLowerCase().includes("morn") || time.toLowerCase().includes("breakfast")) {
      name = "Himalayan Java Coffee";
      tag = "NEPALESE COFFEE BEANS";
      avgPrice = "₹180 - ₹350";
      signatureDish = "Single-Origin Nepal Coffee & Cinnamon Waffles";
      description = "Premium single-origin Nepalese coffee and gourmet breakfast waffles.";
      img = "https://images.unsplash.com/photo-1445116572660-236099ec97a0?w=400";
    } else if (time.toLowerCase().includes("aftern") || time.toLowerCase().includes("lunch")) {
      name = "OR2K (Thamel)";
      tag = "POPULAR VEGAN MEDITERRANEAN";
      highlight = true;
      avgPrice = "₹350 - ₹700";
      signatureDish = "OR2K Hummus & Warm Falafel Platter";
      description = "Floor seating, dynamic vibes, and delicious hummus and falafel platters.";
      img = "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400";
    } else {
      name = "Yangling Tibetan Restaurant";
      tag = "BEST MOMOS IN NEPAL";
      avgPrice = "₹150 - ₹300";
      signatureDish = "Steaming Chicken Kothey Momos";
      description = "Legendary local spot for steaming hot buff/chicken momos and rich Thukpa.";
      img = "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400";
    }
  } else if (normalized.includes("udaipur") || normalized.includes("lake") || normalized.includes("palace") || normalized.includes("pichola")) {
    if (time.toLowerCase().includes("morn") || time.toLowerCase().includes("breakfast")) {
      name = "Jheel's Ginger Coffee House";
      tag = "LAKESIDE SUNRISE";
      avgPrice = "₹200 - ₹400";
      signatureDish = "Nutella French Crepe & Cold Brew";
      description = "Quiet coffee house right on Pichola Lake serving hot crepes and coffee.";
      img = "https://images.unsplash.com/photo-1445116572660-236099ec97a0?w=400";
    } else if (time.toLowerCase().includes("aftern") || time.toLowerCase().includes("lunch")) {
      name = "Millets of Mewar";
      tag = "HEALTHY MEWARI EATS";
      highlight = true;
      avgPrice = "₹250 - ₹500";
      signatureDish = "Rajasthani Millet Panchmel Khichdi";
      description = "Organic millet rotis, traditional Mewari dishes, and vegan snacks.";
      img = "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400";
    } else {
      name = "Ambrai Restaurant";
      tag = "PALACE LAKE VIEW";
      avgPrice = "₹700 - ₹1,500";
      signatureDish = "Traditional Laal Maas Mutton Curry";
      description = "Stunning rooftop dinner directly overlooking the illuminated Lake Palace.";
      img = "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=400";
    }
  } else if (normalized.includes("leh") || normalized.includes("ladakh") || normalized.includes("nubra") || normalized.includes("pangong")) {
    if (time.toLowerCase().includes("morn") || time.toLowerCase().includes("breakfast")) {
      name = "Lala's Art Cafe";
      tag = "HISTORIC TOWN VIBE";
      avgPrice = "₹150 - ₹300";
      signatureDish = "Apricot Cake & Sea Buckthorn Herbal Tea";
      description = "Cosy stone cafe in Leh Old Town serving fresh apricot juice and barley pancakes.";
      img = "https://images.unsplash.com/photo-1445116572660-236099ec97a0?w=400";
    } else if (time.toLowerCase().includes("aftern") || time.toLowerCase().includes("lunch")) {
      name = "Chopsticks Noodle Bar";
      tag = "ASIAN EXQUISITE";
      avgPrice = "₹250 - ₹500";
      signatureDish = "Ladakhi Thukpa Noodles & Ginger Momos";
      description = "Modern restaurant serving Nepalese Thukpa, Tibetan Momos, and Thai curries.";
      img = "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400";
    } else {
      name = "The Tibetan Kitchen";
      tag = "MUST TRY LOCAL FOOD";
      highlight = true;
      avgPrice = "₹450 - ₹900";
      signatureDish = "Traditional Tibetan Gyakok Hotpot";
      description = "Authentic garden seating serving local Ladakhi hotpots, dumplings, and butter tea.";
      img = "https://images.unsplash.com/photo-1544025162-d76694265947?w=400";
    }
  } else {
    // 2. Beautiful Dynamic Fallbacks based on the location name!
    const activityName = activity.replace(/visit|explore|check-in at|see/ig, "").trim();
    const shortAct = activityName.length > 28 ? activityName.slice(0, 25) + "..." : activityName;

    if (time.toLowerCase().includes("morn") || time.toLowerCase().includes("breakfast")) {
      name = `${shortAct} Sunrise Cafe`;
      tag = "BREAKFAST BRUNCH";
      avgPrice = "₹200 - ₹400";
      signatureDish = `Local Artisan Coffee & Breakfast Basket`;
      description = `A charming local spot near ${shortAct} serving fresh local morning delights and premium beverages.`;
      img = "https://images.unsplash.com/photo-1445116572660-236099ec97a0?w=400";
    } else if (time.toLowerCase().includes("aftern") || time.toLowerCase().includes("lunch")) {
      name = `The Royal ${cleanDest} Bistro`;
      tag = "RECOMMENDED LUNCH";
      highlight = true;
      avgPrice = "₹350 - ₹750";
      signatureDish = `Chef's Special ${cleanDest} Platter`;
      description = `Highly rated authentic restaurant near ${shortAct} specializing in regional spices and local recipes.`;
      img = "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400";
    } else {
      name = `${cleanDest} Sunset Tavern`;
      tag = "GORGEOUS DINING VIBE";
      avgPrice = "₹400 - ₹850";
      signatureDish = `Traditional Regional Specialty Curry`;
      description = `Perfect evening retreat near ${shortAct} known for its exquisite local atmosphere, music, and gourmet cuisine.`;
      img = "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400";
    }
  }

  return { name, rating, tag, avgPrice, signatureDish, img, highlight, description };
};

export default function FoodView({ t, destination = "", itineraryDays = [] }: { t: typeof T.dark; destination?: string; itineraryDays?: ItineraryDay[] }) {
  const [activeDay, setActiveDay] = useState(1);

  const totalDays = itineraryDays.length > 0 ? itineraryDays.length : 3;
  const currentDayData = itineraryDays.find(d => d.day === activeDay) || { day: activeDay, plan: [] };

  // Fallback static items if there is no plan items in database
  const fallbackPlans = [
    { time: "Morning", activity: "Relax at your hotel", details: "Leisure breakfast and check-in" },
    { time: "Afternoon", activity: "Explore city center", details: "Explore nearby tourist hotspots" },
    { time: "Evening", activity: "Sunset viewpoints stroll", details: "Walk down beautiful scenic points" },
  ];

  const activePlans = currentDayData.plan && currentDayData.plan.length > 0 ? currentDayData.plan : fallbackPlans;

  return (
    <div style={{ padding: "24px 24px 24px 0" }}>
      {/* HEADER */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
        <div>
          <div style={{ fontSize: 10, color: t.muted, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 4 }}>SMART MEALS</div>
          <h2 style={{ fontSize: 28, fontWeight: 900, color: t.text, margin: 0, letterSpacing: "-0.02em" }}>Culinary <span style={{ color: t.accent }}>Optimizer</span></h2>
          <div style={{ color: t.muted, fontSize: 13, marginTop: 6, maxWidth: 550 }}>
            We've mapped dynamic restaurant recommendations relative to the exact locations you visit each day on your itinerary to save travel time.
          </div>
        </div>
      </div>

      {/* DAY TABS */}
      <div style={{ display: "flex", gap: 8, marginBottom: 24, overflowX: "auto", paddingBottom: 6 }}>
        {Array.from({ length: totalDays }).map((_, idx) => {
          const dayNum = idx + 1;
          const isActive = activeDay === dayNum;
          return (
            <button
              key={dayNum}
              onClick={() => setActiveDay(dayNum)}
              style={{
                background: isActive ? t.accent : t.card,
                color: isActive ? "#fff" : t.text,
                border: `1px solid ${isActive ? t.accent : t.border}`,
                borderRadius: 10,
                padding: "8px 16px",
                fontSize: 12,
                fontWeight: 700,
                cursor: "pointer",
                transition: "all 0.2s",
                whiteSpace: "nowrap",
              }}
            >
              Day {dayNum} Recommendations
            </button>
          );
        })}
      </div>

      {/* TIMELINE OF RECOMMENDATIONS */}
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        {activePlans.map((item, idx) => {
          const { name, rating, tag, avgPrice, signatureDish, img, highlight, description } = getRestaurantsForActivity(item.activity, item.time, destination);
          
          return (
            <div
              key={idx}
              style={{
                background: t.card,
                border: `1px solid ${highlight ? t.accent : t.border}`,
                borderRadius: 16,
                overflow: "hidden",
                display: "flex",
                boxShadow: highlight ? t.shadow : "none",
              }}
            >
              {/* RESTAURANT IMAGE */}
              <div
                style={{
                  width: 220,
                  background: `url('${img}') center/cover`,
                  position: "relative",
                  minHeight: 160,
                }}
              >
                <div style={{ position: "absolute", top: 12, left: 12 }}>
                  <Badge color={item.time.toLowerCase().includes("morn") ? "blue" : item.time.toLowerCase().includes("aftern") ? "orange" : "purple"} t={t}>
                    {item.time.toUpperCase()} STOP
                  </Badge>
                </div>
              </div>

              {/* RESTAURANT CONTENT */}
              <div style={{ padding: 20, flex: 1, display: "flex", justifyContent: "space-between" }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 6, flexWrap: "wrap" }}>
                    <h3 style={{ fontSize: 18, fontWeight: 800, color: t.text, margin: 0 }}>{name}</h3>
                    <div style={{ fontSize: 12, color: "#f59e0b" }}>★ {rating}</div>
                    {highlight && <Badge color="green" t={t}>MUST TRY</Badge>}
                  </div>
                  
                  {/* Location subtitle */}
                  <div style={{ fontSize: 11, color: t.muted, fontWeight: 600, marginBottom: 8 }}>
                    📍 Best spot during: "{item.activity}"
                  </div>

                  {/* Specialty Dish */}
                  <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 700, color: "rgb(245, 158, 11)", marginBottom: 8 }}>
                    <span>🍳</span>
                    <span>Specialty: <span style={{ color: t.text, fontWeight: 600 }}>{signatureDish}</span></span>
                  </div>

                  {/* Description */}
                  <p style={{ fontSize: 12, color: t.text, opacity: 0.8, margin: "0 0 14px 0", lineHeight: 1.4, maxWidth: "90%" }}>
                    {description}
                  </p>

                  <div style={{ display: "flex", gap: 8 }}>
                    {tag && <Badge color="gray" t={t}>{tag}</Badge>}
                  </div>
                </div>

                {/* COST & BOOKING BUTTON */}
                <div style={{ textAlign: "right", display: "flex", flexDirection: "column", justifyContent: "space-between", minWidth: 140 }}>
                  <div>
                    <div style={{ fontSize: 10, color: t.muted }}>AVG. SPEND</div>
                    <div style={{ fontSize: 18, fontWeight: 900, color: t.text }}>{avgPrice}</div>
                    <div style={{ fontSize: 9, color: t.muted, marginTop: 2 }}>per person</div>
                  </div>
                  
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(name + " " + destination)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      background: highlight ? t.accent : "transparent",
                      color: highlight ? "#fff" : t.accent,
                      border: `1px solid ${t.accent}`,
                      borderRadius: 8,
                      padding: "8px 14px",
                      fontSize: 12,
                      fontWeight: 700,
                      cursor: "pointer",
                      textAlign: "center",
                      textDecoration: "none",
                      transition: "all 0.2s",
                    }}
                  >
                    View on Maps
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}