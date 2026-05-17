import axios from "axios";

const getBaseUrl = () => {
  if (typeof window !== "undefined") return "/api";
  if (process.env.NEXT_PUBLIC_APP_URL) return `${process.env.NEXT_PUBLIC_APP_URL}/api`;
  if (process.env.NEXTAUTH_URL) return `${process.env.NEXTAUTH_URL}/api`;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}/api`;
  return "http://localhost:3000/api";
};

export const api = axios.create({
  baseURL: getBaseUrl(),
  withCredentials: true,
});

  