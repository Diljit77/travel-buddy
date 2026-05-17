import { api } from "../api";

// 🔐 Signup
export const signupUser = async (data: {
  name: string;
  email: string;
  password: string;
}) => {
  const res = await api.post("/auth/signup", data);
  return res.data;
};

// 🔐 Login
export const loginUser = async (data: {
  email: string;
  password: string;
}) => {
  const res = await api.post("/auth/login", data);
  return res.data;
};


export const forgotPassword = async (email: string) => {
  const res = await api.post("/auth/forget-password", { email });
  return res.data;
};

export const resetPassword = async (data: {
  token: string;
  password: string;
}) => {
  const res = await api.post("/auth/reset-password", data);
  return res.data;
};
export const logout =async ()=>{
    const res=await api.post("/auth/logout");
    return res.data;
}
export const verifyEmail = async (token: string) => {
  const res = await api.post("/auth/verify-email", { token });
  return res.data;
};