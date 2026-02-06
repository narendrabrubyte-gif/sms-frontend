import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // 1. Token check karo (Cookie se)
  const token = request.cookies.get("token")?.value;

  // 2. Current Path check karo
  const { pathname } = request.nextUrl;

  // 3. Agar user Login/Auth page par hai aur Token hai -> Dashboard bhej do
  if (pathname.startsWith("/login") && token) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // 4. Agar user Dashboard par ja raha hai aur Token nahi hai -> Login bhej do
  if (pathname.startsWith("/dashboard") || pathname === "/") {
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

// Kin routes par middleware chalega?
export const config = {
  matcher: ["/", "/dashboard/:path*", "/login"],
};
