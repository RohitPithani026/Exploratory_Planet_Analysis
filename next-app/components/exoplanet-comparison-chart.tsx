"use client"

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import type { Exoplanet } from "@/lib/types"

interface ExoplanetComparisonChartProps {
    exoplanets: Exoplanet[]
    property: keyof Exoplanet
    title: string
}

export default function ExoplanetComparisonChart({ exoplanets, property, title }: ExoplanetComparisonChartProps) {
    // Generate colors for each exoplanet based on type
    const data = exoplanets.map((planet) => ({
        name: planet.name,
        value: planet[property] as number,
        fill: getPlanetTypeColor(planet.type ?? "Unknown"),
        type: planet.type,
    }))

    return (
        <div className="w-full">
            <div className="h-[300px] w-full">
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
                            formatter={(value, name, props) => [`${value}`, `${title.split(" ")[0]} (${props.payload.type})`]}
                            cursor={{ fill: "rgba(255, 255, 255, 0.05)" }}
                        />
                        <Bar dataKey="value" radius={[4, 4, 0, 0]} animationDuration={1000} animationBegin={200} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
}

// Helper function for consistent planet type colors
function getPlanetTypeColor(type: string): string {
    switch (type.toLowerCase()) {
        case "super-earth":
            return "hsl(152, 75%, 40%)" // emerald
        case "rocky":
            return "hsl(43, 96%, 48%)" // amber
        case "hot jupiter":
            return "hsl(27, 96%, 51%)" // orange
        case "mini-neptune":
            return "hsl(217, 91%, 50%)" // blue
        default:
            return "hsl(259, 94%, 60%)" // purple
    }
}