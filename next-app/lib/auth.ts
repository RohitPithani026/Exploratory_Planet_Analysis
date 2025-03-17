import type { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import GithubProvider from "next-auth/providers/github"
import prisma from "./db"
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
            async profile(profile) {
                const user = await prisma.user.upsert({
                    where: { email: profile.email },
                    update: {
                        fullName: profile.name || profile.login,
                        image: profile.picture,
                        provider: Provider.GOOGLE,
                    },
                    create: {
                        fullName: profile.name || profile.login,
                        email: profile.email,
                        provider: Provider.GOOGLE,
                        image: profile.picture,
                    },
                })
                return {
                    id: user.id,
                    fullName: user.fullName,
                    email: user.email,
                    provider: user.provider,
                    image: user.image,
                }
            },
        }),
        GithubProvider({
            clientId: process.env.GITHUB_CLIENT_ID!,
            clientSecret: process.env.GITHUB_CLIENT_SECRET!,
            authorization: {
                params: {
                    prompt: "consent",
                    access_type: "offline",
                    response_type: "code",
                },
            },
            async profile(profile) {
                const user = await prisma.user.upsert({
                    where: { email: profile.email },
                    update: {
                        fullName: profile.name || profile.login,
                        image: profile.avatar_url,
                        provider: Provider.GITHUB,
                    },
                    create: {
                        fullName: profile.name || profile.login,
                        email: profile.email,
                        provider: Provider.GITHUB,
                        image: profile.avatar_url,
                    },
                })
                return {
                    id: user.id,
                    fullName: user.fullName,
                    email: user.email,
                    provider: user.provider,
                    image: user.image,
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
                if (!credentials?.email || !credentials?.password) return null

                const user = await prisma.user.findUnique({
                    where: { email: credentials.email },
                })

                if (user) {
                    return {
                        id: user.id,
                        fullName: user.fullName,
                        email: user.email,
                        provider: Provider.CREDENTIALS,
                        image: user.image,
                    }
                }

                return null
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
                token.image = user.image
            }
            return token
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string
                session.user.fullName = token.fullName as string
                session.user.provider = token.provider as Provider
                session.user.image = (token.image as string) || null
            }
            return session
        },
    },
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },
    secret: process.env.NEXTAUTH_SECRET,
}
