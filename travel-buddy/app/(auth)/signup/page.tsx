"use client";
import { useState } from "react";
import Link from "next/link";
import { toast } from "react-toastify";
import { useUserStore } from "@/app/store/useUserStore";

interface SignUpForm {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  agreeTerms: boolean;
}

interface SignUpErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  agreeTerms?: string;
}

interface InputFieldProps {
  label: string;
  name: keyof SignUpForm;
  type: string;
  placeholder: string;
  autoComplete?: string;
  extra?: React.ReactNode;
  value: string;
  error?: string;
  showToggle?: boolean;
  showing?: boolean;
  onToggle?: () => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
}

// ✅ Outside SignUpPage
function InputField({
  label,
  name,
  type,
  placeholder,
  autoComplete,
  extra,
  value,
  error,
  showToggle,
  showing,
  onToggle,
  onChange,
  onBlur,
}: InputFieldProps) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          {label}
        </label>
        {extra}
      </div>
      <div className={`flex items-center gap-2 px-4 py-3 rounded-xl border transition-all duration-200 bg-white dark:bg-slate-800/60 ${
        error
          ? "border-red-400 dark:border-red-500 ring-1 ring-red-300 dark:ring-red-800"
          : "border-slate-200 dark:border-slate-700 focus-within:border-[#0077cc] dark:focus-within:border-[#00c9ff] focus-within:ring-1 focus-within:ring-[#0077cc33] dark:focus-within:ring-[#00c9ff33]"
      }`}>
        <input
          type={showToggle ? (showing ? "text" : "password") : type}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className="flex-1 bg-transparent text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-600 outline-none"
        />
        {showToggle && (
          <button
            type="button"
            onClick={onToggle}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors shrink-0"
          >
            {showing ? (
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
        )}
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
  );
}

