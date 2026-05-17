"use client";
import { T } from "./Theme";
import { Badge } from "./Badge";
import { useState, useEffect } from "react";

export function HeroSection({ t, tripData }: { t: typeof T.dark; tripData: any }) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div style={{
      height: isMobile ? 220 : 280,
      background: `linear-gradient(to bottom, rgba(0,0,0,0.2), ${t.bg}), url('${tripData.destinationImage || "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1200"}') center/cover`,
      display: "flex", alignItems: "flex-end", padding: isMobile ? "0 16px 20px" : "0 40px 40px",
      position: "relative", overflow: "hidden"
    }}>
      <div style={{ position: "relative", zIndex: 2, width: "100%" }}>
        <div style={{ display: "flex", gap: 10, marginBottom: 12 }}>
          <Badge color="blue" t={t}>AI GENERATED</Badge>
          <Badge color="orange" t={t}>ULTRA OPTIMISED</Badge>
        </div>
        <h1 style={{ color: "#fff", fontSize: isMobile ? 28 : 42, fontWeight: 900, margin: "8px 0 6px", letterSpacing: "-0.03em", textShadow: "0 2px 12px rgba(0,0,0,0.5)" }}>
          {tripData.name}
        </h1>
        <div style={{ display: "flex", gap: 16, alignItems: "center", color: "rgba(255,255,255,0.85)", fontSize: isMobile ? 11 : 13 }}>
          <span>📅 {tripData.dates}</span>
          <span>👥 {tripData.travelers} Travelers</span>
          <Badge color="green" t={t}>{tripData.currency}{tripData.plannedBudget.toLocaleString()}</Badge>
        </div>
      </div>
    </div>
  );
}
