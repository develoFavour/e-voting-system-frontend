import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Public routes that don't require authentication
const publicRoutes = ["/", "/login", "/accredit"];

// Admin-only routes
const adminRoutes = ["/admin"];

export function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl;

	// Check if route is public
	const isPublicRoute = publicRoutes.some((route) => {
		if (route === "/") return pathname === "/";
		return pathname === route || pathname.startsWith(route + "/");
	});

	// Get token and role from cookie
	const token = request.cookies.get("auth_token")?.value;
	const role = request.cookies.get("user_role")?.value;

	// Protected routes (everything not public)
	if (!isPublicRoute && !token) {
		const loginUrl = new URL("/login", request.url);
		loginUrl.searchParams.set("redirect", pathname);
		return NextResponse.redirect(loginUrl);
	}

	// RBAC Redirection
	if (token && role) {
		// Admin attempting to access user dashboard
		if (role === "ADMIN" && pathname.startsWith("/dashboard")) {
			return NextResponse.redirect(new URL("/admin", request.url));
		}

		// Student attempting to access admin dashboard
		if (role === "STUDENT" && pathname.startsWith("/admin")) {
			return NextResponse.redirect(new URL("/dashboard", request.url));
		}
	}

	return NextResponse.next();
}

export const config = {
	matcher: [
		/*
		 * Match all request paths except:
		 * - _next/static (static files)
		 * - _next/image (image optimization files)
		 * - favicon.ico (favicon file)
		 * - public folder
		 */
		"/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
	],
};
