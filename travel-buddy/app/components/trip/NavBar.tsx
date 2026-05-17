"use client";
import { T } from "./Theme";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useUserStore } from "@/app/store/useUserStore";

export function NavBar({ t }: { t: typeof T.dark }) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const { user, logout } = useUserStore();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <nav className="sticky top-0 z-50 bg-white/90 dark:bg-[#0f0f15]/90 backdrop-blur border-b border-gray-100 dark:border-white/10 w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-14">
        <div className="flex items-center gap-8">
          <Link href="/home" className="text-base font-bold tracking-tight text-[#0f172a] dark:text-white">
            travel<span className="text-amber-500">Buddy</span>
          </Link>
          <div className="hidden md:flex items-center gap-6 text-sm">
            {[
              { label: "Explore", href: "/home" },
              { label: "My Trips", href: "/my-trip" },
              { label: "Plan Trip", href: "/plan-trip" },
              { label: "Journal", href: "#" }
            ].map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`transition-all duration-200 relative py-1.5 px-3 rounded-lg text-xs font-semibold ${
                    isActive
                      ? "text-amber-600 dark:text-amber-400 bg-amber-500/10 dark:bg-amber-400/10"
                      : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
            className="p-2 rounded-full bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/20 transition-colors text-xs font-medium"
          >
            {resolvedTheme === "dark" ? "☀ Light" : "☾ Dark"}
          </button>
          
          <div className="relative">
            <button
              onClick={() => setShowDropdown((v) => !v)}
              className="w-8 h-8 rounded-full bg-linear-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white text-xs font-bold"
            >
              {user?.name?.charAt(0).toUpperCase() || "A"}
            </button>

            {showDropdown && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowDropdown(false)} />
                <div className="absolute right-0 mt-2 w-52 bg-white dark:bg-[#1a1f2e] rounded-xl shadow-xl border border-gray-100 dark:border-white/10 z-50 overflow-hidden">
                  <div className="px-4 py-3 border-b border-gray-100 dark:border-white/10">
                     <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{user?.name || "Traveler"}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user?.email || ""}</p>
                  </div>
                  <div className="py-1">
                    <button onClick={() => { router.push("/profile"); setShowDropdown(false); }} className="w-full text-left px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 flex items-center gap-2">
                      My Profile
                    </button>
                    <button onClick={() => { router.push("/my-trip"); setShowDropdown(false); }} className="w-full text-left px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 flex items-center gap-2">
                      My Trips
                    </button>
                  </div>
                  <div className="border-t border-gray-100 dark:border-white/10 py-1">
                    <button onClick={() => { logout(); router.push("/login"); }} className="w-full text-left px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 flex items-center gap-2">
                      Sign Out
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
