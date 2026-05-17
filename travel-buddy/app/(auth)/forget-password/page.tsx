"use client";
import { useState } from "react";
import Link from "next/link";
import { useUserStore } from "@/app/store/useUserStore";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

const { forgetPassword } = useUserStore();
  const validate = () => {
    if (!email) return "Email address is required.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Enter a valid email address.";
    return "";
  };

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  const err = validate();
  if (err) {
    setError(err);
    return;
  }

  const success = await forgetPassword(email);

  if (success) {
    setSubmitted(true);
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] dark:bg-[#08080c]">

      {/* ── Left Hero Panel (desktop only) ── */}
      <div className="relative hidden lg:flex lg:w-[48%] flex-col justify-between overflow-hidden">
        {/* Light: clean ocean gradient */}
        <div className="absolute inset-0 bg-linear-to-br from-[#0d3b6e] via-[#1565a8] to-[#0a2a50] dark:hidden" />
        {/* Dark: midnight city deep */}
        <div className="absolute inset-0 hidden dark:block bg-linear-to-br from-[#02060f] via-[#050e20] to-[#030812]" />

        {/* Overlay texture */}
        <div className="absolute inset-0 opacity-20"
          style={{ backgroundImage: "radial-gradient(circle at 30% 60%, #00c9ff44 0%, transparent 55%), radial-gradient(circle at 75% 25%, #1a6fc433 0%, transparent 45%)" }} />

        {/* Light mode scenic layers */}
        <div className="absolute inset-0 dark:hidden">
          <div className="absolute bottom-0 left-0 right-0 h-2/3 bg-linear-to-t from-[#0d2a4a] via-[#1255a0aa] to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-linear-to-t from-[#081d36] to-transparent" />
        </div>

        {/* Dark mode: city night glow */}
        <div className="absolute inset-0 hidden dark:block">
          <div className="absolute inset-0 bg-linear-to-t from-[#000510] via-transparent to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 h-1/2 opacity-30"
            style={{ background: "linear-gradient(to top, #00c9ff11, transparent)" }} />
        </div>

        {/* Floating orbs */}
        <div className="absolute top-[20%] left-[15%] w-48 h-48 rounded-full blur-3xl opacity-20 bg-[#00c9ff] dark:bg-[#00c9ff]" />
        <div className="absolute bottom-[25%] right-[10%] w-64 h-64 rounded-full blur-3xl opacity-15 bg-[#1a6fc4] dark:bg-[#00aeff]" />

        {/* Content */}
        <div className="relative z-10 p-12">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#00c9ff] dark:bg-[#00c9ff] flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1M4.22 4.22l.71.71m12.02 12.02l.71.71M3 12h1m16 0h1M4.93 19.07l.71-.71M18.36 5.64l.71-.71"/>
              </svg>
            </div>
            <span className="text-white text-lg font-bold tracking-tight font-['Playfair_Display',serif]">travelBuddy</span>
          </div>
        </div>

        <div className="relative z-10 p-12 space-y-5">
          {/* Light mode text */}
          <div className="dark:hidden">
            <p className="text-[#7dd3fc] text-xs font-semibold uppercase tracking-[0.2em] mb-3">Curating Experiences</p>
            <h2 className="text-5xl font-bold text-white leading-tight font-['Playfair_Display',serif]">
              Rediscover your<br />next journey.
            </h2>
            <p className="mt-4 text-blue-200 text-sm leading-relaxed max-w-xs">
              Your digital concierge is ready to help you get back on track. We&apos;ll have you exploring the world again in no time.
            </p>
          </div>
          {/* Dark mode text */}
          <div className="hidden dark:block">
            <p className="text-[#00c9ff] text-xs font-semibold uppercase tracking-[0.2em] mb-3">Voyage · Navigate the Midnight Landscape</p>
            <h2 className="text-5xl font-bold text-white leading-tight font-['Playfair_Display',serif]">
              Navigate the<br /><span className="text-[#00c9ff]">Midnight</span><br />Landscape.
            </h2>
            <p className="mt-4 text-slate-400 text-sm leading-relaxed max-w-xs">
              Reconnect with your journey. Your data remains encrypted and secure beneath the digital stars.
            </p>
            <div className="flex gap-4 mt-4">
              <span className="text-[10px] text-slate-500 uppercase tracking-widest">Precision Explorer</span>
              <span className="text-[10px] text-slate-600">·</span>
              <span className="text-[10px] text-slate-500 uppercase tracking-widest">Global Auth Protocol 2.4</span>
            </div>
          </div>

          {/* Security badge */}
          <div className="flex items-start gap-3 mt-6 p-4 rounded-xl bg-white/10 dark:bg-[#00c9ff11] border border-white/10 dark:border-[#00c9ff22] backdrop-blur-sm max-w-xs">
            <div className="mt-0.5 shrink-0">
              <svg className="w-5 h-5 text-[#7dd3fc] dark:text-[#00c9ff]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 1L3 5v6c0 5.25 3.75 10.15 9 11.25C17.25 21.15 21 16.25 21 11V5L12 1zm0 4a3 3 0 110 6 3 3 0 010-6zm0 8c-2 0-6 1-6 3v1h12v-1c0-2-4-3-6-3z"/>
              </svg>
            </div>
            <div>
              <p className="text-white text-xs font-semibold">Secure Access</p>
              <p className="text-blue-200 dark:text-slate-400 text-xs mt-0.5">End-to-end encrypted reset link delivered to your inbox.</p>
            </div>
          </div>
        </div>

        <div className="relative z-10 p-12">
          <p className="text-blue-300/50 dark:text-slate-600 text-xs">© 2024 travelBuddy. Secure travel planning.</p>
        </div>
      </div>

      {/* ── Right Panel - Form ── */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 lg:px-16 bg-[#f8fafc] dark:bg-[#08080c]">
        <div className="w-full max-w-sm">

          {/* Mobile Logo */}
          <div className="lg:hidden flex flex-col items-center mb-8 gap-3">
            <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-[#1565a8] to-[#0d3b6e] dark:from-[#00c9ff] dark:to-[#0077cc] flex items-center justify-center shadow-lg">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"/>
              </svg>
            </div>
            <span className="text-[#0d172a] dark:text-white text-lg font-bold font-['Playfair_Display',serif]">travelBuddy</span>
          </div>

          {submitted ? (
            <div className="text-center space-y-5">
              <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mx-auto">
                <svg className="w-8 h-8 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-[#0d172a] dark:text-white font-['Playfair_Display',serif]">Check your inbox</h2>
                <p className="mt-2 text-sm text-[#64748b] dark:text-slate-400">
                  We&apos;ve sent a reset link to <span className="font-semibold text-slate-700 dark:text-slate-200">{email}</span>
                </p>
              </div>
              <div className="p-4 rounded-xl bg-blue-50 dark:bg-[#00c9ff0d] border border-blue-100 dark:border-[#00c9ff22] text-left">
                <div className="flex gap-3">
                  <svg className="w-5 h-5 text-[#1565a8] dark:text-[#00c9ff] shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 1L3 5v6c0 5.25 3.75 10.15 9 11.25C17.25 21.15 21 16.25 21 11V5L12 1z"/>
                  </svg>
                  <div>
                    <p className="text-xs font-semibold text-[#0d3b6e] dark:text-[#00c9ff]">Security Note</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      If you don&apos;t receive an email within 5 minutes, please check your spam folder or contact support at{" "}
                      <a href="mailto:help@voyage.travel" className="text-[#1565a8] dark:text-[#00c9ff] hover:underline">help@voyage.travel</a>
                    </p>
                  </div>
                </div>
              </div>
              <Link href="/login" className="flex items-center justify-center gap-1.5 text-sm text-[#1565a8] dark:text-[#00c9ff] hover:underline font-medium">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
                </svg>
                Back to Login
              </Link>
              <p className="text-[10px] text-slate-400 dark:text-slate-600 uppercase tracking-widest">Voyage Night Explorer Security Framework</p>
            </div>
          ) : (
            <>
              <div className="mb-8">
                <h1 className="text-3xl lg:text-4xl font-bold text-[#0d172a] dark:text-white font-['Playfair_Display',serif]">
                  Forgot Password?
                </h1>
                <p className="mt-2 text-sm text-[#64748b] dark:text-slate-400 leading-relaxed">
                  Enter the email address associated with your account and we&apos;ll send a celestial link to reset your password.
                </p>
              </div>

              <form onSubmit={handleSubmit} noValidate className="space-y-5">
                {/* Back to login (desktop top) */}
                <Link href="/login" className="hidden lg:flex items-center gap-1.5 text-xs text-[#1565a8] dark:text-[#00c9ff] hover:underline font-medium -mt-2 mb-2">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
                  </svg>
                  Back to Login
                </Link>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Registered Email Address
                  </label>
                  <div className={`flex items-center gap-2 px-4 py-3 rounded-xl border transition-all duration-200 bg-[#f8fafc] dark:bg-[#0d1929] ${
                    error
                      ? "border-red-400 dark:border-red-500 ring-1 ring-red-200 dark:ring-red-900"
                      : "border-slate-200 dark:border-slate-700 focus-within:border-[#1565a8] dark:focus-within:border-[#00c9ff] focus-within:ring-1 focus-within:ring-[#1565a822] dark:focus-within:ring-[#00c9ff22]"
                  }`}>
                    <svg className="w-4 h-4 text-slate-400 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                    </svg>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => { setEmail(e.target.value); setError(""); }}
                      onBlur={() => setError(validate())}
                      placeholder="name@voyage.com"
                      className="flex-1 bg-transparent text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-600 outline-none"
                      autoComplete="email"
                    />
                  </div>
                  {error && (
                    <p className="text-xs text-red-500 dark:text-red-400 flex items-center gap-1">
                      <svg className="w-3 h-3 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
                      </svg>
                      {error}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-sm tracking-wide transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed
                    text-white bg-[#0d3b6e] hover:bg-[#1565a8]
                    dark:text-[#060d1a] dark:bg-linear-to-r dark:from-[#00c9ff] dark:to-[#0099dd] dark:hover:from-[#33d4ff] dark:hover:to-[#00aaee]
                    shadow-md hover:shadow-lg hover:-translate-y-0.5"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                      </svg>
                      Sending...
                    </>
                  ) : (
                    <>
                      Send Reset Link
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
                      </svg>
                    </>
                  )}
                </button>

                <Link href="/login" className="flex items-center justify-center gap-1.5 text-sm text-[#1565a8] dark:text-[#00c9ff] hover:underline font-medium">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
                  </svg>
                  Back to Login
                </Link>


                <div className="pt-4 space-y-3">
                  <div className="h-px bg-slate-100 dark:bg-slate-800" />
                  <div className="flex items-center justify-center gap-4">
                    {["Privacy Policy", "Terms of Service", "Security Standards"].map((t) => (
                      <Link key={t} href="#" className="text-[10px] text-slate-400 dark:text-slate-600 hover:text-slate-600 dark:hover:text-slate-400 uppercase tracking-wider transition-colors">
                        {t}
                      </Link>
                    ))}
                  </div>
                  <p className="text-center text-[10px] text-slate-300 dark:text-slate-700 uppercase tracking-widest">
                    Voyage Night Explorer Security Framework
                  </p>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}