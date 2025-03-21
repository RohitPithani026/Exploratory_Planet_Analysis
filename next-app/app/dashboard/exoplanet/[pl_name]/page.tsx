"use client"

import { useEffect, useState, useMemo } from "react"
import { useParams, useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
    ArrowLeft,
    Calendar,
    Download,
    Info,
    Map,
    ThermometerSnowflake,
    Weight,
    Star,
    Rocket,
    Sun,
    Orbit,
    Droplets,
    Zap,
    Share2,
    ChevronRight,
    ChevronLeft,
    ExternalLink,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useToast } from "@/hooks/use-toast"
import { CosmicBackground } from "@/components/cosmic-background"
import Image from "next/image"

// interface ExoplanetData {
//     [key: string]: string | number
//     pl_name: string
// }

export default function ExoplanetDetailsPage() {
    const { pl_name } = useParams<{ pl_name: string }>()
    const router = useRouter()
    const { toast } = useToast()
    const [exoplanet, setExoplanet] = useState<ExoplanetData | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [activeImageIndex, setActiveImageIndex] = useState(0)
    const [showTooltip, setShowTooltip] = useState<string | null>(null)

    // Sample images for the carousel - in a real app, these would be specific to the exoplanet
    const exoplanetImages = useMemo(
        () => [
            {
                src: "/placeholder.svg?height=600&width=800",
                alt: "Exoplanet visualization",
                caption: `Artist's impression of ${pl_name}`,
            },
            {
                src: "/placeholder.svg?height=600&width=800",
                alt: "Exoplanet orbit",
                caption: "Orbital path visualization",
            },
            {
                src: "/placeholder.svg?height=600&width=800",
                alt: "Star system",
                caption: "Host star system",
            },
            {
                src: "/placeholder.svg?height=600&width=800",
                alt: "Surface visualization",
                caption: "Hypothetical surface conditions",
            },
        ],
        [pl_name],
    )

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
        if (score > 0.8) return "text-green-400"
        if (score > 0.6) return "text-blue-400"
        if (score > 0.4) return "text-yellow-400"
        if (score > 0.2) return "text-orange-400"
        return "text-red-400"
    }

    const getProgressColor = (score: number) => {
        if (score > 0.8) return "bg-gradient-to-r from-green-500 to-emerald-500"
        if (score > 0.6) return "bg-gradient-to-r from-blue-500 to-cyan-500"
        if (score > 0.4) return "bg-gradient-to-r from-yellow-500 to-amber-500"
        if (score > 0.2) return "bg-gradient-to-r from-orange-500 to-amber-500"
        return "bg-gradient-to-r from-red-500 to-rose-500"
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
            if (key === "pl_rade") return `${value.toFixed(2)} R⊕`;
            if (key === "pl_bmasse") return `${value.toFixed(2)} M⊕`;
            if (key === "pl_orbper") return `${value.toFixed(1)} days`;
            if (key === "pl_eqt" || key === "st_teff") return `${value.toFixed(0)} K`;
            if (key === "st_mass") return `${value.toFixed(2)} M☉`;
            if (key === "st_rad") return `${value.toFixed(2)} R☉`;
            if (key === "sy_dist") return `${value.toFixed(1)} light years`;
            if (key.includes("score") || key.includes("probability")) return `${(value * 100).toFixed(0)}%`;
            return value.toString();
        }
        return value !== null ? value.toString() : "N/A";
    };


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
    interface ExoplanetData {
        [key: string]: string | number | boolean | null; // Define expected field types
    }

    interface Groups {
        planet: Record<string, string | number | boolean | null>;
        star: Record<string, string | number | boolean | null>;
        system: Record<string, string | number | boolean | null>;
        habitability: Record<string, string | number | boolean | null>;
        other: Record<string, string | number | boolean | null>;
    }

    const groupData = (data: ExoplanetData): Groups => {
        const groups: Groups = {
            planet: {},
            star: {},
            system: {},
            habitability: {},
            other: {},
        };
        Object.entries(data).forEach(([key, value]) => {
            if (key === "pl_name") return; // Skip planet name as it's displayed in the header
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

    return (
        <div className="relative min-h-screen">
            <CosmicBackground>
                <div className="container py-6 space-y-6 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between"
                    >
                        <Button
                            variant="ghost"
                            size="sm"
                            className="w-fit text-white/70 hover:bg-white/10 hover:text-white group"
                            onClick={() => router.back()}
                        >
                            <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
                            Back to Exoplanets
                        </Button>

                        <div className="flex gap-2">
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="border-white/10 bg-white/5 text-white hover:bg-white/10"
                                        >
                                            <Share2 className="mr-2 h-4 w-4" />
                                            Share
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Share this exoplanet</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>

                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="border-white/10 bg-white/5 text-white hover:bg-white/10"
                                        >
                                            <Download className="mr-2 h-4 w-4" />
                                            Export Data
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Download exoplanet data</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>
                    </motion.div>

                    {isLoading ? (
                        <div className="grid gap-6 md:grid-cols-3">
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
                                className="grid gap-6 md:grid-cols-3"
                            >
                                <Card className="bg-black/40 border-white/10 text-white md:col-span-2 backdrop-blur-sm overflow-hidden relative group">
                                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/10 via-purple-900/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                                    <CardHeader className="pb-2 relative z-10">
                                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                                            <motion.div
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ duration: 0.5, delay: 0.2 }}
                                            >
                                                <CardTitle className="text-2xl lg:text-3xl bg-gradient-to-r from-white to-indigo-200 bg-clip-text text-transparent">
                                                    {exoplanet.pl_name}
                                                </CardTitle>
                                                <CardDescription className="text-white/60">
                                                    {exoplanet.hasOwnProperty("sy_dist")
                                                        ? `${formatValue("sy_dist", exoplanet.sy_dist)} from Earth`
                                                        : "Distance unknown"}
                                                </CardDescription>
                                            </motion.div>

                                            <motion.div
                                                initial={{ opacity: 0, scale: 0.8 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                transition={{ duration: 0.5, delay: 0.3 }}
                                            >
                                                <Badge
                                                    className={`${getBadgeColor(getPlanetType(exoplanet.pl_rade as number))} text-sm px-3 py-1`}
                                                >
                                                    {getPlanetType(exoplanet.pl_rade as number)}
                                                </Badge>
                                            </motion.div>
                                        </div>
                                    </CardHeader>

                                    <CardContent className="space-y-6 relative z-10">
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.5, delay: 0.4 }}
                                            className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm"
                                        >
                                            <p className="text-white/80 leading-relaxed">{getPlanetSummary(exoplanet)}</p>
                                        </motion.div>

                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.5, delay: 0.5 }}
                                            className="grid grid-cols-2 md:grid-cols-4 gap-4"
                                        >
                                            {exoplanet.hasOwnProperty("disc_year") && (
                                                <div className="rounded-lg border border-white/10 bg-white/5 p-3 text-center backdrop-blur-sm hover:bg-white/10 transition-colors group">
                                                    <div className="flex justify-center mb-2">
                                                        <Calendar className="h-5 w-5 text-indigo-400 group-hover:text-indigo-300 transition-colors" />
                                                    </div>
                                                    <div className="text-xs text-white/60">Discovery Year</div>
                                                    <div className="text-white font-medium">{exoplanet.disc_year}</div>
                                                </div>
                                            )}

                                            {exoplanet.hasOwnProperty("pl_eqt") && (
                                                <div className="rounded-lg border border-white/10 bg-white/5 p-3 text-center backdrop-blur-sm hover:bg-white/10 transition-colors group">
                                                    <div className="flex justify-center mb-2">
                                                        <ThermometerSnowflake className="h-5 w-5 text-indigo-400 group-hover:text-indigo-300 transition-colors" />
                                                    </div>
                                                    <div className="text-xs text-white/60">Temperature</div>
                                                    <div className="text-white font-medium">{formatValue("pl_eqt", exoplanet.pl_eqt)}</div>
                                                </div>
                                            )}

                                            {exoplanet.hasOwnProperty("pl_rade") && (
                                                <div className="rounded-lg border border-white/10 bg-white/5 p-3 text-center backdrop-blur-sm hover:bg-white/10 transition-colors group">
                                                    <div className="flex justify-center mb-2">
                                                        <Map className="h-5 w-5 text-indigo-400 group-hover:text-indigo-300 transition-colors" />
                                                    </div>
                                                    <div className="text-xs text-white/60">Radius</div>
                                                    <div className="text-white font-medium">{formatValue("pl_rade", exoplanet.pl_rade)}</div>
                                                </div>
                                            )}

                                            {exoplanet.hasOwnProperty("pl_bmasse") && (
                                                <div className="rounded-lg border border-white/10 bg-white/5 p-3 text-center backdrop-blur-sm hover:bg-white/10 transition-colors group">
                                                    <div className="flex justify-center mb-2">
                                                        <Weight className="h-5 w-5 text-indigo-400 group-hover:text-indigo-300 transition-colors" />
                                                    </div>
                                                    <div className="text-xs text-white/60">Mass</div>
                                                    <div className="text-white font-medium">{formatValue("pl_bmasse", exoplanet.pl_bmasse)}</div>
                                                </div>
                                            )}
                                        </motion.div>

                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.5, delay: 0.6 }}
                                        >
                                            <Tabs defaultValue="overview" className="mt-6">
                                                <TabsList className="bg-white/5 border border-white/10 p-0.5 backdrop-blur-sm">
                                                    <TabsTrigger
                                                        value="overview"
                                                        className="data-[state=active]:bg-white/10 data-[state=active]:text-white text-white/70"
                                                    >
                                                        <Info className="mr-2 h-4 w-4" />
                                                        Overview
                                                    </TabsTrigger>
                                                    <TabsTrigger
                                                        value="habitability"
                                                        className="data-[state=active]:bg-white/10 data-[state=active]:text-white text-white/70"
                                                    >
                                                        <Droplets className="mr-2 h-4 w-4" />
                                                        Habitability
                                                    </TabsTrigger>
                                                    <TabsTrigger
                                                        value="star"
                                                        className="data-[state=active]:bg-white/10 data-[state=active]:text-white text-white/70"
                                                    >
                                                        <Sun className="mr-2 h-4 w-4" />
                                                        Host Star
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
                                                                <h3 className="text-sm font-medium text-white/60 flex items-center">
                                                                    {getFieldName(key)}
                                                                    {showTooltip === key && <span className="ml-2 text-xs text-white/40">({key})</span>}
                                                                </h3>
                                                                <p className="text-white">{formatValue(key, value)}</p>
                                                            </div>
                                                        ))}

                                                        {Object.entries(groupData(exoplanet).system).map(([key, value]) => (
                                                            <div
                                                                key={key}
                                                                className="space-y-2 bg-white/5 p-3 rounded-lg border border-white/10 hover:bg-white/10 transition-colors"
                                                                onMouseEnter={() => setShowTooltip(key)}
                                                                onMouseLeave={() => setShowTooltip(null)}
                                                            >
                                                                <h3 className="text-sm font-medium text-white/60 flex items-center">
                                                                    {getFieldName(key)}
                                                                    {showTooltip === key && <span className="ml-2 text-xs text-white/40">({key})</span>}
                                                                </h3>
                                                                <p className="text-white">{formatValue(key, value)}</p>
                                                            </div>
                                                        ))}

                                                        {Object.entries(groupData(exoplanet).other).map(([key, value]) => (
                                                            <div
                                                                key={key}
                                                                className="space-y-2 bg-white/5 p-3 rounded-lg border border-white/10 hover:bg-white/10 transition-colors"
                                                                onMouseEnter={() => setShowTooltip(key)}
                                                                onMouseLeave={() => setShowTooltip(null)}
                                                            >
                                                                <h3 className="text-sm font-medium text-white/60 flex items-center">
                                                                    {getFieldName(key)}
                                                                    {showTooltip === key && <span className="ml-2 text-xs text-white/40">({key})</span>}
                                                                </h3>
                                                                <p className="text-white">{formatValue(key, value)}</p>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </TabsContent>

                                                <TabsContent value="habitability" className="pt-4 space-y-4">
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                        {exoplanet.hasOwnProperty("habitability_score") && (
                                                            <div className="space-y-2 bg-white/5 p-4 rounded-lg border border-white/10">
                                                                <div className="flex items-center justify-between">
                                                                    <h3 className="text-sm font-medium text-white/60">Habitability Score</h3>
                                                                    <span
                                                                        className={`text-sm font-medium ${getHabitabilityColor(exoplanet.habitability_score as number)}`}
                                                                    >
                                                                        {formatValue("habitability_score", exoplanet.habitability_score)}
                                                                    </span>
                                                                </div>
                                                                <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                                                                    <motion.div
                                                                        initial={{ width: 0 }}
                                                                        animate={{ width: `${(exoplanet.habitability_score as number) * 100}%` }}
                                                                        transition={{ duration: 1, delay: 0.2 }}
                                                                        className={`h-full rounded-full ${getProgressColor(exoplanet.habitability_score as number)}`}
                                                                    />
                                                                </div>
                                                                <p className="text-xs text-white/60">
                                                                    Based on planetary characteristics and potential for supporting life
                                                                </p>
                                                            </div>
                                                        )}

                                                        {exoplanet.hasOwnProperty("terraformability_score") && (
                                                            <div className="space-y-2 bg-white/5 p-4 rounded-lg border border-white/10">
                                                                <div className="flex items-center justify-between">
                                                                    <h3 className="text-sm font-medium text-white/60">Terraformability Score</h3>
                                                                    <span
                                                                        className={`text-sm font-medium ${getHabitabilityColor(exoplanet.terraformability_score as number)}`}
                                                                    >
                                                                        {formatValue("terraformability_score", exoplanet.terraformability_score)}
                                                                    </span>
                                                                </div>
                                                                <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                                                                    <motion.div
                                                                        initial={{ width: 0 }}
                                                                        animate={{ width: `${(exoplanet.terraformability_score as number) * 100}%` }}
                                                                        transition={{ duration: 1, delay: 0.3 }}
                                                                        className={`h-full rounded-full ${getProgressColor(exoplanet.terraformability_score as number)}`}
                                                                    />
                                                                </div>
                                                                <p className="text-xs text-white/60">
                                                                    Potential for engineering the planet to support human life
                                                                </p>
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Display any other habitability related fields */}
                                                    {Object.entries(groupData(exoplanet).habitability)
                                                        .filter(([key]) => !["habitability_score", "terraformability_score"].includes(key))
                                                        .map(([key, value]) => (
                                                            <div key={key} className="space-y-2 bg-white/5 p-3 rounded-lg border border-white/10">
                                                                <h3 className="text-sm font-medium text-white/60">{getFieldName(key)}</h3>
                                                                <p className="text-white">{formatValue(key, value)}</p>
                                                            </div>
                                                        ))}

                                                    <Separator className="bg-white/10" />

                                                    <div className="rounded-lg border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                                                        <div className="flex items-start space-x-2">
                                                            <Info className="h-5 w-5 text-indigo-400 mt-0.5" />
                                                            <div>
                                                                <h4 className="font-medium text-white">Habitability Assessment</h4>
                                                                <p className="text-sm text-white/60 mt-1">
                                                                    {exoplanet.hasOwnProperty("habitability_score") &&
                                                                        (exoplanet.habitability_score as number) > 0.7
                                                                        ? "This exoplanet has a high habitability score, primarily due to its position in the habitable zone of its star and estimated physical properties. It represents one of the better candidates for potential habitability."
                                                                        : exoplanet.hasOwnProperty("habitability_score") &&
                                                                            (exoplanet.habitability_score as number) > 0.4
                                                                            ? "This exoplanet has a moderate habitability score. While not ideal for Earth-like life, it may have conditions that could support some forms of life or be a candidate for terraforming."
                                                                            : "This exoplanet has a low habitability score based on available data. It likely has conditions that would make it challenging for Earth-like life to survive without significant protection or adaptation."}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </TabsContent>

                                                <TabsContent value="star" className="pt-4 space-y-4">
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                        {Object.entries(groupData(exoplanet).star).map(([key, value]) => (
                                                            <div
                                                                key={key}
                                                                className="space-y-2 bg-white/5 p-3 rounded-lg border border-white/10 hover:bg-white/10 transition-colors"
                                                            >
                                                                <h3 className="text-sm font-medium text-white/60">{getFieldName(key)}</h3>
                                                                <p className="text-white">{formatValue(key, value)}</p>
                                                            </div>
                                                        ))}
                                                    </div>

                                                    {Object.keys(groupData(exoplanet).star).length > 0 && (
                                                        <div className="rounded-lg border border-white/10 bg-white/5 p-4 backdrop-blur-sm mt-4">
                                                            <div className="flex items-start space-x-2">
                                                                <Sun className="h-5 w-5 text-yellow-400 mt-0.5" />
                                                                <div>
                                                                    <h4 className="font-medium text-white">Host Star Information</h4>
                                                                    <p className="text-sm text-white/60 mt-1">
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
                                        <Card className="bg-black/40 border-white/10 text-white backdrop-blur-sm overflow-hidden relative group">
                                            <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/10 via-purple-900/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                                            <CardHeader className="pb-2 relative z-10">
                                                <CardTitle className="flex items-center">
                                                    <Rocket className="mr-2 h-5 w-5 text-indigo-400" />
                                                    Exoplanet Visualization
                                                </CardTitle>
                                            </CardHeader>

                                            <CardContent className="relative z-10">
                                                <div className="relative w-full aspect-video rounded-lg overflow-hidden">
                                                    {/* Image carousel */}
                                                    <div className="relative w-full h-full">
                                                        <AnimatePresence initial={false}>
                                                            <motion.div
                                                                key={activeImageIndex}
                                                                initial={{ opacity: 0 }}
                                                                animate={{ opacity: 1 }}
                                                                exit={{ opacity: 0 }}
                                                                transition={{ duration: 0.5 }}
                                                                className="absolute inset-0"
                                                            >

                                                                <Image
                                                                    src={exoplanetImages[activeImageIndex]?.src ?? "/placeholder.svg"}
                                                                    alt={exoplanetImages[activeImageIndex]?.alt || "Exoplanet Image"}
                                                                    width={500} // Add appropriate width
                                                                    height={500} // Add appropriate height
                                                                    className="w-full h-full object-cover rounded-lg"
                                                                />

                                                                <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-2 text-center text-sm text-white/80 backdrop-blur-sm">
                                                                    {exoplanetImages[activeImageIndex].caption}
                                                                </div>
                                                            </motion.div>
                                                        </AnimatePresence>

                                                        {/* Navigation buttons */}
                                                        <button
                                                            className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-1 text-white/70 backdrop-blur-sm transition-all hover:bg-black/70 hover:text-white"
                                                            onClick={() =>
                                                                setActiveImageIndex((prev) => (prev === 0 ? exoplanetImages.length - 1 : prev - 1))
                                                            }
                                                        >
                                                            <ChevronLeft className="h-5 w-5" />
                                                        </button>

                                                        <button
                                                            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-1 text-white/70 backdrop-blur-sm transition-all hover:bg-black/70 hover:text-white"
                                                            onClick={() =>
                                                                setActiveImageIndex((prev) => (prev === exoplanetImages.length - 1 ? 0 : prev + 1))
                                                            }
                                                        >
                                                            <ChevronRight className="h-5 w-5" />
                                                        </button>
                                                    </div>
                                                </div>

                                                {/* Dots for carousel */}
                                                <div className="flex justify-center mt-2 space-x-1">
                                                    {exoplanetImages.map((_, index) => (
                                                        <button
                                                            key={index}
                                                            className={`h-1.5 rounded-full transition-all ${index === activeImageIndex ? "w-6 bg-indigo-500" : "w-1.5 bg-white/30"
                                                                }`}
                                                            onClick={() => setActiveImageIndex(index)}
                                                        />
                                                    ))}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </motion.div>

                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.5, delay: 0.8 }}
                                    >
                                        <Card className="bg-black/40 border-white/10 text-white backdrop-blur-sm overflow-hidden relative group">
                                            <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/10 via-purple-900/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                                            <CardHeader className="pb-2 relative z-10">
                                                <CardTitle className="flex items-center">
                                                    <Orbit className="mr-2 h-5 w-5 text-indigo-400" />
                                                    Planet Visualization
                                                </CardTitle>
                                            </CardHeader>

                                            <CardContent className="flex items-center justify-center relative z-10">
                                                <div className="relative w-full aspect-square max-w-xs">
                                                    {/* Simple visualization based on planet type */}
                                                    <div
                                                        className={`absolute inset-0 rounded-full bg-gradient-to-br ${getPlanetColor(
                                                            getPlanetType(exoplanet.pl_rade as number),
                                                        )} animate-pulse`}
                                                    >
                                                        <motion.div
                                                            animate={{
                                                                rotate: 360,
                                                            }}
                                                            transition={{
                                                                duration: 120,
                                                                repeat: Number.POSITIVE_INFINITY,
                                                                ease: "linear",
                                                            }}
                                                            className="w-full h-full"
                                                        >
                                                            <div className="absolute inset-0 opacity-20 mix-blend-overlay">
                                                                <div className="absolute left-[10%] top-[15%] w-[30%] h-[25%] rounded-full bg-white/30 blur-md"></div>
                                                                <div className="absolute right-[20%] bottom-[30%] w-[40%] h-[15%] rounded-full bg-white/20 blur-md"></div>
                                                            </div>
                                                        </motion.div>
                                                    </div>
                                                    <div className="absolute inset-4 rounded-full bg-black/30"></div>
                                                </div>
                                            </CardContent>

                                            <CardFooter className="relative z-10 pt-0">
                                                <div className="w-full text-center text-sm text-white/60">
                                                    Artist&apos;s impression of {exoplanet.pl_name} based on available data
                                                </div>
                                            </CardFooter>
                                        </Card>
                                    </motion.div>

                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.5, delay: 0.9 }}
                                    >
                                        <Card className="bg-black/40 border-white/10 text-white backdrop-blur-sm overflow-hidden relative group">
                                            <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/10 via-purple-900/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                                            <CardHeader className="pb-2 relative z-10">
                                                <CardTitle className="flex items-center">
                                                    <Zap className="mr-2 h-5 w-5 text-indigo-400" />
                                                    Quick Facts
                                                </CardTitle>
                                            </CardHeader>

                                            <CardContent className="relative z-10">
                                                <ul className="space-y-2">
                                                    {exoplanet.hasOwnProperty("pl_rade") && (
                                                        <li className="flex justify-between items-center p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                                                            <span className="text-white/70">Radius:</span>
                                                            <span className="text-white font-medium">
                                                                {formatValue("pl_rade", exoplanet.pl_rade)}
                                                            </span>
                                                        </li>
                                                    )}
                                                    {exoplanet.hasOwnProperty("pl_bmasse") && (
                                                        <li className="flex justify-between items-center p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                                                            <span className="text-white/70">Mass:</span>
                                                            <span className="text-white font-medium">
                                                                {formatValue("pl_bmasse", exoplanet.pl_bmasse)}
                                                            </span>
                                                        </li>
                                                    )}
                                                    {exoplanet.hasOwnProperty("pl_orbper") && (
                                                        <li className="flex justify-between items-center p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                                                            <span className="text-white/70">Orbital Period:</span>
                                                            <span className="text-white font-medium">
                                                                {formatValue("pl_orbper", exoplanet.pl_orbper)}
                                                            </span>
                                                        </li>
                                                    )}
                                                    {exoplanet.hasOwnProperty("pl_eqt") && (
                                                        <li className="flex justify-between items-center p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                                                            <span className="text-white/70">Temperature:</span>
                                                            <span className="text-white font-medium">{formatValue("pl_eqt", exoplanet.pl_eqt)}</span>
                                                        </li>
                                                    )}
                                                    {exoplanet.hasOwnProperty("habitability_score") && (
                                                        <li className="flex justify-between items-center p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                                                            <span className="text-white/70">Habitability:</span>
                                                            <span
                                                                className={`font-medium ${getHabitabilityColor(exoplanet.habitability_score as number)}`}
                                                            >
                                                                {formatValue("habitability_score", exoplanet.habitability_score)}
                                                            </span>
                                                        </li>
                                                    )}
                                                </ul>
                                            </CardContent>

                                            <CardFooter className="relative z-10 pt-0">
                                                <Button
                                                    variant="outline"
                                                    className="w-full border-white/10 bg-white/5 hover:bg-white/10 text-white"
                                                >
                                                    <ExternalLink className="mr-2 h-4 w-4" />
                                                    View in NASA Archive
                                                </Button>
                                            </CardFooter>
                                        </Card>
                                    </motion.div>
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 1 }}
                            >
                                <Card className="bg-black/40 border-white/10 text-white backdrop-blur-sm overflow-hidden relative group">
                                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/10 via-purple-900/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                                    <CardHeader className="relative z-10">
                                        <CardTitle className="flex items-center">
                                            <Star className="mr-2 h-5 w-5 text-indigo-400" />
                                            Similar Exoplanets
                                        </CardTitle>
                                        <CardDescription className="text-white/60">
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
                                                            <div className="font-medium text-white">{planet.name}</div>
                                                            <div className="text-xs text-white/60">{planet.type}</div>
                                                        </div>
                                                    </div>
                                                    <div className="mt-2 text-xs text-white/60">Similarity score: {planet.similarity}%</div>
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
                            <h3 className="mt-4 text-lg font-medium text-white">Exoplanet not found</h3>
                            <p className="mt-2 text-white/60">The requested exoplanet could not be found</p>
                            <Button
                                className="mt-6 relative overflow-hidden rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg transition-all duration-300 hover:shadow-indigo-500/25"
                                onClick={() => router.push("/dashboard/exoplanets")}
                            >
                                <span className="relative z-10">Browse All Exoplanets</span>
                            </Button>
                        </div>
                    )}
                </div>
            </CosmicBackground>
        </div>
    )
}

