"use client";

import { Sparkles, Navigation, AlertTriangle, CheckCircle, RefreshCcw, Info } from "lucide-react";
import { useJourneyStore } from "@/store/journeyStore";
import { getTodayPlan, getCurrentActivity, generateDynamicInsights } from "@/lib/journey-engine";
import { useState } from "react";

export default function AISuggestionsPage() {
  const { trip, expenses, replanJourney } = useJourneyStore();
  const [replanPrompt, setReplanPrompt] = useState("");
  const [isReplanning, setIsReplanning] = useState(false);

  const todayPlanObj = getTodayPlan(trip);
  const currentActivity = getCurrentActivity(trip, todayPlanObj);
  const insights = trip && currentActivity ? generateDynamicInsights(trip, currentActivity) : [];

  const handleReplan = async () => {
    if (!trip?._id) return;
    setIsReplanning(true);
    await replanJourney(trip._id, { prompt: replanPrompt || "Optimize remaining journey based on current context" });
    setReplanPrompt("");
    setIsReplanning(false);
  };

  const IconMap: any = {
    warning: AlertTriangle,
    alert: AlertTriangle,
    success: CheckCircle,
    info: Info
  };

  const ColorMap: any = {
    warning: "text-orange-500 bg-orange-500/10",
    alert: "text-red-500 bg-red-500/10",
    success: "text-green-500 bg-green-500/10",
    info: "text-cyan-400 bg-cyan-400/10"
  };

  return (
    <div className="min-h-screen bg-[#f5f5f7] dark:bg-[#070B16] p-4 lg:p-8 text-black dark:text-white transition-colors">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-4xl font-bold flex items-center gap-3">
            <Sparkles className="w-8 h-8 text-cyan-400" /> AI Suggestions
          </h1>
          <p className="text-black/50 dark:text-white/50 mt-2">
            Real-time, context-aware intelligence for your journey.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
        {insights.length > 0 ? insights.map((insight: any, idx: number) => {
          const Icon = IconMap[insight.type] || Info;
          const colors = ColorMap[insight.type] || ColorMap.info;
          return (
            <div
              key={idx}
              className="rounded-3xl p-6 bg-white dark:bg-[#0D1425] border border-black/5 dark:border-white/10 flex flex-col justify-between"
            >
              <div>
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center mb-4 ${colors}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Contextual Alert</h3>
                <p className="text-sm text-black/60 dark:text-white/60 leading-relaxed">
                  {insight.message}
                </p>
              </div>
            </div>
          )
        }) : (
          <div className="col-span-3 text-center py-10 text-black/50 dark:text-white/50">
            No active insights at this moment. The journey is perfectly on track!
          </div>
        )}
      </div>

      <div className="rounded-3xl bg-gradient-to-br from-blue-900 to-cyan-900 p-8 border border-white/10 text-white relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <RefreshCcw className="w-5 h-5 text-cyan-400" />
            <h2 className="text-2xl font-bold">Intelligent Replanning</h2>
          </div>
          <p className="text-white/70 max-w-2xl mb-6">
            Delayed? Raining? Just want to change the vibe? Describe what you want, and the AI will gracefully reconstruct the remaining itinerary without touching completed activities.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="text"
              value={replanPrompt}
              onChange={(e) => setReplanPrompt(e.target.value)}
              placeholder="e.g. Skip the museum and find a cozy indoor cafe instead..."
              className="flex-1 bg-black/20 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder-white/40 outline-none focus:border-cyan-400 focus:bg-black/30 transition-all"
            />
            <button
              onClick={handleReplan}
              disabled={isReplanning}
              className="rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-black px-8 py-4 font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
            >
              {isReplanning ? "AI Re-routing..." : "Replan Journey"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}