"use client";

import {
  Bell,
  Compass,
  LogOut,
  MapPinned,
  Menu,
  Shield,
  Sparkles,
  Wallet,
  Wifi,
  X,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import BudgetTrackerPage from "@/app/components/trip/journey/BudgetTrackerPage";
import AISuggestionsPage from "@/app/components/trip/journey/AISuggesstionPage";
import MapPage from "@/app/components/trip/journey/MapPage";
import PrivacyCenterPage from "@/app/components/trip/journey/PrivacyCenterPage";
import ItineraryView from "@/app/components/trip/ItineraryView";
import { T } from "@/app/components/trip/Theme";
import { NavBar } from "@/app/components/trip/NavBar";
import { useTheme } from "next-themes";
import { useJourneyStore } from "@/store/journeyStore";
import { getTodayPlan, getCurrentActivity, calculateTripProgress, generateDynamicInsights, budgetStatus } from "@/lib/journey-engine";

export default function LiveJourneyPage() {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("Live Journey");
  const params = useParams();
  const router = useRouter();
  const { trip, loading, error, fetchTrip, expenses, updateActivityStatus } = useJourneyStore();
  const [sosActive, setSosActive] = useState(false);
  const { resolvedTheme } = useTheme();
  
  const t = resolvedTheme === "light" ? T.light : T.dark;

  useEffect(() => {
    if (params.id) {
      fetchTrip(params.id as string);
    }
  }, [params.id, fetchTrip]);

  useEffect(() => {
    // Only redirect to home if there's an error AND we have no cached trip data
    // This allows the user to still view their journey offline!
    if (error && !trip) {
      router.push("/home");
    }
  }, [error, trip, router]);

  const todayPlanObj = getTodayPlan(trip);
  const currentActivity = getCurrentActivity(trip, todayPlanObj);
  const progress = calculateTripProgress(trip);
  const insights = trip && currentActivity ? generateDynamicInsights(trip, currentActivity) : [];
  const budgetInfo = budgetStatus(trip?.budget || 0, expenses || []);

  if (loading && !trip) {
    return <div className="min-h-screen bg-[#f5f5f7] dark:bg-[#070B16] text-black dark:text-white flex items-center justify-center">Loading Journey...</div>;
  }

  return (
    <div className="h-screen bg-[#f5f5f7] dark:bg-[#070B16] text-black dark:text-white transition-colors flex flex-col overflow-hidden">
      <NavBar t={t} />
      <div className="flex flex-1 overflow-hidden relative">
        {/* Sidebar */}
        <aside
          className={`absolute lg:relative z-40 top-0 left-0 h-full w-[260px] bg-white dark:bg-[#0B1020] border-r border-black/5 dark:border-white/10 p-5 flex flex-col justify-between transition-transform duration-300 ${
            open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          }`}
        >
          <div>
            {/* Logo */}
            <div className="flex items-center justify-between mb-10">
              <h1 className="text-xl font-bold tracking-tight">
                Travel<span className="text-blue-500">Buddy</span>
              </h1>

              <button
                onClick={() => setOpen(false)}
                className="lg:hidden"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Menu */}
            <div className="space-y-2">
              <SidebarItem
                active={activeTab === "Live Journey"}
                onClick={() => setActiveTab("Live Journey")}
                icon={<Compass size={18} />}
                title="Live Journey"
              />
              <SidebarItem
                active={activeTab === "Live Itinerary"}
                onClick={() => setActiveTab("Live Itinerary")}
                icon={<MapPinned size={18} />}
                title="Live Itinerary"
              />
              <SidebarItem
                active={activeTab === "Budget Tracker"}
                onClick={() => setActiveTab("Budget Tracker")}
                icon={<Wallet size={18} />}
                title="Budget Tracker"
              />
              <SidebarItem
                active={activeTab === "AI Suggestions"}
                onClick={() => setActiveTab("AI Suggestions")}
                icon={<Sparkles size={18} />}
                title="AI Suggestions"
              />
              <SidebarItem
                active={activeTab === "Live Map"}
                onClick={() => setActiveTab("Live Map")}
                icon={<MapPinned size={18} />}
                title="Live Map"
              />
              <SidebarItem
                active={activeTab === "Privacy Center"}
                onClick={() => setActiveTab("Privacy Center")}
                icon={<Shield size={18} />}
                title="Privacy Center"
              />
            </div>

            {/* Button */}
            <button className="mt-10 w-full rounded-xl bg-orange-500 hover:bg-orange-600 transition-colors py-3 text-sm font-semibold text-white shadow-lg shadow-orange-500/20">
              Optimization On
            </button>
          </div>

          {/* Bottom */}
          <div className="space-y-2">
            <SidebarItem title="Support" />
            <SidebarItem title="Log Out" icon={<LogOut size={18} />} />
          </div>
        </aside>

        {/* Overlay */}
        {open && (
          <div
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-black/50 z-30 lg:hidden"
          />
        )}

        {/* Main */}
        <main className="flex-1 overflow-y-auto">
          {/* Mobile Menu Toggle */}
          <div className="lg:hidden p-4 flex items-center border-b border-black/5 dark:border-white/10">
            <button onClick={() => setOpen(true)} className="flex items-center gap-2 font-medium">
              <Menu className="w-6 h-6" /> Menu
            </button>
          </div>


          {/* Content */}
          {activeTab === "Budget Tracker" && <BudgetTrackerPage />}
          {activeTab === "AI Suggestions" && <AISuggestionsPage />}
          {activeTab === "Live Map" && <MapPage />}
          {activeTab === "Privacy Center" && <PrivacyCenterPage />}
          {activeTab === "Live Itinerary" && (
            <div className="p-4 lg:p-8 overflow-auto h-[calc(100vh-64px)]">
              <ItineraryView t={t} itineraryDays={trip?.plan?.itinerary || []} />
            </div>
          )}
          {activeTab === "Live Journey" && (
            <div className="p-4 lg:p-8">
              <div className="grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-6">
                {/* Left Content */}
              <div className="space-y-6">
                {/* Hero */}
                <div className="relative overflow-hidden rounded-3xl min-h-[280px] lg:min-h-[340px]">
                  <img
                    src={trip?.destinationImage || "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1600"}
                    className="absolute inset-0 w-full h-full object-cover"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />

                  <div className="relative z-10 p-6 lg:p-10 flex flex-col justify-end h-full">
                    <div className="max-w-[520px]">
                      <div className="inline-flex items-center gap-2 rounded-full bg-cyan-500/20 backdrop-blur-xl border border-cyan-400/20 px-4 py-1 text-xs font-medium text-cyan-300 mb-4">
                        ACTIVE JOURNEY
                      </div>

                      <h1 className="text-4xl lg:text-6xl font-bold text-white leading-tight">
                        {trip?.destination || "Loading..."}
                      </h1>

                      <p className="mt-4 text-white/80 max-w-md">
                        The Shinjuku district is vibrant tonight.
                        High energy detected. Shall I book your
                        priority entry for the hidden jazz lounge?
                      </p>

                      <button className="mt-6 rounded-2xl bg-white text-black px-6 py-3 font-semibold hover:scale-[1.02] transition">
                        View Itinerary
                      </button>
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                  <InfoCard
                    title="Location"
                    value={trip?.destination || "Loading..."}
                  />
                  <InfoCard
                    title="Activity"
                    value={trip?.travelType || "Unknown"}
                  />
                  <InfoCard
                    title="Crowd"
                    value="Dense"
                  />
                  <InfoCard
                    title="Budget"
                    value={trip?.budget ? `₹${trip.budget}` : "Unknown"}
                  />
                  <InfoCard
                    title="Progress"
                    value={`${progress}%`}
                  />
                </div>

                {/* Timeline */}
                <div className="rounded-3xl bg-white dark:bg-[#0D1425] border border-black/5 dark:border-white/10 p-6">
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-xl font-semibold">
                      Interactive Timeline
                    </h3>

                    <span className="text-blue-500 text-sm">
                      {new Date().toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'short' })}
                    </span>
                  </div>

                  <div className="space-y-8">
                    {todayPlanObj?.plan?.plan || todayPlanObj?.plan?.events ? (
                      (todayPlanObj.plan.plan || todayPlanObj.plan.events).map((event: any, index: number) => {
                        
                        // Determine status
                        const isCompleted = trip?.completedActivities?.some((a: any) => a.day === todayPlanObj.dayIndex && a.activityIndex === index);
                        let status: 'completed' | 'ongoing' | 'upcoming' = 'upcoming';
                        if (isCompleted) {
                           status = 'completed';
                        } else if (currentActivity?.index === index) {
                           status = 'ongoing';
                        }

                        return (
                          <TimelineCard
                            key={index}
                            status={status}
                            time={event.time}
                            title={event.activity || event.title}
                            description={event.details || event.subtitle || "Enjoy the activity!"}
                            onComplete={() => {
                               if (trip?._id) updateActivityStatus(trip._id, todayPlanObj.dayIndex, index);
                            }}
                          />
                        );
                      })
                    ) : (
                      <div className="text-black/50 dark:text-white/50 text-sm">No timeline available yet...</div>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Panel */}
              <div className="space-y-6">
                {/* Map */}
                <div className="rounded-3xl overflow-hidden border border-black/5 dark:border-white/10 bg-white dark:bg-[#0D1425]">
                  <div className="relative h-[250px]">
                    <img
                      src="https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=1400"
                      className="w-full h-full object-cover"
                    />

                    <div className="absolute inset-0 bg-black/40" />

                    <div className="absolute bottom-5 left-5 right-5">
                      <div className="rounded-2xl bg-black/60 backdrop-blur-xl border border-white/10 p-4">
                        <p className="text-sm text-white/70">
                          Transport Forecast
                        </p>

                        <div className="flex items-center justify-between mt-2">
                          <span className="text-white font-semibold">
                            Stable
                          </span>

                          <span className="text-red-400 text-sm">
                            00:42 AM
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Insights */}
                <div className="rounded-3xl bg-white dark:bg-[#0D1425] border border-black/5 dark:border-white/10 p-6">
                  <div className="flex items-center gap-2 mb-5">
                    <Sparkles className="w-5 h-5 text-cyan-400" />

                    <h3 className="font-semibold">
                      AI Night Insights
                    </h3>
                  </div>

                  <div className="space-y-4">
                    {insights.length > 0 ? (
                      insights.map((insight: any, idx: number) => (
                        <InsightCard key={idx} text={insight.message} type={insight.type} />
                      ))
                    ) : (
                      <InsightCard text="No specific insights at the moment." type="info" />
                    )}
                  </div>
                </div>

                {/* Budget */}
                <div className="rounded-3xl bg-white dark:bg-[#0D1425] border border-black/5 dark:border-white/10 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">Live Budget</h3>
                      <p className="text-sm text-black/50 dark:text-white/50">
                        ₹{budgetInfo.spent.toLocaleString()} used
                      </p>
                    </div>

                    <div className="relative w-24 h-24">
                      <div className="absolute inset-0 rounded-full border-[8px] border-cyan-500/20" />
                      <div 
                        className={`absolute inset-0 rounded-full border-[8px] ${budgetInfo.percentage > 90 ? 'border-red-500' : 'border-cyan-400'} transition-all duration-1000`} 
                        style={{ clipPath: `polygon(50% 50%, 50% 0%, ${budgetInfo.percentage > 50 ? '100% 0%, 100% 100%, 0% 100%, 0% 0%,' : '100% 0%,'} ${budgetInfo.percentage === 100 ? '50% 0%' : '50% 50%'})` }} // Note: accurate circle progress CSS requires SVG or complex clip-path. Falling back to simple style for demo:
                      />
                      {/* Simple circle progress hack */}
                      <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                        <path
                          className="text-cyan-500/20 dark:text-cyan-500/10"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className={`${budgetInfo.percentage >= 90 ? 'text-red-500' : 'text-cyan-400'} transition-all duration-1000`}
                          strokeDasharray={`${budgetInfo.percentage}, 100`}
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                      </svg>

                      <div className={`absolute inset-0 flex items-center justify-center text-sm font-bold ${budgetInfo.percentage >= 90 ? 'text-red-500' : ''}`}>
                        {budgetInfo.percentage}%
                      </div>
                    </div>
                  </div>
                </div>

                {/* Security */}
                <div className={`rounded-3xl p-6 text-white shadow-2xl transition-colors duration-500 ${sosActive ? "bg-red-700 animate-pulse shadow-red-700/50" : "bg-gradient-to-br from-red-600 to-red-500 shadow-red-500/20"}`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-lg">
                        {sosActive ? "SOS ACTIVATED" : "Security Hub"}
                      </h3>

                      <p className="text-sm text-white/80 mt-1">
                        {sosActive ? "Emergency contacts notified. Tracking live." : "Live emergency monitoring active"}
                      </p>
                    </div>

                    <Shield className="w-10 h-10" />
                  </div>

                  <div className="grid grid-cols-2 gap-3 mt-6">
                    <button 
                      onClick={() => {
                        setSosActive(!sosActive);
                        if (!sosActive) {
                          alert("🚨 SOS TRIGGERED! Your location has been shared with emergency contacts.");
                        }
                      }}
                      className={`rounded-xl py-3 font-semibold transition-colors ${sosActive ? "bg-black text-white" : "bg-white text-red-600 hover:bg-red-50"}`}>
                      {sosActive ? "Cancel SOS" : "Trigger SOS"}
                    </button>

                    <button 
                      onClick={() => {
                         if(navigator.geolocation) {
                             navigator.geolocation.getCurrentPosition(() => {
                                 alert("📍 Live location shared securely with trusted contacts.");
                             });
                         } else {
                             alert("Geolocation is not supported by this browser.");
                         }
                      }}
                      className="rounded-xl border border-white/20 py-3 font-semibold hover:bg-white/10 transition-colors">
                      Location Share
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          )}
        </main>
      </div>
    </div>
  );
}

