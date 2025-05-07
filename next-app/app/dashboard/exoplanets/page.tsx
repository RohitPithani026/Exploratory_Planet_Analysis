"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SpaceBackground } from "@/components/space-background"
import { ParticleBackground } from "@/components/particle-background"
import { useTheme } from "@/components/theme-provider"
import {
    Search,
    Globe, Star,
    Thermometer,
    Scale, Ruler,
    ArrowUpDown,
    RefreshCw,
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useSession } from "next-auth/react"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"

type Exoplanet = {
    pl_name: string
    pl_rade: number | null
    pl_bmasse: number | null
    pl_orbper: number | null
    pl_eqt: number | null
    st_teff: number | null
    st_mass: number | null
    st_rad: number | null
    st_met: number | null
    pl_eqt_normalized: number | null;
    st_met_normalized: number | null;
    surface_gravity: number | null;
    surface_gravity_normalized: number | null;
    habitability_score: number | null;
    terraformability_score: number | null;
    st_activity: number | null;
    pl_atmos: number | null;
    pl_surf_temp: number | null;
    pl_escape_vel: number | null;
    pl_radiation_flux: number | null;
    ESI: number | null;
    pl_water_probability: number | null;

}

type PaginationInfo = {
    page: number
    pageSize: number
    totalItems: number
    totalPages: number
    hasNextPage: boolean
    hasPrevPage: boolean
}

type ApiResponse = {
    data: Exoplanet[]
    pagination: PaginationInfo
    error?: string
}

