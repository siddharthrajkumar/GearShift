import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Define protected routes
  const protectedRoutes = ["/dashboard"];

  // Check if the current path is a protected route
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route),
  );

  // Get the session token from cookies
  const sessionToken = request.cookies.get("better-auth.session_token")?.value;

  if (isProtectedRoute) {
    // If no session token exists, redirect to homepage
    if (!sessionToken) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  // If user has session token and trying to access the login page, redirect to dashboard
  if (pathname === "/" && sessionToken) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
