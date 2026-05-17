"use client";
import { useState, useEffect, use } from "react";
import { T } from "@/app/components/trip/Theme";
import { useTheme } from "next-themes";
import { Sidebar } from "@/app/components/trip/Sidebar";
import { HeroSection } from "@/app/components/trip/HeroSection";
import { NavBar } from "@/app/components/trip/NavBar";
import ItineraryView from "@/app/components/trip/ItineraryView";
import HotelView from "@/app/components/trip/HotelView";
import TransportView from "@/app/components/trip/TransportView";
import FoodView from "@/app/components/trip/FoodView";
import BudgetView from "@/app/components/trip/BudgetView";

export default function TripDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { theme, resolvedTheme } = useTheme();
  const [activePage, setActivePage] = useState("itinerary");
  const [trip, setTrip] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const t = resolvedTheme === "light" ? T.light : T.dark;

  useEffect(() => {
    const fetchTrip = async () => {
      try {
        const res = await fetch(`/api/trip/${id}`);
        const data = await res.json();
        if (data.success) {
          setTrip(data.data);
        }
      } catch (err) {
        console.error("Failed to fetch trip", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTrip();
  }, [id]);

  if (loading) return <div style={{ background: t.bg, height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", color: t.text }}>Loading your masterpiece...</div>;

  const dynamicTripData = {
    name: trip?.destination || "Paris Summer '24",
    dates: "July 14 - July 21",
    travelers: 2,
    plannedBudget: trip?.budget || 131600,
    currency: "₹",
    subtitle: `Explore the magic of ${trip?.destination || 'Paris'} with your curated smart itinerary.`,
    itinerary: trip?.plan?.itinerary || [],
    destinationImage: trip?.destinationImage || trip?.plan?.destinationImage
  };

  const pageComponents: Record<string, React.ReactNode> = {
    itinerary: <ItineraryView t={t} itineraryDays={dynamicTripData.itinerary} />,
    hotels: <HotelView t={t} tripId={id} />,
    transport: <TransportView t={t} tripId={id} />,
    food: <FoodView t={t} destination={dynamicTripData.name} itineraryDays={dynamicTripData.itinerary} />,
    budget: <BudgetView t={t} budget={trip?.plan?.budgetBreakdown} />,
  };

  return (
    <div style={{
      background: t.bg,
      height: "100vh",
      color: t.text,
      fontFamily: "'Inter', sans-serif",
      display: "flex",
      flexDirection: "column",
      overflow: "hidden",
    }}>
      <NavBar t={t} />

      <div style={{ 
        display: "flex", 
        flexDirection: isMobile ? "column" : "row", 
        height: isMobile ? "auto" : "calc(100vh - 56px)", 
        overflow: isMobile ? "auto" : "hidden" 
      }}>
        <Sidebar active={activePage} setActive={setActivePage} t={t} tripData={dynamicTripData} />

        <main style={{ 
          flex: 1, 
          minWidth: 0, 
          height: isMobile ? "auto" : "100%", 
          overflowY: isMobile ? "visible" : "auto" 
        }}>
          <HeroSection t={t} tripData={dynamicTripData} />
          <div style={{ padding: isMobile ? "0 16px 24px" : "0 24px 24px" }}>
            {pageComponents[activePage]}
          </div>
        </main>
      </div>
    </div>
  );
}