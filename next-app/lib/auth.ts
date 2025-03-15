import type { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import GithubProvider from "next-auth/providers/github"
import prisma from "./db"

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
        }),
        GithubProvider({
            clientId: process.env.GITHUB_CLIENT_ID!,
            clientSecret: process.env.GITHUB_CLIENT_SECRET!,
            authorization: {
                params: {
                    prompt: "consent",
                    scope: "read:user user:email",
                    response_type: "code",
                }
            }
        }),
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
                name: { label: "Full Name" }
            },
            async authorize(credentials) {
                console.log("Credentials:", credentials);
            
                if (!credentials?.email || !credentials?.password) {
                    console.log("Missing credentials");
                    return null;
                }
            
                const user = await prisma.user.findUnique({
                    where: { email: credentials.email },
                });
            
                if (!user) {
                    console.log("User not found. Creating new user...");
                    const newUser = await prisma.user.create({
                        data: {
                            email: credentials.email,
                            fullName: credentials.name,
                            provider: "CREDENTIALS",
                        },
                    });
                    console.log("New User:", newUser);
                    return newUser;
                }
            
                console.log("User Found:", user);
                return user;
            }
            
        }),
    ],
    pages: {
        signIn: "/signin",
        signOut: "/",
        error: "/signin", 
        newUser: "/signup", 
    },
    callbacks: {
        async jwt({ token, user, account }) {
            if (user) {
                token.id = user.id
            }
            if (account) {
                token.provider = account.provider
            }
            return token
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string
                session.user.provider = token.provider as string
            }
            return session
        },
    },
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },
    secret: process.env.NEXTAUTH_SECRET,
    debug: process.env.NODE_ENV === "development",
}