export default function ExoplanetsPage() {
    const [exoplanets, setExoplanets] = useState<Exoplanet[]>([])
    const [filteredPlanets, setFilteredPlanets] = useState<Exoplanet[]>([])
    const [pagination, setPagination] = useState<PaginationInfo>({
        page: 1,
        pageSize: 20,
        totalItems: 0,
        totalPages: 0,
        hasNextPage: false,
        hasPrevPage: false,
    })
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [error, setError] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState("")
    const [sortBy, setSortBy] = useState<string | null>(null)
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
    const { particleEffects, blurEffects, animations } = useTheme()
    const { data: session } = useSession()
    const [theme] = useState<"light" | "dark">("dark")
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
    const { toast } = useToast()
    const containerRef = useRef<HTMLDivElement>(null)

    const ExpoPlanets = localStorage.setItem("totalExpoPlanets", pagination.totalItems.toLocaleString())
    console.log(ExpoPlanets)

    const fetchExoplanets = async (page: number, pageSize: number) => {
        try {
            setIsLoading(true)
            // Use our proxy API instead of directly calling the NASA API
            const response = await fetch(`/api/exoplanets?page=${page}&pageSize=${pageSize}`)

            if (!response.ok) {
                throw new Error(`API responded with status: ${response.status}`)
            }

            const data: ApiResponse = await response.json()

            if (data.error) {
                throw new Error(data.error)
            }

            // Filter out planets with missing essential data
            const validPlanets = data.data
                .filter((planet: Exoplanet) =>
                    planet.pl_name &&
                    (typeof planet.pl_rade === "number" || typeof planet.pl_bmasse === "number")
                )
                .slice(0, 100);


            setExoplanets(validPlanets)
            setFilteredPlanets(validPlanets)
            setIsLoading(false)
            setPagination(data.pagination)
            setError(null)
        } catch (error) {
            console.error("Error fetching exoplanets:", error)
            toast({
                title: "Error",
                description: "Failed to fetch exoplanet data. Please try again later.",
                variant: "destructive",
            })
            setIsLoading(false)
        }
    }

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

    useEffect(() => {
        fetchExoplanets(pagination.page, pagination.pageSize)
    }, [pagination.page])


    // Handle page changes
    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= pagination.totalPages) {
            fetchExoplanets(newPage, pagination.pageSize)
        }
    }

    // Handle page size changes
    const handlePageSizeChange = (newPageSize: number) => {
        fetchExoplanets(1, newPageSize)
    }

    useEffect(() => {
        // Filter planets based on search query
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
                return sortOrder === "asc" ? (aValue < bValue ? -1 : 1) : aValue > bValue ? -1 : 1
            })
        }

        setFilteredPlanets(filtered)
    }, [exoplanets, searchQuery, sortBy, sortOrder])

    const handleSort = (field: string) => {
        if (sortBy === field) {
            // Toggle sort order if clicking the same field
            setSortOrder(sortOrder === "asc" ? "desc" : "asc")
        } else {
            // Set new sort field and default to descending
            setSortBy(field)
            setSortOrder("desc")
        }
    }

    const getPlanetType = (planet: Exoplanet) => {
        if (!planet.pl_rade) return "Unknown"

        if (planet.pl_rade < 0.5) return "Sub-Earth"
        if (planet.pl_rade < 1.6) return "Earth-like"
        if (planet.pl_rade < 4) return "Super-Earth"
        if (planet.pl_rade < 10) return "Neptune-like"
        return "Gas Giant"
    }

    const getStarType = (planet: Exoplanet) => {
        if (!planet.st_teff) return "Unknown"

        if (planet.st_teff > 30000) return "O-type"
        if (planet.st_teff > 10000) return "B-type"
        if (planet.st_teff > 7500) return "A-type"
        if (planet.st_teff > 6000) return "F-type"
        if (planet.st_teff > 5200) return "G-type (Sun-like)"
        if (planet.st_teff > 3700) return "K-type"
        return "M-type (Red Dwarf)"
    }

    const getBadgeColor = (type: string) => {
        switch (type) {
            case "Earth-like":
                return "bg-green-500/20 text-green-400 border-green-500/30"
            case "Super-Earth":
                return "bg-blue-500/20 text-blue-400 border-blue-500/30"
            case "Neptune-like":
                return "bg-indigo-500/20 text-indigo-400 border-indigo-500/30"
            case "Gas Giant":
                return "bg-purple-500/20 text-purple-400 border-purple-500/30"
            case "Sub-Earth":
                return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
            default:
                return "bg-gray-500/20 text-gray-400 border-gray-500/30"
        }
    }

    const getHabitabilityColor = (score: number) => {
        if (score > 70) return "text-green-400"
        if (score > 50) return "text-blue-400"
        if (score > 30) return "text-yellow-400"
        if (score > 10) return "text-orange-400"
        return "text-red-400"
    }

    return (
        <div className={theme === "dark" ? "dark" : ""} ref={containerRef}>
            <div className="relative min-h-screen bg-[#030014]">
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
                        transition={{ duration: 0.5 }}
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
                                    className="font-medium text-white transition-colors hover:text-indigo-300 relative group"
                                >
                                    Exoplanets
                                    <span className="absolute -bottom-1 left-0 h-0.5 w-full bg-gradient-to-r from-indigo-500 to-purple-600 transition-all duration-300"></span>
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

                <div className="container py-6 space-y-8 relative z-10 pr-8 pl-8">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight text-white">Exoplanets</h1>
                            <p className="text-white/60">Exploring {pagination.totalItems.toLocaleString()} exoplanets from NASA&apos;s Exoplanet Archive</p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="relative">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-white/50" />
                                <Input
                                    type="search"
                                    placeholder="Search planets..."
                                    className="w-full sm:w-[500px] bg-white/5 border-white/10 pl-8 text-white placeholder:text-white/50"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>

                            <Button
                                variant="outline"
                                className="border-white/10 bg-white/5 text-white hover:bg-white/10"
                                onClick={() => {
                                    setSortBy(null)
                                    setSearchQuery("")
                                }}
                            >
                                <RefreshCw className="mr-2 h-4 w-4" />
                                Reset Filters
                            </Button>
                        </div>
                    </div>

                    {/* Page size selector */}
                    <div className="flex justify-end mb-4">
                        <div className="flex items-center gap-2">
                            <label htmlFor="pageSize" className="text-sm text-white/80">
                                Planets per page:
                            </label>
                            <select
                                id="pageSize"
                                className="border border-white/20 rounded p-[2px] px-3 bg-[#111111] text-white/80 text-sm hover:bg-[#1a1a1a] focus:outline-none focus:ring-2 focus:ring-white/40"
                                value={pagination.pageSize}
                                onChange={(e) => handlePageSizeChange(Number(e.target.value))}
                                disabled={isLoading}
                            >
                                {[10, 20, 50, 100].map((size) => (
                                    <option key={size} value={size} className="text-sm">
                                        {size}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <Tabs defaultValue="all" className="space-y-6">
                        <TabsList className="grid w-full grid-cols-3 bg-white/5 border border-white/10 p-0.5">
                            <TabsTrigger
                                value="all"
                                className="data-[state=active]:bg-white/10 data-[state=active]:text-white text-white/70"
                            >
                                All Planets
                            </TabsTrigger>
                            <TabsTrigger
                                value="habitable"
                                className="data-[state=active]:bg-white/10 data-[state=active]:text-white text-white/70"
                            >
                                Potentially Habitable
                            </TabsTrigger>
                            <TabsTrigger
                                value="earth-like"
                                className="data-[state=active]:bg-white/10 data-[state=active]:text-white text-white/70"
                            >
                                Earth-like
                            </TabsTrigger>
                        </TabsList>

                        <div className="flex flex-wrap gap-2 mb-4">
                            <Badge
                                variant="outline"
                                className={`cursor-pointer rounded-full border border-white/20 text-white/100 px-4 py-2 flex items-center gap-1 ${sortBy === "pl_rade" ? "bg-[#121217] text-white" : "bg-transparent"}`}
                                onClick={() => handleSort("pl_rade")}
                            >
                                <Ruler className="h-2 w-2" />
                                Radius {sortBy === "pl_rade" && (sortOrder === "asc" ? "↑" : "↓")}
                            </Badge>
                            <Badge
                                variant="outline"
                                className={`cursor-pointer rounded-full border border-white/20 text-white/100 px-4 py-2 flex items-center gap-1 ${sortBy === "pl_bmasse" ? "bg-[#121217] text-white" : "bg-transparent"}`}
                                onClick={() => handleSort("pl_bmasse")}
                            >
                                <Scale className="h-2 w-2" />
                                Mass {sortBy === "pl_bmasse" && (sortOrder === "asc" ? "↑" : "↓")}
                            </Badge>
                            <Badge
                                variant="outline"
                                className={`cursor-pointer rounded-full border border-white/20 text-white/100 px-4 py-2 flex items-center gap-1 ${sortBy === "pl_orbper" ? "bg-[#121217] text-white" : "bg-transparent"}`}
                                onClick={() => handleSort("pl_orbper")}
                            >
                                <ArrowUpDown className="h-2 w-2" />
                                Orbital Period {sortBy === "pl_orbper" && (sortOrder === "asc" ? "↑" : "↓")}
                            </Badge>
                            <Badge
                                variant="outline"
                                className={`cursor-pointer rounded-full border border-white/20 text-white/100 px-4 py-2 flex items-center gap-1 ${sortBy === "pl_eqt" ? "bg-[#121217] text-white" : "bg-transparent"}`}
                                onClick={() => handleSort("pl_eqt")}
                            >
                                <Thermometer className="h-2 w-2" />
                                Temperature {sortBy === "pl_eqt" && (sortOrder === "asc" ? "↑" : "↓")}
                            </Badge>
                        </div>


                        <TabsContent value="all" className="mt-0">
                            {isLoading ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                    {Array.from({ length: 12 }).map((_, i) => (
                                        <Card key={i} className="bg-black/40 border-white/10">
                                            <CardHeader className="pb-2">
                                                <Skeleton className="h-4 w-3/4 bg-white/5" />
                                                <Skeleton className="h-3 w-1/2 bg-white/5 mt-2" />
                                            </CardHeader>
                                            <CardContent className="space-y-4">
                                                <Skeleton className="h-3 w-full bg-white/5" />
                                                <Skeleton className="h-3 w-full bg-white/5" />
                                                <Skeleton className="h-3 w-3/4 bg-white/5" />
                                            </CardContent>
                                            <CardFooter>
                                                <Skeleton className="h-8 w-full bg-white/5" />
                                            </CardFooter>
                                        </Card>
                                    ))}
                                </div>
                            ) : filteredPlanets.length === 0 ? (
                                <div className="text-center py-12">
                                    <Globe className="mx-auto h-12 w-12 text-white/20" />
                                    <h3 className="mt-4 text-lg font-medium text-white">No planets found</h3>
                                    <p className="mt-2 text-white/60">Try adjusting your search or filters</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                    {filteredPlanets.map((planet, index) => {
                                        const habitabilityScore = planet.habitability_score
                                        const planetType = getPlanetType(planet)
                                        const starType = getStarType(planet)

                                        return (
                                            <motion.div
                                                key={planet.pl_name}
                                                initial={animations ? { opacity: 0, y: 20 } : false}
                                                animate={animations ? { opacity: 1, y: 0 } : {}}
                                                transition={{ duration: 0.3, delay: index * 0.05 }}
                                            >
                                                <Card
                                                    className={`bg-black/40 border-white/10 text-white overflow-hidden ${blurEffects ? "backdrop-blur-sm" : ""} h-full flex flex-col`}
                                                >
                                                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/10 via-purple-900/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                                                    <CardHeader className="pb-2 relative z-10">
                                                        <div className="flex justify-between items-start">
                                                            <div>
                                                                <CardTitle className="text-lg font-bold text-white">{planet.pl_name}</CardTitle>
                                                                <CardDescription className="text-white/60">{starType} Star System</CardDescription>
                                                            </div>
                                                            <Badge className={getBadgeColor(planetType)}>{planetType}</Badge>
                                                        </div>
                                                    </CardHeader>

                                                    <CardContent className="space-y-4 flex-grow relative z-10">
                                                        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                                                            <div className="space-y-1">
                                                                <p className="text-white/50">Radius</p>
                                                                <p className="font-medium">
                                                                    {planet.pl_rade !== null ? `${planet.pl_rade.toFixed(2)} R⊕` : "Unknown"}
                                                                </p>
                                                            </div>
                                                            <div className="space-y-1">
                                                                <p className="text-white/50">Mass</p>
                                                                <p className="font-medium">
                                                                    {planet.pl_bmasse !== null ? `${planet.pl_bmasse.toFixed(2)} M⊕` : "Unknown"}
                                                                </p>
                                                            </div>
                                                            <div className="space-y-1">
                                                                <p className="text-white/50">Orbital Period</p>
                                                                <p className="font-medium">
                                                                    {planet.pl_orbper !== null ? `${planet.pl_orbper.toFixed(1)} days` : "Unknown"}
                                                                </p>
                                                            </div>
                                                            <div className="space-y-1">
                                                                <p className="text-white/50">Temperature</p>
                                                                <p className="font-medium">
                                                                    {planet.pl_eqt !== null ? `${planet.pl_eqt.toFixed(0)} K` : "Unknown"}
                                                                </p>
                                                            </div>
                                                        </div>

                                                        <div className="pt-2">
                                                            <div className="flex justify-between items-center mb-1">
                                                                <span className="text-xs text-white/70">Habitability Score</span>
                                                                <span className={`text-xs font-medium ${getHabitabilityColor(habitabilityScore!)}`}>
                                                                    {planet.habitability_score?.toFixed(0)} %
                                                                </span>
                                                            </div>
                                                            <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                                                                <motion.div
                                                                    initial={{ width: 0 }}
                                                                    animate={{ width: `${planet.habitability_score}%` }}
                                                                    transition={{ duration: 1, delay: 0.2 + index * 0.05 }}
                                                                    className={`h-full rounded-full ${habitabilityScore! > 70
                                                                        ? "bg-green-500"
                                                                        : habitabilityScore! > 50
                                                                            ? "bg-blue-500"
                                                                            : habitabilityScore! > 30
                                                                                ? "bg-yellow-500"
                                                                                : habitabilityScore! > 10
                                                                                    ? "bg-orange-500"
                                                                                    : "bg-red-500"
                                                                        }`}
                                                                />
                                                            </div>
                                                        </div>

                                                        <div className="pt-2">
                                                            <div className="flex justify-between items-center mb-1">
                                                                <span className="text-xs text-white/70">Terraformability Score</span>
                                                                <span className={`text-xs font-medium ${getHabitabilityColor(planet.terraformability_score!)}`}>
                                                                    {planet.terraformability_score?.toFixed(0)} %
                                                                </span>
                                                            </div>
                                                            <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                                                                <motion.div
                                                                    initial={{ width: 0 }}
                                                                    animate={{ width: `${planet.terraformability_score}%` }}
                                                                    transition={{ duration: 1, delay: 0.2 + index * 0.05 }}
                                                                    className={`h-full rounded-full ${planet.terraformability_score! > 70
                                                                        ? "bg-green-500"
                                                                        : planet.terraformability_score! > 50
                                                                            ? "bg-blue-500"
                                                                            : planet.terraformability_score! > 30
                                                                                ? "bg-yellow-500"
                                                                                : planet.terraformability_score! > 10
                                                                                    ? "bg-orange-500"
                                                                                    : "bg-red-500"
                                                                        }`}
                                                                />
                                                            </div>
                                                        </div>
                                                    </CardContent>

                                                    <CardFooter className="relative z-10">
                                                        <Link
                                                            href={`/dashboard/exoplanet/${planet.pl_name?.replace(/\s+/g, "-").toLowerCase()}`}
                                                            className="w-full"
                                                        >
                                                            <Button
                                                                variant="outline"
                                                                className="w-full border-white/10 bg-white/5 hover:bg-white/10 text-white"
                                                            >
                                                                <Star className="mr-2 h-4 w-4" />
                                                                View Details
                                                            </Button>
                                                        </Link>
                                                    </CardFooter>

                                                </Card>
                                            </motion.div>
                                        )
                                    })}
                                </div>
                            )}
                        </TabsContent>

                        <TabsContent value="habitable" className="mt-0">
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {filteredPlanets
                                    .filter((planet) => planet.habitability_score! > 50)
                                    .map((planet, index) => {
                                        const habitabilityScore = planet.habitability_score
                                        const planetType = getPlanetType(planet)
                                        const starType = getStarType(planet)

                                        return (
                                            <motion.div
                                                key={planet.pl_name}
                                                initial={animations ? { opacity: 0, y: 20 } : false}
                                                animate={animations ? { opacity: 1, y: 0 } : {}}
                                                transition={{ duration: 0.3, delay: index * 0.05 }}
                                            >
                                                <Card className={`bg-black/40 border-white/10 text-white overflow-hidden ${blurEffects ? 'backdrop-blur-sm' : ''} h-full flex flex-col`}>
                                                    <div className="absolute inset-0 bg-gradient-to-br from-green-900/10 via-blue-900/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                                                    <CardHeader className="pb-2 relative z-10">
                                                        <div className="flex justify-between items-start">
                                                            <div>
                                                                <CardTitle className="text-lg font-bold text-white">{planet.pl_name}</CardTitle>
                                                                <CardDescription className="text-white/60">
                                                                    {starType} Star System
                                                                </CardDescription>
                                                            </div>
                                                            <Badge className={getBadgeColor(planetType)}>
                                                                {planetType}
                                                            </Badge>
                                                        </div>
                                                    </CardHeader>

                                                    <CardContent className="space-y-4 flex-grow relative z-10">
                                                        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                                                            <div className="space-y-1">
                                                                <p className="text-white/50">Radius</p>
                                                                <p className="font-medium">
                                                                    {planet.pl_rade !== null ? `${planet.pl_rade.toFixed(2)} R⊕` : 'Unknown'}
                                                                </p>
                                                            </div>
                                                            <div className="space-y-1">
                                                                <p className="text-white/50">Mass</p>
                                                                <p className="font-medium">
                                                                    {planet.pl_bmasse !== null ? `${planet.pl_bmasse.toFixed(2)} M⊕` : 'Unknown'}
                                                                </p>
                                                            </div>
                                                            <div className="space-y-1">
                                                                <p className="text-white/50">Orbital Period</p>
                                                                <p className="font-medium">
                                                                    {planet.pl_orbper !== null ? `${planet.pl_orbper.toFixed(1)} days` : 'Unknown'}
                                                                </p>
                                                            </div>
                                                            <div className="space-y-1">
                                                                <p className="text-white/50">Temperature</p>
                                                                <p className="font-medium">
                                                                    {planet.pl_eqt !== null ? `${planet.pl_eqt.toFixed(0)} K` : 'Unknown'}
                                                                </p>
                                                            </div>
                                                        </div>

                                                        <div className="pt-2">
                                                            <div className="flex justify-between items-center mb-1">
                                                                <span className="text-xs text-white/70">Habitability Score</span>
                                                                <span className={`text-xs font-medium ${getHabitabilityColor(habitabilityScore!)}`}>
                                                                    {habitabilityScore?.toFixed(0)}%
                                                                </span>
                                                            </div>
                                                            <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                                                                <motion.div
                                                                    initial={{ width: 0 }}
                                                                    animate={{ width: `${planet.habitability_score}%` }}
                                                                    transition={{ duration: 1, delay: 0.2 + index * 0.05 }}
                                                                    className={`h-full rounded-full ${habitabilityScore! > 70
                                                                        ? "bg-green-500"
                                                                        : habitabilityScore! > 50
                                                                            ? "bg-blue-500"
                                                                            : habitabilityScore! > 30
                                                                                ? "bg-yellow-500"
                                                                                : habitabilityScore! > 10
                                                                                    ? "bg-orange-500"
                                                                                    : "bg-red-500"
                                                                        }`}
                                                                />
                                                            </div>
                                                        </div>

                                                        <div className="pt-2">
                                                            <div className="flex justify-between items-center mb-1">
                                                                <span className="text-xs text-white/70">Terraformability Score</span>
                                                                <span className={`text-xs font-medium ${getHabitabilityColor(planet.terraformability_score!)}`}>
                                                                    {planet.terraformability_score?.toFixed(0)}%
                                                                </span>
                                                            </div>
                                                            <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                                                                <motion.div
                                                                    initial={{ width: 0 }}
                                                                    animate={{ width: `${planet.terraformability_score}%` }}
                                                                    transition={{ duration: 1, delay: 0.2 + index * 0.05 }}
                                                                    className={`h-full rounded-full ${planet.terraformability_score! > 70
                                                                        ? "bg-green-500"
                                                                        : planet.terraformability_score! > 50
                                                                            ? "bg-blue-500"
                                                                            : planet.terraformability_score! > 30
                                                                                ? "bg-yellow-500"
                                                                                : planet.terraformability_score! > 10
                                                                                    ? "bg-orange-500"
                                                                                    : "bg-red-500"
                                                                        }`}
                                                                />
                                                            </div>
                                                        </div>
                                                    </CardContent>

                                                    <CardFooter className="relative z-10">
                                                        <Link
                                                            href={`/dashboard/exoplanet/${planet.pl_name?.replace(/\s+/g, "-").toLowerCase()}`}
                                                            className="w-full"
                                                        >
                                                            <Button
                                                                variant="outline"
                                                                className="w-full border-white/10 bg-white/5 hover:bg-white/10 text-white"
                                                            >
                                                                <Star className="mr-2 h-4 w-4" />
                                                                View Details
                                                            </Button>
                                                        </Link>
                                                    </CardFooter>

                                                </Card>
                                            </motion.div>
                                        )
                                    })}
                            </div>
                        </TabsContent>

                        <TabsContent value="earth-like" className="mt-0">
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {filteredPlanets
                                    .filter((planet) => getPlanetType(planet) === "Earth-like")
                                    .map((planet, index) => {
                                        const habitabilityScore = planet.habitability_score
                                        const planetType = getPlanetType(planet)
                                        const starType = getStarType(planet)

                                        return (
                                            <motion.div
                                                key={planet.pl_name}
                                                initial={animations ? { opacity: 0, y: 20 } : false}
                                                animate={animations ? { opacity: 1, y: 0 } : {}}
                                                transition={{ duration: 0.3, delay: index * 0.05 }}
                                            >
                                                <Card
                                                    className={`bg-black/40 border-white/10 text-white overflow-hidden ${blurEffects ? "backdrop-blur-sm" : ""} h-full flex flex-col`}
                                                >
                                                    <div className="absolute inset-0 bg-gradient-to-br from-green-900/10 via-blue-900/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                                                    <CardHeader className="pb-2 relative z-10">
                                                        <div className="flex justify-between items-start">
                                                            <div>
                                                                <CardTitle className="text-lg font-bold text-white">{planet.pl_name}</CardTitle>
                                                                <CardDescription className="text-white/60">{starType} Star System</CardDescription>
                                                            </div>
                                                            <Badge className={getBadgeColor(planetType)}>{planetType}</Badge>
                                                        </div>
                                                    </CardHeader>

                                                    <CardContent className="space-y-4 flex-grow relative z-10">
                                                        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                                                            <div className="space-y-1">
                                                                <p className="text-white/50">Radius</p>
                                                                <p className="font-medium">
                                                                    {planet.pl_rade !== null ? `${planet.pl_rade.toFixed(2)} R⊕` : "Unknown"}
                                                                </p>
                                                            </div>
                                                            <div className="space-y-1">
                                                                <p className="text-white/50">Mass</p>
                                                                <p className="font-medium">
                                                                    {planet.pl_bmasse !== null ? `${planet.pl_bmasse.toFixed(2)} M⊕` : "Unknown"}
                                                                </p>
                                                            </div>
                                                            <div className="space-y-1">
                                                                <p className="text-white/50">Orbital Period</p>
                                                                <p className="font-medium">
                                                                    {planet.pl_orbper !== null ? `${planet.pl_orbper.toFixed(1)} days` : "Unknown"}
                                                                </p>
                                                            </div>
                                                            <div className="space-y-1">
                                                                <p className="text-white/50">Temperature</p>
                                                                <p className="font-medium">
                                                                    {planet.pl_eqt !== null ? `${planet.pl_eqt.toFixed(0)} K` : "Unknown"}
                                                                </p>
                                                            </div>
                                                        </div>

                                                        <div className="pt-2">
                                                            <div className="flex justify-between items-center mb-1">
                                                                <span className="text-xs text-white/70">Habitability Score</span>
                                                                <span className={`text-xs font-medium ${getHabitabilityColor(habitabilityScore!)}`}>
                                                                    {habitabilityScore?.toFixed(0)}%
                                                                </span>
                                                            </div>
                                                            <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                                                                <motion.div
                                                                    initial={{ width: 0 }}
                                                                    animate={{ width: `${habitabilityScore}%` }}
                                                                    transition={{ duration: 1, delay: 0.2 + index * 0.05 }}
                                                                    className={`h-full rounded-full ${habitabilityScore! > 70
                                                                        ? "bg-green-500"
                                                                        : habitabilityScore! > 50
                                                                            ? "bg-blue-500"
                                                                            : habitabilityScore! > 30
                                                                                ? "bg-yellow-500"
                                                                                : habitabilityScore! > 10
                                                                                    ? "bg-orange-500"
                                                                                    : "bg-red-500"
                                                                        }`}
                                                                />
                                                            </div>
                                                        </div>

                                                        <div className="pt-2">
                                                            <div className="flex justify-between items-center mb-1">
                                                                <span className="text-xs text-white/70">Terraformability Score</span>
                                                                <span className={`text-xs font-medium ${getHabitabilityColor(planet.terraformability_score!)}`}>
                                                                    {planet.terraformability_score?.toFixed(0)}%
                                                                </span>
                                                            </div>
                                                            <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                                                                <motion.div
                                                                    initial={{ width: 0 }}
                                                                    animate={{ width: `${planet.terraformability_score!}%` }}
                                                                    transition={{ duration: 1, delay: 0.2 + index * 0.05 }}
                                                                    className={`h-full rounded-full ${planet.terraformability_score! > 70
                                                                        ? "bg-green-500"
                                                                        : planet.terraformability_score! > 50
                                                                            ? "bg-blue-500"
                                                                            : planet.terraformability_score! > 30
                                                                                ? "bg-yellow-500"
                                                                                : planet.terraformability_score! > 10
                                                                                    ? "bg-orange-500"
                                                                                    : "bg-red-500"
                                                                        }`}
                                                                />
                                                            </div>
                                                        </div>
                                                    </CardContent>

                                                    <CardFooter className="relative z-10">
                                                        <Link
                                                            href={`/dashboard/exoplanet/${planet.pl_name?.replace(/\s+/g, "-").toLowerCase()}`}
                                                            className="w-full"
                                                        >
                                                            <Button
                                                                variant="outline"
                                                                className="w-full border-white/10 bg-white/5 hover:bg-white/10 text-white"
                                                            >
                                                                <Star className="mr-2 h-4 w-4" />
                                                                View Details
                                                            </Button>
                                                        </Link>
                                                    </CardFooter>
                                                </Card>
                                            </motion.div>
                                        )
                                    })}
                            </div>
                        </TabsContent>
                    </Tabs>

                    {/* Pagination controls */}
                    <div className="flex items-center justify-between">
                        <div className="text-sm text-white/100">
                            Showing {pagination.totalItems > 0 ? (pagination.page - 1) * pagination.pageSize + 1 : 0} to{" "}
                            {Math.min(pagination.page * pagination.pageSize, pagination.totalItems)} of{" "}
                            {pagination.totalItems.toLocaleString()} planets
                        </div>

                        <div className="flex items-center gap-2">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="text-white/100 hover:bg-[#1a1a1a] border border-white/20 rounded-md"
                                onClick={() => handlePageChange(1)}
                                disabled={!pagination.hasPrevPage || isLoading}
                            >
                                <ChevronsLeft className="h-4 w-4" />
                            </Button>

                            <Button
                                variant="ghost"
                                size="icon"
                                className="text-white/100 hover:bg-[#1a1a1a] border border-white/20 rounded-md"
                                onClick={() => handlePageChange(pagination.page - 1)}
                                disabled={!pagination.hasPrevPage || isLoading}
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </Button>

                            <span className="px-4 py-2 border border-white/20 rounded-md text-white/90 text-sm bg-[#111111]">
                                {pagination.page} / {pagination.totalPages}
                            </span>

                            <Button
                                variant="ghost"
                                size="icon"
                                className="text-white/100 hover:bg-[#1a1a1a] border border-white/20 rounded-md"
                                onClick={() => handlePageChange(pagination.page + 1)}
                                disabled={!pagination.hasNextPage || isLoading}
                            >
                                <ChevronRight className="h-4 w-4" />
                            </Button>

                            <Button
                                variant="ghost"
                                size="icon"
                                className="text-white/100 hover:bg-[#1a1a1a] border border-white/20 rounded-md"
                                onClick={() => handlePageChange(pagination.totalPages)}
                                disabled={!pagination.hasNextPage || isLoading}
                            >
                                <ChevronsRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            </div >
        </div >
    )
}

