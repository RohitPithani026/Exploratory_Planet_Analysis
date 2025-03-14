"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Bell, Calendar, ChevronRight, Edit, Globe, Mail, MapPin, Moon, Search, Star, Sun } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ParticleBackground } from "@/components/particle-background"
import { SpaceBackground } from "@/components/space-background"

export default function ProfilePage() {
    const [theme, setTheme] = useState<"light" | "dark">("dark")
    const [isEditing, setIsEditing] = useState(false)

    const toggleTheme = () => {
        const newTheme = theme === "light" ? "dark" : "light"
        setTheme(newTheme)
        document.documentElement.classList.toggle("dark")
    }

    return (
        <div className={theme === "dark" ? "dark" : ""}>
            <div className="relative flex min-h-screen flex-col bg-[#030014] dark:bg-[#030014] text-white overflow-hidden">
                <ParticleBackground />
                <SpaceBackground />

                <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-black/50 backdrop-blur-xl supports-[backdrop-filter]:bg-black/20">
                    <motion.div
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        className="container flex h-16 items-center justify-between"
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
                                <Link
                                    href="/dashboard/settings"
                                    className="font-medium text-white/70 transition-colors hover:text-indigo-300 relative group"
                                >
                                    Settings
                                    <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-gradient-to-r from-indigo-500 to-purple-600 group-hover:w-full transition-all duration-300"></span>
                                </Link>
                            </nav>
                        </div>
                        <div className="flex items-center gap-4">
                            <form className="hidden md:flex">
                                <div className="relative group">
                                    <div className="absolute -inset-0.5 rounded-full bg-gradient-to-r from-indigo-500/50 to-purple-600/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"></div>
                                    <div className="relative">
                                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-white/40" />
                                        <Input
                                            type="search"
                                            placeholder="Search exoplanets..."
                                            className="w-64 rounded-full border-white/10 bg-white/5 pl-8 text-white placeholder:text-white/30 focus:border-indigo-500/50 focus:ring-indigo-500/50"
                                        />
                                    </div>
                                </div>
                            </form>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={toggleTheme}
                                className="text-white hover:bg-white/10 relative group"
                            >
                                <div className="absolute inset-0 rounded-full bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                                <span className="sr-only">Toggle theme</span>
                            </Button>
                            <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 relative group">
                                <div className="absolute inset-0 rounded-full bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                <Bell className="h-5 w-5" />
                                <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-indigo-500"></span>
                                <span className="sr-only">Notifications</span>
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="rounded-full border border-white/10 bg-white/5 hover:bg-white/10 transition-all duration-300"
                            >
                                <Avatar className="h-8 w-8">
                                    <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
                                    <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
                                        JD
                                    </AvatarFallback>
                                </Avatar>
                            </Button>
                        </div>
                    </motion.div>
                </header>

                <main className="flex-1 p-4 md:p-6 z-10">
                    <div className="container">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="flex flex-col gap-6"
                        >
                            <div className="flex flex-col md:flex-row items-start justify-between gap-4">
                                <div>
                                    <h1 className="bg-gradient-to-r from-white to-indigo-200 bg-clip-text text-3xl font-bold tracking-tighter text-transparent">
                                        Profile
                                    </h1>
                                    <p className="text-white/60">Manage your account and preferences</p>
                                </div>
                                <Button
                                    onClick={() => setIsEditing(!isEditing)}
                                    className="relative overflow-hidden rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg transition-all duration-300 hover:shadow-indigo-500/25"
                                >
                                    <span className="relative z-10 flex items-center">
                                        {isEditing ? (
                                            "Save Profile"
                                        ) : (
                                            <>
                                                Edit Profile <Edit className="ml-2 h-4 w-4" />
                                            </>
                                        )}
                                    </span>
                                </Button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3, delay: 0.1 }}
                                    className="md:col-span-1"
                                >
                                    <Card className="border-white/10 bg-black/30 backdrop-blur-sm shadow-xl overflow-hidden relative group h-full">
                                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                        <CardHeader className="relative z-10 flex flex-col items-center text-center">
                                            <div className="relative mb-4">
                                                <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 opacity-75 blur"></div>
                                                <Avatar className="h-24 w-24 border-2 border-black">
                                                    <AvatarImage src="/placeholder.svg?height=96&width=96" alt="John Doe" />
                                                    <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-2xl">
                                                        JD
                                                    </AvatarFallback>
                                                </Avatar>
                                            </div>
                                            <CardTitle className="text-xl text-white">John Doe</CardTitle>
                                            <CardDescription className="text-white/60">Exoplanet Researcher</CardDescription>
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
                                                    <span>john.doe@example.com</span>
                                                </div>
                                                <div className="flex items-center gap-3 text-white/70">
                                                    <MapPin className="h-4 w-4 text-indigo-400" />
                                                    <span>San Francisco, CA</span>
                                                </div>
                                                <div className="flex items-center gap-3 text-white/70">
                                                    <Calendar className="h-4 w-4 text-indigo-400" />
                                                    <span>Joined March 2023</span>
                                                </div>
                                            </div>

                                            <div className="pt-4 border-t border-white/10">
                                                <h3 className="text-sm font-medium text-white mb-3">Stats</h3>
                                                <div className="grid grid-cols-3 gap-2 text-center">
                                                    <div className="space-y-1">
                                                        <p className="text-2xl font-bold text-white">42</p>
                                                        <p className="text-xs text-white/60">Discoveries</p>
                                                    </div>
                                                    <div className="space-y-1">
                                                        <p className="text-2xl font-bold text-white">156</p>
                                                        <p className="text-xs text-white/60">Analyses</p>
                                                    </div>
                                                    <div className="space-y-1">
                                                        <p className="text-2xl font-bold text-white">89%</p>
                                                        <p className="text-xs text-white/60">Accuracy</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3, delay: 0.2 }}
                                    className="md:col-span-2"
                                >
                                    <Card className="border-white/10 bg-black/30 backdrop-blur-sm shadow-xl overflow-hidden relative group h-full">
                                        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                        <CardHeader className="relative z-10">
                                            <CardTitle className="text-xl text-white">Profile Information</CardTitle>
                                            <CardDescription className="text-white/60">
                                                Update your profile details and preferences
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent className="relative z-10">
                                            <Tabs defaultValue="personal" className="space-y-4">
                                                <TabsList className="grid w-full grid-cols-3 gap-1 rounded-full border border-white/10 bg-white/5 p-1">
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
                                                    <TabsTrigger
                                                        value="preferences"
                                                        className="rounded-full data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-purple-600 data-[state=active]:text-white transition-all duration-300"
                                                    >
                                                        Preferences
                                                    </TabsTrigger>
                                                </TabsList>

                                                <TabsContent value="personal" className="space-y-4">
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        <div className="space-y-2">
                                                            <label className="text-sm font-medium text-white/70">Full Name</label>
                                                            {isEditing ? (
                                                                <Input
                                                                    defaultValue="John Doe"
                                                                    className="border-white/10 bg-white/5 text-white placeholder:text-white/30 focus:border-indigo-500/50 focus:ring-indigo-500/50"
                                                                />
                                                            ) : (
                                                                <p className="text-white p-2 border border-white/10 rounded-md bg-white/5">John Doe</p>
                                                            )}
                                                        </div>
                                                        <div className="space-y-2">
                                                            <label className="text-sm font-medium text-white/70">Email</label>
                                                            {isEditing ? (
                                                                <Input
                                                                    defaultValue="john.doe@example.com"
                                                                    className="border-white/10 bg-white/5 text-white placeholder:text-white/30 focus:border-indigo-500/50 focus:ring-indigo-500/50"
                                                                />
                                                            ) : (
                                                                <p className="text-white p-2 border border-white/10 rounded-md bg-white/5">
                                                                    john.doe@example.com
                                                                </p>
                                                            )}
                                                        </div>
                                                        <div className="space-y-2">
                                                            <label className="text-sm font-medium text-white/70">Location</label>
                                                            {isEditing ? (
                                                                <Input
                                                                    defaultValue="San Francisco, CA"
                                                                    className="border-white/10 bg-white/5 text-white placeholder:text-white/30 focus:border-indigo-500/50 focus:ring-indigo-500/50"
                                                                />
                                                            ) : (
                                                                <p className="text-white p-2 border border-white/10 rounded-md bg-white/5">
                                                                    San Francisco, CA
                                                                </p>
                                                            )}
                                                        </div>
                                                        <div className="space-y-2">
                                                            <label className="text-sm font-medium text-white/70">Role</label>
                                                            {isEditing ? (
                                                                <Input
                                                                    defaultValue="Exoplanet Researcher"
                                                                    className="border-white/10 bg-white/5 text-white placeholder:text-white/30 focus:border-indigo-500/50 focus:ring-indigo-500/50"
                                                                />
                                                            ) : (
                                                                <p className="text-white p-2 border border-white/10 rounded-md bg-white/5">
                                                                    Exoplanet Researcher
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label className="text-sm font-medium text-white/70">Bio</label>
                                                        {isEditing ? (
                                                            <Textarea
                                                                defaultValue="Passionate astronomer and data scientist specializing in exoplanet habitability analysis. Working to discover Earth-like planets that could potentially support life."
                                                                className="min-h-[100px] border-white/10 bg-white/5 text-white placeholder:text-white/30 focus:border-indigo-500/50 focus:ring-indigo-500/50"
                                                            />
                                                        ) : (
                                                            <p className="text-white p-2 border border-white/10 rounded-md bg-white/5">
                                                                Passionate astronomer and data scientist specializing in exoplanet habitability
                                                                analysis. Working to discover Earth-like planets that could potentially support life.
                                                            </p>
                                                        )}
                                                    </div>
                                                </TabsContent>

                                                <TabsContent value="research" className="space-y-4">
                                                    <div className="space-y-4">
                                                        <div className="space-y-2">
                                                            <label className="text-sm font-medium text-white/70">Research Focus</label>
                                                            {isEditing ? (
                                                                <Input
                                                                    defaultValue="Exoplanet Habitability & Terraforming Potential"
                                                                    className="border-white/10 bg-white/5 text-white placeholder:text-white/30 focus:border-indigo-500/50 focus:ring-indigo-500/50"
                                                                />
                                                            ) : (
                                                                <p className="text-white p-2 border border-white/10 rounded-md bg-white/5">
                                                                    Exoplanet Habitability & Terraforming Potential
                                                                </p>
                                                            )}
                                                        </div>

                                                        <div className="space-y-2">
                                                            <label className="text-sm font-medium text-white/70">Specializations</label>
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
                                                            <label className="text-sm font-medium text-white/70">Notable Discoveries</label>
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

                                                <TabsContent value="preferences" className="space-y-4">
                                                    <div className="space-y-4">
                                                        <div className="flex items-center justify-between p-3 border border-white/10 rounded-md bg-white/5">
                                                            <div>
                                                                <p className="text-white">Email Notifications</p>
                                                                <p className="text-xs text-white/50">Receive email updates about new discoveries</p>
                                                            </div>
                                                            <div className="relative">
                                                                <div className="w-12 h-6 rounded-full bg-white/10 flex items-center p-1">
                                                                    <div
                                                                        className={`w-4 h-4 rounded-full transition-all duration-300 ${isEditing ? "bg-indigo-500 translate-x-6" : "bg-white/50"}`}
                                                                    ></div>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="flex items-center justify-between p-3 border border-white/10 rounded-md bg-white/5">
                                                            <div>
                                                                <p className="text-white">Dark Mode</p>
                                                                <p className="text-xs text-white/50">Use dark theme across the platform</p>
                                                            </div>
                                                            <div className="relative">
                                                                <div className="w-12 h-6 rounded-full bg-white/10 flex items-center p-1">
                                                                    <div className="w-4 h-4 rounded-full bg-indigo-500 translate-x-6"></div>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="flex items-center justify-between p-3 border border-white/10 rounded-md bg-white/5">
                                                            <div>
                                                                <p className="text-white">Data Sharing</p>
                                                                <p className="text-xs text-white/50">Share your research with the community</p>
                                                            </div>
                                                            <div className="relative">
                                                                <div className="w-12 h-6 rounded-full bg-white/10 flex items-center p-1">
                                                                    <div
                                                                        className={`w-4 h-4 rounded-full transition-all duration-300 ${isEditing ? "bg-indigo-500 translate-x-6" : "bg-white/50"}`}
                                                                    ></div>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="space-y-2">
                                                            <label className="text-sm font-medium text-white/70">Default View</label>
                                                            <div className="grid grid-cols-3 gap-2">
                                                                {["Overview", "Habitability", "Terraforming"].map((view, index) => (
                                                                    <div
                                                                        key={index}
                                                                        className={`p-2 border rounded-md text-center cursor-pointer transition-all duration-300 ${index === 0
                                                                                ? "border-indigo-500/50 bg-indigo-500/10 text-white"
                                                                                : "border-white/10 bg-white/5 text-white/70 hover:bg-white/10 hover:text-white"
                                                                            }`}
                                                                    >
                                                                        {view}
                                                                    </div>
                                                                ))}
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
                                transition={{ duration: 0.3, delay: 0.3 }}
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
                                                    transition={{ duration: 0.3, delay: 0.1 * index }}
                                                    whileHover={{ scale: 1.02 }}
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

