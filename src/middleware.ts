import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Define protected routes
  const protectedRoutes = ["/dashboard", "/superadmin"];

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

  // If user has session token and trying to access the login page, redirect based on role
  if (pathname === "/" && sessionToken) {
    try {
      // Verify session and get user data
      const session = await auth.api.getSession({
        headers: {
          cookie: request.headers.get("cookie") || "",
        },
      });

      if (session?.user?.role === "superadmin") {
        return NextResponse.redirect(new URL("/superadmin", request.url));
      } else {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
    } catch (_error) {
      // If session verification fails, redirect to dashboard as fallback
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
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
