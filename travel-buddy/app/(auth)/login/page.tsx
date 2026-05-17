"use client";

import { useState } from "react";
import Link from "next/link";
import { useUserStore } from "@/app/store/useUserStore";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

interface FormState {
  email: string;
  password: string;
  rememberMe: boolean;
}

interface FormErrors {
  email?: string;
  password?: string;
}

export default function LoginPage() {
  const [form, setForm] = useState<FormState>({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const { login, loginWithGoogle } = useUserStore();
  const router=useRouter();

  const validate = (field?: keyof FormState): FormErrors => {
    const newErrors: FormErrors = {};
    if (!field || field === "email") {
      if (!form.email) {
        newErrors.email = "Email address is required.";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
        newErrors.email = "Please enter a valid email address.";
      }
    }
    if (!field || field === "password") {
      if (!form.password) {
        newErrors.password = "Password is required.";
      } else if (form.password.length < 6) {
        newErrors.password = "Password must be at least 6 characters.";
      }
    }
    return newErrors;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    // Clear error on change
    if (name === "email" || name === "password") {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name } = e.target;
    if (name === "email" || name === "password") {
      const fieldErrors = validate(name as keyof FormState);
      setErrors((prev) => ({ ...prev, [name]: fieldErrors[name as keyof FormErrors] }));
    }
  };

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  // Validate form
  const allErrors = validate();
  setErrors(allErrors);
  if (Object.keys(allErrors).length > 0) return;

  setIsSubmitting(true);

  try {
    const success = await login({
      email: form.email,
      password: form.password,
    });

    if (success) {
      // ✅ Show success toast
      toast.success("Welcome back! Redirecting...",);

      setSubmitSuccess(true);

      // Redirect after toast shows
      setTimeout(() => {
        window.location.href = "/home";
      }, 2000);

    } else {

      const errorMsg = useUserStore.getState().error;
      toast.error(errorMsg || "Invalid email or password.");
    }

  } catch (error) {
    toast.error("Something went wrong. Please try again.");
  } finally {
    setIsSubmitting(false);
  }
};
  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    try {
      const success = await loginWithGoogle();

      if (success) {
        toast.success("Signed in with Google! Redirecting... ✈️");
        setTimeout(() => router.push("/home"), 1500);
      } else {
        const errorMsg = useUserStore.getState().error;

        // Handle specific Google errors
        if (errorMsg === "OAuthAccountNotLinked") {
          toast.error("This email is already registered. Please sign in with email & password.");
        } else if (errorMsg === "AccessDenied") {
          toast.error("Access denied. Please try again.");
        } else if (errorMsg === "OAuthSignin") {
          toast.error("Could not connect to Google. Please try again.");
        } else {
          toast.error(errorMsg || "Google sign-in failed. Please try again.");
        }
      }
    } catch {
      toast.error("Google sign-in failed. Please try again.");
    } finally {
      setIsGoogleLoading(false);
    }
  };
  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-[#f8fafc] dark:bg-[#08080c] transition-colors duration-300">
      {/* Left Panel - Hero */}
      <div className="relative hidden lg:flex lg:w-[45%] flex-col justify-between p-12 overflow-hidden bg-linear-to-br from-[#0d2b55] via-[#0f3d6e] to-[#0a1a3a] dark:from-[#05111f] dark:via-[#081c35] dark:to-[#030c18]">
        {/* Background texture */}
        <div className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `radial-gradient(circle at 20% 50%, #2a7fff33 0%, transparent 60%), radial-gradient(circle at 80% 20%, #00c9ff22 0%, transparent 50%)`,
          }}
        />
        {/* Decorative floating orbs */}
        <div className="absolute top-[15%] left-[10%] w-64 h-64 rounded-full bg-[#1a5fa8] opacity-20 blur-3xl" />
        <div className="absolute bottom-[20%] right-[5%] w-80 h-80 rounded-full bg-[#0077cc] opacity-15 blur-3xl" />

        {/* Logo */}
        <div className="relative z-10">
          <span className="text-white text-xl font-semibold tracking-wide font-['Playfair_Display',serif]">
            travelBuddy
          </span>
        </div>

        {/* Middle content */}
        <div className="relative z-10 space-y-6">
          <h2 className="text-5xl font-bold text-white leading-tight font-['Playfair_Display',serif]">
            Journey beyond the{" "}
            <span className="text-[#00c9ff]">expected.</span>
          </h2>
          <p className="text-blue-200 text-base leading-relaxed max-w-sm">
            Log in to access your curated itineraries and discover the hidden gems of the world, selected by experts.
          </p>
          {/* Social proof */}
          <div className="flex items-center gap-3 mt-8">
            <div className="flex -space-x-2">
              {["🧳", "🌍", "✈️"].map((emoji, i) => (
                <div
                  key={i}
                  className="w-9 h-9 rounded-full bg-linear-to-br from-blue-400 to-blue-600 border-2 border-blue-900 flex items-center justify-center text-sm"
                >
                  {emoji}
                </div>
              ))}
            </div>
            <span className="text-blue-300 text-sm font-medium">+12k curious explorers</span>
          </div>
        </div>

        {/* Bottom decoration */}
        <div className="relative z-10 text-blue-400 text-xs opacity-60">
          © 2026 travelBuddy. All rights reserved.
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 lg:px-16">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <span className="text-[#0d172a] dark:text-white text-2xl font-bold font-['Playfair_Display',serif]">
              travelBuddy
            </span>
          </div>

          <div className="mb-8">
            <h1 className="text-3xl lg:text-4xl font-bold text-[#0d172a] dark:text-white font-['Playfair_Display',serif]">
              Welcome Back
            </h1>
            <p className="mt-2 text-sm text-[#64748b] dark:text-slate-400">
              Please enter your details to sign in to your journey.
            </p>
          </div>

          {submitSuccess ? (
            <div className="rounded-2xl bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-700 p-6 text-center space-y-2">
              <div className="text-3xl">✅</div>
              <p className="text-emerald-700 dark:text-emerald-300 font-semibold">Signed in successfully!</p>
              <p className="text-emerald-600 dark:text-emerald-400 text-sm">Redirecting to your dashboard...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="space-y-5">
   
 <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  disabled={isGoogleLoading || isSubmitting}
                  className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-all duration-200 shadow-sm hover:shadow disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isGoogleLoading ? (
                    <>
                      <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                      </svg>
                      Connecting...
                    </>
                  ) : (
                    <>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                      </svg>
                      Google
                    </>
                  )}
                </button>

                <button
                  type="button"
                  disabled={isGoogleLoading || isSubmitting}
                  className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-all duration-200 shadow-sm hover:shadow disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <svg width="16" height="18" viewBox="0 0 814 1000" fill="currentColor">
                    <path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76 0-103.7 40.8-165.9 40.8s-105-37.5-155.5-127.4C46.5 782.3 0 683.6 0 590.4 0 416 118.1 320.3 234.8 320.3c61.2 0 112.3 41.3 149.6 41.3 36.2 0 93.3-43.5 163.1-43.5 26.3 0 108.3 2.9 164.3 56zm-219.3-73.5c28.3-34 48-81.3 48-128.6 0-6.4-.6-12.9-1.3-19.3-45.7 1.9-99.4 30.5-131.4 68.5-25.7 28.9-50 76.2-50 124.1 0 7.1 1.3 14.2 1.9 16.5 2.6.6 6.4 1.3 10.3 1.3 42 0 91.3-26.6 122.5-62.5z"/>
                  </svg>
                  Apple
                </button>
              </div>

    
              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
                <span className="text-xs text-slate-400 dark:text-slate-500 uppercase tracking-widest">or with email</span>
                <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Email Address
                </label>
                <div className={`flex items-center gap-2 px-4 py-3 rounded-xl border transition-all duration-200 bg-white dark:bg-slate-800/60 ${
                  errors.email
                    ? "border-red-400 dark:border-red-500 ring-1 ring-red-300 dark:ring-red-800"
                    : "border-slate-200 dark:border-slate-700 focus-within:border-[#0077cc] dark:focus-within:border-[#00c9ff] focus-within:ring-1 focus-within:ring-[#0077cc33] dark:focus-within:ring-[#00c9ff33]"
                }`}>
                  <svg className="w-4 h-4 text-slate-400 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                  </svg>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="explorer@travelbuddy.com"
                    className="flex-1 bg-transparent text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-600 outline-none"
                    autoComplete="email"
                  />
                </div>
                {errors.email && (
                  <p className="text-xs text-red-500 dark:text-red-400 flex items-center gap-1">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
                    </svg>
                    {errors.email}
                  </p>
                )}
              </div>

          
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Password
                  </label>
                  <Link href="/forget-password" className="text-xs text-[#0077cc] dark:text-[#00c9ff] hover:underline font-medium">
                    Forgot password?
                  </Link>
                </div>
                <div className={`flex items-center gap-2 px-4 py-3 rounded-xl border transition-all duration-200 bg-white dark:bg-slate-800/60 ${
                  errors.password
                    ? "border-red-400 dark:border-red-500 ring-1 ring-red-300 dark:ring-red-800"
                    : "border-slate-200 dark:border-slate-700 focus-within:border-[#0077cc] dark:focus-within:border-[#00c9ff] focus-within:ring-1 focus-within:ring-[#0077cc33] dark:focus-within:ring-[#00c9ff33]"
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
                    placeholder="••••••••"
                    className="flex-1 bg-transparent text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-600 outline-none"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                  >
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
                {errors.password && (
                  <p className="text-xs text-red-500 dark:text-red-400 flex items-center gap-1">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
                    </svg>
                    {errors.password}
                  </p>
                )}
              </div>


              <label className="flex items-center gap-3 cursor-pointer group">
                <div className="relative">
                  <input
                    type="checkbox"
                    name="rememberMe"
                    checked={form.rememberMe}
                    onChange={handleChange}
                    className="sr-only peer"
                  />
                  <div className="w-4 h-4 rounded border-2 border-slate-300 dark:border-slate-600 peer-checked:bg-[#0077cc] dark:peer-checked:bg-[#00c9ff] peer-checked:border-[#0077cc] dark:peer-checked:border-[#00c9ff] transition-colors" />
                  <svg className="absolute top-0.5 left-0.5 w-3 h-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
                  </svg>
                </div>
                <span className="text-sm text-slate-600 dark:text-slate-400 group-hover:text-slate-800 dark:group-hover:text-slate-200 transition-colors">
                  Stay logged in for 30 days
                </span>
              </label>

    
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 rounded-xl font-semibold text-white text-sm tracking-wide transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed relative overflow-hidden group
                  bg-[#0d2b55] hover:bg-[#0f3d6e]
                  dark:bg-linear-to-r dark:from-[#00c9ff] dark:via-[#0077cc] dark:to-[#005fa3] dark:hover:from-[#00d4ff] dark:hover:via-[#0088ee] dark:hover:to-[#006ab8]
                  shadow-lg hover:shadow-xl hover:-translate-y-0.5"
              >
                <span className="relative z-10">
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                      </svg>
                      Signing in...
                    </span>
                  ) : "Sign In"}
                </span>
              </button>

              <p className="text-center text-sm text-slate-500 dark:text-slate-400">
                Don&apos;t have an account?{" "}
                <Link href="/signup" className="text-[#0077cc] dark:text-[#00c9ff] font-semibold hover:underline">
                  Create Account
                </Link>
              </p>

              <div className="flex items-center justify-center gap-4 pt-2">
                {["Privacy Policy", "Terms of Service", "Contact Concierge"].map((link) => (
                  <Link key={link} href="#" className="text-[10px] text-slate-400 dark:text-slate-600 hover:text-slate-600 dark:hover:text-slate-400 uppercase tracking-wider transition-colors">
                    {link}
                  </Link>
                ))}
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}