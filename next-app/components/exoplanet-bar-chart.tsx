"use client"

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import type { Exoplanet } from "@/lib/types"

interface ExoplanetBarChartProps {
    exoplanets: Exoplanet[]
    property: string
    title: string
}

export default function ExoplanetBarChart({ exoplanets, property, title }: ExoplanetBarChartProps) {
    // Generate colors for each exoplanet based on habitability
    const data = exoplanets
        .filter((planet) => planet[property] !== null && planet[property] !== undefined)
        .map((planet) => {
            const habitabilityScore = planet.habitability_score || 0
            return {
                name: planet.pl_name,
                value: planet[property] as number,
                fill: getHabitabilityColor(habitabilityScore),
                habitability: habitabilityScore,
            }
        })

    return (
        <div className="w-full">
            <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                        <CartesianGrid strokeDasharray="3 3" opacity={0.1} stroke="hsl(var(--muted-foreground))" />
                        <XAxis
                            dataKey="name"
                            angle={-45}
                            textAnchor="end"
                            height={60}
                            tick={{ fontSize: 12, fill: "hsl(var(--foreground))" }}
                            tickMargin={10}
                            stroke="hsl(var(--muted-foreground))"
                        />
                        <YAxis tick={{ fill: "hsl(var(--foreground))" }} stroke="hsl(var(--muted-foreground))" />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: "hsl(var(--background))",
                                borderColor: "hsl(var(--border))",
                                borderRadius: "0.5rem",
                                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
                                padding: "8px 12px",
                                color: "hsl(var(--foreground))",
                            }}
                            formatter={(value) => [`${typeof value === "number" ? value.toFixed(2) : value}`, title]}
                            cursor={{ fill: "rgba(255, 255, 255, 0.05)" }}
                            labelFormatter={(label) => `Planet: ${label}`}
                        />
                        <Bar dataKey="value" radius={[4, 4, 0, 0]} animationDuration={1000} animationBegin={200} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
}

// Helper function for habitability color gradient
function getHabitabilityColor(score: number): string {
    if (score >= 70) return "hsl(152, 75%, 40%)" // emerald
    if (score >= 50) return "hsl(142, 71%, 45%)" // green
    if (score >= 30) return "hsl(48, 96%, 53%)" // yellow
    if (score >= 10) return "hsl(27, 96%, 61%)" // orange
    return "hsl(0, 84%, 60%)" // red
}