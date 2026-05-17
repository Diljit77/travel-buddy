"use client";
import { useState } from "react";
import { T } from "./Theme";

export default function ItineraryView({ t, itineraryDays }: { t: typeof T.dark; itineraryDays: any[] }) {
  const [activeDay, setActiveDay] = useState(1);

  return (
    <div style={{ display: "flex", gap: 20, flex: 1, padding: "24px 24px 24px 0" }}>
      {/* Left: daily timeline */}
      <div style={{ flex: 1, minWidth: 0 }}>
        {/* Day tabs */}
        <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
          {itineraryDays.map((d, i) => (
            <button
              key={i}
              onClick={() => setActiveDay(i + 1)}
              style={{
                padding: "6px 16px",
                borderRadius: 20,
                border: `1px solid ${activeDay === i + 1 ? t.accent : t.border}`,
                background: activeDay === i + 1 ? t.accent : "transparent",
                color: activeDay === i + 1 ? "#fff" : t.muted,
                fontSize: 12,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >Day {i + 1}</button>
          ))}
        </div>

        <h2 style={{ color: t.text, fontSize: 20, fontWeight: 700, marginBottom: 16 }}>Daily Itinerary</h2>

        {/* Timeline events */}
        <div style={{ position: "relative" }}>
          {/* Vertical line */}
          <div style={{
            position: "absolute", left: 10, top: 16, bottom: 16, width: 2,
            background: `linear-gradient(to bottom, ${t.accent}, ${t.accentOrange})`,
          }} />

          {(itineraryDays[Math.min(activeDay - 1, itineraryDays.length - 1)]?.plan || 
            itineraryDays[Math.min(activeDay - 1, itineraryDays.length - 1)]?.events || []).map((ev:any, idx:any) => (
            <div key={idx} style={{ display: "flex", gap: 16, marginBottom: 20 }}>
              {/* Dot */}
              <div style={{ flexShrink: 0, paddingTop: 4 }}>
                <div style={{
                  width: 20, height: 20, borderRadius: "50%",
                  background: idx === 0 ? t.accent : t.accentOrange,
                  border: `3px solid ${t.bg}`,
                  boxShadow: `0 0 0 2px ${idx === 0 ? t.accent : t.accentOrange}`,
                }} />
              </div>

              {/* Card */}
              <div style={{
                flex: 1,
                background: t.card,
                border: `1px solid ${t.border}`,
                borderRadius: 12,
                overflow: "hidden",
                boxShadow: t.shadow,
              }}>
                {/* Card header with image */}
                {ev.image && (
                  <div style={{
                    height: 120,
                    background: `url('${ev.image}') center/cover`,
                    position: "relative",
                  }}>
                    <div style={{
                      position: "absolute", inset: 0,
                      background: "linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.6))",
                    }} />
                  </div>
                )}

                <div style={{ padding: "12px 16px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                    <div>
                      <div style={{ fontSize: 10, color: t.muted, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 2 }}>
                        {ev.time} {ev.type ? `· ${ev.type}` : ""}
                      </div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: t.text }}>{ev.activity || ev.title}</div>
                      {(ev.details || ev.subtitle) && <div style={{ fontSize: 11, color: t.muted, marginTop: 2, lineHeight: 1.4 }}>{ev.details || ev.subtitle}</div>}
                    </div>
                    {(ev.cost > 0 || ev.planned > 0) && (
                      <div style={{ textAlign: "right", flexShrink: 0 }}>
                        <div style={{ fontSize: 10, color: t.muted }}>PLANNED</div>
                        <div style={{ fontSize: 14, fontWeight: 700, color: t.text }}>₹{(ev.cost || ev.planned).toLocaleString()}</div>
                      </div>
                    )}
                  </div>

                  {/* Smart option */}
                  {ev.smartOption && (
                    <div style={{
                      background: t.highlight,
                      border: `1px solid ${t.accent}20`,
                      borderRadius: 8,
                      padding: "8px 12px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginTop: 8,
                    }}>
                      <div style={{ fontSize: 11 }}>
                        <div style={{ color: t.muted, marginBottom: 2 }}>{ev.smartOption.label}</div>
                        <div style={{ color: t.saveText || "#4ade80", fontWeight: 700 }}>{ev.smartOption.saved}</div>
                      </div>
                      {ev.smartOption.action && (
                        <button style={{
                          background: t.accent,
                          color: "#fff",
                          border: "none",
                          borderRadius: 6,
                          padding: "5px 14px",
                          fontSize: 11,
                          fontWeight: 700,
                          cursor: "pointer",
                        }}>{ev.smartOption.action}</button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right: Budget overview placeholder for this view */}
      <div style={{ width: 260, flexShrink: 0 }}>
         {/* Could add dynamic insights here */}
      </div>
    </div>
  );
}