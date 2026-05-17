
import { cookies } from "next/headers";

export async function POST() {
  try {
    const cookieStore = await cookies();

    cookieStore.set("manual-token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 0,
    });

    return Response.json({ success: true, message: "Logged out successfully" });

  } catch (error) {
    console.error("Logout error:", error);
    return Response.json(
      { success: false, error: "Logout failed" },
      { status: 500 }
    );
  }
}