"use client";

import { useUserStore } from "@/app/store/useUserStore";
import { useTheme } from "next-themes";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { NavBar } from "@/app/components/trip/NavBar";
import { T } from "@/app/components/trip/Theme";

const destinations = [
  {
    name: "Udaipur, Rajasthan",
    tagline: "Venice of the East & Lakes",
    price: "₹35,000/pp",
    tag: "ROYAL HERITAGE",
    img: "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=400&q=80",
  },
  {
    name: "Mumbai, MH",
    tagline: "The City of Dreams & Sea",
    price: "₹18,000/pp",
    tag: "COASTAL CITY",
    img: "https://images.unsplash.com/photo-1566552881560-0be862a7c445?w=400&q=80",
  },
  {
    name: "Leh Ladakh",
    tagline: "Passes & Sparkling Lakes",
    price: "₹45,000/pp",
    tag: "ADVENTURE PEAKS",
    img: "https://images.unsplash.com/photo-1548013146-72479768bada?w=400&q=80",
  },
  {
    name: "Kerala Backwaters",
    tagline: "God's Own Country Houseboat",
    price: "₹25,000/pp",
    tag: "SERENE NATURE",
    img: "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?w=400&q=80",
  },
];

const upcomingJourneys = [
  {
    name: "Manali & Solang Valley Peaks",
    tagline: "Exploring snowy peaks, paragliding thrills, and lazy Solang Valley walks.",
    dates: "5 Days | Dec 2026",
    tag: "COMING UP NEXT",
    rating: null,
    img: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&q=80",
    large: true,
  },
  {
    name: "Varanasi Ganga Aarti",
    dates: "Dec 22 – Dec 26 • 2 Travelers",
    tag: "Planned",
    img: "https://images.unsplash.com/photo-1561361513-2d000a50f0db?w=400&q=80",
    large: false,
  },
  {
    name: "Goa Beach Soiree",
    dates: "Feb 2027 • Solo Trip",
    tag: "Saved",
    img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&q=80",
    large: false,
  },
];

const recommended = [
  {
    name: "Jaipur, Rajasthan",
    tagline: "TRENDING IN INDIA",
    price: "From ₹12,000",
    img: "https://images.unsplash.com/photo-1477587458883-471a5ed94245?w=600&q=80",
    large: true,
  },
  {
    name: "Munnar, Kerala",
    img: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=400&q=80",
    large: false,
  },
  {
    name: "Agra, Uttar Pradesh",
    img: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=400&q=80",
    large: false,
  },
  {
    name: "Havelock, Andamans",
    tagline: "Pristine white sand beaches",
    img: "https://images.unsplash.com/photo-1589308078059-be1415eab4c3?w=600&q=80",
    large: false,
    wide: true,
  },
];