// ✅ Outside SignUpPage
function PasswordStrength({ password }: { password: string }) {
  const score = (() => {
    if (!password) return 0;
    let s = 0;
    if (password.length >= 8) s++;
    if (/[A-Z]/.test(password)) s++;
    if (/[0-9]/.test(password)) s++;
    if (/[^A-Za-z0-9]/.test(password)) s++;
    return s;
  })();

  const labels = ["", "Weak", "Fair", "Good", "Strong"];
  const colors = ["", "bg-red-500", "bg-orange-400", "bg-yellow-400", "bg-emerald-500"];
  const textColors = ["", "text-red-500", "text-orange-400", "text-yellow-400", "text-emerald-500"];

  if (!password) return null;

  return (
    <div className="space-y-1.5">
      <div className="flex gap-1">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-all duration-300 ${
              i <= score ? colors[score] : "bg-slate-200 dark:bg-slate-700"
            }`}
          />
        ))}
      </div>
      <p className={`text-xs font-medium ${textColors[score]}`}>{labels[score]}</p>
    </div>
  );
}

export default function SignUpPage() {
  const [form, setForm] = useState<SignUpForm>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeTerms: false,
  });
  const [errors, setErrors] = useState<SignUpErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const { signup } = useUserStore();

  const validate = (field?: keyof SignUpForm): SignUpErrors => {
    const e: SignUpErrors = {};
    if (!field || field === "name") {
      if (!form.name.trim()) e.name = "Full name is required.";
      else if (form.name.trim().length < 2) e.name = "Name must be at least 2 characters.";
    }
    if (!field || field === "email") {
      if (!form.email) e.email = "Email address is required.";
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Enter a valid email address.";
    }
    if (!field || field === "password") {
      if (!form.password) e.password = "Password is required.";
      else if (form.password.length < 8) e.password = "Password must be at least 8 characters.";
    }
    if (!field || field === "confirmPassword") {
      if (!form.confirmPassword) e.confirmPassword = "Please confirm your password.";
      else if (form.confirmPassword !== form.password) e.confirmPassword = "Passwords do not match.";
    }
    if (!field || field === "agreeTerms") {
      if (!form.agreeTerms) e.agreeTerms = "You must agree to the Terms of Service.";
    }
    return e;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name } = e.target;
    const fieldErrors = validate(name as keyof SignUpForm);
    setErrors((prev) => ({
      ...prev,
      [name]: fieldErrors[name as keyof SignUpErrors],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const allErrors = validate();
    setErrors(allErrors);
    if (Object.keys(allErrors).length > 0) return;

    setIsSubmitting(true);
    try {
      const success = await signup({
        name: form.name,
        email: form.email,
        password: form.password,
      });

      if (success) {
        toast.success("Account created successfully! Welcome aboard 🎉");
        setSubmitSuccess(true);
      } else {
        const errorMsg = useUserStore.getState().error;
        toast.error(errorMsg || "Signup failed. Please try again.");
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-[#f8fafc] dark:bg-[#08080c] transition-colors duration-300">
      {/* Left Panel */}
      <div className="relative hidden lg:flex lg:w-[45%] flex-col justify-between p-12 overflow-hidden bg-linear-to-br from-[#0d2b55] via-[#0f3d6e] to-[#0a1a3a] dark:from-[#05111f] dark:via-[#081c35] dark:to-[#030c18]">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `radial-gradient(circle at 20% 50%, #2a7fff33 0%, transparent 60%), radial-gradient(circle at 80% 20%, #00c9ff22 0%, transparent 50%)`,
          }}
        />
        <div className="absolute top-[15%] left-[10%] w-64 h-64 rounded-full bg-[#1a5fa8] opacity-20 blur-3xl" />
        <div className="absolute bottom-[20%] right-[5%] w-80 h-80 rounded-full bg-[#0077cc] opacity-15 blur-3xl" />

        <div className="relative z-10">
          <span className="text-white text-xl font-semibold tracking-wide font-['Playfair_Display',serif]">
            travelBuddy
          </span>
        </div>

        <div className="relative z-10 space-y-6">
          <h2 className="text-5xl font-bold text-white leading-tight font-['Playfair_Display',serif]">
            Start your <span className="text-[#00c9ff]">curated journey.</span>
          </h2>
          <p className="text-blue-200 text-base leading-relaxed max-w-sm">
            Join thousands of curious explorers who have discovered their perfect travel experiences through our expert curation.
          </p>

          <div className="space-y-4 mt-8">
            {[
              { icon: "🗺️", text: "Personalized expert-curated itineraries" },
              { icon: "💎", text: "Access to exclusive hidden gems worldwide" },
              { icon: "🤝", text: "Dedicated concierge support 24/7" },
            ].map(({ icon, text }) => (
              <div key={text} className="flex items-center gap-3">
                <span className="text-xl">{icon}</span>
                <span className="text-blue-200 text-sm">{text}</span>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-3 mt-6">
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

        <div className="relative z-10 text-blue-400 text-xs opacity-60">
          © 2026 travelBuddy. All rights reserved.
        </div>
      </div>

      {/* Right Panel */}
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
              Create Account
            </h1>
            <p className="mt-2 text-sm text-[#64748b] dark:text-slate-400">
              Begin your journey with a personalized experience.
            </p>
          </div>

          {submitSuccess ? (
            <div className="rounded-2xl bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-700 p-6 text-center space-y-3">
              <div className="text-4xl">🎉</div>
              <p className="text-emerald-700 dark:text-emerald-300 font-semibold text-lg">Welcome aboard!</p>
              <p className="text-emerald-600 dark:text-emerald-400 text-sm">
                Your account has been created. Check your email to verify your address.
              </p>
              <Link
                href="/login"
                className="inline-block mt-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold transition-colors"
              >
                Sign In Now
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              {/* Social Buttons */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-all duration-200 shadow-sm hover:shadow"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  Google
                </button>
                <button
                  type="button"
                  className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-all duration-200 shadow-sm hover:shadow"
                >
                  <svg width="16" height="18" viewBox="0 0 814 1000" fill="currentColor">
                    <path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76 0-103.7 40.8-165.9 40.8s-105-37.5-155.5-127.4C46.5 782.3 0 683.6 0 590.4 0 416 118.1 320.3 234.8 320.3c61.2 0 112.3 41.3 149.6 41.3 36.2 0 93.3-43.5 163.1-43.5 26.3 0 108.3 2.9 164.3 56zm-219.3-73.5c28.3-34 48-81.3 48-128.6 0-6.4-.6-12.9-1.3-19.3-45.7 1.9-99.4 30.5-131.4 68.5-25.7 28.9-50 76.2-50 124.1 0 7.1 1.3 14.2 1.9 16.5 2.6.6 6.4 1.3 10.3 1.3 42 0 91.3-26.6 122.5-62.5z"/>
                  </svg>
                  Apple
                </button>
              </div>

              {/* Divider */}
              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
                <span className="text-xs text-slate-400 dark:text-slate-500 uppercase tracking-widest">or with email</span>
                <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
              </div>

              {/* Full Name */}
              <InputField
                label="Full Name"
                name="name"
                type="text"
                placeholder="Your full name"
                autoComplete="name"
                value={form.name}
                error={errors.name}
                onChange={handleChange}
                onBlur={handleBlur}
              />

              {/* Email */}
              <InputField
                label="Email Address"
                name="email"
                type="email"
                placeholder="explorer@travelbuddy.com"
                autoComplete="email"
                value={form.email}
                error={errors.email}
                onChange={handleChange}
                onBlur={handleBlur}
              />

              {/* Password */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Password
                </label>
                <div className={`flex items-center gap-2 px-4 py-3 rounded-xl border transition-all duration-200 bg-white dark:bg-slate-800/60 ${
                  errors.password
                    ? "border-red-400 dark:border-red-500 ring-1 ring-red-300 dark:ring-red-800"
                    : "border-slate-200 dark:border-slate-700 focus-within:border-[#0077cc] dark:focus-within:border-[#00c9ff] focus-within:ring-1 focus-within:ring-[#0077cc33] dark:focus-within:ring-[#00c9ff33]"
                }`}>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Min. 8 characters"
                    autoComplete="new-password"
                    className="flex-1 bg-transparent text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-600 outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors shrink-0"
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
                {form.password && <PasswordStrength password={form.password} />}
                {errors.password && (
                  <p className="text-xs text-red-500 dark:text-red-400 flex items-center gap-1">
                    <svg className="w-3 h-3 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
                    </svg>
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Confirm Password */}
              <InputField
                label="Confirm Password"
                name="confirmPassword"
                type="password"
                placeholder="Re-enter your password"
                autoComplete="new-password"
                value={form.confirmPassword}
                error={errors.confirmPassword}
                showToggle={true}
                showing={showConfirm}
                onToggle={() => setShowConfirm((v) => !v)}
                onChange={handleChange}
                onBlur={handleBlur}
              />

              {/* Terms */}
              <div className="space-y-1">
                <label className="flex items-start gap-3 cursor-pointer group">
                  <div className="relative mt-0.5 shrink-0">
                    <input
                      type="checkbox"
                      name="agreeTerms"
                      checked={form.agreeTerms}
                      onChange={handleChange}
                      className="sr-only peer"
                    />
                    <div className="w-4 h-4 rounded border-2 border-slate-300 dark:border-slate-600 peer-checked:bg-[#0077cc] dark:peer-checked:bg-[#00c9ff] peer-checked:border-[#0077cc] dark:peer-checked:border-[#00c9ff] transition-colors" />
                    <svg
                      className="absolute top-0.5 left-0.5 w-3 h-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
                    </svg>
                  </div>
                  <span className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    I agree to the{" "}
                    <Link href="#" className="text-[#0077cc] dark:text-[#00c9ff] hover:underline font-medium">
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link href="#" className="text-[#0077cc] dark:text-[#00c9ff] hover:underline font-medium">
                      Privacy Policy
                    </Link>
                  </span>
                </label>
                {errors.agreeTerms && (
                  <p className="text-xs text-red-500 dark:text-red-400 flex items-center gap-1 ml-7">
                    <svg className="w-3 h-3 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
                    </svg>
                    {errors.agreeTerms}
                  </p>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 rounded-xl font-semibold text-white text-sm tracking-wide transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed
                  bg-[#0d2b55] hover:bg-[#0f3d6e]
                  dark:bg-linear-to-r dark:from-[#00c9ff] dark:via-[#0077cc] dark:to-[#005fa3] dark:hover:from-[#00d4ff] dark:hover:via-[#0088ee] dark:hover:to-[#006ab8]
                  shadow-lg hover:shadow-xl hover:-translate-y-0.5"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                    </svg>
                    Creating Account...
                  </span>
                ) : (
                  "Create My Account"
                )}
              </button>

              {/* Sign In Link */}
              <p className="text-center text-sm text-slate-500 dark:text-slate-400">
                Already have an account?{" "}
                <Link href="/login" className="text-[#0077cc] dark:text-[#00c9ff] font-semibold hover:underline">
                  Sign In
                </Link>
              </p>

              {/* Footer Links */}
              <div className="flex items-center justify-center gap-4 pt-2">
                {["Privacy Policy", "Terms of Service", "Contact Concierge"].map((link) => (
                  <Link
                    key={link}
                    href="#"
                    className="text-[10px] text-slate-400 dark:text-slate-600 hover:text-slate-600 dark:hover:text-slate-400 uppercase tracking-wider transition-colors"
                  >
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