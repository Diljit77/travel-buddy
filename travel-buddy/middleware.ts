import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  let nextAuthToken = null;

  try {
    // ✅ Safe wrapper (prevents crash)
    nextAuthToken = await getToken({ req });
  } catch (err) {
    console.log("NextAuth error:", err);
  }

  const manualToken = req.cookies.get("manual-token")?.value;

  const isLoggedIn = !!nextAuthToken || !!manualToken;

  const pathname = req.nextUrl.pathname;

  const isAuthPage =
    pathname.startsWith("/login") || pathname.startsWith("/verify-email")||
    pathname.startsWith("/signup") || pathname.startsWith("/forget-password") || pathname.startsWith("/reset-password")

  // 🔐 Protect routes
  if (!isLoggedIn && !isAuthPage) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // 🔁 Prevent logged-in users from auth pages
  if (isLoggedIn && isAuthPage) {
    return NextResponse.redirect(new URL("/home", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next|favicon.ico).*)"],
};