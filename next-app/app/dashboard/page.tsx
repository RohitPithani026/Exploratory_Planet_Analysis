"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { useSession } from "next-auth/react"
import {
    BarChart3,
    ChevronRight,
    Globe,
    Menu,
    Moon,
    Search,
    Star,
    Sun,
    User,
    Rocket,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

import { ParticleBackground } from "@/components/particle-background"
import { SpaceBackground } from "@/components/space-background"
import { PlanetCard } from "@/components/planet-card"
import { GlowingButton } from "@/components/glowing-button"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { useTheme } from "@/components/theme-provider"
import { useToast } from "@/hooks/use-toast"

export default function Dashboard() {
    const { data: session } = useSession()
    const { theme, setTheme, animations, particleEffects, blurEffects } = useTheme()
    const { toast } = useToast()
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [progress, setProgress] = useState(13)
    const [isLoading, setIsLoading] = useState(true)
    const [activeTab, setActiveTab] = useState("overview")
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

    const containerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        // Simulate progress loading
        const timer = setTimeout(() => setProgress(66), 500)
        const timer2 = setTimeout(() => setProgress(100), 1000)
        const loadingTimer = setTimeout(() => {
            setIsLoading(false)
            toast({
                title: "Welcome back!",
                description: "Your dashboard is ready to explore.",
            })
        }, 1500)

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
            clearTimeout(timer)
            clearTimeout(timer2)
            clearTimeout(loadingTimer)
            window.removeEventListener("mousemove", handleMouseMove)
        }
    }, [toast])

    const toggleTheme = () => {
        setTheme(theme === "light" ? "dark" : "light")
    }

    const handleTabChange = (value: string) => {
        setActiveTab(value)
    }

    if (isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[#030014]">
                <div className="relative flex flex-col items-center justify-center">
                    <div className="absolute -inset-20 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 opacity-20 blur-3xl animate-pulse"></div>
                    <div className="relative flex items-center justify-center h-32 w-32">
                        <div className="absolute flex items-center justify-center">
                            <div className="h-24 w-24 rounded-full border-4 border-t-indigo-500 border-r-transparent border-b-purple-600 border-l-transparent animate-spin"></div>
                        </div>
                        <div className="absolute flex items-center justify-center">
                            <div className="h-16 w-16 rounded-full border-4 border-t-transparent border-r-purple-600 border-b-transparent border-l-indigo-500 animate-spin"></div>
                        </div>
                        <Globe className="h-8 w-8 text-indigo-400 animate-pulse" />
                    </div>
                    <div className="mt-6 text-center">
                        <h2 className="text-xl font-bold text-white">Loading ExoHabit</h2>
                        <p className="text-indigo-300">Preparing your cosmic journey...</p>
                    </div>
                </div>
            </div>
        )
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
                            <Sheet>
                                <SheetTrigger asChild>
                                    <Button variant="ghost" size="icon" className="md:hidden text-white hover:bg-white/10">
                                        <Menu className="h-5 w-5" />
                                        <span className="sr-only">Toggle menu</span>
                                    </Button>
                                </SheetTrigger>
                                <SheetContent
                                    side="left"
                                    className={`border-r border-white/10 bg-black/80 ${blurEffects ? "backdrop-blur-xl" : ""}`}
                                >
                                    <nav className="grid gap-6 text-lg font-medium">
                                        <Link href="/dashboard" className="flex items-center gap-2 text-lg font-semibold">
                                            <div className="relative">
                                                <div className="absolute -inset-0.5 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 opacity-75 blur"></div>
                                                <div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-black">
                                                    <Globe className="h-5 w-5 text-indigo-400" />
                                                </div>
                                            </div>
                                            <span className="bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">
                                                ExoHabit
                                            </span>
                                        </Link>
                                        <Link
                                            href="/dashboard"
                                            className="flex items-center gap-2 text-white/70 transition-colors hover:text-white"
                                        >
                                            <BarChart3 className="h-5 w-5" />
                                            <span>Dashboard</span>
                                        </Link>
                                        <Link
                                            href="/dashboard/exoplanets"
                                            className="flex items-center gap-2 text-white/70 transition-colors hover:text-white"
                                        >
                                            <Globe className="h-5 w-5" />
                                            <span>Exoplanets</span>
                                        </Link>
                                        <Link
                                            href="/dashboard/profile"
                                            className="flex items-center gap-2 text-white/70 transition-colors hover:text-white"
                                        >
                                            <User className="h-5 w-5" />
                                            <span>Profile</span>
                                        </Link>
                                    </nav>
                                </SheetContent>
                            </Sheet>
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
                                    className="font-medium text-white transition-colors hover:text-indigo-300 relative group"
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
                                    className="font-medium text-white/70 transition-colors hover:text-indigo-300 relative group"
                                >
                                    Profile
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
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
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
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Toggle theme</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>

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
                            className="flex flex-col gap-4 md:gap-8"
                        >
                            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                                <div>
                                    <h1 className="bg-gradient-to-r from-white to-indigo-200 bg-clip-text text-3xl font-bold tracking-tighter text-transparent">
                                        Dashboard
                                    </h1>
                                    <p className="text-white/60">Welcome back, explore the latest exoplanet data</p>
                                </div>
                                <GlowingButton>Analyze New Exoplanet</GlowingButton>
                            </div>

                            <Tabs defaultValue="overview" className="space-y-4" value={activeTab} onValueChange={handleTabChange}>
                                <TabsList className="grid w-full grid-cols-3 md:w-auto gap-1 rounded-full border border-white/10 bg-white/5 p-1">
                                    <TabsTrigger
                                        value="overview"
                                        className="rounded-full data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-purple-600 data-[state=active]:text-white transition-all duration-300"
                                    >
                                        Overview
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="habitability"
                                        className="rounded-full data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-purple-600 data-[state=active]:text-white transition-all duration-300"
                                    >
                                        Habitability
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="terraforming"
                                        className="rounded-full data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-purple-600 data-[state=active]:text-white transition-all duration-300"
                                    >
                                        Terraforming
                                    </TabsTrigger>
                                </TabsList>

                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={activeTab}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: animations ? 0.3 : 0 }}
                                    >
                                        {activeTab === "overview" && (
                                            <TabsContent value="overview" className="space-y-4 mt-0">
                                                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                                                    {[
                                                        {
                                                            title: "Total Exoplanets",
                                                            value: localStorage.getItem("totalExpoPlanets"),
                                                            change: "+120",
                                                            icon: <Globe className="h-4 w-4 text-indigo-400" />,
                                                            color: "indigo",
                                                        },
                                                        {
                                                            title: "Habitable Planets",
                                                            value: "217",
                                                            change: "+12",
                                                            icon: <Star className="h-4 w-4 text-green-400" />,
                                                            color: "green",
                                                        },
                                                        {
                                                            title: "Terraformable Planets",
                                                            value: "842",
                                                            change: "+35",
                                                            icon: <Rocket className="h-4 w-4 text-purple-400" />,
                                                            color: "purple",
                                                        },
                                                        {
                                                            title: "Data Accuracy",
                                                            value: "94.2%",
                                                            change: "+2.1%",
                                                            icon: <BarChart3 className="h-4 w-4 text-blue-400" />,
                                                            color: "blue",
                                                        },
                                                    ].map((item, index) => (
                                                        <motion.div
                                                            key={item.title}
                                                            initial={{ opacity: 0, y: 20 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            transition={{ duration: animations ? 0.3 : 0, delay: animations ? index * 0.1 : 0 }}
                                                        >
                                                            <Card
                                                                className={`border-white/10 bg-black/30 ${blurEffects ? "backdrop-blur-sm" : ""} overflow-hidden relative group`}
                                                            >
                                                                <div
                                                                    className={`absolute inset-0 bg-gradient-to-br from-${item.color}-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                                                                ></div>
                                                                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
                                                                    <CardTitle className="text-sm font-medium text-white/70">{item.title}</CardTitle>
                                                                    <div className={`rounded-full bg-${item.color}-500/10 p-1`}>{item.icon}</div>
                                                                </CardHeader>
                                                                <CardContent className="relative z-10">
                                                                    <div className="text-2xl font-bold text-white">{item.value}</div>
                                                                    <div className="flex items-center pt-1">
                                                                        <span className="text-xs text-green-400">{item.change}</span>
                                                                        <span className="ml-1 text-xs text-white/40">from last month</span>
                                                                    </div>
                                                                </CardContent>
                                                            </Card>
                                                        </motion.div>
                                                    ))}
                                                </div>

                                                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                                                    <motion.div
                                                        initial={{ opacity: 0, y: 20 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        transition={{ duration: animations ? 0.3 : 0, delay: animations ? 0.4 : 0 }}
                                                        className="lg:col-span-4"
                                                    >
                                                        <Card
                                                            className={`border-white/10 bg-black/30 ${blurEffects ? "backdrop-blur-sm" : ""} shadow-xl h-full overflow-hidden relative group`}
                                                        >
                                                            <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                                            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                                            <CardHeader className="relative z-10">
                                                                <CardTitle className="text-white">Exoplanet Distribution</CardTitle>
                                                                <CardDescription className="text-white/60">
                                                                    Distribution by star type and planetary class
                                                                </CardDescription>
                                                            </CardHeader>
                                                            <CardContent className="relative z-10">
                                                                <div className="relative h-80 w-full overflow-hidden rounded-lg border border-white/10 bg-black/50 p-6">
                                                                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900/20 via-transparent to-transparent"></div>
                                                                    <div className="relative z-10 flex h-full items-center justify-center">
                                                                        <div className="space-y-2 text-center">
                                                                            <div className="inline-block rounded-full bg-white/5 px-3 py-1 text-sm text-indigo-300 backdrop-blur">
                                                                                <span className="mr-2 inline-block h-2 w-2 rounded-full bg-indigo-400"></span>
                                                                                Interactive Chart
                                                                            </div>
                                                                            <p className="text-white/40">Visualization would appear here</p>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </CardContent>
                                                        </Card>
                                                    </motion.div>

                                                    <motion.div
                                                        initial={{ opacity: 0, y: 20 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        transition={{ duration: animations ? 0.3 : 0, delay: animations ? 0.5 : 0 }}
                                                        className="lg:col-span-3"
                                                    >
                                                        <Card
                                                            className={`border-white/10 bg-black/30 ${blurEffects ? "backdrop-blur-sm" : ""} shadow-xl h-full overflow-hidden relative group`}
                                                        >
                                                            <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                                            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                                            <CardHeader className="relative z-10">
                                                                <CardTitle className="text-white">Recent Discoveries</CardTitle>
                                                                <CardDescription className="text-white/60">Newly discovered exoplanets</CardDescription>
                                                            </CardHeader>
                                                            <CardContent className="relative z-10">
                                                                <div className="space-y-6">
                                                                    {[
                                                                        { name: "Kepler-452b", type: "Super Earth", distance: "2 days ago", score: 0.82 },
                                                                        { name: "TRAPPIST-1e", type: "Earth-like", distance: "5 days ago", score: 0.91 },
                                                                        { name: "HD 219134 b", type: "Rocky", distance: "1 week ago", score: 0.67 },
                                                                        { name: "K2-18b", type: "Mini-Neptune", distance: "2 weeks ago", score: 0.75 },
                                                                    ].map((planet, index) => (
                                                                        <PlanetCard
                                                                            key={planet.name}
                                                                            name={planet.name}
                                                                            type={planet.type}
                                                                            distance={planet.distance}
                                                                            habitabilityScore={planet.score}
                                                                            index={index}
                                                                            score={planet.score}
                                                                        />
                                                                    ))}
                                                                </div>
                                                            </CardContent>
                                                        </Card>
                                                    </motion.div>
                                                </div>
                                            </TabsContent>
                                        )}

                                        {activeTab === "habitability" && (
                                            <TabsContent value="habitability" className="space-y-4 mt-0">
                                                <motion.div
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ duration: animations ? 0.3 : 0 }}
                                                >
                                                    <Card
                                                        className={`border-white/10 bg-black/30 ${blurEffects ? "backdrop-blur-sm" : ""} shadow-xl overflow-hidden relative group`}
                                                    >
                                                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                                        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                                        <CardHeader className="relative z-10">
                                                            <CardTitle className="text-white">Habitability Analysis</CardTitle>
                                                            <CardDescription className="text-white/60">
                                                                AI-powered assessment of exoplanet habitability
                                                            </CardDescription>
                                                        </CardHeader>
                                                        <CardContent className="relative z-10">
                                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative h-96 w-full overflow-hidden rounded-lg border border-white/10 bg-black/50 p-6">
                                                                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900/20 via-transparent to-transparent"></div>

                                                                <div className="relative z-10 flex flex-col justify-center space-y-6">
                                                                    <div className="inline-block rounded-full bg-white/5 px-3 py-1 text-sm text-indigo-300 backdrop-blur w-fit">
                                                                        <span className="mr-2 inline-block h-2 w-2 rounded-full bg-indigo-400"></span>
                                                                        Habitability Factors
                                                                    </div>
                                                                    <div className="w-full space-y-4">
                                                                        {[
                                                                            { name: "Atmospheric Composition", value: 78 },
                                                                            { name: "Surface Temperature", value: 65 },
                                                                            { name: "Liquid Water", value: 92 },
                                                                            { name: "Gravity", value: 84 },
                                                                        ].map((factor, index) => (
                                                                            <motion.div
                                                                                key={factor.name}
                                                                                initial={{ opacity: 0, x: -20 }}
                                                                                animate={{ opacity: 1, x: 0 }}
                                                                                transition={{ duration: 0.3, delay: index * 0.1 }}
                                                                                className="space-y-2"
                                                                            >
                                                                                <div className="flex items-center justify-between">
                                                                                    <span className="text-sm text-white/70">{factor.name}</span>
                                                                                    <span className="text-sm font-medium text-white">{factor.value}%</span>
                                                                                </div>
                                                                                <div className="relative h-2 w-full overflow-hidden rounded-full bg-white/10">
                                                                                    <motion.div
                                                                                        initial={{ width: 0 }}
                                                                                        animate={{ width: `${factor.value}%` }}
                                                                                        transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                                                                                        className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600"
                                                                                    />
                                                                                </div>
                                                                            </motion.div>
                                                                        ))}
                                                                    </div>
                                                                </div>

                                                                <motion.div
                                                                    initial={{ opacity: 0, scale: 0.9 }}
                                                                    animate={{ opacity: 1, scale: 1 }}
                                                                    transition={{ duration: 0.5, delay: 1 }}
                                                                    className="flex items-center justify-center"
                                                                >
                                                                    <div className="relative h-48 w-48 rounded-full">
                                                                        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-500/20 to-purple-500/20 blur-md"></div>
                                                                        <div className="absolute inset-2 rounded-full border border-white/20 bg-black"></div>
                                                                        <div className="absolute inset-0 flex items-center justify-center">
                                                                            <div className="text-center">
                                                                                <div className="text-4xl font-bold bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">
                                                                                    79%
                                                                                </div>
                                                                                <div className="text-sm text-white/60">
                                                                                    Habitability
                                                                                    <br />
                                                                                    Score
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        <svg className="absolute inset-0" width="192" height="192" viewBox="0 0 192 192">
                                                                            <circle
                                                                                cx="96"
                                                                                cy="96"
                                                                                r="88"
                                                                                fill="none"
                                                                                stroke="url(#gradient-hab)"
                                                                                strokeWidth="6"
                                                                                strokeDasharray="553"
                                                                                strokeDashoffset="116"
                                                                                strokeLinecap="round"
                                                                            />
                                                                            <defs>
                                                                                <linearGradient id="gradient-hab" x1="0%" y1="0%" x2="100%" y2="0%">
                                                                                    <stop offset="0%" stopColor="#8B5CF6" />
                                                                                    <stop offset="100%" stopColor="#D946EF" />
                                                                                </linearGradient>
                                                                            </defs>
                                                                        </svg>
                                                                    </div>
                                                                </motion.div>
                                                            </div>
                                                        </CardContent>
                                                    </Card>
                                                </motion.div>
                                            </TabsContent>
                                        )}

                                        {activeTab === "terraforming" && (
                                            <TabsContent value="terraforming" className="space-y-4 mt-0">
                                                <motion.div
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ duration: 0.3 }}
                                                >
                                                    <Card
                                                        className={`border-white/10 bg-black/30 ${blurEffects ? "backdrop-blur-sm" : ""} shadow-xl overflow-hidden relative group`}
                                                    >
                                                        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                                        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                                        <CardHeader className="relative z-10">
                                                            <CardTitle className="text-white">Terraforming Potential</CardTitle>
                                                            <CardDescription className="text-white/60">
                                                                Assessment of exoplanet terraforming capabilities
                                                            </CardDescription>
                                                        </CardHeader>
                                                        <CardContent className="relative z-10">
                                                            <div className="relative h-96 w-full overflow-hidden rounded-lg border border-white/10 bg-black/50 p-6">
                                                                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-transparent to-transparent"></div>
                                                                <div className="relative z-10 grid h-full grid-cols-1 md:grid-cols-2 gap-8 items-center">
                                                                    <motion.div
                                                                        initial={{ opacity: 0, x: -20 }}
                                                                        animate={{ opacity: 1, x: 0 }}
                                                                        transition={{ duration: 0.5 }}
                                                                        className="space-y-6"
                                                                    >
                                                                        <div className="inline-block rounded-full bg-white/5 px-3 py-1 text-sm text-purple-300 backdrop-blur">
                                                                            <span className="mr-2 inline-block h-2 w-2 rounded-full bg-purple-400"></span>
                                                                            Terraforming Requirements
                                                                        </div>
                                                                        <div className="space-y-4">
                                                                            {[
                                                                                { name: "Resource Availability", value: "High", color: "text-green-400" },
                                                                                { name: "Geological Stability", value: "Medium", color: "text-yellow-400" },
                                                                                {
                                                                                    name: "Atmospheric Modification",
                                                                                    value: "Complex",
                                                                                    color: "text-orange-400",
                                                                                },
                                                                                { name: "Energy Requirements", value: "Very High", color: "text-red-400" },
                                                                                { name: "Estimated Timeline", value: "150-200 Years", color: "text-blue-400" },
                                                                            ].map((item, index) => (
                                                                                <motion.div
                                                                                    key={index}
                                                                                    initial={{ opacity: 0, x: -20 }}
                                                                                    animate={{ opacity: 1, x: 0 }}
                                                                                    transition={{ duration: 0.3, delay: index * 0.1 }}
                                                                                    className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 p-3 hover:bg-white/10 transition-colors duration-300"
                                                                                >
                                                                                    <span className="text-sm text-white/70">{item.name}</span>
                                                                                    <span className={`text-sm font-medium ${item.color}`}>{item.value}</span>
                                                                                </motion.div>
                                                                            ))}
                                                                        </div>
                                                                    </motion.div>
                                                                    <motion.div
                                                                        initial={{ opacity: 0, scale: 0.9 }}
                                                                        animate={{ opacity: 1, scale: 1 }}
                                                                        transition={{ duration: 0.5, delay: 0.5 }}
                                                                        className="flex items-center justify-center"
                                                                    >
                                                                        <div className="relative h-48 w-48 rounded-full">
                                                                            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-500/20 to-purple-500/20 blur-md"></div>
                                                                            <div className="absolute inset-2 rounded-full border border-white/20 bg-black"></div>
                                                                            <div className="absolute inset-0 flex items-center justify-center">
                                                                                <div className="text-center">
                                                                                    <div className="text-4xl font-bold bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">
                                                                                        76%
                                                                                    </div>
                                                                                    <div className="text-sm text-white/60">
                                                                                        Terraforming
                                                                                        <br />
                                                                                        Potential
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                            <svg className="absolute inset-0" width="192" height="192" viewBox="0 0 192 192">
                                                                                <circle
                                                                                    cx="96"
                                                                                    cy="96"
                                                                                    r="88"
                                                                                    fill="none"
                                                                                    stroke="url(#gradient)"
                                                                                    strokeWidth="6"
                                                                                    strokeDasharray="553"
                                                                                    strokeDashoffset="133"
                                                                                    strokeLinecap="round"
                                                                                />
                                                                                <defs>
                                                                                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                                                                        <stop offset="0%" stopColor="#8B5CF6" />
                                                                                        <stop offset="100%" stopColor="#D946EF" />
                                                                                    </linearGradient>
                                                                                </defs>
                                                                            </svg>
                                                                        </div>
                                                                    </motion.div>
                                                                </div>
                                                            </div>
                                                        </CardContent>
                                                    </Card>
                                                </motion.div>
                                            </TabsContent>
                                        )}
                                    </motion.div>
                                </AnimatePresence>
                            </Tabs>
                        </motion.div>
                    </div>
                </main>
            </div>
        </div>
    )
}

