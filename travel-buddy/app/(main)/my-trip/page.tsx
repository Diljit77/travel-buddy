"use client";
import React, { useEffect, useState } from "react";
import {
  CalendarDays,
  MapPin,
  Plane,
  ChevronRight,
  Loader2
} from "lucide-react";
import { NavBar } from "@/app/components/trip/NavBar";
import { T } from "@/app/components/trip/Theme";
import { useTheme } from "next-themes";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/app/store/useUserStore";

export default function MyTripsPage() {
  const [trips, setTrips] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { resolvedTheme } = useTheme();
  const { user } = useUserStore();
  const router = useRouter();

  const t = resolvedTheme === "light" ? T.light : T.dark;

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const res = await fetch("/api/trip");
        const data = await res.json();
        if (data.success) {
          setTrips(data.data);
        }
      } catch (err) {
        console.error("Failed to fetch trips", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTrips();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "confirmed": return "text-emerald-500 bg-emerald-500/10";
      case "planned": return "text-blue-500 bg-blue-500/10";
      default: return "text-amber-500 bg-amber-500/10";
    }
  };
  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#08080c] transition-colors duration-300">
      <NavBar t={t} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <header className="mb-10">
          <h1 className="text-4xl font-bold text-[#0f172a] dark:text-white font-['Playfair_Display',serif]">
            My Trips
          </h1>
          <p className="mt-2 text-[#64748b] dark:text-gray-400">
            A curated collection of your celestial trajectories and past memories.
          </p>
        </header>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <Loader2 className="w-10 h-10 animate-spin mb-4" />
            <p>Loading your expeditions...</p>
          </div>
        ) : trips.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-[#0f0f15] rounded-[32px] border border-gray-100 dark:border-white/5 shadow-sm">
            <div className="w-20 h-20 bg-gray-50 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
              <MapPin className="w-10 h-10 text-gray-300 dark:text-gray-600" />
            </div>
            <h2 className="text-2xl font-bold text-[#0f172a] dark:text-white mb-2">No trips found</h2>
            <p className="text-[#64748b] dark:text-gray-400 mb-8 max-w-sm mx-auto">
              Your map is currently blank. Let's start curating your first masterpiece.
            </p>
            <Link href="/plan-trip" className="inline-flex items-center gap-2 bg-[#1a3cff] hover:bg-[#0f2de0] text-white px-8 py-3.5 rounded-2xl font-semibold transition-all shadow-lg shadow-[#1a3cff]/20">
              <Plane className="w-4 h-4" />
              Plan New Journey
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {trips.map((trip) => (
              <div
                key={trip._id}
                className="group bg-white dark:bg-[#15151e] rounded-[32px] overflow-hidden border border-gray-100 dark:border-white/5 shadow-sm hover:shadow-2xl transition-all duration-500"
              >
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={trip.destinationImage || trip.plan?.destinationImage || "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1200&auto=format&fit=crop"}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute top-5 right-5">
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold tracking-wider uppercase backdrop-blur-md ${getStatusColor(trip.status)}`}>
                      {trip.status || "PLANNED"}
                    </span>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>

                <div className="p-8">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-2xl font-bold text-[#0f172a] dark:text-white mb-1 group-hover:text-[#1a3cff] dark:group-hover:text-blue-400 transition-colors">
                        {trip.destination}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-[#64748b] dark:text-gray-400">
                        <CalendarDays className="w-4 h-4" />
                        {trip.days} Days · {trip.mode}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-50 dark:border-white/5">
                    <div className="text-sm font-semibold text-[#0f172a] dark:text-gray-300">
                      ₹{trip.budget?.toLocaleString()}
                    </div>
                    <div className="flex items-center gap-4">
                      <Link
                        href={`/trip/${trip._id}`}
                        className="text-sm font-bold text-[#64748b] dark:text-gray-400 hover:text-[#1a3cff] dark:hover:text-blue-400 transition-colors"
                      >
                        View Details
                      </Link>
                      <Link
                        href={`/journey/${trip._id}`}
                        className="flex items-center gap-2 bg-[#1a3cff] hover:bg-[#0f2de0] text-white px-4 py-2 rounded-xl text-sm font-bold transition-all shadow-md shadow-[#1a3cff]/20 hover:scale-105"
                      >
                        Start Trip
                        <Plane className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* PROMO BANNER */}
        <div className="mt-16 relative rounded-[40px] bg-[#ececf1] dark:bg-[#0f0f15] overflow-hidden border border-gray-100 dark:border-white/5">
          <div className="grid lg:grid-cols-2 items-center">
            <div className="p-10 lg:p-16">
              <h2 className="text-4xl lg:text-5xl font-bold leading-tight text-[#0f172a] dark:text-white font-['Playfair_Display',serif]">
                Ready for your next
                <span className="text-[#f59e0b] block mt-2"> Masterpiece?</span>
              </h2>
              <p className="mt-6 text-[#64748b] dark:text-gray-400 text-lg leading-relaxed max-w-lg">
                Our digital concierge uses celestial data to craft journeys through the world's most exclusive hidden gems.
              </p>
              <Link href="/plan-trip" className="mt-10 inline-flex items-center gap-3 bg-[#0f172a] dark:bg-white text-white dark:text-black px-10 py-4 rounded-2xl font-bold hover:scale-105 transition-all shadow-xl">
                <Plane className="w-5 h-5" />
                Start AI Planning
              </Link>
            </div>
            <div className="hidden lg:block relative p-10 h-full">
               <img
                src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=1200&auto=format&fit=crop"
                className="rounded-[30px] shadow-2xl rotate-3 h-[400px] w-full object-cover"
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}