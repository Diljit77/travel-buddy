import { generateToken } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { comparePassword } from "@/utils/hash";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  await connectDB();

  const { email, password } = await req.json();
  const user = await User.findOne({ email });

  if (!user || !user.password) {
    return Response.json({ error: "User not found" });
  }

  const isMatch = await comparePassword(password, user.password);

  if (!isMatch) {
    return Response.json({ error: "Invalid credentials" });
  }

  const token =await generateToken(user._id.toString());

  const cookieStore = await cookies();

  cookieStore.set("manual-token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });


  return Response.json({ success: true });
}