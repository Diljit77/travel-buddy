"use client";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { NavBar } from "@/app/components/trip/NavBar";
import { T } from "@/app/components/trip/Theme";
const tripModes = [
  {
    id: "relax",
    label: "Relax",
    sub: "Beaches, Spas & Calm",
    badge: null,
    img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80",
  },
  {
    id: "adventure",
    label: "Adventure",
    sub: "Hiking, Sports & Thrills",
    badge: "HOT",
    img: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80",
  },
  {
    id: "spiritual",
    label: "Spiritual",
    sub: "Temples, Yoga & Peace",
    badge: null,
    img: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=800&q=80",
  },
  {
    id: "cultural",
    label: "Cultural",
    sub: "History, Art & Local Life",
    badge: "NEW",
    img: "https://images.unsplash.com/photo-1555993539-1732b0258235?w=800&q=80",
  },
];

const travelTypes = [
  { id: "solo", label: "Solo", icon: "👤" },
  { id: "group", label: "Group", icon: "👥" },
  { id: "couple", label: "Couple", icon: "❤️" },
  { id: "family", label: "Family", icon: "🏠" },
];

const budgetOptions = [
  { id: "value", label: "Value Explorer" },
  { id: "premium", label: "Premium Comfort" },
  { id: "ultra", label: "Ultra Luxe" },
];

const navItems = [
  { label: "Explore", href: "#" },
  { label: "My Trips", href: "#" },
  { label: "Concierge", href: "#" },
  { label: "Journal", href: "#" },
];

