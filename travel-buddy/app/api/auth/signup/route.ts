import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { hashPassword } from "@/utils/hash";
import { generateToken } from "@/lib/auth";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  await connectDB();

  const { name, email, password } = await req.json();

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    return Response.json({ error: "User already exists" });
  }

  const hashedPassword = await hashPassword(password);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  const token = await generateToken(user._id.toString());
  const cookieStore = await cookies();

  cookieStore.set("manual-token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });

  return Response.json({ success: true, user });
}