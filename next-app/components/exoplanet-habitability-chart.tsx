"use client"

import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import type { Exoplanet } from "@/lib/types"

interface ExoplanetHabitabilityChartProps {
    exoplanets: Exoplanet[]
}

export default function ExoplanetHabitabilityChart({ exoplanets }: ExoplanetHabitabilityChartProps) {
    // Prepare data for the habitability chart
    const data = exoplanets.map((planet) => ({
        name: planet.pl_name,
        habitability: planet.habitability_score || 0,
        esi: (planet.ESI || 0) * 100,
        water: (planet.pl_water_probability || 0) * 100,
        terraformability: planet.terraformability_score || 0,
    }))

    return (
        <div className="w-full h-[500px]">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart
                    data={data}
                    margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 60, // Increase bottom margin for better readability
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" opacity={0.1} stroke="rgba(255, 255, 255, 0.3)" />
                    <XAxis
                        dataKey="name"
                        angle={0} // Slightly reduce tilt for readability
                        height={80} // Increased height for clarity
                        tick={{ fontSize: 12, fill: "rgba(255, 255, 255, 0.8)" }}
                        tickMargin={15}
                        stroke="rgba(255, 255, 255, 0.5)"
                    />
                    <YAxis
                        tick={{ fill: "rgba(255, 255, 255, 0.8)" }}
                        stroke="rgba(255, 255, 255, 0.5)"
                        label={{
                            value: "Score (%)",
                            angle: -90,
                            position: "insideLeft",
                            fill: "rgba(255, 255, 255, 0.8)",
                        }}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: "rgba(15, 23, 42, 0.9)",
                            borderColor: "rgba(100, 116, 139, 0.5)",
                            borderRadius: "0.5rem",
                            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.5)",
                            padding: "8px 12px",
                            color: "rgba(255, 255, 255, 0.9)",
                        }}
                        formatter={(value) => [`${value}%`]}
                        cursor={{ fill: "rgba(255, 255, 255, 0.05)" }}
                    />
                    <Legend wrapperStyle={{ color: "rgba(255, 255, 255, 0.8)" }} />
                    <Bar dataKey="habitability" name="Habitability" fill="#10b981" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="esi" name="Earth Similarity" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="water" name="Water Probability" fill="#06b6d4" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="terraformability" name="Terraformability" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    )
}