export default function TravelPlannerPage() {
  const router = useRouter();
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [plan, setPlan] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [budget, setBudget] = useState("50000");
  const [budgetOption, setBudgetOption] = useState("premium");
  const [days, setDays] = useState("5");
  const [travelType, setTravelType] = useState("solo");
  const [selectedModes, setSelectedModes] = useState<string[]>(["relax"]);
  const [destination, setDestination] = useState("Goa, India");
  const [travelTypeDropdown, setTravelTypeDropdown] = useState("Solo Expedition");
  const [userLocation, setUserLocation] = useState("");
  
  // Geoapify Autocomplete States
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [searching, setSearching] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Parse URL query params if present to prefill
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const destParam = params.get("destination");
      const budgetParam = params.get("budget");
      const daysParam = params.get("days");

      if (destParam) setDestination(destParam);
      if (budgetParam) setBudget(budgetParam);
      if (daysParam) setDays(daysParam);
    }

    navigator.geolocation.getCurrentPosition((pos) => {
      setUserLocation(`${pos.coords.latitude},${pos.coords.longitude}`);
    });
  }, []);

  // Debounced autocomplete suggestions fetching
  useEffect(() => {
    if (!destination.trim() || destination.trim().length < 2) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setSearching(true);
        const res = await fetch(`/api/autocomplete?text=${encodeURIComponent(destination)}`);
        const data = await res.json();
        if (data.success) {
          setSuggestions(data.data || []);
        }
      } catch (err) {
        console.error("Autocomplete search failed:", err);
      } finally {
        setSearching(false);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [destination]);

  const toggleMode = (id: string) => {
    setSelectedModes((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]
    );
  };
  const handleGenerate = async () => {
  // 🔴 VALIDATION FIRST
  if (!budget || Number(budget) <= 0) {
    toast.error("Please enter a valid budget");
    return;
  }

  if (!days || Number(days) <= 0) {
    toast.error("Please enter number of days");
    return;
  }

  if (!destination.trim()) {
    toast.error("Please enter a destination");
    return;
  }

  if (selectedModes.length === 0) {
    toast.error("Please select at least one trip mode");
    return;
  }

  try {
    setLoading(true);

    const res = await fetch("/api/plan", {
      method: "POST",
      body: JSON.stringify({
        budget: Number(budget),
        days: Number(days),
        mode: selectedModes,
        destination,
        travelType,
        userLocation,
      }),
    });

    const data = await res.json();
    
    if (data.success && data.trip) {
      toast.success("Trip generated and saved successfully!");
      router.push(`/trip/${data.trip._id}`);
    } else {
      toast.error(data.error || "Generation failed");
    }
  } catch (err) {
    console.error(err);
    toast.error("An error occurred");
  } finally {
    setLoading(false);
  }
};
  if (!mounted) return null;

  return (
    <div>
      <div className="min-h-screen bg-[#f8fafc] dark:bg-[#08080c] font-sans transition-colors duration-300">

        {/* ── DESKTOP NAV ── */}
        <NavBar t={resolvedTheme === "light" ? T.light : T.dark} />

        {/* ── MAIN CONTENT ── */}
        <main className="max-w-5xl mx-auto px-4 md:px-8 py-8 md:py-14">

          {/* Hero */}
          <div className="text-center mb-8 md:mb-12">
            <h1 className="text-2xl md:text-4xl font-bold text-[#0f172a] dark:text-white leading-tight mb-2">
              {/* Mobile */}
              <span className="md:hidden">Plan Your Escape</span>
              {/* Desktop */}
              <span className="hidden md:inline">
                Design Your Next{" "}
                <span className="text-[#f5a623]">Odyssey</span>
              </span>
            </h1>
            <p className="text-sm md:text-[15px] text-[#64748b] dark:text-gray-400 max-w-md mx-auto">
              {/* Mobile */}
              <span className="md:hidden">
                Tell us your preferences, and we'll curate the perfect journey for you.
              </span>
              {/* Desktop */}
              <span className="hidden md:inline">
                Share your preferences and let our digital concierge curate a bespoke itinerary
                tailored for your rhythm.
              </span>
            </p>
          </div>

          {/* ── DESKTOP FORM GRID ── */}
          <div className="hidden md:grid grid-cols-3 gap-4 mb-6">

            {/* Budget */}
            {/* <div className="bg-white dark:bg-[#0d1526] rounded-2xl p-5 border border-gray-100 dark:border-white/5 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-base">💰</span>
                <span className="text-[13px] font-semibold text-gray-700 dark:text-gray-200">Budget</span>
              </div>
              <p className="text-[11px] text-gray-400 dark:text-gray-500 mb-3">
                Select your investment range for this journey
              </p>
              <div className="space-y-2">
                {budgetOptions.map((b) => (
                  <label
                    key={b.id}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer border transition-all text-[12px] font-medium
                      ${budgetOption === b.id
                        ? "border-[#1a3cff] bg-blue-50 dark:bg-[#1a3cff]/10 text-[#1a3cff] dark:text-blue-400"
                        : "border-gray-100 dark:border-white/5 text-gray-600 dark:text-gray-400 hover:border-gray-200 dark:hover:border-white/10"
                      }`}
                  >
                    <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors
                      ${budgetOption === b.id ? "border-[#1a3cff]" : "border-gray-300 dark:border-gray-600"}`}>
                      {budgetOption === b.id && (
                        <span className="w-2 h-2 rounded-full bg-[#1a3cff]" />
                      )}
                    </span>
                    <input
                      type="radio"
                      name="budget"
                      value={b.id}
                      checked={budgetOption === b.id}
                      onChange={() => setBudgetOption(b.id)}
                      className="hidden"
                    />
                    {b.label}
                  </label>
                ))}
              </div>
            </div> */}
{/* Budget */}
<div className="bg-white dark:bg-[#15151e] rounded-2xl p-5 border border-gray-100 dark:border-white/5 shadow-sm">
  <div className="flex items-center gap-2 mb-4">
    <span className="text-base">💰</span>
    <span className="text-[13px] font-semibold text-[#0f172a] dark:text-gray-200">
      Budget
    </span>
  </div>

  <p className="text-[11px] text-gray-400 dark:text-gray-500 mb-3">
    Enter your total budget for this trip
  </p>

  <input
    type="number"
    placeholder="Enter budget (e.g. 5000)"
    value={budget}
    onChange={(e) => setBudget(e.target.value)}
    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 
    bg-white dark:bg-[#08080c] text-sm text-[#0f172a] dark:text-gray-200 
    placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1a3cff]"
  />
</div>
            {/* Duration + Travel Type */}
            <div className="space-y-4">
              <div className="bg-white dark:bg-[#15151e] rounded-2xl p-5 border border-gray-100 dark:border-white/5 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-base">📅</span>
                  <span className="text-[13px] font-semibold text-[#0f172a] dark:text-gray-200">Duration</span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={days}
                    onChange={(e) => setDays(e.target.value)}
                    placeholder="Number of days"
                    className="flex-1 bg-gray-50 dark:bg-[#08080c] border border-gray-200 dark:border-white/5 rounded-xl px-3 py-2.5 text-[13px] text-[#0f172a] dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-600 outline-none focus:border-[#1a3cff] dark:focus:border-blue-500 transition-colors"
                  />
                  <span className="text-[12px] text-gray-400 dark:text-gray-500 whitespace-nowrap">Days</span>
                </div>
              </div>

              <div className="bg-white dark:bg-[#15151e] rounded-2xl p-5 border border-gray-100 dark:border-white/5 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-base">✈️</span>
                  <span className="text-[13px] font-semibold text-[#0f172a] dark:text-gray-200">Travel Type</span>
                </div>
                <select
                  value={travelTypeDropdown}
                  onChange={(e) => setTravelTypeDropdown(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-[#08080c] border border-gray-200 dark:border-white/5 rounded-xl px-3 py-2.5 text-[13px] text-[#0f172a] dark:text-gray-200 outline-none focus:border-[#1a3cff] dark:focus:border-blue-500 transition-colors appearance-none"
                >
                  <option>Solo Expedition</option>
                  <option>Group Journey</option>
                  <option>Couple Retreat</option>
                  <option>Family Adventure</option>
                </select>
              </div>
            </div>

            {/* Destination */}
            <div className="bg-white dark:bg-[#15151e] rounded-2xl p-5 border border-gray-100 dark:border-white/5 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-base">📍</span>
                <span className="text-[13px] font-semibold text-[#0f172a] dark:text-gray-200">Destination</span>
              </div>
              <div className="relative">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35m0 0A7 7 0 104.65 4.65a7 7 0 0011.99 11.99z" />
                </svg>
                <input
                  type="text"
                  value={destination}
                  onChange={(e) => {
                    setDestination(e.target.value);
                    setShowSuggestions(true);
                  }}
                  onFocus={() => setShowSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 250)}
                  placeholder="Where do you want to explore?"
                  className="w-full bg-gray-50 dark:bg-[#08080c] border border-gray-200 dark:border-white/5 rounded-xl pl-9 pr-3 py-2.5 text-[13px] text-[#0f172a] dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-600 outline-none focus:border-[#1a3cff] dark:focus:border-blue-500 transition-colors"
                />

                {/* Geoapify Suggestions list */}
                {showSuggestions && (searching || suggestions.length > 0) && (
                  <div className="absolute z-50 left-0 right-0 mt-2 bg-white dark:bg-[#15151e] border border-gray-100 dark:border-white/10 rounded-xl shadow-xl overflow-hidden max-h-60 overflow-y-auto">
                    {searching && (
                      <div className="px-4 py-3 text-xs text-gray-400 flex items-center gap-2">
                        <svg className="animate-spin h-3.5 w-3.5 text-amber-500" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        <span>Searching locations...</span>
                      </div>
                    )}
                    {!searching && suggestions.map((place, idx) => (
                      <div
                        key={idx}
                        onClick={() => {
                          setDestination(place);
                          setShowSuggestions(false);
                        }}
                        className="px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-[#08080c] cursor-pointer text-xs text-[#0f172a] dark:text-gray-200 transition-colors border-b border-gray-50 dark:border-white/5 last:border-b-0"
                      >
                        📍 {place}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ── MOBILE FORM ── */}
          <div className="md:hidden space-y-4 mb-6">

            {/* Budget */}
            <div className="bg-white dark:bg-[#15151e] rounded-2xl p-4 border border-gray-100 dark:border-white/5 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <span>💰</span>
                <span className="text-[13px] font-semibold text-[#0f172a] dark:text-gray-200">Budget</span>
              </div>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 text-sm">₹</span>
                <input
                  type="number"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  placeholder="Enter Amount"
                  className="w-full bg-gray-50 dark:bg-[#08080c] border border-gray-200 dark:border-white/5 rounded-xl pl-7 pr-3 py-2.5 text-[13px] text-[#0f172a] dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-600 outline-none focus:border-[#1a3cff] dark:focus:border-blue-400 transition-colors"
                />
              </div>
            </div>

            {/* Destination */}
            <div className="bg-white dark:bg-[#15151e] rounded-2xl p-4 border border-gray-100 dark:border-white/5 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <span>📍</span>
                <span className="text-[13px] font-semibold text-[#0f172a] dark:text-gray-200">Destination</span>
              </div>
              <div className="relative">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35m0 0A7 7 0 104.65 4.65a7 7 0 0011.99 11.99z" />
                </svg>
                <input
                  type="text"
                  value={destination}
                  onChange={(e) => {
                    setDestination(e.target.value);
                    setShowSuggestions(true);
                  }}
                  onFocus={() => setShowSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 250)}
                  placeholder="Where do you want to explore?"
                  className="w-full bg-gray-50 dark:bg-[#08080c] border border-gray-200 dark:border-white/5 rounded-xl pl-9 pr-3 py-2.5 text-[13px] text-[#0f172a] dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-600 outline-none focus:border-[#1a3cff] dark:focus:border-blue-400 transition-colors"
                />

                {/* Geoapify Suggestions list */}
                {showSuggestions && (searching || suggestions.length > 0) && (
                  <div className="absolute z-50 left-0 right-0 mt-2 bg-white dark:bg-[#15151e] border border-gray-100 dark:border-white/10 rounded-xl shadow-xl overflow-hidden max-h-60 overflow-y-auto">
                    {searching && (
                      <div className="px-4 py-3 text-xs text-gray-400 flex items-center gap-2">
                        <svg className="animate-spin h-3.5 w-3.5 text-amber-500" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        <span>Searching locations...</span>
                      </div>
                    )}
                    {!searching && suggestions.map((place, idx) => (
                      <div
                        key={idx}
                        onClick={() => {
                          setDestination(place);
                          setShowSuggestions(false);
                        }}
                        className="px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-[#08080c] cursor-pointer text-xs text-[#0f172a] dark:text-gray-200 transition-colors border-b border-gray-50 dark:border-white/5 last:border-b-0"
                      >
                        📍 {place}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Duration */}
            <div className="bg-white dark:bg-[#15151e] rounded-2xl p-4 border border-gray-100 dark:border-white/5 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <span>📅</span>
                <span className="text-[13px] font-semibold text-[#0f172a] dark:text-gray-200">Duration</span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={days}
                  onChange={(e) => setDays(e.target.value)}
                  placeholder="How many days?"
                  className="flex-1 bg-gray-50 dark:bg-[#08080c] border border-gray-200 dark:border-white/5 rounded-xl px-3 py-2.5 text-[13px] text-[#0f172a] dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-600 outline-none focus:border-[#1a3cff] dark:focus:border-blue-400 transition-colors"
                />
                <span className="text-[12px] text-[#64748b] dark:text-gray-500">Days</span>
              </div>
            </div>

            {/* Travel Type */}
            <div className="bg-white dark:bg-[#15151e] rounded-2xl p-4 border border-gray-100 dark:border-white/5 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <span>👥</span>
                <span className="text-[13px] font-semibold text-[#0f172a] dark:text-gray-200">Travel Type</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {travelTypes.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setTravelType(t.id)}
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-[12px] font-medium transition-all
                      ${travelType === t.id
                        ? "bg-[#1a3cff] border-[#1a3cff] text-white"
                        : "border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-400 hover:border-gray-300 dark:hover:border-white/20"
                      }`}
                  >
                    <span>{t.icon}</span>
                    {t.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* ── TRIP MODE ── */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-base">🧭</span>
              <h2 className="text-[14px] font-semibold text-[#0f172a] dark:text-gray-100">Trip Mode</h2>
            </div>
            <p className="text-[12px] text-[#64748b] dark:text-gray-500 mb-4 ml-6">
              Define the emotional substance of your trip
            </p>

            {/* Mobile: vertical list */}
            <div className="md:hidden space-y-3">
              {tripModes.slice(0, 3).map((m) => (
                <button
                  key={m.id}
                  onClick={() => toggleMode(m.id)}
                  className={`relative w-full h-27.5 rounded-2xl overflow-hidden text-left transition-all ${
                    selectedModes.includes(m.id) ? "ring-2 ring-[#1a3cff] dark:ring-[#00e5ff]" : ""
                  }`}
                >
                  <img src={m.img} alt={m.label} className="absolute inset-0 w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-linear-to-r from-black/70 via-black/40 to-transparent" />
                  <div className="absolute bottom-3 left-4">
                    <p className="text-white font-semibold text-[13px]">{m.label}</p>
                    <p className="text-white/70 text-[11px]">{m.sub}</p>
                  </div>
                  {selectedModes.includes(m.id) && (
                    <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-[#1a3cff] dark:bg-[#00e5ff] flex items-center justify-center">
                      <svg className="w-3 h-3 text-white dark:text-[#0a0f1e]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                </button>
              ))}
            </div>

          
            <div className="hidden md:grid grid-cols-4 gap-4">
              {tripModes.map((m) => (
                <button
                  key={m.id}
                  onClick={() => toggleMode(m.id)}
                  className={`relative h-40 rounded-2xl overflow-hidden text-left transition-all hover:scale-[1.02] ${
                    selectedModes.includes(m.id) ? "ring-2 ring-[#1a3cff] dark:ring-[#00e5ff]" : ""
                  }`}
                >
                  <img src={m.img} alt={m.label} className="absolute inset-0 w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/30 to-transparent" />
                  {m.badge && (
                    <div className={`absolute top-3 left-3 px-2 py-0.5 rounded-full text-[10px] font-bold text-white ${
                      m.badge === "HOT" ? "bg-orange-500" : "bg-emerald-500"
                    }`}>
                      {m.badge}
                    </div>
                  )}
                  {selectedModes.includes(m.id) && (
                    <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-[#1a3cff] dark:bg-[#00e5ff] flex items-center justify-center">
                      <svg className="w-3 h-3 text-white dark:text-[#0a0f1e]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                  <div className="absolute bottom-3 left-3">
                    <p className="text-white font-semibold text-[13px]">{m.label}</p>
                    <p className="text-white/70 text-[11px]">{m.sub}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* ── AI BADGE ── */}
          <div className="hidden md:flex items-center justify-center gap-2 mb-6 text-[12px] text-[#64748b] dark:text-gray-500">
            <span className="w-4 h-4 rounded-full bg-linear-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-[8px]">✦</span>
            AI-Powered Personalization for you
          </div>

          {/* ── CTA ── */}
          <div className="flex flex-col items-center gap-3">
            <button onClick={handleGenerate} disabled={loading} className="w-full md:w-auto md:px-16 py-3.5 rounded-2xl bg-[#1a3cff] hover:bg-[#0f2de0] text-white font-semibold text-[14px] flex items-center justify-center gap-2 transition-all hover:scale-[1.01] shadow-lg shadow-[#1a3cff]/30 dark:shadow-[#1a3cff]/20 cursor-pointer">
            {loading?"Generating....":"Generate Plan"} 
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </button>
            <p className="hidden md:block text-[11px] text-[#64748b] dark:text-gray-600 text-center max-w-xs">
              Your journey with travelBuddy begins here, curated uniquely to your vibe by tomorrow.
            </p>
            <button className="md:hidden text-[12px] text-[#64748b] dark:text-gray-500 underline underline-offset-2">
              Custom AI Itinerary
            </button>
          </div>
        </main>


        {/* ── MOBILE BOTTOM NAV ── */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-[#0f0f15] border-t border-gray-100 dark:border-white/5 flex items-center justify-around px-4 py-2 z-50">
          {[
            { label: "Home", icon: "🏠" },
            { label: "Plan", icon: "✈️", active: true },
            { label: "Journey", icon: "🗺️" },
            { label: "Profile", icon: "👤" },
          ].map((item) => (
            <button
              key={item.label}
              className={`flex flex-col items-center gap-1 px-3 py-1 rounded-xl transition-colors ${
                item.active
                  ? "text-[#1a3cff] dark:text-[#00e5ff]"
                  : "text-gray-400 dark:text-gray-600"
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span className="text-[10px] font-medium">{item.label}</span>
              {item.active && (
                <span className="w-1 h-1 rounded-full bg-[#1a3cff] dark:bg-[#00e5ff]" />
              )}
            </button>
          ))}
        </nav>

        {/* ── DESKTOP FOOTER ── */}
        <footer className="hidden md:flex items-center justify-between px-10 py-5 border-t border-gray-100 dark:border-white/5 mt-8">
          <span className="text-[12px] text-[#64748b] dark:text-gray-600">travelBuddy</span>
          <div className="flex gap-6">
            {["PRIVACY", "TERMS", "SUPPORT"].map((l) => (
              <a key={l} href="#" className="text-[11px] text-[#64748b] dark:text-gray-600 hover:text-[#0f172a] dark:hover:text-gray-400 transition-colors">
                {l}
              </a>
            ))}
          </div>
          <span className="text-[11px] text-gray-300 dark:text-gray-700">© 2025 travelBuddy Group</span>
        </footer>

        {/* Bottom spacer on mobile for fixed nav */}
        <div className="md:hidden h-20" />
      </div>

      {loading && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-md z-50 flex flex-col items-center justify-center text-white p-6">
          <div className="relative w-24 h-24 mb-6">
            <div className="absolute inset-0 border-4 border-amber-500/20 rounded-full animate-pulse" />
            <div className="absolute inset-0 border-4 border-t-amber-500 rounded-full animate-spin" />
            <span className="absolute inset-0 flex items-center justify-center text-3xl animate-bounce">✈️</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-extrabold font-['Playfair_Display',serif] mb-2 tracking-tight">
            Curating Your Odyssey to {destination}
          </h3>
          <p className="text-gray-400 text-sm max-w-sm text-center leading-relaxed">
            Please wait while travelBuddy orchestrates a custom-tailored smart itinerary, computes local thalis, checks train/flight availability, and designs your digital map...
          </p>
        </div>
      )}
    </div>
  );
}