export default function HomePage() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [query, setQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [userTrips, setUserTrips] = useState<any[]>([]);
  const [loadingTrips, setLoadingTrips] = useState(true);
  const [generatingDestination, setGeneratingDestination] = useState<string | null>(null);

  const { user, logout } = useUserStore();
  const router = useRouter();

  const [recommendedList, setRecommendedList] = useState<any[]>(recommended);

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      const fetchTrips = async () => {
        try {
          const res = await fetch("/api/trip");
          const data = await res.json();
          if (data.success) {
            setUserTrips(data.data || []);
          }
        } catch (err) {
          console.error("Failed to fetch trips in Home Feed:", err);
        } finally {
          setLoadingTrips(false);
        }
      };
      const fetchRecommendations = async () => {
        try {
          const res = await fetch("/api/recommendations");
          const data = await res.json();
          if (data.success && data.data && data.data.length >= 4) {
            setRecommendedList(data.data);
          }
        } catch (err) {
          console.error("Failed to fetch live recommendations:", err);
        }
      };
      fetchTrips();
      fetchRecommendations();
    }
  }, [mounted]);

  // Compute recommendations based on last destination
  const lastTripDestination = userTrips.length > 0 ? userTrips[0].destination : undefined;
  
  const getPersonalizedRecommendations = (lastDestination?: string) => {
    const destLower = lastDestination?.toLowerCase() || "";
    
    if (destLower.includes("goa") || destLower.includes("beach") || destLower.includes("bali") || destLower.includes("maldives") || destLower.includes("phuket") || destLower.includes("island") || destLower.includes("sea")) {
      return [
        {
          name: "Santorini, Greece",
          tagline: "The Art of Living White",
          price: "₹1,80,000/pp",
          tag: "BEACH & SUN",
          img: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=400&q=80",
        },
        {
          name: "Maldives",
          tagline: "Overwater Villa Paradise",
          price: "₹2,20,000/pp",
          tag: "LUXURY BEACH",
          img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&q=80",
        },
        {
          name: "Phuket, Thailand",
          tagline: "Tropical Andaman Escape",
          price: "₹45,000/pp",
          tag: "ISLAND GETAWAY",
          img: "https://images.unsplash.com/photo-1589308078059-be1415eab4c3?w=400&q=80",
        },
        {
          name: "Kerala, India",
          tagline: "Serene Backwater Houseboats",
          price: "₹35,000/pp",
          tag: "NATURE & COAST",
          img: "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?w=400&q=80",
        }
      ];
    }
    
    if (destLower.includes("manali") || destLower.includes("leh") || destLower.includes("ladakh") || destLower.includes("mountain") || destLower.includes("zermatt") || destLower.includes("swiss") || destLower.includes("alps") || destLower.includes("hill")) {
      return [
        {
          name: "Zermatt, Switzerland",
          tagline: "Matterhorn Mornings",
          price: "₹2,90,000/pp",
          tag: "COZY ALPINE",
          img: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80",
        },
        {
          name: "Banff, Canada",
          tagline: "Turquoise Mountain Lakes",
          price: "₹2,40,000/pp",
          tag: "WILDERNESS",
          img: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=400&q=80",
        },
        {
          name: "Leh Ladakh, India",
          tagline: "The Land of High Passes",
          price: "₹40,000/pp",
          tag: "ADVENTURE",
          img: "https://images.unsplash.com/photo-1548013146-72479768bada?w=400&q=80",
        },
        {
          name: "Queenstown, NZ",
          tagline: "Alpine Adventure Capital",
          price: "₹3,10,000/pp",
          tag: "PEAK THRILLS",
          img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&q=80",
        }
      ];
    }

    // Default premium selection
    return [
      {
        name: "Oia, Greece",
        tagline: "The Art of Living White",
        price: "₹2,10,000/pp",
        tag: "ARCHITECTURE",
        img: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=400&q=80",
      },
      {
        name: "Singapore",
        tagline: "Vertical Power Strip",
        price: "₹65,000/pp",
        tag: "FUTURE CITIES",
        img: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=400&q=80",
      },
      {
        name: "Zermatt, CH",
        tagline: "Matterhorn Mornings",
        price: "₹2,90,000/pp",
        tag: "COZY ALPINE",
        img: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80",
      },
      {
        name: "Tuscany, Italy",
        tagline: "Vineyard Serenity",
        price: "₹1,95,000/pp",
        tag: "VENTURE",
        img: "https://images.unsplash.com/photo-1523531294919-4bcd7c65e216?w=400&q=80",
      },
    ];
  };

  const dynamicDestinations = getPersonalizedRecommendations(lastTripDestination);

  const handleCuratedClick = async (destinationName: string) => {
    try {
      setGeneratingDestination(destinationName);
      toast.info(`Curating your custom escape to ${destinationName}...`, { autoClose: 3000 });
      
      const res = await fetch("/api/plan", {
        method: "POST",
        body: JSON.stringify({
          budget: 150000,
          days: 5,
          mode: ["flight", "cab"],
          destination: destinationName,
          travelType: "Solo Expedition",
          userLocation: "Delhi",
        }),
      });

      const data = await res.json();
      if (data.success && data.trip) {
        toast.success(`Welcome to ${destinationName}!`);
        router.push(`/trip/${data.trip._id}`);
      } else {
        toast.error(data.error || "Failed to generate dynamic trip.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to connect to plan API.");
    } finally {
      setGeneratingDestination(null);
    }
  };

  const handleLogout = async () => {
    try {
      logout();
      toast.success("Logged out successfully!");
      setTimeout(() => {
        router.push("/login");
      }, 1000);
    } catch (error) {
      toast.error("Logout failed. Please try again.");
    }
  };

  if (!mounted) return null;

  return (
    <div>
      <div className="min-h-screen bg-[#f8fafc] dark:bg-[#08080c] font-sans transition-colors duration-300">

        <NavBar t={resolvedTheme === "light" ? T.light : T.dark} />

        {/* HERO */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-linear-to-b from-sky-50/60 to-[#f8fafc] dark:from-[#0b1a2e] dark:to-[#08080c]" />
          {/* Decorative mountain silhouette */}
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-linear-to-t from-[#f8fafc] dark:from-[#08080c] to-transparent z-10" />
          <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20 text-center">
            <p className="text-xs font-semibold tracking-widest text-amber-500 uppercase mb-3">
              Explore Incredible India
            </p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight text-[#0f172a] dark:text-white mb-2">
              Discover India's
            </h1>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight text-amber-500 dark:text-cyan-400 mb-6">
              Hidden Masterpieces
            </h1>
            <p className="text-[#64748b] dark:text-gray-400 text-base sm:text-lg max-w-md mx-auto mb-8">
              Plan your next divine escape across majestic forts, peaceful ghats, and pristine tropical beaches.
            </p>

            {/* Search bar */}
            <div className="flex items-center max-w-xl mx-auto bg-white dark:bg-white/10 border border-gray-200 dark:border-white/10 rounded-xl shadow-lg overflow-hidden mb-6">
              <span className="pl-4 text-gray-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
                </svg>
              </span>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search destinations, experiences, or stays…"
                className="flex-1 px-3 py-3 bg-transparent text-sm text-gray-700 dark:text-white placeholder-gray-400 outline-none"
              />
              <button className="bg-blue-600 hover:bg-blue-700 dark:bg-cyan-500 dark:hover:bg-cyan-600 text-white text-sm font-semibold px-5 py-3 transition-colors">
                Find Now
              </button>
            </div>

            <div className="flex items-center justify-center gap-4 text-sm">
              <Link href="/plan-trip" className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-semibold px-5 py-2.5 rounded-lg transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Start New Plan
              </Link>
              <button className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors font-medium">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3l7 7-7 7M19 3l-7 7 7 7" />
                </svg>
                Get Inspired
              </button>
            </div>
          </div>
        </section>

        {/* MY UPCOMING JOURNEYS */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-xs font-semibold tracking-widest text-amber-500 uppercase mb-1">Your Adventure</p>
              <h2 className="text-2xl font-bold text-[#0f172a] dark:text-white">My Upcoming Journeys</h2>
            </div>
            <Link href="/my-trip" className="text-sm text-blue-600 dark:text-cyan-400 hover:underline font-medium flex items-center gap-1">
              View All Plans →
            </Link>
          </div>

          {loadingTrips ? (
            <div className="flex items-center justify-center py-12 text-gray-400 text-sm">
              <svg className="animate-spin w-5 h-5 mr-3 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" strokeLinecap="round" className="opacity-25" />
                <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" className="opacity-75" />
              </svg>
              <span>Checking your celestial trajectories...</span>
            </div>
          ) : userTrips.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Large card */}
              <div 
                onClick={() => router.push(`/trip/${userTrips[0]._id}`)}
                className="md:col-span-2 relative rounded-2xl overflow-hidden h-72 md:h-80 group cursor-pointer"
              >
                <img
                  src={userTrips[0].destinationImage || userTrips[0].plan?.destinationImage || "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1200"}
                  alt={userTrips[0].destination}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute top-3 left-3 flex gap-2">
                  <span className="bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded-full uppercase">
                    {userTrips[0].status || 'PLANNED'}
                  </span>
                  <span className="bg-white/20 backdrop-blur text-white text-xs px-2 py-1 rounded-full">
                    {userTrips[0].days} Days · {userTrips[0].travelType || 'Solo'}
                  </span>
                </div>
                <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                  <div>
                    <h3 className="text-white font-bold text-xl leading-tight">{userTrips[0].destination}</h3>
                    <p className="text-white/70 text-xs mt-1">₹{userTrips[0].budget?.toLocaleString()}</p>
                  </div>
                  <button className="w-9 h-9 bg-white rounded-full flex items-center justify-center text-gray-900 hover:bg-amber-500 hover:text-white transition-colors">
                    →
                  </button>
                </div>
              </div>

              {/* Small cards */}
              <div className="flex flex-col gap-4">
                {userTrips.slice(1, 3).map((j) => (
                  <div 
                    key={j._id} 
                    onClick={() => router.push(`/trip/${j._id}`)}
                    className="relative rounded-2xl overflow-hidden h-34.5 group cursor-pointer"
                  >
                    <img 
                      src={j.destinationImage || j.plan?.destinationImage || "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1200"} 
                      alt={j.destination} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/70 to-transparent" />
                    <span className="absolute top-2 right-2 bg-blue-600 text-white text-xs font-bold px-2 py-0.5 rounded-full uppercase">
                      {j.status || 'PLANNED'}
                    </span>
                    <div className="absolute bottom-3 left-3">
                      <h3 className="text-white font-bold text-sm">{j.destination}</h3>
                      <p className="text-white/70 text-xs">{j.days} Days · ₹{j.budget?.toLocaleString()}</p>
                    </div>
                  </div>
                ))}
                {userTrips.length === 1 && (
                  <Link href="/plan-trip" className="flex flex-col items-center justify-center border-2 border-dashed border-gray-200 dark:border-white/10 rounded-2xl h-34.5 text-gray-400 dark:text-gray-500 hover:border-amber-500 dark:hover:border-cyan-400 hover:text-amber-500 dark:hover:text-cyan-400 transition-colors cursor-pointer">
                    <span className="text-lg">➕</span>
                    <span className="text-xs font-medium mt-1">Plan Another Journey</span>
                  </Link>
                )}
              </div>
            </div>
          ) : (
            /* Fallback to static mock cards if no actual user trips exist */
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Large card */}
              <div className="md:col-span-2 relative rounded-2xl overflow-hidden h-72 md:h-80 group cursor-pointer">
                <img
                  src={upcomingJourneys[0].img}
                  alt={upcomingJourneys[0].name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute top-3 left-3 flex gap-2">
                  <span className="bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                    {upcomingJourneys[0].tag}
                  </span>
                  <span className="bg-white/20 backdrop-blur text-white text-xs px-2 py-1 rounded-full">
                    {upcomingJourneys[0].dates}
                  </span>
                </div>
                <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                  <div>
                    <h3 className="text-white font-bold text-xl leading-tight">{upcomingJourneys[0].name}</h3>
                    <p className="text-white/70 text-xs mt-1">{upcomingJourneys[0].tagline}</p>
                  </div>
                  <button className="w-9 h-9 bg-white rounded-full flex items-center justify-center text-gray-900 hover:bg-amber-500 hover:text-white transition-colors">
                    →
                  </button>
                </div>
              </div>

              {/* Small cards */}
              <div className="flex flex-col gap-4">
                {upcomingJourneys.slice(1).map((j) => (
                  <div key={j.name} className="relative rounded-2xl overflow-hidden h-34.5 group cursor-pointer">
                    <img src={j.img} alt={j.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-linear-to-t from-black/70 to-transparent" />
                    <span className="absolute top-2 right-2 bg-blue-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                      {j.tag}
                    </span>
                    <div className="absolute bottom-3 left-3">
                      <h3 className="text-white font-bold text-sm">{j.name}</h3>
                      <p className="text-white/70 text-xs">{j.dates}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* CURATED FOR YOUR TASTE */}
        <section className="py-16 bg-white dark:bg-[#0f0f15]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 className="text-2xl sm:text-3xl font-bold text-[#0f172a] dark:text-white mb-2">Recommended for You</h2>
              <p className="text-[#64748b] dark:text-gray-400 text-sm max-w-md mx-auto">
                {lastTripDestination ? (
                  `Since you planned a journey to ${lastTripDestination}, we analyzed your preferences to tailor these personalized escapes.`
                ) : (
                  "Based on your love for minimalism and music and alpine landscapes, we thought you might enjoy these destinations."
                )}
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {dynamicDestinations.map((d) => (
                <div 
                  key={d.name} 
                  onClick={() => handleCuratedClick(d.name)}
                  className="relative rounded-2xl overflow-hidden h-52 group cursor-pointer border border-transparent hover:border-amber-500/30 dark:hover:border-cyan-500/30 transition-all duration-300 shadow-md hover:shadow-xl"
                >
                  <img src={d.img} alt={d.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/10 to-transparent" />
                  <span className="absolute top-2 left-2 bg-white/20 backdrop-blur text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {d.tag}
                  </span>
                  <div className="absolute bottom-3 left-3 right-3">
                    <h3 className="text-white font-bold text-sm">{d.name}</h3>
                    <p className="text-white/60 text-xs">{d.tagline}</p>
                    <p className="text-amber-400 dark:text-cyan-400 text-xs font-semibold mt-0.5">{d.price}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* RECOMMENDED FOR YOU */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-[#0f172a] dark:text-white">Recommended for You</h2>
            <a href="#" className="text-sm text-blue-600 dark:text-cyan-400 hover:underline font-medium">View all →</a>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {/* Large featured */}
            {recommendedList[0] && (
              <div 
                className="col-span-2 md:col-span-1 md:row-span-2 relative rounded-2xl overflow-hidden h-64 md:h-auto group cursor-pointer"
                onClick={() => handleCuratedClick(recommendedList[0].name)}
              >
                <img src={recommendedList[0].img} alt={recommendedList[0].name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 min-h-65" />
                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-4 left-4">
                  <p className="text-amber-400 dark:text-cyan-400 text-[10px] font-bold tracking-widest uppercase mb-1">{recommendedList[0].tagline}</p>
                  <h3 className="text-white font-bold text-lg">{recommendedList[0].name}</h3>
                  <p className="text-white/70 text-xs mt-0.5">{recommendedList[0].price}</p>
                </div>
              </div>
            )}

            {[recommendedList[1], recommendedList[2]].map((r) => r && (
              <div 
                key={r.name} 
                className="relative rounded-2xl overflow-hidden h-40 group cursor-pointer"
                onClick={() => handleCuratedClick(r.name)}
              >
                <img src={r.img} alt={r.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-linear-to-t from-black/70 to-transparent" />
                <h3 className="absolute bottom-3 left-3 text-white font-bold text-sm">{r.name}</h3>
              </div>
            ))}

            {recommendedList[3] && (
              <div 
                className="col-span-2 relative rounded-2xl overflow-hidden h-40 group cursor-pointer"
                onClick={() => handleCuratedClick(recommendedList[3].name)}
              >
                <img src={recommendedList[3].img} alt={recommendedList[3].name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-linear-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-3 left-3">
                  <h3 className="text-white font-bold text-sm">{recommendedList[3].name}</h3>
                  <p className="text-white/70 text-xs">{recommendedList[3].tagline}</p>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* NEWSLETTER */}
        <section className="py-16 px-4">
          <div className="max-w-2xl mx-auto bg-blue-900 dark:bg-[#0a1628] rounded-3xl p-10 text-center shadow-xl">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">Become a Better Traveler.</h2>
            <p className="text-blue-200 text-sm mb-6">
              Join 50,000+ explorers receiving curated itineraries and hidden gems every Thursday.
            </p>
            <div className="flex items-center gap-2 max-w-sm mx-auto mb-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 text-sm outline-none focus:border-cyan-400"
              />
              <button className="bg-amber-500 hover:bg-amber-600 text-white font-semibold px-4 py-3 rounded-lg text-sm transition-colors whitespace-nowrap">
                Subscribe
              </button>
            </div>
            <p className="text-blue-300/60 text-xs">No spam, just inspiration. Unsubscribe anytime.</p>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="border-t border-gray-100 dark:border-white/10 bg-[#f8fafc] dark:bg-[#08080c] py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 mb-8">
              <div>
                <span className="text-base font-bold text-[#0f172a] dark:text-white">
                  travel<span className="text-amber-500">Buddy</span>
                </span>
                <p className="text-[#64748b] dark:text-gray-400 text-xs mt-2 leading-relaxed">
                  The modern traveler's companion for curated experiences and seamless planning.
                </p>
                <div className="flex gap-3 mt-3 text-gray-400">
                  {["◈", "↗", "✉"].map((icon, i) => (
                    <button key={i} className="hover:text-amber-500 transition-colors text-sm">{icon}</button>
                  ))}
                </div>
              </div>
              {[
                { title: "Discovery", links: ["Newest Destinations", "Curated Journals", "Solo Travel Guides", "Sustainable Stays"] },
                { title: "Company", links: ["About Our Vision", "travelBuddy Careers", "Contact Concierge", "Partnerships"] },
                { title: "Legal", links: ["Privacy Policy", "Terms of Service", "Cookie Settings"] },
              ].map((col) => (
                <div key={col.title}>
                  <p className="text-[#0f172a] dark:text-white font-semibold text-sm mb-3">{col.title}</p>
                  <ul className="space-y-2">
                    {col.links.map((link) => (
                      <li key={link}>
                        <a href="#" className="text-gray-500 dark:text-gray-400 text-xs hover:text-amber-500 dark:hover:text-cyan-400 transition-colors">
                          {link}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-100 dark:border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-400">
              <span>© 2026 travelBuddy Travel Group. All rights reserved.</span>
              <span>Designed for the Intentional Explorer.</span>
            </div>
          </div>
        </footer>
      </div>
      {generatingDestination && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex flex-col items-center justify-center text-white p-6">
          <div className="relative w-24 h-24 mb-6">
            <div className="absolute inset-0 border-4 border-amber-500/20 rounded-full" />
            <div className="absolute inset-0 border-4 border-t-amber-500 rounded-full animate-spin" />
            <span className="absolute inset-0 flex items-center justify-center text-2xl">✨</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-extrabold font-['Playfair_Display',serif] mb-2 tracking-tight">Curating {generatingDestination}</h3>
          <p className="text-gray-400 text-sm max-w-sm text-center leading-relaxed">
            Please wait while our travel engine constructs a custom-tailored smart itinerary, finds nearby accommodations, and calculates budgets...
          </p>
        </div>
      )}
    </div>
  );
}