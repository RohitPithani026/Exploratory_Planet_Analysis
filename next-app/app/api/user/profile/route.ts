import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/db"

export async function GET() {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: {
                id: true,
                fullName: true,
                email: true,
                location: true,
                role: true,
                bio: true,
                provider: true,
                researchFocus: true,
                image: true,
                specializations: true,
                discoveries: true,
            },
        })

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 })
        }

        return NextResponse.json(user)
    } catch (error) {
        console.error("Error fetching user profile:", error)
        return NextResponse.json({ error: "Failed to fetch user profile" }, { status: 500 })
    }
}

export async function PUT(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const data = await req.json()

        // Update user profile
        const updatedUser = await prisma.user.update({
            where: { id: session.user.id },
            data: {
                fullName: data.fullName,
                location: data.location,
                role: data.role,
                bio: data.bio,
                researchFocus: data.researchFocus,
                image: data.image,
            },
        })

        return NextResponse.json(updatedUser)
    } catch (error) {
        console.error("Error updating user profile:", error)
        return NextResponse.json({ error: "Failed to update user profile" }, { status: 500 })
    }
}

