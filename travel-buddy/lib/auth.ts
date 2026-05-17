import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in environment variables");
}

export const generateToken = (userId: string) => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: "7d" });
};

export const getUserId = async () => {
  // 1. Try manual token from cookie
  const cookieStore = await cookies();
  const token = cookieStore.get("manual-token")?.value;

  if (token) {
    try {
      const decoded: any = jwt.verify(token, JWT_SECRET!);
      return decoded.userId;
    } catch (err) {
      console.error("JWT verify error in getUserId:", err);
    }
  }

  // 2. Try NextAuth session
  try {
    const session: any = await getServerSession(authOptions);
    return session?.user?.id;
  } catch (err) {
    console.error("NextAuth session error in getUserId:", err);
    return null;
  }
};