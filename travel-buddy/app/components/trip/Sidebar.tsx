"use client";
import { T } from "./Theme";
import { useState, useEffect } from "react";

export function Sidebar({ active, setActive, t, tripData }: { active: string; setActive: (p: string) => void; t: typeof T.dark; tripData: any }) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const menu = [
    { id: "itinerary", label: "Itinerary", icon: "🗓️" },
    { id: "hotels", label: "Smart Hotels", icon: "🏨" },
    { id: "transport", label: "Transport", icon: "🚗" },
    { id: "food", label: "Food & Dining", icon: "🍽️" },
    { id: "budget", label: "Budget Insight", icon: "📊" },
  ];

  if (isMobile) {
    return (
      <div style={{
        background: t.sidebarBg,
        borderBottom: `1px solid ${t.border}`,
        padding: "10px 16px",
        display: "flex",
        flexDirection: "column",
        gap: 6,
        width: "100%",
        overflow: "hidden"
      }}>
        <nav style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 4, scrollbarWidth: "none" }}>
          {menu.map(item => (
            <button
              key={item.id}
              onClick={() => setActive(item.id)}
              style={{
                display: "flex",
                 alignItems: "center",
                gap: 6,
                padding: "8px 14px",
                borderRadius: 10,
                border: "none",
                cursor: "pointer",
                background: active === item.id ? t.highlight : "transparent",
                color: active === item.id ? t.accent : t.muted,
                fontSize: 12,
                fontWeight: active === item.id ? 700 : 500,
                transition: "all 0.2s",
                whiteSpace: "nowrap"
              }}
            >
              <span>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>
      </div>
    );
  }

  return (
    <div style={{
      width: 240, 
      background: t.sidebarBg, 
      borderRight: `1px solid ${t.border}`,
      padding: "24px 12px", 
      display: "flex", 
      flexDirection: "column", 
      gap: 30,
      height: "100%",
      position: "sticky",
      top: 0,
      flexShrink: 0
    }}>

      <nav style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: t.muted, letterSpacing: "0.1em", padding: "0 12px 10px", textTransform: "uppercase" }}>Trip Dashboard</div>
        {menu.map(item => (
          <button
            key={item.id}
            onClick={() => setActive(item.id)}
            style={{
              display: "flex", alignItems: "center", gap: 12, padding: "10px 12px",
              borderRadius: 10, border: "none", cursor: "pointer",
              background: active === item.id ? t.highlight : "transparent",
              color: active === item.id ? t.accent : t.muted,
              fontSize: 13, fontWeight: active === item.id ? 700 : 500,
              transition: "all 0.2s"
            }}
          >
            <span style={{ fontSize: 16 }}>{item.icon}</span>
            {item.label}
            {active === item.id && <div style={{ marginLeft: "auto", width: 4, height: 4, borderRadius: "50%", background: t.accent }} />}
          </button>
        ))}
      </nav>

      <div style={{ marginTop: "auto", padding: 12, background: "linear-gradient(135deg, #f97316, #ef4444)", borderRadius: 12, color: "#fff" }}>
        <div style={{ fontSize: 13, fontWeight: 800, lineHeight: 1.2, marginBottom: 4 }}>Solo is good.<br />Group is cheaper.</div>
        <div style={{ fontSize: 10, opacity: 0.9, marginBottom: 10 }}>Invite friends to unlock group discounts.</div>
        <button style={{ width: "100%", background: "#fff", color: "#f97316", border: "none", borderRadius: 6, padding: "6px 0", fontSize: 11, fontWeight: 700, cursor: "pointer" }}>Invite Now</button>
      </div>
    </div>
  );
}
