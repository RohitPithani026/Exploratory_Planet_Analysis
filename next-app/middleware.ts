import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl

    // Check if the path is protected
    const protectedPaths = ["/dashboard", "/profile"]
    const isPathProtected = protectedPaths.some((path) => pathname === path || pathname.startsWith(`${path}/`))

    if (isPathProtected) {
        const token = await getToken({
            req: request,
            secret: process.env.NEXTAUTH_SECRET,
        })

        // Redirect to login if not authenticated
        if (!token) {
            const url = new URL("/signin", request.url)
            url.searchParams.set("callbackUrl", encodeURI(pathname))
            return NextResponse.redirect(url)
        }
    }

    return NextResponse.next()
}

export const config = {
    matcher: ["/dashboard", "/dashboard/:path*", "/profile", "/profile/:path*"],
}

