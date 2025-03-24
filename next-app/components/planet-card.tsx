"use client"

import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { useTheme } from "@/components/theme-provider"
import { ScoreBar } from "@/components/score-bar"

interface PlanetCardProps {
    name: string
    type?: string
    distance?: string
    habitabilityScore: number
    terraformabilityScore: number
    description?: string
    discoveryYear?: number
    starSystem?: string
    index?: number
    score?: number
}

export function PlanetCard({
    name,
    type,
    habitabilityScore,
    terraformabilityScore,
    description,
    index = 0,
}: PlanetCardProps) {
    const { animations } = useTheme()

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

    return (
        <motion.div
            initial={animations ? { opacity: 0, y: 20 } : false}
            animate={animations ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.3, delay: 0.1 * index }}
            whileHover={{ scale: animations ? 1.02 : 1 }}
            className="group relative overflow-hidden rounded-lg border border-white/10 bg-white/5 p-4 transition-all duration-300 hover:bg-white/10"
        >
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
            <div className="relative z-10 space-y-3">
                <div className="flex items-center justify-between">
                    <div className="space-y-1">
                        <p className="font-medium text-white">{name}</p>
                        <div className="flex items-center gap-2">
                            <Badge variant="outline" className={getBadgeColor(type || "")}>
                                {type}
                            </Badge>
                        </div>
                    </div>
                </div>

                {/* Score bars */}
                <div className="space-y-2 mt-2">
                    <ScoreBar
                        label="Habitability Score"
                        value={habitabilityScore}
                        color={habitabilityScore > 50 ? "green" : habitabilityScore > 30 ? "yellow" : "red"}
                    />
                    <ScoreBar
                        label="Terraformability Score"
                        value={terraformabilityScore}
                        color={terraformabilityScore > 70 ? "green" : terraformabilityScore > 40 ? "yellow" : "red"}
                    />
                </div>

                {description && <p className="text-xs text-white/60 line-clamp-3">{description}</p>}
            </div>
        </motion.div>
    )
}

