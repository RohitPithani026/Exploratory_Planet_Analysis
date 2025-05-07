"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Calendar, ChevronRight, Edit, Globe, Mail, MapPin, Star, Save, X, LogOut } from "lucide-react"
import { signOut, useSession } from "next-auth/react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ParticleBackground } from "@/components/particle-background"
import { SpaceBackground } from "@/components/space-background"
import { useTheme } from "@/components/theme-provider"
import { useToast } from "@/hooks/use-toast"
import { Separator } from "@/components/ui/separator"
import { Label } from "@/components/ui/label"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"

interface UserProfile {
    id: string
    fullName: string
    email: string
    location?: string
    role?: string
    bio?: string
    researchFocus?: string
    image?: string
    provider: string
    createdAt: string
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    specializations?: any[]
}

export default function ProfilePage() {
    const { data: session } = useSession()
    const { toast } = useToast()
    const { theme, animations, particleEffects, blurEffects } = useTheme()
    const containerRef = useRef<HTMLDivElement>(null)
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
    const [isEditing, setIsEditing] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [profile, setProfile] = useState<UserProfile | null>(null)
    const [formData, setFormData] = useState({
        fullName: "",
        location: "",
        role: "",
        bio: "",
        researchFocus: "",
    })

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (containerRef.current) {
                const rect = containerRef.current.getBoundingClientRect()
                setMousePosition({
                    x: e.clientX - rect.left,
                    y: e.clientY - rect.top,
                })
            }
        }

        window.addEventListener("mousemove", handleMouseMove)

        return () => {
            window.removeEventListener("mousemove", handleMouseMove)
        }
    }, [toast])

    // Fetch user profile
    useEffect(() => {
        const fetchProfile = async () => {
            if (session?.user?.id) {
                try {
                    const response = await fetch("/api/user/profile")

                    if (response.ok) {
                        const data = await response.json()
                        setProfile(data)
                        setFormData({
                            fullName: data.fullName || "",
                            location: data.location || "",
                            role: data.role || "",
                            bio: data.bio || "",
                            researchFocus: data.researchFocus || "",
                        })
                    } else {
                        toast({
                            title: "Error",
                            description: "Failed to fetch profile data",
                            variant: "destructive",
                        })
                    }
                } catch (error) {
                    console.error("Error fetching profile:", error)
                    toast({
                        title: "Error",
                        description: "An unexpected error occurred",
                        variant: "destructive",
                    })
                } finally {
                    setIsLoading(false)
                }
            } else if (session === null) {
                setIsLoading(false)
            }
        }

        fetchProfile()
    }, [session, toast])

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    const handleLogout = async () => {
        toast({
            title: "Logging out",
            description: "You are being signed out...",
        })

        await signOut({ callbackUrl: "/" })
    }

    const handleSaveProfile = async () => {
        try {
            setIsLoading(true)

            const response = await fetch("/api/user/profile", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            })

            if (response.ok) {
                const updatedProfile = await response.json()
                setProfile(updatedProfile)
                setIsEditing(false)
                toast({
                    title: "Profile updated",
                    description: "Your profile has been updated successfully",
                })
            } else {
                throw new Error("Failed to update profile")
            }
        } catch (error) {
            console.error("Error updating profile:", error)
            toast({
                title: "Error",
                description: "Failed to update profile",
                variant: "destructive",
            })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className={theme === "dark" ? "dark" : ""} ref={containerRef}>
            <div className="relative flex min-h-screen flex-col bg-[#030014] dark:bg-[#030014] text-white overflow-hidden">
                {particleEffects && <ParticleBackground />}
                {particleEffects && <SpaceBackground />}

                {animations && (
                    <div
                        className="pointer-events-none absolute inset-0 z-30 opacity-70"
                        style={{
                            background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(139, 92, 246, 0.15), transparent 25%)`,
                        }}
                    />
                )}

                <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-black/50 backdrop-blur-xl supports-[backdrop-filter]:bg-black/20">
                    <motion.div
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: animations ? 0.5 : 0 }}
                        className="container flex h-16 items-center justify-between p-8"
                    >
                        <div className="flex items-center gap-2 md:gap-4">
                            <Link href="/dashboard" className="flex items-center gap-2 group">
                                <div className="relative">
                                    <div className="absolute -inset-0.5 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 opacity-75 blur group-hover:opacity-100 transition-opacity duration-300"></div>
                                    <div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-black">
                                        <Globe className="h-5 w-5 text-indigo-400" />
                                    </div>
                                </div>
                                <span className="bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-xl font-bold text-transparent hidden md:inline">
                                    ExoHabit
                                </span>
                            </Link>
                            <nav className="hidden md:flex items-center gap-6 text-sm">
                                <Link
                                    href="/dashboard"
                                    className="font-medium text-white/70 transition-colors hover:text-indigo-300 relative group"
                                >
                                    Dashboard
                                    <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-gradient-to-r from-indigo-500 to-purple-600 group-hover:w-full transition-all duration-300"></span>
                                </Link>
                                <Link
                                    href="/dashboard/exoplanets"
                                    className="font-medium text-white/70 transition-colors hover:text-indigo-300 relative group"
                                >
                                    Exoplanets
                                    <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-gradient-to-r from-indigo-500 to-purple-600 group-hover:w-full transition-all duration-300"></span>
                                </Link>
                                <Link
                                    href="/dashboard/profile"
                                    className="font-medium text-white transition-colors hover:text-indigo-300 relative group"
                                >
                                    Profile
                                    <span className="absolute -bottom-1 left-0 h-0.5 w-full bg-gradient-to-r from-indigo-500 to-purple-600 transition-all duration-300"></span>
                                </Link>
                            </nav>
                        </div>
                        <div className="flex items-center gap-4">

                            <HoverCard>
                                <HoverCardTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="rounded-full border border-white/10 bg-white/5 hover:bg-white/10 transition-all duration-300"
                                    >
                                        <Avatar className="h-8 w-8">
                                            <AvatarImage src={session?.user?.image || "/placeholder.svg?height=32&width=32"} alt="User" />
                                            <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
                                                {session?.user?.fullName?.charAt(0) || "U"}
                                            </AvatarFallback>
                                        </Avatar>
                                    </Button>
                                </HoverCardTrigger>
                                <HoverCardContent
                                    className={`w-80 border-white/10 bg-black/80 text-white ${blurEffects ? "backdrop-blur-xl" : ""}`}
                                >
                                    <div className="flex justify-between space-x-4">
                                        <Avatar className="h-12 w-12">
                                            <AvatarImage src={session?.user?.image || "/placeholder.svg?height=48&width=48"} />
                                            <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
                                                {session?.user?.fullName?.charAt(0) || "U"}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="space-y-1 flex-1">
                                            <h4 className="text-sm font-semibold">{session?.user?.fullName || "John Doe"}</h4>
                                            <p className="text-xs text-white/60">{session?.user?.email || "Exoplanet Researcher"}</p>
                                            <div className="flex items-center pt-2">
                                                <Link
                                                    href="/dashboard/profile"
                                                    className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center"
                                                >
                                                    View profile <ChevronRight className="h-3 w-3 ml-1" />
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </HoverCardContent>
                            </HoverCard>
                        </div>
                    </motion.div>
                </header>

                <main className="flex-1 p-4 md:p-6 z-10">
                    <div className="container">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: animations ? 0.5 : 0 }}
                            className="flex flex-col gap-6"
                        >
                            <div className="flex flex-col md:flex-row items-start justify-between gap-4">
                                <div>
                                    <h1 className="bg-gradient-to-r from-white to-indigo-200 bg-clip-text text-3xl font-bold tracking-tighter text-transparent">
                                        Profile
                                    </h1>
                                    <p className="text-white/60">Manage your account and preferences</p>
                                </div>
                                {isEditing ? (
                                    <div className="flex gap-2">
                                        <Button
                                            onClick={() => setIsEditing(false)}
                                            className="relative overflow-hidden rounded-full border border-white/10 bg-white/5 text-white"
                                        >
                                            <X className="mr-2 h-4 w-4" />
                                            Cancel
                                        </Button>
                                        <Button
                                            onClick={handleSaveProfile}
                                            disabled={isLoading}
                                            className="relative overflow-hidden rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg transition-all duration-300 hover:shadow-indigo-500/25"
                                        >
                                            <Save className="mr-2 h-4 w-4" />
                                            Save Profile
                                        </Button>
                                    </div>
                                ) : (
                                    <Button
                                        onClick={() => setIsEditing(true)}
                                        className="relative overflow-hidden rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg transition-all duration-300 hover:shadow-indigo-500/25"
                                    >
                                        <span className="relative z-10 flex items-center">
                                            <Edit className="mr-2 h-4 w-4" />
                                            Edit Profile
                                        </span>
                                    </Button>
                                )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: animations ? 0.3 : 0, delay: animations ? 0.1 : 0 }}
                                    className="md:col-span-1"
                                >
                                    <Card className="border-white/10 bg-black/30 backdrop-blur-sm shadow-xl overflow-hidden relative group h-full">
                                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                        <CardHeader className="relative z-10 flex flex-col items-center text-center">
                                            <div className="relative mb-4">
                                                <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 opacity-75 blur"></div>
                                                <Avatar className="h-24 w-24 border-2 border-black">
                                                    <AvatarImage
                                                        src={profile?.image || "/placeholder.svg?height=96&width=96"}
                                                        alt={profile?.fullName}
                                                    />
                                                    <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-2xl">
                                                        {profile?.fullName?.charAt(0) || "U"}
                                                    </AvatarFallback>
                                                </Avatar>
                                            </div>
                                            <CardTitle className="text-xl text-white">{profile?.fullName}</CardTitle>
                                            <CardDescription className="text-white/60">
                                                {profile?.role || "Exoplanet Researcher"}
                                            </CardDescription>
                                            <div className="flex items-center gap-2 mt-2">
                                                <Badge className="bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500/30">Astronomer</Badge>
                                                <Badge className="bg-purple-500/20 text-purple-300 hover:bg-purple-500/30">
                                                    Data Scientist
                                                </Badge>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="relative z-10 space-y-4">
                                            <div className="space-y-4">
                                                <div className="flex items-center gap-3 text-white/70">
                                                    <Mail className="h-4 w-4 text-indigo-400" />
                                                    <span>{profile?.email}</span>
                                                </div>
                                                <div className="flex items-center gap-3 text-white/70">
                                                    <MapPin className="h-4 w-4 text-indigo-400" />
                                                    <span>{profile?.location || "San Francisco, CA"}</span>
                                                </div>
                                                <div className="flex items-center gap-3 text-white/70">
                                                    <Calendar className="h-4 w-4 text-indigo-400" />
                                                    <span>
                                                        Joined{" "}
                                                        {profile?.createdAt
                                                            ? new Date(profile.createdAt).toLocaleDateString("en-US", {
                                                                month: "long",
                                                                year: "numeric",
                                                            })
                                                            : "March 2023"}
                                                    </span>
                                                </div>
                                            </div>

                                            <Separator className="my-6 bg-white/10" />

                                            <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-4">
                                                <div className="flex items-center gap-3">
                                                    <LogOut className="h-5 w-5 text-red-400" />
                                                    <div>
                                                        <h4 className="font-medium text-white">Log out</h4>
                                                        <p className="text-xs text-white/60">Sign out of your account</p>
                                                    </div>
                                                </div>
                                                <Button variant="destructive" size="sm" className="mt-3 w-full" onClick={handleLogout}>
                                                    Log Out
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: animations ? 0.3 : 0, delay: animations ? 0.2 : 0 }}
                                    className="md:col-span-2"
                                >
                                    <Card className="border-white/10 bg-black/30 backdrop-blur-sm shadow-xl overflow-hidden relative group h-full">
                                        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                        <CardHeader className="relative z-10">
                                            <CardTitle className="text-xl text-white">Profile Information</CardTitle>
                                            <CardDescription className="text-white/60">
                                                {isEditing ? "Update your profile details" : "Your profile details and preferences"}
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent className="relative z-10">
                                            <Tabs defaultValue="personal" className="space-y-4">
                                                <TabsList className="grid w-full grid-cols-2 gap-1 rounded-full border border-white/10 bg-white/5 p-1">
                                                    <TabsTrigger
                                                        value="personal"
                                                        className="rounded-full data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-purple-600 data-[state=active]:text-white transition-all duration-300"
                                                    >
                                                        Personal
                                                    </TabsTrigger>
                                                    <TabsTrigger
                                                        value="research"
                                                        className="rounded-full data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-purple-600 data-[state=active]:text-white transition-all duration-300"
                                                    >
                                                        Research
                                                    </TabsTrigger>
                                                </TabsList>

                                                <TabsContent value="personal" className="space-y-8">
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                        <div className="space-y-4">
                                                            <Label className="text-sm font-medium text-white/70">Full Name</Label>
                                                            {isEditing ? (
                                                                <Input
                                                                    name="fullName"
                                                                    value={formData.fullName}
                                                                    onChange={handleInputChange}
                                                                    className="border-white/10 bg-white/5 text-white placeholder:text-white/30 focus:border-indigo-500/50 focus:ring-indigo-500/50"
                                                                />
                                                            ) : (
                                                                <p className="text-white p-2 border border-white/10 rounded-md bg-white/5">
                                                                    {profile?.fullName}
                                                                </p>
                                                            )}
                                                        </div>
                                                        <div className="space-y-4">
                                                            <Label className="text-sm font-medium text-white/70">Email</Label>
                                                            <p className="text-white p-2 border border-white/10 rounded-md bg-white/5">
                                                                {profile?.email}
                                                            </p>
                                                        </div>
                                                        <div className="space-y-4">
                                                            <Label className="text-sm font-medium text-white/70">Location</Label>
                                                            {isEditing ? (
                                                                <Input
                                                                    name="location"
                                                                    value={formData.location}
                                                                    onChange={handleInputChange}
                                                                    className="border-white/10 bg-white/5 text-white placeholder:text-white/30 focus:border-indigo-500/50 focus:ring-indigo-500/50"
                                                                />
                                                            ) : (
                                                                <p className="text-white p-2 border border-white/10 rounded-md bg-white/5">
                                                                    {profile?.location || "San Francisco, CA"}
                                                                </p>
                                                            )}
                                                        </div>
                                                        <div className="space-y-4">
                                                            <Label className="text-sm font-medium text-white/70">Role</Label>
                                                            {isEditing ? (
                                                                <Input
                                                                    name="role"
                                                                    value={formData.role}
                                                                    onChange={handleInputChange}
                                                                    className="border-white/10 bg-white/5 text-white placeholder:text-white/30 focus:border-indigo-500/50 focus:ring-indigo-500/50"
                                                                />
                                                            ) : (
                                                                <p className="text-white p-2 border border-white/10 rounded-md bg-white/5">
                                                                    {profile?.role || "Exoplanet Researcher"}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="space-y-4">
                                                        <Label className="text-sm font-medium text-white/70">Bio</Label>
                                                        {isEditing ? (
                                                            <Textarea
                                                                name="bio"
                                                                value={formData.bio}
                                                                onChange={handleInputChange}
                                                                className="min-h-[100px] border-white/10 bg-white/5 text-white placeholder:text-white/30 focus:border-indigo-500/50 focus:ring-indigo-500/50"
                                                            />
                                                        ) : (
                                                            <p className="text-white p-2 border border-white/10 rounded-md bg-white/5">
                                                                {profile?.bio ||
                                                                    "Passionate astronomer and data scientist specializing in exoplanet habitability analysis. Working to discover Earth-like planets that could potentially support life."}
                                                            </p>
                                                        )}
                                                    </div>
                                                </TabsContent>

                                                <TabsContent value="research" className="space-y-4">
                                                    <div className="space-y-4">
                                                        <div className="space-y-2">
                                                            <Label className="text-sm font-medium text-white/70">Research Focus</Label>
                                                            {isEditing ? (
                                                                <Input
                                                                    name="researchFocus"
                                                                    value={formData.researchFocus}
                                                                    onChange={handleInputChange}
                                                                    className="border-white/10 bg-white/5 text-white placeholder:text-white/30 focus:border-indigo-500/50 focus:ring-indigo-500/50"
                                                                />
                                                            ) : (
                                                                <p className="text-white p-2 border border-white/10 rounded-md bg-white/5">
                                                                    {profile?.researchFocus || "Exoplanet Habitability & Terraforming Potential"}
                                                                </p>
                                                            )}
                                                        </div>

                                                        <div className="space-y-2">
                                                            <Label className="text-sm font-medium text-white/70">Specializations</Label>
                                                            <div className="flex flex-wrap gap-2">
                                                                <Badge className="bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500/30">
                                                                    Astronomer
                                                                </Badge>
                                                                <Badge className="bg-purple-500/20 text-purple-300 hover:bg-purple-500/30">
                                                                    Data Scientist
                                                                </Badge>
                                                                <Badge className="bg-blue-500/20 text-blue-300 hover:bg-blue-500/30">
                                                                    Astrophysics
                                                                </Badge>
                                                                <Badge className="bg-green-500/20 text-green-300 hover:bg-green-500/30">
                                                                    Planetary Science
                                                                </Badge>
                                                                {isEditing && (
                                                                    <Button
                                                                        variant="outline"
                                                                        size="sm"
                                                                        className="h-6 rounded-full border-dashed border-white/30 text-white/50 hover:text-white hover:border-white/50"
                                                                    >
                                                                        + Add
                                                                    </Button>
                                                                )}
                                                            </div>
                                                        </div>

                                                        <div className="space-y-2">
                                                            <Label className="text-sm font-medium text-white/70">Notable Discoveries</Label>
                                                            <div className="space-y-3">
                                                                {[
                                                                    { name: "Kepler-452b habitability assessment", date: "June 2024" },
                                                                    { name: "TRAPPIST-1e atmospheric analysis", date: "March 2024" },
                                                                    { name: "HD 219134 b terraforming potential study", date: "January 2024" },
                                                                ].map((discovery, index) => (
                                                                    <div
                                                                        key={index}
                                                                        className="flex items-center justify-between p-2 border border-white/10 rounded-md bg-white/5"
                                                                    >
                                                                        <div>
                                                                            <p className="text-white">{discovery.name}</p>
                                                                            <p className="text-xs text-white/50">{discovery.date}</p>
                                                                        </div>
                                                                        {isEditing && (
                                                                            <Button
                                                                                variant="ghost"
                                                                                size="sm"
                                                                                className="h-8 w-8 p-0 text-white/50 hover:text-white hover:bg-white/10"
                                                                            >
                                                                                <Edit className="h-4 w-4" />
                                                                            </Button>
                                                                        )}
                                                                    </div>
                                                                ))}
                                                                {isEditing && (
                                                                    <Button
                                                                        variant="outline"
                                                                        className="w-full border-dashed border-white/30 text-white/50 hover:text-white hover:border-white/50"
                                                                    >
                                                                        + Add Discovery
                                                                    </Button>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </TabsContent>
                                            </Tabs>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            </div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: animations ? 0.3 : 0, delay: animations ? 0.3 : 0 }}
                            >
                                <Card className="border-white/10 bg-black/30 backdrop-blur-sm shadow-xl overflow-hidden relative group">
                                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                    <CardHeader className="relative z-10">
                                        <CardTitle className="text-xl text-white">Favorite Exoplanets</CardTitle>
                                        <CardDescription className="text-white/60">Your saved exoplanets for quick access</CardDescription>
                                    </CardHeader>
                                    <CardContent className="relative z-10">
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            {[
                                                { name: "Kepler-452b", type: "Super Earth", distance: "1,400 light years", habitability: 0.82 },
                                                { name: "TRAPPIST-1e", type: "Earth-like", distance: "39 light years", habitability: 0.91 },
                                                { name: "Proxima Centauri b", type: "Rocky", distance: "4.2 light years", habitability: 0.75 },
                                            ].map((planet, index) => (
                                                <motion.div
                                                    key={planet.name}
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ duration: animations ? 0.3 : 0, delay: animations ? 0.1 * index : 0 }}
                                                    whileHover={{ scale: animations ? 1.02 : 1 }}
                                                    className="group/card relative overflow-hidden rounded-lg border border-white/10 bg-white/5 p-4 transition-all duration-300 hover:bg-white/10"
                                                >
                                                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 opacity-0 transition-opacity duration-300 group-hover/card:opacity-100"></div>
                                                    <div className="relative z-10">
                                                        <div className="flex items-center justify-between mb-3">
                                                            <h3 className="font-medium text-white">{planet.name}</h3>
                                                            <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <div className="flex items-center justify-between">
                                                                <span className="text-xs text-white/60">Type:</span>
                                                                <Badge
                                                                    variant="outline"
                                                                    className="border-indigo-500/30 bg-indigo-500/10 text-indigo-300"
                                                                >
                                                                    {planet.type}
                                                                </Badge>
                                                            </div>
                                                            <div className="flex items-center justify-between">
                                                                <span className="text-xs text-white/60">Distance:</span>
                                                                <span className="text-xs text-white">{planet.distance}</span>
                                                            </div>
                                                            <div className="flex items-center justify-between">
                                                                <span className="text-xs text-white/60">Habitability:</span>
                                                                <div className="flex items-center">
                                                                    <div className="w-16 h-2 rounded-full bg-white/10 mr-2">
                                                                        <div
                                                                            className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-600"
                                                                            style={{ width: `${planet.habitability * 100}%` }}
                                                                        ></div>
                                                                    </div>
                                                                    <span className="text-xs text-white">{(planet.habitability * 100).toFixed(0)}%</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="w-full mt-3 text-indigo-300 hover:text-indigo-200 hover:bg-white/10"
                                                        >
                                                            View Details <ChevronRight className="ml-1 h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        </motion.div>
                    </div>
                </main>
            </div>
        </div>
    )
}

