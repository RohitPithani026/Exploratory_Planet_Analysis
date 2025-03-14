"use client"

import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"

interface PlanetCardProps {
    planet: {
        name: string
        type: string
        date: string
        score: number
    }
    index: number
}

export function PlanetCard({ planet, index }: PlanetCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 * index }}
            whileHover={{ scale: 1.02 }}
            className="group relative overflow-hidden rounded-lg border border-white/10 bg-white/5 p-4 transition-all duration-300 hover:bg-white/10"
        >
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
            <div className="relative z-10 flex items-center justify-between">
                <div className="space-y-1">
                    <p className="font-medium text-white">{planet.name}</p>
                    <div className="flex items-center gap-2">
                        <Badge variant="outline" className="border-indigo-500/30 bg-indigo-500/10 text-indigo-300">
                            {planet.type}
                        </Badge>
                        <span className="text-xs text-white/40">{planet.date}</span>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <motion.div
                        initial={{ rotate: -90 }}
                        animate={{ rotate: 0 }}
                        transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                        className="relative h-10 w-10 overflow-hidden rounded-full border border-white/10"
                    >
                        <div
                            className="absolute inset-0 rounded-full"
                            style={{
                                background: `conic-gradient(${planet.score > 0.8 ? "#10b981" : planet.score > 0.7 ? "#f59e0b" : "#ef4444"
                                    } ${planet.score * 100}%, transparent 0)`,
                            }}
                        ></div>
                        <div className="absolute inset-1 flex items-center justify-center rounded-full bg-black">
                            <span
                                className={`text-xs font-medium ${planet.score > 0.8 ? "text-green-500" : planet.score > 0.7 ? "text-yellow-500" : "text-red-500"
                                    }`}
                            >
                                {(planet.score * 100).toFixed(0)}
                            </span>
                        </div>
                    </motion.div>
                </div>
            </div>
        </motion.div>
    )
}

