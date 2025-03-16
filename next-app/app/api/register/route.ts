import { type NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { Provider } from "@prisma/client"

export async function POST(req: NextRequest) {
    try {
        const { fullName, email, password } = await req.json()

        // Validate input
        if (!fullName || !email || !password) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
        }

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email },
        })

        if (existingUser) {
            return NextResponse.json({ error: "User with this email already exists" }, { status: 409 })
        }

        // In a real application, you would hash the password here
        // For example: const hashedPassword = await bcrypt.hash(password, 10)

        // Create new user
        const user = await prisma.user.create({
            data: {
                fullName,
                email,
                provider: Provider.CREDENTIALS,
            },
        })

        return NextResponse.json(
            {
                id: user.id,
                fullName: user.fullName,
                email: user.email,
            },
            { status: 201 },
        )
    } catch (error) {
        console.error("Registration error:", error)
        return NextResponse.json({ error: "An error occurred during registration" }, { status: 500 })
    }
}

