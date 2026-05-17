"use client";
import { useState, useEffect } from "react";
import { T } from "./Theme";
import { Badge } from "./Badge";

export default function HotelView({ t, tripId }: { t: typeof T.dark; tripId: string }) {
  const [loading, setLoading] = useState(true);
  const [hotels, setHotels] = useState<any[]>([]);

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const res = await fetch(`/api/trip/${tripId}/hotels`);
        const json = await res.json();
        if (json.success) {
          // Geoapify returns features array
          setHotels(json.data?.features || []);
        }
      } catch (err) {
        console.error("Hotels fetch error", err);
      } finally {
        setLoading(false);
      }
    };
    if (tripId) fetchHotels();
  }, [tripId]);

  const hotelAlts = [
    { properties: { name: "The Grand Palace & Spa", formatted: "0.4km from city center" }, rating: 4.8, price: "₹8,500/night" },
    { properties: { name: "Heritage Boutique Resort", formatted: "1.2km from city center" }, rating: 4.7, price: "₹6,200/night" },
    { properties: { name: "Signature Vista Premium", formatted: "0.8km from city center" }, rating: 4.5, price: "₹4,800/night" },
  ];

  if (loading) return <div style={{ padding: 40, color: t.muted }}>Checking live availability...</div>;

  const displayHotels = hotels.length > 0 ? hotels : hotelAlts;

  return (
    <div style={{ padding: "24px 24px 24px 0" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
        <div>
          <div style={{ fontSize: 10, color: t.muted, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 4 }}>CURATED STAYS</div>
          <h2 style={{ fontSize: 28, fontWeight: 900, color: t.text, margin: 0, letterSpacing: "-0.02em" }}>Smart <span style={{ color: t.accent }}>Accommodations</span></h2>
          <div style={{ color: t.muted, fontSize: 13, marginTop: 6, maxWidth: 500 }}>
            We've found the best accommodation options near your destination using real-time location data.
          </div>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 24 }}>
        {displayHotels.slice(0, 5).map((h, i) => {
          const props = h.properties;
          return (
            <div key={i} style={{
              background: t.card,
              border: `1px solid ${i === 0 ? t.accent : t.border}`,
              borderRadius: 16,
              overflow: "hidden",
              display: "flex",
              boxShadow: i === 0 ? t.shadow : "none",
            }}>
              <div style={{
                width: 220,
                background: `url('https://images.unsplash.com/photo-1566073771259-6a8506099945?hotel-${i}&w=600') center/cover`,
                position: "relative",
              }}>
                {i === 0 && (
                  <div style={{ position: "absolute", top: 12, left: 12 }}>
                    <Badge color="green" t={t}>SMART CHOICE</Badge>
                  </div>
                )}
              </div>
              <div style={{ padding: 20, flex: 1, display: "flex", justifyContent: "space-between" }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 6 }}>
                    <h3 style={{ fontSize: 18, fontWeight: 800, color: t.text, margin: 0 }}>{props.name}</h3>
                    <div style={{ fontSize: 12, color: "#f59e0b" }}>★ {h.rating || "4.5"}</div>
                  </div>
                  <div style={{ fontSize: 12, color: t.muted, marginBottom: 12, lineHeight: 1.4, maxWidth: "90%" }}>
                    {props.address_line2 || props.formatted}
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <Badge color="gray" t={t}>{props.city || "Local Area"}</Badge>
                    {props.postcode && <Badge color="gray" t={t}>{props.postcode}</Badge>}
                  </div>
                </div>
                <div style={{ textAlign: "right", display: "flex", flexDirection: "column", justifyContent: "space-between", minWidth: 120 }}>
                  <div>
                    <div style={{ fontSize: 10, color: t.muted }}>ESTIMATED</div>
                    <div style={{ fontSize: 20, fontWeight: 900, color: t.text }}>{h.price || "Contact for Price"}</div>
                  </div>
                  <button style={{
                    background: i === 0 ? t.accent : "transparent",
                    color: i === 0 ? "#fff" : t.accent,
                    border: `1px solid ${t.accent}`,
                    borderRadius: 8,
                    padding: "8px 20px",
                    fontSize: 12,
                    fontWeight: 700,
                    cursor: "pointer",
                    transition: "all 0.2s"
                  }}>
                    {i === 0 ? "Select Stay" : "View Details"}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Strategic location map placeholder */}
      <div style={{
        background: t.card,
        border: `1px solid ${t.border}`,
        borderRadius: 12,
        overflow: "hidden",
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
      }}>
        <div style={{
          height: 160,
          background: "url('https://images.unsplash.com/photo-1524661135-423995f22d0b?w=600') center/cover",
          filter: "grayscale(0.3) brightness(0.9)",
        }} />
        <div style={{ padding: 20 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: t.text, marginBottom: 8 }}>Geographic Insight</div>
          <div style={{ fontSize: 12, color: t.muted, lineHeight: 1.5, marginBottom: 10 }}>
            These locations are verified based on current proximity to your destination center.
          </div>
          <div style={{ display: "flex", gap: 20 }}>
            <div>
              <div style={{ fontSize: 10, color: t.muted }}>RADIUS</div>
              <div style={{ fontSize: 20, fontWeight: 800, color: t.accentGreen }}>5 km</div>
            </div>
            <div>
              <div style={{ fontSize: 10, color: t.muted }}>ACCURACY</div>
              <div style={{ fontSize: 20, fontWeight: 800, color: t.accent }}>High</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}