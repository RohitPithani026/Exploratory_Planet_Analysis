"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { BarChart3, ChevronRight, Globe, Menu, Search, Star, User, Rocket, RefreshCw } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

import { ParticleBackground } from "@/components/particle-background"
import { SpaceBackground } from "@/components/space-background"
import { PlanetCard } from "@/components/planet-card"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { useTheme } from "@/components/theme-provider"
import { useToast } from "@/hooks/use-toast"
import ExoplanetComparison from "@/components/exoplanet-comparison"

type Exoplanet = {
    pl_name: string
    pl_rade?: number | null
    pl_bmasse?: number | null
    pl_orbper?: number | null
    pl_eqt?: number | null
    st_teff?: number | null
    st_mass?: number | null
    st_rad?: number | null
    st_met?: number | null
    pl_eqt_normalized?: number | null
    st_met_normalized?: number | null
    surface_gravity?: number | null
    surface_gravity_normalized?: number | null
    habitability_score?: number | null
    terraformability_score?: number | null
    st_activity?: number | null
    pl_atmos?: number | null
    pl_surf_temp?: number | null
    pl_escape_vel?: number | null
    pl_radiation_flux?: number | null
    ESI?: number | null
    pl_water_probability?: number | null
    [key: string]: string | number | null | undefined
}

