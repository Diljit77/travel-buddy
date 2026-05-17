"use client";

import { Navigation, LocateFixed, Shield, MapPin } from "lucide-react";
import { useState, useEffect } from "react";
import { useJourneyStore } from "@/store/journeyStore";
import { getTodayPlan, getCurrentActivity, getNextActivity } from "@/lib/journey-engine";

export default function LiveMapPage() {
  const { trip, updateLocation } = useJourneyStore();
  const [location, setLocation] = useState<{lat: number, lng: number} | null>(null);
  const [tracking, setTracking] = useState(false);
  const [error, setError] = useState("");

  const todayPlanObj = getTodayPlan(trip);
  const currentActivity = getCurrentActivity(trip, todayPlanObj);
  const nextActivity = getNextActivity(todayPlanObj, currentActivity?.index || 0);

  const startTracking = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      return;
    }
    setTracking(true);
    navigator.geolocation.watchPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
        // Sync to backend for privacy/safety center
        if (trip?._id) {
          updateLocation(trip._id, position.coords.latitude, position.coords.longitude);
        }
        setError("");
      },
      (err) => {
        setError(err.message);
        setTracking(false);
      },
      { enableHighAccuracy: true }
    );
  };

  useEffect(() => {
    startTracking();
    return () => {
      // Cleanup tracking if needed (in a real app, keep watchId and clearWatch)
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#f5f5f7] dark:bg-[#070B16] p-4 lg:p-8 text-black dark:text-white transition-colors">
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-6 h-[calc(100vh-64px)]">
        <div className="relative rounded-3xl overflow-hidden border border-black/5 dark:border-white/10">
          {/* Map Placeholder Image */}
          <img
            src="https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=1400"
            className="absolute inset-0 w-full h-full object-cover"
          />

          <div className="absolute inset-0 bg-black/40" />

          {/* Top Bar */}
          <div className="absolute top-5 left-5 right-5 flex items-center justify-between">
            <div className="rounded-2xl bg-black/60 backdrop-blur-xl border border-white/10 px-5 py-3 text-white">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${tracking ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
                {tracking ? "Live Tracking Active" : "Tracking Paused"}
              </div>
              {location && (
                <div className="text-xs text-white/70 mt-1 font-mono">
                  {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
                </div>
              )}
              {error && <div className="text-xs text-red-400 mt-1">{error}</div>}
            </div>

            <button 
              onClick={startTracking}
              className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${tracking ? 'bg-cyan-500 text-black' : 'bg-white text-black hover:bg-cyan-100'}`}>
              <LocateFixed className="w-5 h-5" />
            </button>
          </div>

          {/* Current Location Marker Simulation */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
             <div className="relative">
                <div className="absolute -inset-4 bg-cyan-500/30 rounded-full animate-ping" />
                <div className="bg-cyan-500 text-black p-3 rounded-full relative z-10 shadow-lg">
                  <MapPin className="w-6 h-6" />
                </div>
             </div>
          </div>

          {/* Bottom Bar */}
          <div className="absolute bottom-6 left-6 right-6 rounded-3xl bg-black/70 backdrop-blur-xl border border-white/10 p-5 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/60 text-sm">{nextActivity ? "Next Destination" : "Current Destination"}</p>
                <h3 className="text-2xl font-bold mt-1">
                  {nextActivity?.activity || currentActivity?.activity || trip?.destination || "Unknown"}
                </h3>
              </div>

              <button className="rounded-2xl bg-cyan-400 text-black px-5 py-3 font-semibold flex items-center gap-2 hover:bg-cyan-300 transition-colors">
                <Navigation className="w-4 h-4" />
                Navigate
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="rounded-3xl bg-white dark:bg-[#0D1425] border border-black/5 dark:border-white/10 p-6">
            <h3 className="font-semibold text-lg mb-5">Nearby Places</h3>

            <div className="space-y-4">
              <MapCard title="Ramen Ichiran" distance="300m" />
              <MapCard title="Tokyo Jazz House" distance="1.2km" />
              <MapCard title="Night Market" distance="700m" />
            </div>
          </div>

          <div className="rounded-3xl bg-gradient-to-br from-red-600 to-red-500 p-6 text-white shadow-lg shadow-red-500/20">
            <div className="flex items-center gap-3">
              <Shield className="w-6 h-6" />
              <h3 className="font-semibold text-xl">Safety Status</h3>
            </div>

            <p className="mt-4 text-white/80">
              Area currently safe with moderate crowd density. Live location tracking enabled.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
function MapCard({ title, distance }: any) {
  return (
    <div className="rounded-2xl border border-white/10 p-4 flex items-center justify-between">
      <div>
        <h4 className="font-medium">{title}</h4>
        <p className="text-sm text-white/50">{distance} away</p>
      </div>

      <button className="rounded-xl bg-white/10 px-4 py-2 text-sm">
        View
      </button>
    </div>
  );
}