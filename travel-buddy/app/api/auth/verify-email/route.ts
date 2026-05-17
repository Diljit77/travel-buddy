import { connectDB } from "@/lib/db";
import User from "@/models/User";

export async function POST(req: Request) {
  try {
    await connectDB();

    const { token } = await req.json();

    const user = await User.findOne({
      verifyToken: token,
      verifyTokenExpiry: { $gt: new Date() },
    });

    if (!user) {
      return Response.json({
        success: false,
        error: "Invalid or expired token",
      });
    }

    user.isVerified = true;
    user.verifyToken = undefined;
    user.verifyTokenExpiry = undefined;

    await user.save();

    return Response.json({ success: true });

  } catch (error) {
    return Response.json(
      { success: false, error: "Something went wrong" },
      { status: 500 }
    );
  }
}