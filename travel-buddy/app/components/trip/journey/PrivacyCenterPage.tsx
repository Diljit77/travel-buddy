"use client";

import {
  ShieldCheck,
  EyeOff,
  Lock,
  Smartphone,
  Globe,
  Bell,
  Fingerprint,
  MapPinned,
  ChevronRight,
} from "lucide-react";

export default function PrivacyCenterPage() {
  return (
    <div className="min-h-screen bg-[#f5f5f7] dark:bg-[#070B16] text-black dark:text-white">
      <div className="p-4 lg:p-8">
        {/* Header */}
        <div className="relative overflow-hidden rounded-[32px] border border-black/5 dark:border-white/10 bg-gradient-to-br from-cyan-500 to-blue-700 p-8 lg:p-10 text-white">
          <div className="absolute top-0 right-0 w-[320px] h-[320px] bg-white/10 rounded-full blur-3xl" />

          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 backdrop-blur-xl px-4 py-2 text-sm font-medium">
              <ShieldCheck className="w-4 h-4" />
              SECURITY & PRIVACY
            </div>

            <h1 className="mt-6 text-4xl lg:text-6xl font-bold tracking-tight">
              Privacy Center
            </h1>

            <p className="mt-5 text-white/80 leading-relaxed max-w-xl">
              Manage your live location, encrypted backups,
              identity protection, and AI privacy preferences
              while traveling.
            </p>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-6 mt-6">
          {/* Left */}
          <div className="space-y-6">
            {/* Privacy Controls */}
            <div className="rounded-[32px] bg-white dark:bg-[#0D1425] border border-black/5 dark:border-white/10 p-6">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-bold">
                    Privacy Controls
                  </h2>

                  <p className="text-black/50 dark:text-white/50 mt-1">
                    Customize your travel privacy settings.
                  </p>
                </div>

                <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
                  <Lock className="w-6 h-6" />
                </div>
              </div>

              <div className="space-y-4">
                <PrivacyItem
                  icon={<MapPinned className="w-5 h-5" />}
                  title="Live Location Sharing"
                  description="Share your location with trusted contacts."
                  active
                />

                <PrivacyItem
                  icon={<EyeOff className="w-5 h-5" />}
                  title="Anonymous Mode"
                  description="Hide activity from public AI recommendations."
                />

                <PrivacyItem
                  icon={<Bell className="w-5 h-5" />}
                  title="Emergency Alerts"
                  description="Receive instant security notifications."
                  active
                />

                <PrivacyItem
                  icon={<Globe className="w-5 h-5" />}
                  title="Public Travel Status"
                  description="Allow friends to see current destination."
                />
              </div>
            </div>

            {/* Device Security */}
            <div className="rounded-[32px] bg-white dark:bg-[#0D1425] border border-black/5 dark:border-white/10 p-6">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-bold">
                    Device Security
                  </h2>

                  <p className="text-black/50 dark:text-white/50 mt-1">
                    Active protection across all connected devices.
                  </p>
                </div>

                <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
                  <Fingerprint className="w-6 h-6" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <SecurityCard
                  title="Biometric Lock"
                  description="Face ID + Fingerprint enabled"
                  icon={<Fingerprint className="w-5 h-5" />}
                />

                <SecurityCard
                  title="Trusted Device"
                  description="Redmi Note 12 Pro connected"
                  icon={<Smartphone className="w-5 h-5" />}
                />

                <SecurityCard
                  title="Encrypted Cloud"
                  description="Secure travel backup active"
                  icon={<ShieldCheck className="w-5 h-5" />}
                />

                <SecurityCard
                  title="VPN Security"
                  description="Protected on public networks"
                  icon={<Globe className="w-5 h-5" />}
                />
              </div>
            </div>
          </div>

          {/* Right */}
          <div className="space-y-6">
            {/* Safety Score */}
            <div className="rounded-[32px] bg-gradient-to-br from-green-500 to-emerald-600 p-6 text-white overflow-hidden relative">
              <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/10" />

              <div className="relative z-10">
                <p className="text-white/70 text-sm">
                  Security Status
                </p>

                <div className="mt-5 flex items-end gap-3">
                  <h2 className="text-6xl font-bold">98%</h2>

                  <span className="pb-2 text-white/80">
                    Protected
                  </span>
                </div>

                <p className="mt-5 text-white/80 leading-relaxed">
                  All security systems operational. No threats
                  detected in your current area.
                </p>
              </div>
            </div>

            {/* Activity Logs */}
            <div className="rounded-[32px] bg-white dark:bg-[#0D1425] border border-black/5 dark:border-white/10 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold">
                  Recent Activity
                </h3>

                <button className="text-cyan-400 text-sm">
                  View All
                </button>
              </div>

              <div className="space-y-4">
                <ActivityItem
                  title="Location accessed"
                  time="2 mins ago"
                />

                <ActivityItem
                  title="Emergency contact updated"
                  time="1 hour ago"
                />

                <ActivityItem
                  title="AI tracking optimized"
                  time="Today"
                />

                <ActivityItem
                  title="Encrypted backup synced"
                  time="Yesterday"
                />
              </div>
            </div>

            {/* Emergency Panel */}
            <div className="rounded-[32px] bg-gradient-to-br from-red-600 to-orange-500 p-6 text-white">
              <h3 className="text-2xl font-bold">
                Emergency Access
              </h3>

              <p className="mt-3 text-white/80 leading-relaxed">
                Instantly share your live location and travel
                status with emergency contacts.
              </p>

              <div className="grid grid-cols-2 gap-4 mt-8">
                <button className="rounded-2xl bg-white text-red-600 py-3 font-semibold">
                  Trigger SOS
                </button>

                <button className="rounded-2xl border border-white/20 bg-white/10 py-3 font-semibold">
                  Share Live
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PrivacyItem({
  icon,
  title,
  description,
  active,
}: any) {
  return (
    <div className="flex items-center justify-between rounded-3xl border border-black/5 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.02] p-5">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
          {icon}
        </div>

        <div>
          <h4 className="font-semibold">{title}</h4>

          <p className="mt-1 text-sm text-black/50 dark:text-white/50">
            {description}
          </p>
        </div>
      </div>

      <button
        className={`relative w-14 h-8 rounded-full transition ${
          active
            ? "bg-cyan-400"
            : "bg-black/10 dark:bg-white/10"
        }`}
      >
        <div
          className={`absolute top-1 w-6 h-6 rounded-full bg-white transition ${
            active ? "left-7" : "left-1"
          }`}
        />
      </button>
    </div>
  );
}

function SecurityCard({
  title,
  description,
  icon,
}: any) {
  return (
    <div className="rounded-3xl border border-black/5 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.02] p-5">
      <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
        {icon}
      </div>

      <h4 className="mt-5 text-lg font-semibold">
        {title}
      </h4>

      <p className="mt-2 text-sm text-black/50 dark:text-white/50 leading-relaxed">
        {description}
      </p>

      <button className="mt-5 flex items-center gap-2 text-cyan-400 text-sm font-medium">
        Configure
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}

function ActivityItem({
  title,
  time,
}: any) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-black/5 dark:border-white/10 p-4">
      <div>
        <h4 className="font-medium">{title}</h4>

        <p className="text-sm text-black/50 dark:text-white/50 mt-1">
          {time}
        </p>
      </div>

      <div className="w-3 h-3 rounded-full bg-green-400 shadow-lg shadow-green-400/40" />
    </div>
  );
}