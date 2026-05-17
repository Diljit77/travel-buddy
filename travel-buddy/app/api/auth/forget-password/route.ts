import { connectDB } from "@/lib/db";
import { sendEmail } from "@/lib/Mail";
import { forgotPasswordTemplate } from "@/lib/templates/forgetPaasswordTemplate";
import User from "@/models/User";

import crypto from "crypto";

export async function POST(req: Request) {
  try {
    await connectDB();

    const { email } = await req.json();

    if (!email) {
      return Response.json(
        { success: false, error: "Email is required" },
        { status: 400 }
      );
    }

    const user = await User.findOne({ email });

    // 🔐 Always return success (security)
    if (!user) {
      return Response.json({ success: true });
    }

    // 🔑 Generate token
    const token = crypto.randomBytes(32).toString("hex");

    // ⏳ Expiry (1 hour)
    const expiry = new Date(Date.now() + 60 * 60 * 1000);

    // 💾 Save in DB
    user.resetToken = token;
    user.resetTokenExpiry = expiry;
    await user.save();

    const resetLink = `${process.env.NEXTAUTH_URL}/reset-password?token=${token}`;

    await sendEmail(
      user.email,
      "Reset Your Password",
 forgotPasswordTemplate(user.name,resetLink)
    );

    return Response.json({ success: true });

  } catch (error) {
    console.error("Forgot Password Error:", error);

    return Response.json(
      { success: false, error: "Something went wrong" },
      { status: 500 }
    );
  }
}