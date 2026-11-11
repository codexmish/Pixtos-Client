import { type NextRequest, NextResponse } from "next/server";

// -----pages only for logged out users
const authRoutes = ["/signin", "/signup"];

// -----pages that need login (their inner pages too)
const protectedRoutes = ["/", "/albums", "/favorites", "/profile", "/trash"];

const isProtected = (pathname: string) =>
  protectedRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );

// -----only checks the cookie is there (backend still checks if it's valid)
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ----access token lives 1 day, refresh token 7 days
  // ----with only refresh token left, apiClient can still get new tokens
  const isLoggedIn =
    request.cookies.has("accessToken") || request.cookies.has("refreshToken");

  // ----logged in user can't open signin/signup, goes home instead
  if (isLoggedIn && authRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // ----page needs login, goes to signin instead
  if (!isLoggedIn && isProtected(pathname)) {
    return NextResponse.redirect(new URL("/signin", request.url));
  }

  return NextResponse.next();
}

// -----matcher must be written by hand (variables are ignored here)
export const config = {
  matcher: [
    "/",
    "/signin",
    "/signup",
    "/albums/:path*",
    "/favorites/:path*",
    "/profile/:path*",
    "/trash/:path*",
  ],
};
