import { create } from "zustand";
import { loginUser, logout, signupUser, verifyEmail as verifyEmailAPI,resetPassword as resetPasswordAPI  } from "@/lib/api/auth";
import { signIn ,signOut} from "next-auth/react";
import { forgotPassword } from "@/lib/api/auth";
import { toast } from "react-toastify";
interface User {
  _id: string;
  name: string;
  email: string;
}

interface UserStore {
  user: User | null;
  loading: boolean;
  error: string | null;

  login: (data: { email: string; password: string }) => Promise<boolean>;
  signup: (data: {
    name: string;
    email: string;
    password: string;
  }) => Promise<boolean>;
loginWithGoogle: () => Promise<boolean>;
forgetPassword:(enail:string)=>Promise<boolean>;
verifyEmail:(token:string)=>Promise<boolean>;
resetPassword:(data:{token: string; password: string})=>Promise<boolean>;
  logout: () => void;
}

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  loading: false,
  error: null,

  login: async (data) => {
    try {
      set({ loading: true, error: null });

      const res = await loginUser(data);

      if (res.success) {
        set({ user: res.user, loading: false });
        return true;
      }

      set({ error: res.error, loading: false });
      return false;
    } catch (err) {
      set({ error: "Login failed", loading: false });
      return false;
    }
  },

  signup: async (data) => {
    try {
      set({ loading: true, error: null });

      const res = await signupUser(data);

      if (res.success) {
        set({ loading: false });
        return true;
      }

      set({ error: res.error, loading: false });
      return false;
    } catch {
      set({ error: "Signup failed", loading: false });
      return false;
    }
  },
  loginWithGoogle: async () => {
    try {
      set({ loading: true, error: null });

      const result = await signIn("google", {
        redirect: false,  
      });

      if (result?.error) {
        set({
          error: result.error,
          loading: false,
        });
        return false;
      }

      if (result?.ok) {
        set({ loading: false });
        return true;
      }

      set({ error: "Google login failed", loading: false });
      return false;

    } catch {
      set({ error: "Google login failed", loading: false });
      return false;
    }
  },
 forgetPassword: async (email: string): Promise<boolean> => {
  try {
    set({ loading: true, error: null });

    const res = await forgotPassword(email);

    if (res.success) {
      toast.success("Reset link sent to your email 📩");
      set({ loading: false });
      return true;
    }

    toast.error(res.error || "Something went wrong");
    set({ error: res.error, loading: false });
    return false;

  } catch (err) {
    toast.error("Failed to send reset email");
    set({ error: "Forgot password failed", loading: false });
    return false;
  }
},
resetPassword: async (data: { token: string; password: string }) => {
  try {
    set({ loading: true, error: null });

    const res = await resetPasswordAPI(data);

    if (res.success) {
      toast.success("Password reset successfully 🔐");
      set({ loading: false });
      return true;
    }

    toast.error(res.error);
    set({ error: res.error, loading: false });
    return false;

  } catch {
    toast.error("Reset failed");
    set({ error: "Reset failed", loading: false });
    return false;
  }
},
verifyEmail: async (token: string): Promise<boolean> => {
  try {
    set({ loading: true, error: null });

    const res = await verifyEmailAPI(token);

    if (res.success) {
      toast.success("Email verified successfully 🎉");
      set({ loading: false });
      return true;
    }

    toast.error(res.error || "Verification failed");
    set({ error: res.error, loading: false });
    return false;

  } catch {
    toast.error("Verification failed");
    set({ error: "Verification error", loading: false });
    return false;
  }
},
logout: async () => {
  try {
    // Clear NextAuth session
    await signOut({ redirect: false });
     await logout();
    // Clear your custom token
    document.cookie = "token=; Max-Age=0; path=/";

    // Clear Zustand state
    set({ user: null });

  } catch (err) {
    console.error("Logout error:", err);
  }
}
}));