export default function Dashboard() {
    const { data: session } = useSession()
    const { theme, animations, particleEffects, blurEffects } = useTheme()
    const { toast } = useToast()
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [progress, setProgress] = useState(13)
    const [isLoading, setIsLoading] = useState(true)
    const [activeTab, setActiveTab] = useState("overview")
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
    const [exoplanets, setExoplanets] = useState<Exoplanet[]>([])
    const [searchQuery, setSearchQuery] = useState("")
    const [sortBy] = useState<string | null>(null)
    const [sortOrder] = useState<"asc" | "desc">("desc")
    const [filteredPlanets, setFilteredPlanets] = useState<Exoplanet[]>([])
    const [isSearching, setIsSearching] = useState(false)
    const [statistics, setStatistics] = useState({
        totalPlanets: 0,
        habitablePlanets: 0,
        terraformablePlanets: 0,
        dataAccuracy: 0,
    })

    const containerRef = useRef<HTMLDivElement>(null)

    // Calculate statistics from exoplanet data
    const calculateStatistics = (planets: Exoplanet[]) => {
        if (!planets || planets.length === 0)
            return {
                totalPlanets: 0,
                habitablePlanets: 0,
                terraformablePlanets: 0,
                dataAccuracy: 0,
            }

        const habitablePlanets = planets.filter(
            (planet) =>
                planet.habitability_score !== undefined &&
                planet.habitability_score !== null &&
                Number(planet.habitability_score) > 50,
        ).length

        const terraformablePlanets = planets.filter(
            (planet) =>
                planet.terraformability_score !== undefined &&
                planet.terraformability_score !== null &&
                Number(planet.terraformability_score) > 60,
        ).length

        // Calculate data accuracy (percentage of planets with complete data)
        const planetsWithCompleteData = planets.filter(
            (planet) =>
                planet.pl_rade !== undefined &&
                planet.pl_rade !== null &&
                planet.pl_bmasse !== undefined &&
                planet.pl_bmasse !== null &&
                planet.habitability_score !== undefined &&
                planet.habitability_score !== null,
        ).length

        const dataAccuracy = (planetsWithCompleteData / planets.length) * 100

        return {
            totalPlanets: planets.length,
            habitablePlanets,
            terraformablePlanets,
            dataAccuracy: Math.round(dataAccuracy * 10) / 10,
        }
    }

    // Fetch exoplanet data
    useEffect(() => {
        const fetchExoplanets = async () => {
            try {
                setIsLoading(true)
                const response = await fetch("/api/data")
                if (!response.ok) {
                    throw new Error("Failed to fetch exoplanet data")
                }
                const data = await response.json()
                setExoplanets(data)

                // Calculate statistics
                const stats = calculateStatistics(data)
                setStatistics(stats)

                // Store total count in localStorage for reference
                localStorage.setItem("totalExpoPlanets", data.length.toString())

                // Set initial filtered planets
                setFilteredPlanets(data.slice(0, 10)) // Show first 10 by default
                setIsLoading(false)
            } catch (error) {
                console.error("Error fetching exoplanet data:", error)
                setIsLoading(false)
                toast({
                    title: "Error",
                    description: "Failed to load exoplanet data. Please try again later.",
                    variant: "destructive",
                })
            }
        }

        fetchExoplanets()
    }, [toast])

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

    const handleTabChange = (value: string) => {
        setActiveTab(value)
    }

    useEffect(() => {
        // Filter planets based on search query
        if (searchQuery.trim() === "") {
            setIsSearching(false)
            setFilteredPlanets(exoplanets.slice(0, 10)) // Show first 10 when not searching
            return
        }

        setIsSearching(true)
        const filtered = exoplanets.filter((planet) => planet.pl_name.toLowerCase().includes(searchQuery.toLowerCase()))

        // Sort planets if sortBy is set
        if (sortBy) {
            filtered.sort((a, b) => {
                const aValue = a[sortBy as keyof Exoplanet]
                const bValue = b[sortBy as keyof Exoplanet]

                // Handle null values
                if (aValue === null && bValue === null) return 0
                if (aValue === null) return 1
                if (bValue === null) return -1

                // Sort based on sortOrder
                return sortOrder === "asc"
                    ? Number(aValue) < Number(bValue)
                        ? -1
                        : 1
                    : Number(aValue) > Number(bValue)
                        ? -1
                        : 1
            })
        }

        setFilteredPlanets(filtered.slice(0, 20)) // Limit to 20 results for performance
    }, [exoplanets, searchQuery, sortBy, sortOrder])

    // Function to get planet type based on data
    const getPlanetType = (planet: Exoplanet) => {
        if (!planet.pl_rade) return "Unknown"

        if (planet.pl_rade < 0.5) return "Sub-Earth"
        if (planet.pl_rade < 1.6) return "Earth-like"
        if (planet.pl_rade < 4) return "Super-Earth"
        if (planet.pl_rade < 10) return "Neptune-like"
        return "Gas Giant"
    }

    // Function to calculate habitability score if not present
    const getHabitabilityScore = (planet: Exoplanet) => {
        if (planet.habitability_score !== null && planet.habitability_score !== undefined) {
            return Number(planet.habitability_score)
        }

        // Simple fallback calculation
        let score = 0.5 // Default middle score

        // Adjust based on available data
        if (planet.ESI) {
            score = Number(planet.ESI)
        } else if (planet.pl_eqt) {
            // Temperature factor (Earth-like temperatures score higher)
            const temp = Number(planet.pl_eqt)
            if (temp > 200 && temp < 320) {
                score += 0.2
            } else if (temp > 150 && temp < 380) {
                score += 0.1
            } else {
                score -= 0.1
            }
        }

        return Math.min(Math.max(score, 0.1), 0.99) // Keep between 0.1 and 0.99
    }

    // Function to calculate terraformability score if not present
    const getTerraformabilityScore = (planet: Exoplanet) => {
        if (planet.terraformability_score !== null && planet.terraformability_score !== undefined) {
            return Number(planet.terraformability_score)
        }

        // Simple fallback calculation
        let score = 0.6 // Default middle score

        // Adjust based on available data
        if (planet.pl_rade) {
            const radius = Number(planet.pl_rade)
            // Planets closer to Earth size are easier to terraform
            if (radius > 0.8 && radius < 1.5) {
                score += 0.2
            } else if (radius > 0.5 && radius < 2) {
                score += 0.1
            } else if (radius > 3) {
                score -= 0.2
            }
        }

        return Math.min(Math.max(score, 0.1), 0.99) // Keep between 0.1 and 0.99
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
                        className="container flex h-16 items-center justify-between p-4 md:p-8"
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
                                    <div className="flex flex-col sm:flex-row gap-4">
                                        <div className="relative">
                                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-white/50" />
                                            <Input
                                                type="search"
                                                placeholder="Search exoplanets..."
                                                className="w-full sm:w-[300px] bg-white/5 border-white/10 pl-8 text-white placeholder:text-white/50"
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                            />
                                        </div>

                                        {searchQuery && (
                                            <Button
                                                variant="outline"
                                                className="border-white/10 bg-white/5 text-white hover:bg-white/10"
                                                onClick={() => setSearchQuery("")}
                                            >
                                                <RefreshCw className="h-4 w-4 mr-2" />
                                                Clear
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </form>

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
                                                {session?.user?.name?.charAt(0) || "U"}
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
                                                {session?.user?.name?.charAt(0) || "U"}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="space-y-1 flex-1">
                                            <h4 className="text-sm font-semibold">{session?.user?.name || "John Doe"}</h4>
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
                            {/* Mobile search bar */}
                            <div className="md:hidden w-full mb-4">
                                <div className="relative">
                                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-white/50" />
                                    <Input
                                        type="search"
                                        placeholder="Search exoplanets..."
                                        className="w-full bg-white/5 border-white/10 pl-8 text-white placeholder:text-white/50"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                                <div>
                                    <h1 className="bg-gradient-to-r from-white to-indigo-200 bg-clip-text text-3xl font-bold tracking-tighter text-transparent">
                                        Dashboard
                                    </h1>
                                    <p className="text-white/60">Welcome back, explore the latest exoplanet data</p>
                                </div>
                            </div>

                            {/* Search Results Section */}
                            {isSearching && (
                                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
                                    <Card className="border-white/10 bg-black/30 backdrop-blur-sm">
                                        <CardHeader className="pb-3">
                                            <CardTitle className="text-white flex items-center justify-between">
                                                <span>Search Results</span>
                                                <span className="text-sm font-normal text-white/60">
                                                    {filteredPlanets.length} {filteredPlanets.length === 1 ? "result" : "results"}
                                                </span>
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                                {filteredPlanets.length > 0 ? (
                                                    filteredPlanets.map((planet, index) => (
                                                        <Link
                                                            href={`/dashboard/exoplanet/${encodeURIComponent(planet.pl_name)}`}
                                                            key={planet.pl_name}
                                                        >
                                                            <PlanetCard
                                                                name={planet.pl_name}
                                                                type={getPlanetType(planet)}
                                                                habitabilityScore={Math.round(getHabitabilityScore(planet))}
                                                                terraformabilityScore={Math.round(getTerraformabilityScore(planet))}
                                                                index={index}
                                                            />
                                                        </Link>
                                                    ))
                                                ) : (
                                                    <div className="col-span-full flex flex-col items-center justify-center py-8 text-center">
                                                        <Globe className="h-12 w-12 text-white/20 mb-4" />
                                                        <h3 className="text-lg font-medium text-white">No planets found</h3>
                                                        <p className="text-white/60 mt-1">Try a different search term</p>
                                                    </div>
                                                )}
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            )}

                            <Tabs defaultValue="overview" className="space-y-4 " value={activeTab} onValueChange={handleTabChange}>
                            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 gap-1 full border border-white/10 bg-white/5 p-1">
                                    <TabsTrigger
                                        value="overview"
                                        className="full data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-purple-600 data-[state=active]:text-white transition-all duration-300"
                                    >
                                        Overview
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="habitability"
                                        className="full data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-purple-600 data-[state=active]:text-white transition-all duration-300"
                                    >
                                        Habitability
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="terraforming"
                                        className="full data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-purple-600 data-[state=active]:text-white transition-all duration-300"
                                    >
                                        Terraforming
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="compare-exoplanets"
                                        className="full data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-purple-600 data-[state=active]:text-white transition-all duration-300"
                                    >
                                        Compare Exoplanets
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
                                                            value: statistics.totalPlanets.toLocaleString(),
                                                            icon: <Globe className="h-4 w-4 text-indigo-400" />,
                                                            color: "indigo",
                                                        },
                                                        {
                                                            title: "Habitable Planets",
                                                            value: statistics.habitablePlanets.toLocaleString(),
                                                            icon: <Star className="h-4 w-4 text-green-400" />,
                                                            color: "green",
                                                        },
                                                        {
                                                            title: "Terraformable Planets",
                                                            value: statistics.terraformablePlanets.toLocaleString(),
                                                            icon: <Rocket className="h-4 w-4 text-purple-400" />,
                                                            color: "purple",
                                                        },
                                                        {
                                                            title: "Data Accuracy",
                                                            value: `${statistics.dataAccuracy}%`,
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
                                                                    {filteredPlanets.slice(0, 4).map((planet, index) => (
                                                                        <Link
                                                                            href={`/dashboard/exoplanet/${encodeURIComponent(planet.pl_name)}`}
                                                                            key={planet.pl_name}
                                                                        >
                                                                            <div className="p-2">
                                                                                <PlanetCard
                                                                                    name={planet.pl_name}
                                                                                    type={getPlanetType(planet)}
                                                                                    habitabilityScore={getHabitabilityScore(planet)}
                                                                                    terraformabilityScore={getTerraformabilityScore(planet)}
                                                                                    index={index}
                                                                                />
                                                                            </div>
                                                                        </Link>
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
                                        {activeTab === "compare-exoplanets" && (
                                            <TabsContent value="compare-exoplanets" className="space-y-4 mt-0">
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
                                                            <CardTitle className="text-white">Exoplanet Comparison Tool</CardTitle>
                                                            <CardDescription className="text-white/60">
                                                                Explore and compare the physical properties, habitability,
                                                                and stellar characteristics of exoplanets discovered across
                                                                our galaxy.
                                                            </CardDescription>
                                                        </CardHeader>
                                                        <CardContent className="relative z-10">
                                                            <ExoplanetComparison />
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

