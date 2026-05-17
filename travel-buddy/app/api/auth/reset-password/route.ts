import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { hashPassword } from "@/utils/hash";

export async function POST(req: Request) {
  try {
    await connectDB();

    const { token, password } = await req.json();

    // 🛑 Validation
    if (!token || !password) {
      return Response.json(
        { success: false, error: "Token and password are required" },
        { status: 400 }
      );
    }

    // 🔍 Find user with valid token
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: new Date() }, // not expired
    });

    if (!user) {
      return Response.json({
        success: false,
        error: "Invalid or expired token",
      });
    }

    // 🔐 Hash new password
    const hashedPassword = await hashPassword(password);

    // 💾 Update user
    user.password = hashedPassword;
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;

    await user.save();

    return Response.json({
      success: true,
      message: "Password reset successfully",
    });

  } catch (error) {
    console.error("Reset Password Error:", error);

    return Response.json(
      { success: false, error: "Something went wrong" },
      { status: 500 }
    );
  }
}