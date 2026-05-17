"use client";

import { useState } from "react";
import Link from "next/link";
import { resetPassword } from "@/lib/api/auth";
import { useParams, useSearchParams } from "next/navigation";

interface ResetForm {
  password: string;
  confirmPassword: string;
}

interface ResetErrors {
  password?: string;
  confirmPassword?: string;
}

function PasswordStrengthBar({ password }: { password: string }) {
  const score = (() => {
    if (!password) return 0;
    let s = 0;
    if (password.length >= 8) s++;
    if (password.length >= 12) s++;
    if (/[A-Z]/.test(password) && /[a-z]/.test(password)) s++;
    if (/[^A-Za-z0-9]/.test(password)) s++;
    return Math.min(s, 4);
  })();

  const labels = ["", "Weak", "Fair", "Good", "Strong"];
  const barColors = ["", "bg-red-500", "bg-orange-400", "bg-yellow-400", "bg-emerald-500"];
  const textColors = ["", "text-red-500", "text-orange-400", "text-yellow-400", "text-emerald-500"];

  if (!password) return null;

  return (
    <div className="space-y-1.5">
      <div className="flex gap-1">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-all duration-300 ${i <= score ? barColors[score] : "bg-slate-200 dark:bg-slate-700"}`}
          />
        ))}
      </div>
      <p className={`text-xs font-semibold ${textColors[score]}`}>
        Password strength: {labels[score]}
      </p>
    </div>
  );
}

function CheckItem({ met, text }: { met: boolean; text: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center transition-all duration-200 ${
        met ? "bg-emerald-500 dark:bg-emerald-400" : "bg-slate-200 dark:bg-slate-700"
      }`}>
        {met && (
          <svg className="w-2 h-2 text-white" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
          </svg>
        )}
      </div>
      <span className={`text-xs transition-colors ${met ? "text-emerald-600 dark:text-emerald-400" : "text-slate-500 dark:text-slate-500"}`}>
        {text}
      </span>
    </div>
  );
}

