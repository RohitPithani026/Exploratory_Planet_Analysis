import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Define protected and allowed paths
    const protectedPaths = ["/dashboard", "/profile"];
    const allowedPaths = ["/dashboard/exoplanet"]; // Allow direct access to exoplanet pages

    const isPathProtected = protectedPaths.some((path) => pathname === path || pathname.startsWith(`${path}/`));
    const isAllowed = allowedPaths.some((path) => pathname.startsWith(path));

    if (isPathProtected && !isAllowed) {
        const token = await getToken({
            req: request,
            secret: process.env.NEXTAUTH_SECRET,
        });

        console.log("Token:", token); // Debugging

        // Redirect to login if not authenticated
        if (!token) {
            const url = new URL("/signin", request.url);
            url.searchParams.set("callbackUrl", encodeURIComponent(pathname));
            return NextResponse.redirect(url);
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/dashboard",
        "/profile",
        "/profile/:path*",
    ],
};