function SidebarItem({
  title,
  icon,
  active,
  onClick,
}: {
  title: string;
  icon?: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all ${
        active
          ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
          : "hover:bg-black/5 dark:hover:bg-white/5 text-black/70 dark:text-white/70"
      }`}
    >
      {icon}
      {title}
    </button>
  );
}

function InfoCard({
  title,
  value,
}: {
  title: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl bg-white dark:bg-[#0D1425] border border-black/5 dark:border-white/10 p-5">
      <p className="text-xs uppercase tracking-widest text-black/40 dark:text-white/40">
        {title}
      </p>

      <div className="mt-3 flex items-center gap-2">
        <Wifi className="w-4 h-4 text-cyan-400" />

        <span className="font-semibold">{value}</span>
      </div>
    </div>
  );
}

function TimelineCard({
  title,
  description,
  time,
  status,
  onComplete,
}: {
  title: string;
  description: string;
  time: string;
  status: 'completed' | 'ongoing' | 'upcoming';
  onComplete?: () => void;
}) {
  const isCompleted = status === 'completed';
  const isOngoing = status === 'ongoing';

  return (
    <div className={`flex gap-5 transition-opacity ${isCompleted ? 'opacity-50' : 'opacity-100'}`}>
      {/* Dot */}
      <div className="flex flex-col items-center">
        <div
          className={`w-4 h-4 rounded-full ${
            isOngoing
              ? "bg-cyan-400 shadow-lg shadow-cyan-400/50 animate-pulse"
              : isCompleted 
                ? "bg-green-500" 
                : "bg-white/20"
          }`}
        />

        <div className={`w-[2px] flex-1 mt-2 ${isCompleted ? "bg-green-500/50" : "bg-white/10"}`} />
      </div>

      {/* Card */}
      <div
        className={`flex-1 rounded-2xl border p-5 transition-colors ${
          isOngoing
            ? "bg-cyan-500/10 border-cyan-400/20"
            : isCompleted
              ? "bg-green-500/5 border-green-500/10"
              : "bg-black/[0.03] dark:bg-white/[0.02] border-black/5 dark:border-white/10"
        }`}
      >
        <div className="flex items-center justify-between">
          <h4 className={`font-semibold ${isCompleted ? 'line-through text-black/50 dark:text-white/50' : ''}`}>{title}</h4>

          <span className="text-sm text-black/50 dark:text-white/50">
            {time}
          </span>
        </div>

        <p className={`mt-2 text-sm leading-relaxed ${isCompleted ? 'text-black/40 dark:text-white/40' : 'text-black/60 dark:text-white/60'}`}>
          {description}
        </p>

        {isOngoing && (
          <div className="flex gap-3 mt-4">
             <button className="rounded-xl bg-cyan-400 text-black px-4 py-2 text-sm font-semibold hover:bg-cyan-300 transition-colors">
               Live Guide
             </button>
             <button onClick={onComplete} className="rounded-xl bg-green-500 text-white px-4 py-2 text-sm font-semibold hover:bg-green-400 transition-colors">
               Mark Complete
             </button>
          </div>
        )}
      </div>
    </div>
  );
}

function InsightCard({ text, type = 'info' }: { text: string; type?: string }) {
  const bgColors: any = {
    warning: "bg-orange-500/10 border-orange-500/20 text-orange-500",
    alert: "bg-red-500/10 border-red-500/20 text-red-500",
    success: "bg-green-500/10 border-green-500/20 text-green-500",
    info: "bg-cyan-500/10 border-cyan-500/20 text-cyan-400"
  };

  return (
    <div className={`rounded-2xl border p-4 ${bgColors[type] || bgColors.info}`}>
      <p className="text-sm font-medium">
        {text}
      </p>
    </div>
  );
}