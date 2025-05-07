"use client"

import { useEffect, useState, useRef } from "react"
import { useParams, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import {
    ArrowLeft,
    Calendar,
    Info,
    Map,
    ThermometerSnowflake,
    Weight,
    Star,
    Sun,
    Orbit,
    Droplets,
    Zap,
    Globe,
    Sparkles,
    Compass,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useTheme } from "@/components/theme-provider"
import { useToast } from "@/hooks/use-toast"
import { ParticleBackground } from "@/components/particle-background"
import { SpaceBackground } from "@/components/space-background"
import { OrbitVisualization } from "@/components/orbit-visualization"
import { HabitabilityGauge } from "@/components/habitability-gauge"
import { PlanetVisualization } from "@/components/planet-visualization"
import { useAIContent } from "@/hooks/use-ai-content"
import { ShareDialog } from "@/components/share-dialog"
import { ImportDataDialog } from "@/components/import-data-dialog"
interface ExoplanetData {
    [key: string]: string | number | boolean | null
    pl_name: string
}

export default function ExoplanetDetailsPage() {
    const { pl_name } = useParams<{ pl_name: string }>()
    const router = useRouter()
    const { toast } = useToast()
    const [exoplanet, setExoplanet] = useState<ExoplanetData | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [showTooltip, setShowTooltip] = useState<string | null>(null)
    const { animations, particleEffects } = useTheme()
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
    const containerRef = useRef<HTMLDivElement>(null)
    const [theme] = useState<"light" | "dark">("dark")

    // Use our custom hooks for AI-generated content
    const { summary, isLoadingSummary, generateSummary } = useAIContent(exoplanet)

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
    }, [])

    useEffect(() => {
        const fetchExoplanetData = async () => {
            try {
                // Fetch data from our API
                const response = await fetch(`/api/data/${pl_name}`)

                if (!response.ok) {
                    throw new Error(`API responded with status: ${response.status}`)
                }

                const data = await response.json()
                setExoplanet(data)
                setIsLoading(false)
            } catch (error) {
                console.error("Error fetching exoplanet data:", error)
                toast({
                    title: "Error",
                    description: "Failed to load exoplanet data",
                    variant: "destructive",
                })
                setIsLoading(false)
            }
        }

        fetchExoplanetData()
    }, [pl_name, toast])

    const getHabitabilityColor = (score: number) => {
        if (score > 70) return "text-green-400"
        if (score > 50) return "text-blue-400"
        if (score > 30) return "text-yellow-400"
        if (score > 10) return "text-orange-400"
        return "text-red-400"
    }

    const getPlanetType = (radius: number | undefined) => {
        if (!radius) return "Unknown"

        if (radius < 0.5) return "Sub-Earth"
        if (radius < 1.6) return "Earth-like"
        if (radius < 4) return "Super-Earth"
        if (radius < 10) return "Neptune-like"
        return "Gas Giant"
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

    // Function to format values based on type
    const formatValue = (key: string, value: string | number | boolean | null): string => {
        if (typeof value === "number") {
            if (key === "pl_rade") return `${value.toFixed(2)} R⊕`
            if (key === "pl_bmasse") return `${value.toFixed(2)} M⊕`
            if (key === "pl_orbper") return `${value.toFixed(1)} days`
            if (key === "pl_eqt" || key === "st_teff") return `${value.toFixed(0)} K`
            if (key === "st_mass") return `${value.toFixed(2)} M☉`
            if (key === "st_rad") return `${value.toFixed(2)} R☉`
            if (key === "sy_dist") return `${value.toFixed(1)} light years`
            if (key.includes("score") || key.includes("probability")) {
                return value > 1 ? `${value.toFixed(0)}%` : `${(value * 100).toFixed(0)}%`
            }
            return value.toString()
        }
        return value !== null ? value.toString() : "N/A"
    }

    // Function to get a human-readable name from a field key
    const getFieldName = (key: string): string => {
        const nameMap: { [key: string]: string } = {
            pl_name: "Planet Name",
            pl_rade: "Planet Radius",
            pl_bmasse: "Planet Mass",
            pl_orbper: "Orbital Period",
            pl_eqt: "Equilibrium Temperature",
            st_teff: "Star Temperature",
            st_mass: "Star Mass",
            st_rad: "Star Radius",
            st_met: "Star Metallicity",
            sy_dist: "Distance from Earth",
            disc_year: "Discovery Year",
            disc_facility: "Discovery Facility",
            habitability_score: "Habitability Score",
            terraformability_score: "Terraformability Score",
        }

        // If we have a predefined name, use it
        if (nameMap[key]) return nameMap[key]

        // Otherwise create a readable name from the key
        return key
            .replace("pl_", "")
            .replace("st_", "Star ")
            .replace("sy_", "System ")
            .replace(/_/g, " ")
            .replace(/\b\w/g, (l) => l.toUpperCase())
    }

    // Group data for display in relevant sections
    type GroupedData = {
        planet: Record<string, string | number | boolean | null>;
        star: Record<string, string | number | boolean | null>;
        system: Record<string, string | number | boolean | null>;
        habitability: Record<string, string | number | boolean | null>;
        other: Record<string, string | number | boolean | null>;
    };

    const groupData = (data: Record<string, string | number | boolean | null>): GroupedData => {
        const groups: GroupedData = {
            planet: {},
            star: {},
            system: {},
            habitability: {},
            other: {},
        };

        Object.entries(data).forEach(([key, value]) => {
            if (key === "pl_name") return;

            if (key.startsWith("pl_")) {
                groups.planet[key] = value;
            } else if (key.startsWith("st_")) {
                groups.star[key] = value;
            } else if (key.startsWith("sy_")) {
                groups.system[key] = value;
            } else if (key.includes("hab") || key.includes("terra") || key.includes("score")) {
                groups.habitability[key] = value;
            } else {
                groups.other[key] = value;
            }
        });

        return groups;
    };

    // Get planet color based on type
    const getPlanetColor = (type: string) => {
        switch (type) {
            case "Earth-like":
                return "from-blue-600 to-green-800"
            case "Super-Earth":
                return "from-indigo-600 to-blue-800"
            case "Neptune-like":
                return "from-indigo-600 to-purple-800"
            case "Gas Giant":
                return "from-purple-600 to-red-800"
            case "Sub-Earth":
                return "from-yellow-600 to-orange-800"
            default:
                return "from-gray-600 to-gray-800"
        }
    }

    // Get a summary description based on planet data
    const getPlanetSummary = (data: ExoplanetData) => {
        const type = getPlanetType(data.pl_rade as number)
        const habitabilityScore = (data.habitability_score as number) || 0
        const terraformabilityScore = (data.terraformability_score as number) || 0

        let summary = `${data.pl_name} is a ${type.toLowerCase()} exoplanet`

        if (data.sy_dist) {
            summary += ` located approximately ${formatValue("sy_dist", data.sy_dist)} from Earth`
        }

        if (data.disc_year) {
            summary += `, discovered in ${data.disc_year}`
        }

        if (data.disc_facility) {
            summary += ` by ${data.disc_facility}`
        }

        summary += ". "

        if (data.pl_orbper) {
            summary += `It orbits its host star every ${formatValue("pl_orbper", data.pl_orbper)}`

            if (data.pl_eqt) {
                summary += ` with a surface temperature of approximately ${formatValue("pl_eqt", data.pl_eqt)}`
            }

            summary += ". "
        }

        if (habitabilityScore > 0) {
            if (habitabilityScore > 0.7) {
                summary += `With a high habitability score of ${formatValue("habitability_score", habitabilityScore)}, it's considered one of the more promising candidates for potential habitability.`
            } else if (habitabilityScore > 0.4) {
                summary += `It has a moderate habitability score of ${formatValue("habitability_score", habitabilityScore)}, suggesting some conditions that might support certain forms of life.`
            } else {
                summary += `Its low habitability score of ${formatValue("habitability_score", habitabilityScore)} indicates conditions that would be challenging for Earth-like life.`
            }
        }

        if (terraformabilityScore > 0) {
            summary += ` The planet has a terraformability potential of ${formatValue("terraformability_score", terraformabilityScore)}.`
        }

        return summary
    }

    // Get similar planets based on characteristics
    const getSimilarPlanets = () => {
        return [
            {
                name: "Kepler-442b",
                type: "Earth-like",
                similarity: 95,
                color: "from-blue-600 to-green-800",
            },
            {
                name: "TRAPPIST-1e",
                type: "Earth-like",
                similarity: 88,
                color: "from-blue-600 to-green-800",
            },
            {
                name: "Proxima Centauri b",
                type: "Super-Earth",
                similarity: 82,
                color: "from-indigo-600 to-blue-800",
            },
            {
                name: "K2-18b",
                type: "Neptune-like",
                similarity: 75,
                color: "from-indigo-600 to-purple-800",
            },
        ]
    }

    const getStarType = (st_teff: number) => {
        if (!st_teff) return "Unknown"

        if (st_teff > 30000) return "O-type"
        if (st_teff > 10000) return "B-type"
        if (st_teff > 7500) return "A-type"
        if (st_teff > 6000) return "F-type"
        if (st_teff > 5200) return "G-type (Sun-like)"
        if (st_teff > 3700) return "K-type"
        return "M-type (Red Dwarf)"
    }

    const getPlanetUrl = () => {
        if (typeof window !== "undefined") {
            return window.location.href
        }
        return ""
    }

    const handleImportData = (data: ExoplanetData) => {
        setExoplanet(data)
        toast({
            title: "Data imported",
            description: "Exoplanet data has been successfully imported.",
        })
    }

    return (
        <div className={theme === "dark" ? "dark" : ""} ref={containerRef}>
            <div className="relative min-h-screen space-bg">
                <div className="absolute inset-0 nebula-bg"></div>
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
                <div className="container py-6 space-y-6 relative z-10 pr-2 pl-2">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between px-4 sm:px-0"
                    >
                        <Button
                            variant="ghost"
                            size="sm"
                            className="w-fit text-white/70 hover:bg-white/10 hover:text-white group font-body"
                            onClick={() => router.back()}
                        >
                            <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
                            Back to Exoplanets
                        </Button>

                        <div className="flex flex-wrap gap-2">

                            {exoplanet && (
                                <>
                                    <ShareDialog planetName={exoplanet.pl_name} planetUrl={getPlanetUrl()} planetData={exoplanet} />

                                    <ImportDataDialog onImportSuccess={handleImportData} />
                                </>
                            )}
                        </div>
                    </motion.div>

                    {isLoading ? (
                        <div className="grid gap-6 md:grid-cols-3 p-4 sm:p-8">
                            <Card className="bg-black/40 border-white/10 md:col-span-2 animate-pulse">
                                <CardHeader className="pb-2">
                                    <div className="h-6 w-1/3 bg-white/5 rounded"></div>
                                    <div className="h-4 w-1/2 bg-white/5 rounded mt-2"></div>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="h-20 bg-white/5 rounded"></div>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        <div className="h-16 bg-white/5 rounded"></div>
                                        <div className="h-16 bg-white/5 rounded"></div>
                                        <div className="h-16 bg-white/5 rounded"></div>
                                        <div className="h-16 bg-white/5 rounded"></div>
                                    </div>
                                </CardContent>
                            </Card>
                            <Card className="bg-black/40 border-white/10 animate-pulse">
                                <CardHeader className="pb-2">
                                    <div className="h-6 w-2/3 bg-white/5 rounded"></div>
                                </CardHeader>
                                <CardContent>
                                    <div className="h-48 bg-white/5 rounded"></div>
                                </CardContent>
                            </Card>
                        </div>
                    ) : exoplanet ? (
                        <>
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.8 }}
                                className="grid gap-6 md:grid-cols-3 pr-8 pl-8"
                            >
                                <Card className="glass text-white md:col-span-2 overflow-hidden relative group">
                                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/10 via-purple-900/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                                    <CardHeader className="pb-2 relative z-10">
                                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                                            <motion.div
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ duration: 0.5, delay: 0.2 }}
                                            >
                                                <CardTitle className="text-2xl lg:text-3xl text-gradient font-display">
                                                    {exoplanet.pl_name}
                                                </CardTitle>
                                                <CardDescription className="text-white/60 font-body">
                                                    {getStarType(exoplanet.st_teff as number)} Star System
                                                </CardDescription>
                                            </motion.div>

                                            <motion.div
                                                initial={{ opacity: 0, scale: 0.8 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                transition={{ duration: 0.5, delay: 0.3 }}
                                            >
                                                <Badge
                                                    className={`${getBadgeColor(getPlanetType(exoplanet.pl_rade as number))} text-sm px-3 py-1 font-body`}
                                                >
                                                    {getPlanetType(exoplanet.pl_rade as number)}
                                                </Badge>
                                            </motion.div>
                                        </div>
                                    </CardHeader>

                                    <CardContent className="space-y-6 relative z-10">
                                        {summary ? (
                                            <motion.div
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ duration: 0.5, delay: 0.4 }}
                                                className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm"
                                            >
                                                <div className="flex items-start gap-2">
                                                    <Sparkles className="h-5 w-5 text-purple-400 mt-1 flex-shrink-0" />
                                                    <div>
                                                        <h3 className="text-sm font-medium text-white/80 mb-2 font-display">
                                                            AI-Generated Summary
                                                        </h3>
                                                        <p className="text-white/80 leading-relaxed font-body">{summary}</p>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ) : (
                                            <motion.div
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ duration: 0.5, delay: 0.4 }}
                                                className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm"
                                            >
                                                <p className="text-white/80 leading-relaxed font-body">{getPlanetSummary(exoplanet)}</p>
                                                <Button
                                                    variant="link"
                                                    className="text-purple-400 hover:text-purple-300 p-0 h-auto mt-2 flex items-center font-body"
                                                    onClick={generateSummary}
                                                    disabled={isLoadingSummary}
                                                >
                                                    {isLoadingSummary ? (
                                                        <>
                                                            <div className="animate-spin h-4 w-4 mr-2 border-2 border-purple-500 border-t-transparent rounded-full" />
                                                            Generating AI summary...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Sparkles className="mr-2 h-4 w-4" />
                                                            Generate AI summary
                                                        </>
                                                    )}
                                                </Button>
                                            </motion.div>
                                        )}

                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.5, delay: 0.5 }}
                                            className="grid grid-cols-2 md:grid-cols-4 gap-4"
                                        >
                                            {exoplanet.hasOwnProperty("disc_year") && (
                                                <div className="rounded-lg border border-white/10 bg-white/5 p-3 text-center backdrop-blur-sm hover:bg-white/10 transition-colors group animate-float">
                                                    <div className="flex justify-center mb-2">
                                                        <Calendar className="h-5 w-5 text-indigo-400 group-hover:text-indigo-300 transition-colors" />
                                                    </div>
                                                    <div className="text-xs text-white/60 font-body">Discovery Year</div>
                                                    <div className="text-white font-medium font-display">{exoplanet.disc_year}</div>
                                                </div>
                                            )}

                                            {exoplanet.hasOwnProperty("pl_eqt") && (
                                                <div className="rounded-lg border border-white/10 bg-white/5 p-3 text-center backdrop-blur-sm hover:bg-white/10 transition-colors group animate-float animation-delay-150">
                                                    <div className="flex justify-center mb-2">
                                                        <ThermometerSnowflake className="h-5 w-5 text-indigo-400 group-hover:text-indigo-300 transition-colors" />
                                                    </div>
                                                    <div className="text-xs text-white/60 font-body">Temperature</div>
                                                    <div className="text-white font-medium font-display">
                                                        {formatValue("pl_eqt", exoplanet.pl_eqt)}
                                                    </div>
                                                </div>
                                            )}

                                            {exoplanet.hasOwnProperty("pl_rade") && (
                                                <div className="rounded-lg border border-white/10 bg-white/5 p-3 text-center backdrop-blur-sm hover:bg-white/10 transition-colors group animate-float animation-delay-300">
                                                    <div className="flex justify-center mb-2">
                                                        <Map className="h-5 w-5 text-indigo-400 group-hover:text-indigo-300 transition-colors" />
                                                    </div>
                                                    <div className="text-xs text-white/60 font-body">Radius</div>
                                                    <div className="text-white font-medium font-display">
                                                        {formatValue("pl_rade", exoplanet.pl_rade)}
                                                    </div>
                                                </div>
                                            )}

                                            {exoplanet.hasOwnProperty("pl_bmasse") && (
                                                <div className="rounded-lg border border-white/10 bg-white/5 p-3 text-center backdrop-blur-sm hover:bg-white/10 transition-colors group animate-float animation-delay-450">
                                                    <div className="flex justify-center mb-2">
                                                        <Weight className="h-5 w-5 text-indigo-400 group-hover:text-indigo-300 transition-colors" />
                                                    </div>
                                                    <div className="text-xs text-white/60 font-body">Mass</div>
                                                    <div className="text-white font-medium font-display">
                                                        {formatValue("pl_bmasse", exoplanet.pl_bmasse)}
                                                    </div>
                                                </div>
                                            )}
                                        </motion.div>

                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.5, delay: 0.6 }}
                                        >
                                            <Tabs defaultValue="overview" className="mt-6">
                                                <TabsList className="bg-white/5 border border-white/10 p-0.5 backdrop-blur-sm overflow-x-auto flex w-full">
                                                    <TabsTrigger
                                                        value="overview"
                                                        className="data-[state=active]:bg-white/10 data-[state=active]:text-white text-white/70 font-body"
                                                    >
                                                        <Info className="mr-2 h-4 w-4" />
                                                        <span className="hidden sm:inline">Overview</span>
                                                        <span className="sm:hidden">Info</span>
                                                    </TabsTrigger>
                                                    <TabsTrigger
                                                        value="habitability"
                                                        className="data-[state=active]:bg-white/10 data-[state=active]:text-white text-white/70 font-body"
                                                    >
                                                        <Droplets className="mr-2 h-4 w-4" />
                                                        <span className="hidden sm:inline">Habitability</span>
                                                        <span className="sm:hidden">Habit</span>
                                                    </TabsTrigger>
                                                    <TabsTrigger
                                                        value="star"
                                                        className="data-[state=active]:bg-white/10 data-[state=active]:text-white text-white/70 font-body"
                                                    >
                                                        <Sun className="mr-2 h-4 w-4" />
                                                        <span className="hidden sm:inline">Host Star</span>
                                                        <span className="sm:hidden">Star</span>
                                                    </TabsTrigger>
                                                </TabsList>

                                                <TabsContent value="overview" className="pt-4 space-y-4">
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                        {Object.entries(groupData(exoplanet).planet).map(([key, value]) => (
                                                            <div
                                                                key={key}
                                                                className="space-y-2 bg-white/5 p-3 rounded-lg border border-white/10 hover:bg-white/10 transition-colors"
                                                                onMouseEnter={() => setShowTooltip(key)}
                                                                onMouseLeave={() => setShowTooltip(null)}
                                                            >
                                                                <h3 className="text-sm font-medium text-white/60 flex items-center font-display">
                                                                    {getFieldName(key)}
                                                                    {showTooltip === key && (
                                                                        <span className="ml-2 text-xs text-white/40 font-body">({key})</span>
                                                                    )}
                                                                </h3>
                                                                <p className="text-white font-body">{formatValue(key, value)}</p>
                                                            </div>
                                                        ))}

                                                        {Object.entries(groupData(exoplanet).system).map(([key, value]) => (
                                                            <div
                                                                key={key}
                                                                className="space-y-2 bg-white/5 p-3 rounded-lg border border-white/10 hover:bg-white/10 transition-colors"
                                                                onMouseEnter={() => setShowTooltip(key)}
                                                                onMouseLeave={() => setShowTooltip(null)}
                                                            >
                                                                <h3 className="text-sm font-medium text-white/60 flex items-center font-display">
                                                                    {getFieldName(key)}
                                                                    {showTooltip === key && (
                                                                        <span className="ml-2 text-xs text-white/40 font-body">({key})</span>
                                                                    )}
                                                                </h3>
                                                                <p className="text-white font-body">{formatValue(key, value)}</p>
                                                            </div>
                                                        ))}

                                                        {Object.entries(groupData(exoplanet).other).map(([key, value]) => (
                                                            <div
                                                                key={key}
                                                                className="space-y-2 bg-white/5 p-3 rounded-lg border border-white/10 hover:bg-white/10 transition-colors"
                                                                onMouseEnter={() => setShowTooltip(key)}
                                                                onMouseLeave={() => setShowTooltip(null)}
                                                            >
                                                                <h3 className="text-sm font-medium text-white/60 flex items-center font-display">
                                                                    {getFieldName(key)}
                                                                    {showTooltip === key && (
                                                                        <span className="ml-2 text-xs text-white/40 font-body">({key})</span>
                                                                    )}
                                                                </h3>
                                                                <p className="text-white font-body">{formatValue(key, value)}</p>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </TabsContent>

                                                <TabsContent value="habitability" className="pt-4 space-y-4">
                                                    {/* Display any other habitability related fields */}
                                                    {Object.entries(groupData(exoplanet).habitability)
                                                        .filter(([key]) => !["habitability_score", "terraformability_score"].includes(key))
                                                        .map(([key, value]) => (
                                                            <div key={key} className="space-y-2 bg-white/5 p-3 rounded-lg border border-white/10">
                                                                <h3 className="text-sm font-medium text-white/60 font-display">{getFieldName(key)}</h3>
                                                                <p className="text-white font-body">{formatValue(key, value)}</p>
                                                            </div>
                                                        ))}

                                                    <Separator className="bg-white/10" />

                                                    <motion.div
                                                        initial={{ opacity: 0, y: 20 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        transition={{ duration: 0.5, delay: 1.2 }}
                                                        className="px-8 py-4"
                                                    >
                                                        <CardTitle className="flex items-center justify-start font-display">
                                                            <Compass className="mr-2 h-5 w-5 text-indigo-400" />
                                                            Habitability & Terraformability Assessment
                                                        </CardTitle>
                                                        <CardContent className="relative z-10 pt-8">
                                                            <div className="flex flex-col gap-25">
                                                                {exoplanet.hasOwnProperty("habitability_score") && (
                                                                    <HabitabilityGauge
                                                                        score={exoplanet.habitability_score as number}
                                                                        label="Habitability Score"
                                                                        description="Likelihood of supporting Earth-like life forms"
                                                                    />
                                                                )}
                                                                {exoplanet.hasOwnProperty("terraformability_score") && (
                                                                    <HabitabilityGauge
                                                                        score={exoplanet.terraformability_score as number}
                                                                        label="Terraformability Score"
                                                                        description="Potential for human modification to support life"
                                                                    />
                                                                )}
                                                            </div>
                                                        </CardContent>
                                                    </motion.div>
                                                </TabsContent>

                                                <TabsContent value="star" className="pt-4 space-y-4">
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                        {Object.entries(groupData(exoplanet).star).map(([key, value]) => (
                                                            <div
                                                                key={key}
                                                                className="space-y-2 bg-white/5 p-3 rounded-lg border border-white/10 hover:bg-white/10 transition-colors"
                                                            >
                                                                <h3 className="text-sm font-medium text-white/60 font-display">{getFieldName(key)}</h3>
                                                                <p className="text-white font-body">{formatValue(key, value)}</p>
                                                            </div>
                                                        ))}
                                                    </div>

                                                    {Object.keys(groupData(exoplanet).star).length > 0 && (
                                                        <div className="rounded-lg border border-white/10 bg-white/5 p-4 backdrop-blur-sm mt-4">
                                                            <div className="flex items-start space-x-2">
                                                                <Sun className="h-5 w-5 text-yellow-400 mt-0.5" />
                                                                <div>
                                                                    <h4 className="font-medium text-white font-display">Host Star Information</h4>
                                                                    <p className="text-sm text-white/60 mt-1 font-body">
                                                                        The host star of this exoplanet system provides the energy that influences the
                                                                        planet&apos;s climate, temperature, and potential for habitability. The star&apos;s
                                                                        properties, including its temperature, mass, and radiation output, are critical
                                                                        factors in determining whether the exoplanet could support life or be terraformed in
                                                                        the future.
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                                </TabsContent>
                                            </Tabs>
                                        </motion.div>
                                    </CardContent>
                                </Card>

                                <div className="space-y-6">
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.5, delay: 0.7 }}
                                    >
                                        <Card className="glass text-white overflow-hidden relative group animate-pulse-glow">
                                            <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/10 via-purple-900/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                                            <CardHeader className="pb-2 relative z-10">
                                                <CardTitle className="flex items-center font-display">
                                                    <Globe className="mr-2 h-5 w-5 text-indigo-400" />
                                                    Planet Visualization
                                                </CardTitle>
                                            </CardHeader>

                                            <CardContent className="flex items-center justify-center relative z-10">
                                                <PlanetVisualization
                                                    planetType={getPlanetType(exoplanet.pl_rade as number)}
                                                    planetColor={getPlanetColor(getPlanetType(exoplanet.pl_rade as number)).split(" ")[1]}
                                                    planetName={exoplanet.pl_name as string}
                                                />
                                            </CardContent>

                                            <CardFooter className="relative z-10 pt-0">
                                                <div className="w-full text-center text-sm text-white/60 font-body">
                                                    Interactive visualization of {exoplanet.pl_name} based on available data
                                                </div>
                                            </CardFooter>
                                        </Card>
                                    </motion.div>

                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.5, delay: 0.8 }}
                                    >
                                        <Card className="glass text-white overflow-hidden relative group">
                                            <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/10 via-purple-900/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                                            <CardHeader className="pb-2 relative z-10">
                                                <CardTitle className="flex items-center font-display">
                                                    <Orbit className="mr-2 h-5 w-5 text-indigo-400" />
                                                    Orbital Visualization
                                                </CardTitle>
                                            </CardHeader>

                                            <CardContent className="relative z-10">
                                                <OrbitVisualization
                                                    planetRadius={(exoplanet.pl_rade as number) || 1}
                                                    orbitalPeriod={(exoplanet.pl_orbper as number) || 365}
                                                    starTemperature={(exoplanet.st_teff as number) || 5778}
                                                    planetName={exoplanet.pl_name as string}
                                                />
                                            </CardContent>
                                        </Card>
                                    </motion.div>

                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.5, delay: 0.9 }}
                                    >
                                        <Card className="glass text-white overflow-hidden relative group">
                                            <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/10 via-purple-900/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                                            <CardHeader className="pb-2 relative z-10">
                                                <CardTitle className="flex items-center font-display">
                                                    <Zap className="mr-2 h-5 w-5 text-indigo-400" />
                                                    Quick Facts
                                                </CardTitle>
                                            </CardHeader>

                                            <CardContent className="relative z-10">
                                                <ul className="space-y-2">
                                                    {exoplanet.hasOwnProperty("pl_rade") && (
                                                        <li className="flex justify-between items-center p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                                                            <span className="text-white/70 font-body">Radius:</span>
                                                            <span className="text-white font-medium font-display">
                                                                {formatValue("pl_rade", exoplanet.pl_rade)}
                                                            </span>
                                                        </li>
                                                    )}
                                                    {exoplanet.hasOwnProperty("pl_bmasse") && (
                                                        <li className="flex justify-between items-center p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                                                            <span className="text-white/70 font-body">Mass:</span>
                                                            <span className="text-white font-medium font-display">
                                                                {formatValue("pl_bmasse", exoplanet.pl_bmasse)}
                                                            </span>
                                                        </li>
                                                    )}
                                                    {exoplanet.hasOwnProperty("pl_orbper") && (
                                                        <li className="flex justify-between items-center p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                                                            <span className="text-white/70 font-body">Orbital Period:</span>
                                                            <span className="text-white font-medium font-display">
                                                                {formatValue("pl_orbper", exoplanet.pl_orbper)}
                                                            </span>
                                                        </li>
                                                    )}
                                                    {exoplanet.hasOwnProperty("pl_eqt") && (
                                                        <li className="flex justify-between items-center p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                                                            <span className="text-white/70 font-body">Temperature:</span>
                                                            <span className="text-white font-medium font-display">
                                                                {formatValue("pl_eqt", exoplanet.pl_eqt)}
                                                            </span>
                                                        </li>
                                                    )}
                                                    {exoplanet.hasOwnProperty("habitability_score") && (
                                                        <li className="flex justify-between items-center p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                                                            <span className="text-white/70 font-body">Habitability:</span>
                                                            <span
                                                                className={`font-medium ${getHabitabilityColor(exoplanet.habitability_score as number)} font-display`}
                                                            >
                                                                {formatValue("habitability_score", exoplanet.habitability_score)}
                                                            </span>
                                                        </li>
                                                    )}
                                                </ul>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 1 }}
                                className="px-8"
                            >
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 1.1 }}
                                className="px-8"
                            >
                                <Card className="glass text-white overflow-hidden relative group">
                                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/10 via-purple-900/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                                    <CardHeader className="relative z-10">
                                        <CardTitle className="flex items-center font-display">
                                            <Star className="mr-2 h-5 w-5 text-indigo-400" />
                                            Similar Exoplanets
                                        </CardTitle>
                                        <CardDescription className="text-white/60 font-body">
                                            Other exoplanets with similar characteristics
                                        </CardDescription>
                                    </CardHeader>

                                    <CardContent className="relative z-10">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                            {getSimilarPlanets().map((planet, i) => (
                                                <div
                                                    key={i}
                                                    className="rounded-lg border border-white/10 bg-white/5 p-3 hover:bg-white/10 transition-colors"
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${planet.color}`}></div>
                                                        <div>
                                                            <div className="font-medium text-white font-display">{planet.name}</div>
                                                            <div className="text-xs text-white/60 font-body">{planet.type}</div>
                                                        </div>
                                                    </div>
                                                    <div className="mt-2 text-xs text-white/60 font-body">
                                                        Similarity score: {planet.similarity}%
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        </>
                    ) : (
                        <div className="text-center py-12">
                            <Info className="mx-auto h-12 w-12 text-white/20" />
                            <h3 className="mt-4 text-lg font-medium text-white font-display">Exoplanet not found</h3>
                            <p className="mt-2 text-white/60 font-body">The requested exoplanet could not be found</p>
                            <Button
                                className="mt-6 relative overflow-hidden rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg transition-all duration-300 hover:shadow-indigo-500/25 font-body"
                                onClick={() => router.push("/dashboard/exoplanets")}
                            >
                                <span className="relative z-10">Browse All Exoplanets</span>
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

