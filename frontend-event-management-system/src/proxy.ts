import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { getDefaultDashboardRoute, getRouteOwner, isAuthRoute, UserRole } from './lib/auth-utils';

// Helper to get cookie value from request
function getCookie(request: NextRequest, name: string): string | null {
    return request.cookies.get(name)?.value || null;
}

// Helper to decode JWT payload without verification (for Edge runtime)
// Note: This is a basic decode - proper verification should be done in API routes
function decodeJWT(token: string): { role?: UserRole; email?: string } | null {
    try {
        const base64Url = token.split('.')[1];
        if (!base64Url) return null;
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split('')
                .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
        );
        const decoded = JSON.parse(jsonPayload);
        // Normalize role to uppercase to match UserRole enum
        if (decoded.role) {
            decoded.role = decoded.role.toUpperCase();
        }
        console.log("🔐 Decoded JWT payload:", decoded);
        return decoded;
    } catch (error) {
        console.error("❌ Error decoding JWT:", error);
        return null;
    }
}

// Helper to create response with deleted cookies
function createResponseWithDeletedCookies(url: URL): NextResponse {
    const response = NextResponse.redirect(url);
    response.cookies.delete("accessToken");
    response.cookies.delete("refreshToken");
    return response;
}

// This function can be marked `async` if using `await` inside
export async function proxy(request: NextRequest) {
    const pathname = request.nextUrl.pathname;
    const hasTokenRefreshedParam = request.nextUrl.searchParams.has('tokenRefreshed');

    // If coming back after token refresh, remove the param and continue
    if (hasTokenRefreshedParam) {
        const url = request.nextUrl.clone();
        url.searchParams.delete('tokenRefreshed');
        return NextResponse.redirect(url);
    }

    // TODO: Implement token refresh logic when auth service is ready
    // const tokenRefreshResult = await getNewAccessToken();

    const accessToken = getCookie(request, "accessToken") || null;

    // Debug logging for cookie issues
    if (pathname.startsWith('/dashboard') || pathname.startsWith('/admin') || pathname.startsWith('/host')) {
        console.log("🔍 Middleware check:", {
            pathname,
            hasAccessToken: !!accessToken,
            allCookies: request.cookies.getAll().map(c => c.name),
        });
    }

    let userRole: UserRole | null = null;
    if (accessToken) {
        // Decode JWT to get role (without verification - verification happens in API routes)
        const decoded = decodeJWT(accessToken);
        if (decoded && decoded.role) {
            userRole = decoded.role as UserRole;
            console.log("✅ Decoded user role:", userRole);
        } else {
            // Invalid token format, clear cookies and redirect to login
            console.log("❌ Invalid token format, redirecting to login");
            return createResponseWithDeletedCookies(new URL('/login', request.url));
        }
    } else {
        console.log("⚠️ No access token found");
    }

    const routerOwner = getRouteOwner(pathname);
    const isAuth = isAuthRoute(pathname);

    // Debug logging for route matching
    if (pathname.startsWith('/admin') || pathname.startsWith('/host') || pathname.startsWith('/dashboard')) {
        console.log("🔍 Route matching:", {
            pathname,
            routerOwner,
            userRole,
            isAuth,
            hasAccessToken: !!accessToken,
        });
    }

    // Rule 0: Handle /logout route - redirect to home (logout is handled by server action)
    if (pathname === "/logout") {
        return NextResponse.redirect(new URL("/", request.url));
    }

    // Rule 1: User is logged in and trying to access auth route. Redirect to default dashboard
    if (accessToken && isAuth) {
        return NextResponse.redirect(
            new URL(getDefaultDashboardRoute(userRole as UserRole), request.url)
        );
    }

    // Rule 2: User is trying to access open public route
    if (routerOwner === null) {
        return NextResponse.next();
    }

    // Rule 4: User is not authenticated and trying to access protected route
    if (!accessToken) {
        const loginUrl = new URL("/login", request.url);
        // Don't set redirect for reset-password routes
        if (pathname !== "/reset-password" && !pathname.startsWith("/reset-password")) {
            loginUrl.searchParams.set("redirect", pathname);
        }
        return NextResponse.redirect(loginUrl);
    }

    // Rule 5: Password change functionality removed - users go directly to dashboard

    // Rule 6: User is trying to access common protected route
    if (routerOwner === "COMMON") {
        return NextResponse.next();
    }

    // Rule 7: User is trying to access role-based protected route
    if (routerOwner === "ADMIN" || routerOwner === "HOST" || routerOwner === "USER") {
        if (userRole !== routerOwner) {
            console.log("❌ Role mismatch - redirecting:", {
                pathname,
                routerOwner,
                userRole,
                redirectingTo: getDefaultDashboardRoute(userRole as UserRole),
            });
            return NextResponse.redirect(
                new URL(getDefaultDashboardRoute(userRole as UserRole), request.url)
            );
        } else {
            console.log("✅ Role match - allowing access:", {
                pathname,
                routerOwner,
                userRole,
            });
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
         * - favicon.ico, sitemap.xml, robots.txt (metadata files)
         */
        '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.well-known).*)',
    ],
}

