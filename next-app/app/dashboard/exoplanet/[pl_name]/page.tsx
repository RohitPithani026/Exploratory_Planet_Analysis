"use client"

import { useEffect, useState, useRef } from "react"
import { useParams, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import {
    Calendar, Info, Map, ThermometerSnowflake, Weight,
    Star, Sun, Orbit, Globe, Sparkles, Compass, Zap,
    ChevronDown, ChevronUp, Bot,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useTheme } from "@/components/theme-provider"
import { useToast } from "@/hooks/use-toast"
import { ParticleBackground } from "@/components/particle-background"
import { SpaceBackground } from "@/components/space-background"
import { OrbitVisualization } from "@/components/orbit-visualization"
import { PlanetVisualization } from "@/components/planet-visualization"
import { useAIContent } from "@/hooks/use-ai-content"
import { ShareDialog } from "@/components/share-dialog"
import { ImportDataDialog } from "@/components/import-data-dialog"
import { AiSidebar } from "@/components/ai-sidebar"

interface ExoplanetData {
    [key: string]: string | number | boolean | null
    pl_name: string
}

interface SimilarPlanetEntry {
    pl_name: string
    pl_rade: number
    habitability_score: number
}

export default function ExoplanetDetailsPage() {
    const { pl_name } = useParams<{ pl_name: string }>()
    const router = useRouter()
    const { toast } = useToast()
    const [exoplanet, setExoplanet] = useState<ExoplanetData | null>(null)
    const [isLoading, setIsLoading] = useState(true)
const [similarPlanets, setSimilarPlanets] = useState<SimilarPlanetEntry[]>([])
    const [loadingSimilar, setLoadingSimilar] = useState(false)
    const [isNarrativeExpanded, setIsNarrativeExpanded] = useState(false)
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
    const { animations, particleEffects } = useTheme()

    const containerRef = useRef<HTMLDivElement>(null)
    const gradientRef = useRef<HTMLDivElement>(null)
    const summaryTriggered = useRef(false)

    const {
        summary, imagePrompts, factCard,
        isLoadingSummary, isLoadingImages, isLoadingFactCard,
        error,
        generateSummary, generateImagePrompts, generateFactCard,
    } = useAIContent(exoplanet)

    // Mouse gradient — useRef + direct DOM write, no setState re-renders
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!gradientRef.current || !containerRef.current) return
            const rect = containerRef.current.getBoundingClientRect()
            gradientRef.current.style.background =
                `radial-gradient(circle at ${e.clientX - rect.left}px ${e.clientY - rect.top}px, rgba(139,92,246,0.15), transparent 25%)`
        }
        window.addEventListener("mousemove", handleMouseMove)
        return () => window.removeEventListener("mousemove", handleMouseMove)
    }, [])

    // Fetch planet data
    useEffect(() => {
        const fetchExoplanetData = async () => {
            try {
                const response = await fetch(`/api/data/${pl_name}`)
                if (!response.ok) throw new Error(`API responded with status: ${response.status}`)
                setExoplanet(await response.json())
            } catch (err) {
                console.error("Error fetching exoplanet data:", err)
                toast({ title: "Error", description: "Failed to load exoplanet data", variant: "destructive" })
            } finally {
                setIsLoading(false)
            }
        }
        fetchExoplanetData()
    }, [pl_name, toast])

    // Auto-trigger all AI content once per planet
    useEffect(() => {
        if (exoplanet && !summaryTriggered.current) {
            summaryTriggered.current = true
            generateSummary()
            generateFactCard()
            generateImagePrompts()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [exoplanet?.pl_name])

    // Fetch real similar planets
    useEffect(() => {
        if (!exoplanet) return
        setLoadingSimilar(true)
        const currentType = getPlanetType(exoplanet.pl_rade as number)
        const currentScore = (exoplanet.habitability_score as number) || 0
        fetch("/api/exoplanets?pageSize=200&page=1")
            .then(r => r.json())
            .then(({ data }) => {
                if (!Array.isArray(data)) return
                const similar = (data as ExoplanetData[])
                    .filter(p =>
                        p.pl_name !== exoplanet.pl_name &&
                        getPlanetType(p.pl_rade as number) === currentType)
                    .sort((a, b) =>
                        Math.abs(((a.habitability_score as number) || 0) - currentScore) -
                        Math.abs(((b.habitability_score as number) || 0) - currentScore))
                    .slice(0, 4)
                    .map(p => ({
                        pl_name: p.pl_name,
                        pl_rade: (p.pl_rade as number) || 1,
                        habitability_score: (p.habitability_score as number) || 0,
                    }))
                setSimilarPlanets(similar)
            })
            .catch(() => {})
            .finally(() => setLoadingSimilar(false))
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [exoplanet?.pl_name])

    // ── Helpers ──────────────────────────────────────────────────────

    const normalizeScore = (score: number) => score > 1 ? score : score * 100

    const getHabitabilityColor = (score: number) => {
        if (score > 70) return "text-green-400"
        if (score > 50) return "text-blue-400"
        if (score > 30) return "text-yellow-400"
        if (score > 10) return "text-orange-400"
        return "text-red-400"
    }

    const getHabitabilityBarColor = (score: number) => {
        if (score > 70) return "from-green-500 to-green-400"
        if (score > 50) return "from-blue-500 to-blue-400"
        if (score > 30) return "from-yellow-500 to-yellow-400"
        if (score > 10) return "from-orange-500 to-orange-400"
        return "from-red-500 to-red-400"
    }

    const getHabitabilityLabel = (score: number) => {
        if (score > 70) return "Highly Habitable"
        if (score > 50) return "Potentially Habitable"
        if (score > 30) return "Marginally Habitable"
        if (score > 10) return "Challenging"
        return "Hostile Environment"
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
            case "Earth-like": return "bg-green-500/20 text-green-400 border-green-500/30"
            case "Super-Earth": return "bg-blue-500/20 text-blue-400 border-blue-500/30"
            case "Neptune-like": return "bg-indigo-500/20 text-indigo-400 border-indigo-500/30"
            case "Gas Giant": return "bg-purple-500/20 text-purple-400 border-purple-500/30"
            case "Sub-Earth": return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
            default: return "bg-gray-500/20 text-gray-400 border-gray-500/30"
        }
    }

    const formatValue = (key: string, value: string | number | boolean | null): string => {
        if (typeof value === "number") {
            if (key === "pl_rade") return `${value.toFixed(2)} R⊕`
            if (key === "pl_bmasse") return `${value.toFixed(2)} M⊕`
            if (key === "pl_orbper") return `${value.toFixed(1)} days`
            if (key === "pl_eqt" || key === "st_teff") return `${value.toFixed(0)} K`
            if (key === "st_mass") return `${value.toFixed(2)} M☉`
            if (key === "st_rad") return `${value.toFixed(2)} R☉`
            if (key === "sy_dist") return `${value.toFixed(1)} light years`
            if (key.includes("score") || key.includes("probability"))
                return value > 1 ? `${value.toFixed(0)}%` : `${(value * 100).toFixed(1)}%`
            return value.toString()
        }
        return value !== null ? value.toString() : "N/A"
    }

    const getFieldName = (key: string): string => {
        const nameMap: Record<string, string> = {
            pl_name: "Planet Name", pl_rade: "Planet Radius", pl_bmasse: "Planet Mass",
            pl_orbper: "Orbital Period", pl_eqt: "Equilibrium Temperature",
            pl_orbsmax: "Orbital Semi-Major Axis", pl_orbeccen: "Orbital Eccentricity",
            st_teff: "Star Temperature", st_mass: "Star Mass", st_rad: "Star Radius",
            st_met: "Star Metallicity", sy_dist: "Distance from Earth",
            disc_year: "Discovery Year", disc_facility: "Discovery Facility",
            disc_method: "Discovery Method",
            habitability_score: "Habitability Score", terraformability_score: "Terraformability Score",
            water_probability: "Water Probability", ESI: "Earth Similarity Index",
        }
        if (nameMap[key]) return nameMap[key]
        return key
            .replace("pl_", "").replace("st_", "Star ").replace("sy_", "System ")
            .replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase())
    }

const getPlanetColor = (type: string) => {
        switch (type) {
            case "Earth-like": return "from-blue-600 to-green-800"
            case "Super-Earth": return "from-indigo-600 to-blue-800"
            case "Neptune-like": return "from-indigo-600 to-purple-800"
            case "Gas Giant": return "from-purple-600 to-red-800"
            case "Sub-Earth": return "from-yellow-600 to-orange-800"
            default: return "from-gray-600 to-gray-800"
        }
    }

    const getStarType = (teff: number) => {
        if (!teff) return "Unknown"
        if (teff > 30000) return "O-type"
        if (teff > 10000) return "B-type"
        if (teff > 7500) return "A-type"
        if (teff > 6000) return "F-type"
        if (teff > 5200) return "G-type (Sun-like)"
        if (teff > 3700) return "K-type"
        return "M-type (Red Dwarf)"
    }

    const getPlanetSummary = (data: ExoplanetData) => {
        const type = getPlanetType(data.pl_rade as number)
        const habitScore = (data.habitability_score as number) || 0
        const terraScore = (data.terraformability_score as number) || 0
        let s = `${data.pl_name} is a ${type.toLowerCase()} exoplanet`
        if (data.sy_dist) s += ` located approximately ${formatValue("sy_dist", data.sy_dist)} from Earth`
        if (data.disc_year) s += `, discovered in ${data.disc_year}`
        if (data.disc_facility) s += ` by ${data.disc_facility}`
        s += ". "
        if (data.pl_orbper) {
            s += `It orbits its host star every ${formatValue("pl_orbper", data.pl_orbper)}`
            if (data.pl_eqt) s += ` with a surface temperature of approximately ${formatValue("pl_eqt", data.pl_eqt)}`
            s += ". "
        }
        if (habitScore > 0) {
            const norm = normalizeScore(habitScore)
            if (norm > 70) s += `With a high habitability score of ${formatValue("habitability_score", habitScore)}, it's considered one of the more promising candidates for potential habitability.`
            else if (norm > 40) s += `It has a moderate habitability score of ${formatValue("habitability_score", habitScore)}, suggesting some conditions that might support certain forms of life.`
            else s += `Its low habitability score of ${formatValue("habitability_score", habitScore)} indicates conditions that would be challenging for Earth-like life.`
        }
        if (terraScore > 0) s += ` The planet has a terraformability potential of ${formatValue("terraformability_score", terraScore)}.`
        return s
    }

    const getEarthComparison = (key: string, value: number): string => {
        if (key === "pl_rade") return value === 1 ? "= Earth" : `${value.toFixed(2)}× Earth`
        if (key === "pl_bmasse") return value === 1 ? "= Earth" : `${value.toFixed(1)}× Earth`
        if (key === "pl_orbper") return `${(value / 365.25).toFixed(2)} yr`
        if (key === "pl_eqt") { const d = Math.round(value - 288); return d > 0 ? `+${d}K vs Earth` : `${d}K vs Earth` }
        return ""
    }

    const getPlanetUrl = () => typeof window !== "undefined" ? window.location.href : ""

    const stripMarkdown = (text: string) =>
        text.replace(/\*\*([^*]+)\*\*/g, "$1").replace(/\*([^*]+)\*/g, "$1").replace(/\*+/g, "")

    const getTerraformabilityLabel = (score: number) => {
        if (score > 70) return "High Potential"
        if (score > 50) return "Promising"
        if (score > 30) return "Moderate"
        if (score > 10) return "Difficult"
        return "Very Difficult"
    }

    const handleImportData = (data: ExoplanetData) => {
        summaryTriggered.current = false
        setSimilarPlanets([])
        setExoplanet(data)
        toast({ title: "Data imported", description: "Exoplanet data has been successfully imported." })
    }

    // Stat chips config
    const statChips = [
        { key: "pl_rade", label: "Radius", Icon: Map },
        { key: "pl_bmasse", label: "Mass", Icon: Weight },
        { key: "pl_eqt", label: "Temperature", Icon: ThermometerSnowflake },
        { key: "pl_orbper", label: "Orbital Period", Icon: Orbit },
    ] as const

    // ── Render ───────────────────────────────────────────────────────

    return (
        <div ref={containerRef} className="relative">
            {exoplanet && (
                <AiSidebar
                    planetData={exoplanet as Record<string, string | number | boolean | null>}
                    isOpen={isSidebarOpen}
                    onClose={() => setIsSidebarOpen(false)}
                />
            )}

            {/* ── FLOATING ASK AI BUTTON ──────────────────────────── */}
            {exoplanet && !isSidebarOpen && (
                <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ type: "spring", damping: 18, stiffness: 260, delay: 0.6 }}
                    className="fixed bottom-7 right-7 z-[60]"
                >
                    {/* Pulse rings */}
                    <motion.span
                        className="absolute inset-0 rounded-full"
                        style={{ background: "rgba(139,92,246,0.35)" }}
                        animate={{ scale: [1, 1.55], opacity: [0.6, 0] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
                    />
                    <motion.span
                        className="absolute inset-0 rounded-full"
                        style={{ background: "rgba(99,102,241,0.25)" }}
                        animate={{ scale: [1, 1.9], opacity: [0.5, 0] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeOut", delay: 0.5 }}
                    />

                    <motion.button
                        onClick={() => setIsSidebarOpen(true)}
                        whileHover={{ scale: 1.06 }}
                        whileTap={{ scale: 0.94 }}
                        className="relative flex items-center gap-2.5 rounded-full px-5 py-3.5 font-display text-sm font-semibold text-white"
                        style={{
                            background: "linear-gradient(135deg, #7c3aed 0%, #6d28d9 50%, #5b21b6 100%)",
                            boxShadow:
                                "0 0 0 1px rgba(139,92,246,0.4), 0 8px 32px rgba(109,40,217,0.55), 0 2px 8px rgba(0,0,0,0.4)",
                        }}
                    >
                        <Bot className="h-4.5 w-4.5 text-violet-200" />
                        Ask AI
                        <Sparkles className="h-3.5 w-3.5 text-violet-200/70" />
                    </motion.button>
                </motion.div>
            )}
            <div className="relative min-h-screen space-bg">
                <div className="absolute inset-0 nebula-bg" />
                {particleEffects && <ParticleBackground />}
                {particleEffects && <SpaceBackground />}
                {animations && (
                    <div ref={gradientRef} className="pointer-events-none absolute inset-0 z-30 opacity-70" />
                )}

                <div className="container mx-auto relative z-10 py-6 space-y-8 px-4 sm:px-8">
                    {/* ── PAGE TITLE ───────────────────────────────────── */}
                    <div className="flex flex-wrap items-start justify-between gap-4">
                        <div className="min-w-0">
                            <h1 className="text-3xl font-bold tracking-tight text-white font-display break-words">
                                {exoplanet?.pl_name ?? "—"}
                            </h1>
                            {exoplanet && (
                                <div className="mt-1 flex flex-wrap items-center gap-2">
                                    <p className="text-white/50 font-body text-sm">
                                        {getStarType(exoplanet.st_teff as number)} Star System
                                    </p>
                                    <Badge className={`${getBadgeColor(getPlanetType(exoplanet.pl_rade as number))} text-xs px-2 py-0.5 font-body`}>
                                        {getPlanetType(exoplanet.pl_rade as number)}
                                    </Badge>
                                </div>
                            )}
                        </div>
                        {exoplanet && (
                            <div className="flex items-center gap-2 flex-shrink-0">
                                <ShareDialog planetName={exoplanet.pl_name} planetUrl={getPlanetUrl()} planetData={exoplanet} />
                                <ImportDataDialog onImportSuccess={handleImportData} />
                            </div>
                        )}
                    </div>

                    {/* Loading skeleton */}
                    {isLoading ? (
                        <div className="space-y-6">
                            <div className="grid md:grid-cols-[55%_45%] gap-6">
                                <Card className="glass text-white animate-pulse">
                                    <CardContent className="pt-6 space-y-4">
                                        <div className="h-10 w-2/3 bg-white/10 rounded" />
                                        <div className="h-4 w-1/3 bg-white/5 rounded" />
                                        <div className="h-3 w-full bg-white/5 rounded mt-6" />
                                        <div className="grid grid-cols-4 gap-3 mt-2">
                                            {[...Array(4)].map((_, i) => <div key={i} className="h-20 bg-white/5 rounded" />)}
                                        </div>
                                    </CardContent>
                                </Card>
                                <Card className="glass animate-pulse">
                                    <CardContent className="pt-6">
                                        <div className="h-52 bg-white/5 rounded" />
                                    </CardContent>
                                </Card>
                            </div>
                        </div>

                    ) : exoplanet ? (
                        <>
                            {/* ── MAIN LAYOUT: 70/30 ───────────────────────────────── */}
                            <div className="grid md:grid-cols-[70%_30%] gap-6 items-stretch">

                                {/* LEFT PANE: Hero + AI Analysis */}
                                <div className="flex flex-col gap-6 h-full min-h-0">

                                {/* S1: HERO ────────────────────────────────────────── */}
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.6, delay: 0.1 }}
                                >
                                    <Card className="glass text-white h-full">
                                        <CardContent className="pt-6 space-y-5">

                                            {/* Habitability + Terraformability KPI cards */}
                                            <div className="grid grid-cols-2 gap-3">
                                                {exoplanet.hasOwnProperty("habitability_score") && (
                                                    <div className={`relative overflow-hidden rounded-xl border border-l-2 p-4 pb-0 ${
                                                        normalizeScore(exoplanet.habitability_score as number) > 70
                                                            ? "border-green-500/25 border-l-green-500 bg-green-500/10"
                                                            : normalizeScore(exoplanet.habitability_score as number) > 50
                                                            ? "border-blue-500/25 border-l-blue-400 bg-blue-500/10"
                                                            : normalizeScore(exoplanet.habitability_score as number) > 30
                                                            ? "border-yellow-500/25 border-l-yellow-500 bg-yellow-500/10"
                                                            : normalizeScore(exoplanet.habitability_score as number) > 10
                                                            ? "border-orange-500/25 border-l-orange-500 bg-orange-500/10"
                                                            : "border-red-500/25 border-l-red-500 bg-red-500/10"
                                                    }`}>
                                                        <div className="text-xs text-white/45 font-body mb-1">Habitability</div>
                                                        <div className={`text-3xl font-display font-bold leading-none ${getHabitabilityColor(normalizeScore(exoplanet.habitability_score as number))}`}>
                                                            {normalizeScore(exoplanet.habitability_score as number).toFixed(1)}%
                                                        </div>
                                                        <div className={`text-xs font-body mt-1 mb-3 ${getHabitabilityColor(normalizeScore(exoplanet.habitability_score as number))}`}>
                                                            {getHabitabilityLabel(normalizeScore(exoplanet.habitability_score as number))}
                                                        </div>
                                                        <div className="h-1 w-full overflow-hidden -mx-0">
                                                            <motion.div
                                                                className={`h-full bg-gradient-to-r ${getHabitabilityBarColor(normalizeScore(exoplanet.habitability_score as number))}`}
                                                                initial={{ width: 0 }}
                                                                animate={{ width: `${Math.min(normalizeScore(exoplanet.habitability_score as number), 100)}%` }}
                                                                transition={{ duration: 1.2, delay: 0.4, ease: "easeOut" }}
                                                            />
                                                        </div>
                                                    </div>
                                                )}
                                                {exoplanet.hasOwnProperty("terraformability_score") && (
                                                    <div className="relative overflow-hidden rounded-xl border border-l-2 border-blue-400/25 border-l-blue-400 bg-blue-500/10 p-4 pb-0">
                                                        <div className="text-xs text-white/45 font-body mb-1">Terraformability</div>
                                                        <div className="text-3xl font-display font-bold leading-none text-blue-400">
                                                            {normalizeScore(exoplanet.terraformability_score as number).toFixed(1)}%
                                                        </div>
                                                        <div className="text-xs font-body mt-1 mb-3 text-blue-400">
                                                            {getTerraformabilityLabel(normalizeScore(exoplanet.terraformability_score as number))}
                                                        </div>
                                                        <div className="h-1 w-full overflow-hidden">
                                                            <motion.div
                                                                className="h-full bg-gradient-to-r from-blue-500 to-teal-400"
                                                                initial={{ width: 0 }}
                                                                animate={{ width: `${Math.min(normalizeScore(exoplanet.terraformability_score as number), 100)}%` }}
                                                                transition={{ duration: 1.2, delay: 0.6, ease: "easeOut" }}
                                                            />
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            {/* 4 stat chips */}
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                                {statChips.map(({ key, label, Icon }) =>
                                                    exoplanet.hasOwnProperty(key) && (
                                                        <div key={key} className="rounded-lg border border-white/10 bg-white/5 p-3 text-center backdrop-blur-sm hover:bg-white/10 transition-colors">
                                                            <div className="flex justify-center mb-1">
                                                                <Icon className="h-4 w-4 text-indigo-400" />
                                                            </div>
                                                            <div className="text-xs text-white/50 font-body">{label}</div>
                                                            <div className="text-white font-medium font-display text-sm mt-0.5">
                                                                {formatValue(key, exoplanet[key])}
                                                            </div>
                                                            <div className="text-xs text-white/35 font-body mt-0.5">
                                                                {getEarthComparison(key, exoplanet[key] as number)}
                                                            </div>
                                                        </div>
                                                    )
                                                )}
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>

                                {/* ── S2: AI ANALYSIS ──────────────────────────────── */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: 0.45 }}
                                    className="flex-1 flex flex-col"
                                >
                                <Card className="glass text-white flex-1">
                                    <CardHeader className="pb-3">
                                        <CardTitle className="flex items-center gap-2 font-display">
                                            <Sparkles className="h-5 w-5 text-purple-400" />
                                            AI Analysis
                                            <Badge className="ml-1 bg-purple-500/20 text-purple-300 border-purple-500/30 text-xs font-body">Powered by AI</Badge>
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-6">

                                        {/* Panel A: AI Narrative */}
                                        <div>
                                            <div className="flex items-center gap-2 mb-3">
                                                <Sparkles className="h-3.5 w-3.5 text-purple-400" />
                                                <span className="text-xs font-display text-white/60 uppercase tracking-wide">AI Narrative</span>
                                                <Badge className="bg-purple-500/15 text-purple-300 border-purple-500/20 text-xs font-body">AI Generated</Badge>
                                            </div>
                                            {isLoadingSummary ? (
                                                <div className="space-y-2 animate-pulse">
                                                    <div className="h-4 w-full bg-white/10 rounded" />
                                                    <div className="h-4 w-4/5 bg-white/10 rounded" />
                                                    <div className="h-4 w-3/4 bg-white/10 rounded" />
                                                    <div className="h-4 w-2/3 bg-white/10 rounded" />
                                                </div>
                                            ) : summary ? (
                                                <div className="space-y-3">
                                                    {summary.split(/\n+/).filter(p => p.trim()).slice(0, isNarrativeExpanded ? undefined : 2).map((para, i) => (
                                                        <p key={i} className="text-white/80 leading-relaxed font-body text-sm">
                                                            {stripMarkdown(para.trim())}
                                                        </p>
                                                    ))}
                                                    {summary.split(/\n+/).filter(p => p.trim()).length > 2 && (
                                                        <button
                                                            className="flex items-center gap-1 text-xs text-purple-400/70 hover:text-purple-300 font-body transition-colors"
                                                            onClick={() => setIsNarrativeExpanded(v => !v)}
                                                        >
                                                            {isNarrativeExpanded
                                                                ? <><ChevronUp className="h-3 w-3" />Show less</>
                                                                : <><ChevronDown className="h-3 w-3" />Read more</>}
                                                        </button>
                                                    )}
                                                </div>
                                            ) : (
                                                <div className="flex items-start gap-3">
                                                    <p className="text-white/40 text-sm font-body italic flex-1">{stripMarkdown(getPlanetSummary(exoplanet))}</p>
                                                    {error && (
                                                        <Button variant="ghost" size="sm" className="text-purple-400 hover:text-purple-300 hover:bg-purple-500/10 font-body px-2 flex-shrink-0" onClick={generateSummary}>
                                                            <Sparkles className="mr-1 h-3 w-3" />Retry
                                                        </Button>
                                                    )}
                                                </div>
                                            )}
                                        </div>

                                        <Separator className="bg-white/10" />

                                        {/* Panel B: Key Facts */}
                                        <div>
                                            <div className="flex items-center gap-2 mb-3">
                                                <Zap className="h-3.5 w-3.5 text-amber-400" />
                                                <span className="text-xs font-display text-white/60 uppercase tracking-wide">Key Facts</span>
                                                <Badge className="bg-amber-500/15 text-amber-300 border-amber-500/20 text-xs font-body">AI Generated</Badge>
                                            </div>
                                            {isLoadingFactCard ? (
                                                <div className="space-y-2 animate-pulse">
                                                    <div className="h-3 w-3/4 bg-white/10 rounded" />
                                                    <div className="h-3 w-2/3 bg-white/10 rounded" />
                                                    <div className="h-3 w-1/2 bg-white/10 rounded" />
                                                </div>
                                            ) : factCard ? (
                                                <ul className="space-y-2">
                                                    {factCard.split(/\n/).filter(l => l.trim()).slice(0, 5).map((line, i) => (
                                                        <li key={i} className="flex items-start gap-2.5 text-white/75 text-sm font-body">
                                                            <span className="text-amber-400 mt-1 flex-shrink-0 text-xs leading-none">◆</span>
                                                            {stripMarkdown(line.replace(/^[-•*]\s*/, ""))}
                                                        </li>
                                                    ))}
                                                </ul>
                                            ) : (
                                                <p className="text-white/30 text-xs font-body italic">Generating key facts…</p>
                                            )}
                                        </div>

                                        <Separator className="bg-white/10" />

                                        {/* Panel C: Scene Description */}
                                        <div>
                                            <div className="flex items-center gap-2 mb-3">
                                                <Compass className="h-3.5 w-3.5 text-teal-400" />
                                                <span className="text-xs font-display text-white/60 uppercase tracking-wide">Scene Description</span>
                                                <Badge className="bg-teal-500/15 text-teal-300 border-teal-500/20 text-xs font-body">AI Vision</Badge>
                                            </div>
                                            {isLoadingImages ? (
                                                <div className="space-y-2 animate-pulse">
                                                    <div className="h-3 w-full bg-white/10 rounded" />
                                                    <div className="h-3 w-4/5 bg-white/10 rounded" />
                                                </div>
                                            ) : imagePrompts && imagePrompts.length > 0 ? (
                                                <div className="space-y-2.5">
                                                    {imagePrompts.map((prompt, i) => (
                                                        <div key={i} className="flex items-start gap-3">
                                                            <span className="text-teal-500/60 text-xs font-display mt-0.5 flex-shrink-0">{i + 1}.</span>
                                                            <p className="text-white/55 text-xs italic font-body leading-relaxed border-l-2 border-teal-500/25 pl-3">
                                                                {stripMarkdown(prompt)}
                                                            </p>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <p className="text-white/30 text-xs font-body italic">Generating scene descriptions…</p>
                                            )}
                                        </div>

                                        <Separator className="bg-white/10" />

                                        {/* Panel D: Host Star */}
                                        <div>
                                            <div className="flex items-center gap-2 mb-3">
                                                <Sun className="h-3.5 w-3.5 text-yellow-400" />
                                                <span className="text-xs font-display text-white/60 uppercase tracking-wide">Host Star</span>
                                                <Badge className="bg-yellow-500/15 text-yellow-300 border-yellow-500/20 text-xs font-body">Data</Badge>
                                            </div>
                                            <div className="grid grid-cols-2 gap-3">
                                                {[
                                                    { label: "Star Type", value: getStarType(exoplanet.st_teff as number) },
                                                    ...(exoplanet.st_teff ? [{ label: "Temperature", value: formatValue("st_teff", exoplanet.st_teff) }] : []),
                                                    ...(exoplanet.st_mass ? [{ label: "Mass", value: formatValue("st_mass", exoplanet.st_mass) }] : []),
                                                    ...(exoplanet.st_rad ? [{ label: "Radius", value: formatValue("st_rad", exoplanet.st_rad) }] : []),
                                                ].map(({ label, value }) => (
                                                    <div key={label} className="rounded-lg border border-white/10 bg-white/5 p-3 text-center backdrop-blur-sm hover:bg-white/8 transition-colors">
                                                        <span className="block text-white/45 text-xs font-body mb-1">{label}</span>
                                                        <span className="block text-white font-medium font-display text-sm">{value}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {(exoplanet.disc_year || exoplanet.disc_facility || exoplanet.disc_method || exoplanet.sy_dist) && (
                                            <>
                                                <Separator className="bg-white/10" />
                                                <div>
                                                    <div className="flex items-center gap-2 mb-3">
                                                        <Calendar className="h-3.5 w-3.5 text-cyan-400" />
                                                        <span className="text-xs font-display text-white/60 uppercase tracking-wide">Discovery</span>
                                                        <Badge className="bg-cyan-500/15 text-cyan-300 border-cyan-500/20 text-xs font-body">Data</Badge>
                                                    </div>
                                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                                        {[
                                                            ...(exoplanet.disc_year ? [{ label: "Year", value: String(exoplanet.disc_year) }] : []),
                                                            ...(exoplanet.disc_facility ? [{ label: "Facility", value: String(exoplanet.disc_facility) }] : []),
                                                            ...(exoplanet.disc_method ? [{ label: "Method", value: String(exoplanet.disc_method) }] : []),
                                                            ...(exoplanet.sy_dist ? [{ label: "Distance", value: formatValue("sy_dist", exoplanet.sy_dist) }] : []),
                                                        ].map(({ label, value }) => (
                                                            <div key={label} className="flex flex-col gap-0.5">
                                                                <span className="text-white/40 text-xs font-body">{label}</span>
                                                                <span className="text-white/80 text-sm font-body">{value}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </>
                                        )}

                                    </CardContent>
                                </Card>
                                </motion.div>

                                </div>{/* end LEFT PANE */}

                                {/* RIGHT PANE: Viz + Orbital + Data Explorer */}
                                <div className="flex flex-col gap-4 h-full min-h-0">

                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.6, delay: 0.3 }}
                                >
                                    <Card className="glass text-white overflow-hidden animate-pulse-glow">
                                        <CardHeader className="pb-2">
                                            <CardTitle className="flex items-center font-display text-base">
                                                <Globe className="mr-2 h-4 w-4 text-indigo-400" />
                                                Planet Visualization
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="flex items-center justify-center">
                                            <PlanetVisualization
                                                planetType={getPlanetType(exoplanet.pl_rade as number)}
                                                planetColor={getPlanetColor(getPlanetType(exoplanet.pl_rade as number)).split(" ")[1]}
                                                planetName={exoplanet.pl_name as string}
                                            />
                                        </CardContent>
                                        <div className="px-4 pb-3 text-center text-xs text-white/35 font-body">
                                            Visualization based on available data
                                        </div>
                                    </Card>
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.6, delay: 0.4 }}
                                >
                                    <Card className="glass text-white">
                                        <CardHeader className="pb-2">
                                            <CardTitle className="flex items-center font-display text-base">
                                                <Orbit className="mr-2 h-4 w-4 text-indigo-400" />
                                                Orbital View
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <OrbitVisualization
                                                planetRadius={(exoplanet.pl_rade as number) || 1}
                                                orbitalPeriod={(exoplanet.pl_orbper as number) || 365}
                                                starTemperature={(exoplanet.st_teff as number) || 5778}
                                                planetName={exoplanet.pl_name as string}
                                            />
                                        </CardContent>
                                    </Card>
                                </motion.div>

                                {/* ── S3: DATA EXPLORER ─────────────────────────────── */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.65 }}
                                className="flex-1 flex flex-col min-h-0"
                            >
                                <Card className="glass text-white flex-1 flex flex-col min-h-0">
                                    <CardHeader className="pb-2 flex-shrink-0">
                                        <CardTitle className="flex items-center font-display">
                                            <Info className="mr-2 h-5 w-5 text-indigo-400" />
                                            Data Explorer
                                        </CardTitle>
                                        <CardDescription className="text-white/50 font-body">
                                            Full scientific dataset for {exoplanet.pl_name}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="p-0 overflow-hidden">
                                        <div className="max-h-[250px] overflow-y-auto overflow-x-auto">
                                                <table className="w-full text-sm">
                                                    <thead className="sticky top-0 bg-[#0f1117]/90 backdrop-blur-sm border-b border-white/10 z-10">
                                                        <tr>
                                                            <th className="text-left px-4 py-2.5 text-white/50 font-display text-xs">Parameter</th>
                                                            <th className="text-left px-4 py-2.5 text-white/50 font-display text-xs">Value</th>
                                                            <th className="text-left px-4 py-2.5 text-white/50 font-display text-xs hidden sm:table-cell">vs Earth</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {(() => {
                                                            const PRIORITY = ["habitability_score", "terraformability_score", "pl_rade", "pl_bmasse", "pl_eqt", "ESI", "water_probability"]
                                                            const all = Object.entries(exoplanet).filter(([key, value]) => key !== "pl_name" && value !== null && value !== undefined && value !== "")
                                                            const priority = PRIORITY.map(k => all.find(([key]) => key === k)).filter(Boolean) as typeof all
                                                            const rest = all.filter(([key]) => !PRIORITY.includes(key))
                                                            return [...priority, ...rest]
                                                        })().map(([key, value], i) => (
                                                                <tr key={key} className={`border-b border-white/5 ${i % 2 === 0 ? "bg-white/[0.03]" : ""} hover:bg-white/10 transition-colors`}>
                                                                    <td className="px-4 py-2.5 text-white/55 font-display text-xs">{getFieldName(key)}</td>
                                                                    <td className="px-4 py-2.5 text-white font-body text-sm">{formatValue(key, value)}</td>
                                                                    <td className="px-4 py-2.5 text-white/35 font-body text-xs hidden sm:table-cell">
                                                                        {getEarthComparison(key, value as number) || "—"}
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                    </tbody>
                                                </table>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>

                                </div>{/* end RIGHT PANE */}
                            </div>{/* end MAIN LAYOUT GRID */}

                            {/* ── S5: SIMILAR PLANETS — full width ──────────────────── */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.75 }}
                            >
                                <Card className="glass text-white">
                                    <CardHeader className="pb-2">
                                        <CardTitle className="flex items-center font-display">
                                            <Star className="mr-2 h-5 w-5 text-indigo-400" />
                                            Similar Exoplanets
                                        </CardTitle>
                                        <CardDescription className="text-white/50 font-body">
                                            Other {getPlanetType(exoplanet.pl_rade as number)} class planets with similar habitability
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        {loadingSimilar ? (
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                                {[...Array(4)].map((_, i) => (
                                                    <div key={i} className="h-24 rounded-xl bg-white/5 animate-pulse" />
                                                ))}
                                            </div>
                                        ) : similarPlanets.length > 0 ? (
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                                {similarPlanets.map((planet, i) => {
                                                    const type = getPlanetType(planet.pl_rade)
                                                    const score = normalizeScore(planet.habitability_score)
                                                    return (
                                                        <div
                                                            key={i}
                                                            role="button"
                                                            tabIndex={0}
                                                            onClick={() => router.push(`/dashboard/exoplanet/${encodeURIComponent(planet.pl_name)}`)}
                                                            onKeyDown={e => {
                                                                if (e.key === "Enter") router.push(`/dashboard/exoplanet/${encodeURIComponent(planet.pl_name)}`)
                                                            }}
                                                            className="rounded-xl border border-white/10 bg-white/5 p-4 hover:bg-white/10 hover:border-purple-500/40 transition-all cursor-pointer group"
                                                        >
                                                            <div className="flex items-center gap-3 mb-2">
                                                                <div className={`w-9 h-9 rounded-full flex-shrink-0 bg-gradient-to-br ${getPlanetColor(type)}`} />
                                                                <div className="min-w-0">
                                                                    <div className="font-medium text-white font-display text-sm truncate group-hover:text-purple-300 transition-colors">
                                                                        {planet.pl_name}
                                                                    </div>
                                                                    <Badge className={`${getBadgeColor(type)} text-xs px-1.5 py-0 mt-0.5`}>{type}</Badge>
                                                                </div>
                                                            </div>
                                                            <div className={`text-xs font-body ${getHabitabilityColor(score)}`}>
                                                                {score.toFixed(1)}% habitable
                                                            </div>
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                        ) : (
                                            <p className="text-white/40 text-sm text-center py-4 font-body">
                                                No similar {getPlanetType(exoplanet.pl_rade as number)} planets found in the dataset.
                                            </p>
                                        )}
                                    </CardContent>
                                </Card>
                            </motion.div>
                        </>

                    ) : (
                        /* Not found */
                        <div className="text-center py-12">
                            <Info className="mx-auto h-12 w-12 text-white/20" />
                            <h3 className="mt-4 text-lg font-medium text-white font-display">Exoplanet not found</h3>
                            <p className="mt-2 text-white/60 font-body">The requested exoplanet could not be found</p>
                            <Button
                                className="mt-6 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-body"
                                onClick={() => router.push("/dashboard/exoplanets")}
                            >
                                Browse All Exoplanets
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
