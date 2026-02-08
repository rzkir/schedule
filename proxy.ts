import { NextResponse } from "next/server";

import type { NextRequest } from "next/server";

const publicPaths = [
    "/signin",
    "/sitemap.xml",
    "/robots.txt",
    "/manifest.json",
];

const authPages = ["/signin"];

export async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const hasSessionCookie = request.cookies.has("session");

    // If user is logged in and tries to access auth pages
    if (hasSessionCookie && authPages.includes(pathname)) {
        try {
            // Verify session
            const response = await fetch(
                `${request.nextUrl.origin}/api/auth/session`,
                {
                    headers: {
                        Cookie: request.headers.get("cookie") || "",
                    },
                }
            );

            const data = await response.json();

            if (data.authenticated) {
                // If authenticated, redirect to dashboard
                return NextResponse.redirect(new URL("/dashboard", request.url));
            }
        } catch (error) {
            console.error("Error verifying session:", error);
            // If there's an error, clear the session and redirect to signin
            const response = NextResponse.redirect(new URL("/signin", request.url));
            response.cookies.delete("session");
            return response;
        }
    }

    if (
        !hasSessionCookie &&
        !publicPaths.includes(pathname) &&
        !pathname.startsWith("/_next") &&
        !pathname.startsWith("/api") &&
        !pathname.startsWith("/signin/")
    ) {
        return NextResponse.next();
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
