import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            include: {
                specializations: true,
                discoveries: true,
            },
        })

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 })
        }

        // Remove sensitive information
        const { ...userProfile } = user

        return NextResponse.json(userProfile)
    } catch (error) {
        console.error("Profile fetch error:", error)
        return NextResponse.json({ error: "An error occurred while fetching the profile" }, { status: 500 })
    }
}

export async function PUT(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const { fullName, location, bio, researchFocus } = await req.json()

        const updatedUser = await prisma.user.update({
            where: { id: session.user.id },
            data: {
                fullName,
                location,
                bio,
                researchFocus,
            },
        })

        return NextResponse.json(updatedUser)
    } catch (error) {
        console.error("Profile update error:", error)
        return NextResponse.json({ error: "An error occurred while updating the profile" }, { status: 500 })
    }
}

