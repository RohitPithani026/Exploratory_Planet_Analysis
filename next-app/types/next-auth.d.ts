import type { DefaultSession } from "next-auth"
import type { Provider } from "@prisma/client"

declare module "next-auth" {
    interface User {
        fullName: string
        provider: Provider
    }

    interface Session {
        user: {
            id: string
            fullName: string
            provider: Provider
        } & DefaultSession["user"]
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id: string
        fullName: string
        provider: Provider
    }
}

