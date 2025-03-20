import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

    console.log("Middleware Executed:");
    console.log("Path:", pathname);
    console.log("Token:", token);

    const protectedPaths = ["/dashboard", "/profile", "/dashboard/exoplanet"];
    const isPathProtected = protectedPaths.some((path) => pathname.startsWith(path));

    if (isPathProtected && !token) {
        console.log("❌ Redirecting to /signin due to missing token");
        const url = new URL("/signin", request.nextUrl.origin);
        url.searchParams.set("callbackUrl", request.nextUrl.pathname);
        return NextResponse.redirect(url);
    }

    console.log("✅ Middleware passed, proceeding to page.");
    return NextResponse.next();
}

export const config = {
    matcher: [
        "/dashboard",
        "/dashboard/:path",
        "/dashboard/exoplanet/:path",
        "/profile",
        "/profile/:path*",
    ],
};
