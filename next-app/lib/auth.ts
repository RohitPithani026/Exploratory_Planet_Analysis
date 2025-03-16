import type { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import GithubProvider from "next-auth/providers/github"
import prisma from "./prisma" // Make sure this import is correct
import { Provider } from "@prisma/client"

export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
            authorization: {
                params: {
                    prompt: "consent",
                    access_type: "offline",
                    response_type: "code",
                },
            },
            profile(profile) {
                return {
                    id: profile.sub,
                    fullName: profile.name || profile.login,
                    email: profile.email,
                    provider: Provider.GOOGLE,
                    image: profile.picture,
                }
            },
        }),
        GithubProvider({
            clientId: process.env.GITHUB_CLIENT_ID!,
            clientSecret: process.env.GITHUB_CLIENT_SECRET!,
            authorization: {
                params: {
                    prompt: "consent",
                    response_type: "code"
                }
            },
            profile(profile) {
                return {
                    id: String(profile.id),
                    fullName: profile.name || profile.login,
                    email: profile.email,
                    provider: Provider.GITHUB,
                    image: profile.avatar_url,
                }
            },
        }),
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    return null
                }

                try {
                    // Check if user exists
                    const user = await prisma.user.findUnique({
                        where: { email: credentials.email },
                    })

                    if (user) {
                        return {
                            id: user.id,
                            fullName: user.fullName,
                            email: user.email,
                            provider: Provider.CREDENTIALS,
                        }
                    }

                    return null
                } catch (error) {
                    console.error("Error during authentication:", error)
                    return null
                }
            },
        }),
    ],
    pages: {
        signIn: "/signin",
        signOut: "/",
        error: "/auth/error",
        newUser: "/signup",
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id
                token.fullName = user.fullName
                token.provider = user.provider
            }
            return token
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string
                session.user.fullName = token.fullName as string
                session.user.provider = token.provider as Provider
            }
            return session
        },
        async redirect({ url, baseUrl }) {
            // Allows relative callback URLs
            if (url.startsWith("/")) return `${baseUrl}${url}`
            // Allows callback URLs on the same origin
            else if (new URL(url).origin === baseUrl) return url
            return baseUrl
        },
    },
    // debug: process.env.NODE_ENV === "development",
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },
    secret: process.env.NEXTAUTH_SECRET,
}

