import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/db"
import { Provider } from "@prisma/client"

export async function GET() {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        // Check if user exists
        let user = await prisma.user.findUnique({
            where: { id: session.user.id },
        })

        // If user doesn't exist, create them
        if (!user) {
            user = await prisma.user.create({
                data: {
                    id: session.user.id,
                    email: session.user.email || "",
                    fullName: session.user.fullName || "User",
                    provider: session.user.provider || Provider.CREDENTIALS,
                    image: session.user.image || null,
                },
            })
        }

        return NextResponse.json({ success: true, user })
    } catch (error) {
        console.error("Error syncing user:", error)
        return NextResponse.json({ error: "Failed to sync user" }, { status: 500 })
    }
}

