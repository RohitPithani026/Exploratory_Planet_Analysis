"use client"

import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { useTheme } from "@/components/theme-provider"

interface PlanetCardProps {
    name: string
    type: string
    distance?: string
    habitabilityScore: number
    terraformabilityScore?: number
    description?: string
    discoveryYear?: number
    starSystem?: string
    index?: number
    score: number
}

export function PlanetCard({
    name,
    type,
    distance,
    habitabilityScore,
    terraformabilityScore,
    description,
    discoveryYear,
    index = 0,
}: PlanetCardProps) {
    const { animations } = useTheme()

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
                            <Badge variant="outline" className="border-indigo-500/30 bg-indigo-500/10 text-indigo-300">
                                {type}
                            </Badge>
                            {distance && <span className="text-xs text-white/40">{distance}</span>}
                            {discoveryYear && <span className="text-xs text-white/40">Discovered: {discoveryYear}</span>}
                        </div>
                    </div>
                    <motion.div
                        initial={animations ? { rotate: -90 } : false}
                        animate={animations ? { rotate: 0 } : {}}
                        transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                        className="relative h-10 w-10 overflow-hidden rounded-full border border-white/10"
                    >
                        <div
                            className="absolute inset-0 rounded-full"
                            style={{
                                background: `conic-gradient(${habitabilityScore > 0.8 ? "#10b981" : habitabilityScore > 0.7 ? "#f59e0b" : "#ef4444"
                                    } ${habitabilityScore * 100}%, transparent 0)`,
                            }}
                        ></div>
                        <div className="absolute inset-1 flex items-center justify-center rounded-full bg-black">
                            <span
                                className={`text-xs font-medium ${habitabilityScore > 0.8
                                        ? "text-green-500"
                                        : habitabilityScore > 0.7
                                            ? "text-yellow-500"
                                            : "text-red-500"
                                    }`}
                            >
                                {(habitabilityScore * 100).toFixed(0)}
                            </span>
                        </div>
                    </motion.div>
                </div>

                {description && <p className="text-xs text-white/60 line-clamp-3">{description}</p>}

                {terraformabilityScore && (
                    <div className="flex items-center justify-between text-xs">
                        <span className="text-white/60">Terraforming Potential:</span>
                        <span
                            className={`font-medium ${terraformabilityScore > 0.8
                                    ? "text-green-500"
                                    : terraformabilityScore > 0.7
                                        ? "text-yellow-500"
                                        : "text-red-500"
                                }`}
                        >
                            {(terraformabilityScore * 100).toFixed(0)}%
                        </span>
                    </div>
                )}
            </div>
        </motion.div>
    )
}