export default function ResetPasswordPage() {
  const [form, setForm] = useState<ResetForm>({ password: "", confirmPassword: "" });
  const [errors, setErrors] = useState<ResetErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
    const params = useSearchParams();
  const token = params.get("token")||"";
  const rules = {
    length: form.password.length >= 8,
    lengthStrong: form.password.length >= 12,
    uppercase: /[A-Z]/.test(form.password),
    special: /[^A-Za-z0-9]/.test(form.password),
    number: /[0-9]/.test(form.password),
  };

  const validate = (field?: keyof ResetForm): ResetErrors => {
    const e: ResetErrors = {};
    if (!field || field === "password") {
      if (!form.password) e.password = "Password is required.";
      else if (!rules.length) e.password = "Must be at least 8 characters.";
    }
    if (!field || field === "confirmPassword") {
      if (!form.confirmPassword) e.confirmPassword = "Please confirm your password.";
      else if (form.confirmPassword !== form.password) e.confirmPassword = "Passwords do not match.";
    }
    return e;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    setErrors((p) => ({ ...p, [name]: undefined }));
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name } = e.target;
    const fe = validate(name as keyof ResetForm);
    setErrors((p) => ({ ...p, [name]: fe[name as keyof ResetErrors] }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const allErrors = validate();
    setErrors(allErrors);
    if (Object.keys(allErrors).length > 0) return;
    setIsSubmitting(true);
    
  await resetPassword({ token,password: form.password });

    setIsSubmitting(false);
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-[#f8fafc] dark:bg-[#08080c] transition-colors duration-300">

      {/* ── Left Hero Panel (desktop only) ── */}
      <div className="relative hidden lg:flex lg:w-[48%] flex-col justify-between overflow-hidden">
        {/* Light: ocean/horizon landscape */}
        <div className="absolute inset-0 bg-linear-to-br from-[#0a2d55] via-[#1260a8] to-[#0e3f7a] dark:hidden" />
        {/* Dark: deep space / horizon */}
        <div className="absolute inset-0 hidden dark:block bg-linear-to-br from-[#010408] via-[#030c1a] to-[#010610]" />

        {/* Atmospheric layers */}
        <div className="absolute inset-0 opacity-25"
          style={{ backgroundImage: "radial-gradient(ellipse at 50% 70%, #00c9ff55 0%, transparent 60%), radial-gradient(ellipse at 20% 30%, #ff6b0022 0%, transparent 50%)" }} />

        {/* Light: horizon glow */}
        <div className="absolute dark:hidden bottom-0 left-0 right-0 h-2/5 bg-linear-to-t from-[#051828] via-[#0d4a8888] to-transparent" />

        {/* Dark: city/plane horizon */}
        <div className="absolute hidden dark:block inset-0">
          <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-linear-to-t from-[#000305] via-transparent to-transparent" />
          <div className="absolute inset-0 opacity-20"
            style={{ backgroundImage: "linear-gradient(180deg, transparent 40%, #00c9ff08 60%, #00c9ff15 80%, transparent 100%)" }} />
        </div>

        {/* Floating orbs */}
        <div className="absolute top-[10%] right-[15%] w-56 h-56 rounded-full blur-3xl opacity-20 bg-[#00c9ff] dark:bg-[#00c9ff]" />
        <div className="absolute bottom-[30%] left-[10%] w-72 h-72 rounded-full blur-3xl opacity-10 bg-[#1a90ff] dark:bg-[#0055ff]" />

        {/* Logo */}
        <div className="relative z-10 p-12 flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#00c9ff] flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1M4.22 4.22l.71.71m12.02 12.02l.71.71M3 12h1m16 0h1M4.93 19.07l.71-.71M18.36 5.64l.71-.71"/>
            </svg>
          </div>
          <span className="text-white text-lg font-bold tracking-tight font-['Playfair_Display',serif]">Voyage</span>
        </div>

        {/* Hero text */}
        <div className="relative z-10 p-12 space-y-5">
          <div className="dark:hidden">
            <h2 className="text-5xl font-bold text-white leading-tight font-['Playfair_Display',serif]">
              Your security is our<br /><span className="text-[#7dd3fc]">priority.</span>
            </h2>
            <p className="mt-4 text-blue-200 text-sm max-w-xs leading-relaxed">
              Choose a new, strong password to keep your journey credentials safe and secure.
            </p>
          </div>
          <div className="hidden dark:block">
            <h2 className="text-5xl font-bold text-white leading-tight font-['Playfair_Display',serif]">
              Secure your<br /><span className="text-[#00c9ff]">Horizon.</span>
            </h2>
            <p className="mt-4 text-slate-400 text-sm max-w-xs leading-relaxed">
              Your new password should be different from your previous explorer&apos;s keys.
            </p>
          </div>

          {/* Testimonial card (dark) */}
          <div className="hidden dark:block mt-8 p-5 rounded-2xl bg-white/5 border border-[#00c9ff20] backdrop-blur-sm max-w-xs">
            <svg className="w-5 h-5 text-[#00c9ff] mb-3" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 1L3 5v6c0 5.25 3.75 10.15 9 11.25C17.25 21.15 21 16.25 21 11V5L12 1z"/>
            </svg>
            <p className="text-slate-300 text-sm italic leading-relaxed">
              &ldquo;The stars are our map, but security is our compass. Reset your credentials to continue your journey.&rdquo;
            </p>
            <div className="flex items-center gap-2 mt-3">
              <div className="w-6 h-6 rounded-full bg-[#00c9ff] flex items-center justify-center">
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
              </div>
              <div>
                <p className="text-xs font-semibold text-white">Voyage Control</p>
                <p className="text-[10px] text-slate-500">Fleet Operations</p>
              </div>
            </div>
          </div>

          {/* Light security note */}
          <div className="dark:hidden flex items-start gap-3 mt-6 p-4 rounded-xl bg-white/10 border border-white/15 backdrop-blur-sm max-w-xs">
            <svg className="w-5 h-5 text-[#7dd3fc] shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 1L3 5v6c0 5.25 3.75 10.15 9 11.25C17.25 21.15 21 16.25 21 11V5L12 1z"/>
            </svg>
            <div>
              <p className="text-white text-xs font-semibold">End-to-End Encrypted</p>
              <p className="text-blue-200 text-xs mt-0.5">Your new credentials are protected with voyage-grade encryption.</p>
            </div>
          </div>
        </div>

        <div className="relative z-10 p-12">
          <p className="text-blue-300/40 dark:text-slate-700 text-xs">© 2024 travelBuddy. Secure travel planning.</p>
        </div>
      </div>

      {/* ── Right Panel - Form ── */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 lg:px-16 bg-[#f8fafc] dark:bg-[#08080c]">
        <div className="w-full max-w-sm">

          {/* Mobile Logo */}
          <div className="lg:hidden flex flex-col items-center mb-8 gap-3">
            <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-[#1565a8] to-[#0d3b6e] dark:from-[#00c9ff] dark:to-[#0077cc] flex items-center justify-center shadow-lg">
              <svg className="w-7 h-7 text-white dark:text-[#060d1a]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"/>
              </svg>
            </div>
            <span className="text-[#0d172a] dark:text-white text-lg font-bold font-['Playfair_Display',serif]">travelBuddy</span>
          </div>

          {submitted ? (
            <div className="text-center space-y-5">
              <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mx-auto">
                <svg className="w-8 h-8 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-[#0d172a] dark:text-white font-['Playfair_Display',serif]">Password Updated!</h2>
                <p className="mt-2 text-sm text-[#64748b] dark:text-slate-400">Your credentials have been secured. You can now sign in with your new password.</p>
              </div>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm text-white bg-[#0d3b6e] hover:bg-[#1565a8] dark:text-[#060d1a] dark:bg-[#00c9ff] dark:hover:bg-[#33d4ff] transition-all shadow-md hover:shadow-lg"
              >
                Back to Sign In
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
                </svg>
              </Link>
              <p className="text-[10px] text-slate-400 dark:text-slate-600 uppercase tracking-widest">End-to-end encrypted · Voyage planning</p>
            </div>
          ) : (
            <>
              <div className="mb-8">
                <Link href="/login" className="flex items-center gap-1.5 text-xs text-[#1565a8] dark:text-[#00c9ff] hover:underline font-medium mb-5">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
                  </svg>
                  Back to Login
                </Link>
                <h1 className="text-3xl lg:text-4xl font-bold text-[#0d172a] dark:text-white font-['Playfair_Display',serif]">
                  Reset Password
                </h1>
                <p className="mt-2 text-sm text-[#64748b] dark:text-slate-400">
                  Choose a strong password to secure your account.
                </p>
              </div>

              <form onSubmit={handleSubmit} noValidate className="space-y-5">

                {/* New Password */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">New Password</label>
                  <div className={`flex items-center gap-2 px-4 py-3 rounded-xl border transition-all duration-200 bg-[#f8fafc] dark:bg-[#0d1929] ${
                    errors.password
                      ? "border-red-400 dark:border-red-500 ring-1 ring-red-200 dark:ring-red-900"
                      : "border-slate-200 dark:border-slate-700 focus-within:border-[#1565a8] dark:focus-within:border-[#00c9ff] focus-within:ring-1 focus-within:ring-[#1565a822] dark:focus-within:ring-[#00c9ff22]"
                  }`}>
                    <svg className="w-4 h-4 text-slate-400 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                    </svg>
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={form.password}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="••••••••••"
                      className="flex-1 bg-transparent text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-600 outline-none"
                      autoComplete="new-password"
                    />
                    <button type="button" onClick={() => setShowPassword((v) => !v)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors shrink-0">
                      {showPassword ? (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/>
                        </svg>
                      ) : (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                        </svg>
                      )}
                    </button>
                  </div>
                  {form.password && <PasswordStrengthBar password={form.password} />}
                  {errors.password && (
                    <p className="text-xs text-red-500 dark:text-red-400 flex items-center gap-1">
                      <svg className="w-3 h-3 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/></svg>
                      {errors.password}
                    </p>
                  )}
                </div>

                {/* Password rules */}
                {form.password && (
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 px-1">
                    <CheckItem met={rules.length} text="At least 8 characters" />
                    <CheckItem met={rules.number} text="Contains a number" />
                    <CheckItem met={rules.uppercase} text="Uppercase letter" />
                    <CheckItem met={rules.special} text="Special character" />
                  </div>
                )}

                {/* Confirm Password */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Confirm Password</label>
                  <div className={`flex items-center gap-2 px-4 py-3 rounded-xl border transition-all duration-200 bg-[#f8fafc] dark:bg-[#0d1929] ${
                    errors.confirmPassword
                      ? "border-red-400 dark:border-red-500 ring-1 ring-red-200 dark:ring-red-900"
                      : form.confirmPassword && form.confirmPassword === form.password
                        ? "border-emerald-400 dark:border-emerald-500"
                        : "border-slate-200 dark:border-slate-700 focus-within:border-[#1565a8] dark:focus-within:border-[#00c9ff] focus-within:ring-1 focus-within:ring-[#1565a822] dark:focus-within:ring-[#00c9ff22]"
                  }`}>
                    <svg className="w-4 h-4 text-slate-400 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
                    </svg>
                    <input
                      type={showConfirm ? "text" : "password"}
                      name="confirmPassword"
                      value={form.confirmPassword}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="••••••••••"
                      className="flex-1 bg-transparent text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-600 outline-none"
                      autoComplete="new-password"
                    />
                    <button type="button" onClick={() => setShowConfirm((v) => !v)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors shrink-0">
                      {showConfirm ? (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/>
                        </svg>
                      ) : (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                        </svg>
                      )}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-xs text-red-500 dark:text-red-400 flex items-center gap-1">
                      <svg className="w-3 h-3 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/></svg>
                      {errors.confirmPassword}
                    </p>
                  )}
                  {form.confirmPassword && form.confirmPassword === form.password && !errors.confirmPassword && (
                    <p className="text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                      <svg className="w-3 h-3 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
                      Passwords match
                    </p>
                  )}
                </div>

                {/* Submit */}
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
                      Updating...
                    </>
                  ) : (
                    <>
                      Update Password
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
                  Back to Sign In
                </Link>

                {/* Footer */}
                <div className="pt-3 space-y-3">
                  <div className="h-px bg-slate-100 dark:bg-slate-800" />
                  <p className="text-center text-xs text-slate-400 dark:text-slate-600">
                    Need assistance?{" "}
                    <a href="mailto:support@voyage.travel" className="text-[#1565a8] dark:text-[#00c9ff] hover:underline font-medium">
                      Contact Explorer Support
                    </a>
                  </p>
                  <div className="flex items-center justify-center gap-4">
                    {["Privacy Policy", "Terms of Service"].map((t) => (
                      <Link key={t} href="#" className="text-[10px] text-slate-400 dark:text-slate-600 hover:text-slate-600 dark:hover:text-slate-400 uppercase tracking-wider transition-colors">
                        {t}
                      </Link>
                    ))}
                  </div>
                  <p className="text-center text-[10px] text-slate-300 dark:text-slate-700 uppercase tracking-widest">
                    © 2024 Voyage Exploration Systems · Encrypted Session
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