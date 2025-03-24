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
    habitability: (planet.habitability_score || 0) * 100,
    esi: (planet.ESI || 0) * 100,
    water: (planet.pl_water_probability || 0) * 100,
    terraformability: (planet.terraformability_score || 0) * 100,
  }))

  return (
    <div className="w-full h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 60,
          }}
        >
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
          <YAxis
            tick={{ fill: "hsl(var(--foreground))" }}
            stroke="hsl(var(--muted-foreground))"
            label={{
              value: "Score (%)",
              angle: -90,
              position: "insideLeft",
              fill: "hsl(var(--foreground))",
            }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(var(--background))",
              borderColor: "hsl(var(--border))",
              borderRadius: "0.5rem",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
              padding: "8px 12px",
              color: "hsl(var(--foreground))",
            }}
            formatter={(value) => [`${value.toFixed(1)}%`]}
            cursor={{ fill: "rgba(255, 255, 255, 0.05)" }}
          />
          <Legend />
          <Bar dataKey="habitability" name="Habitability" fill="#10b981" radius={[4, 4, 0, 0]} />
          <Bar dataKey="esi" name="Earth Similarity" fill="#3b82f6" radius={[4, 4, 0, 0]} />
          <Bar dataKey="water" name="Water Probability" fill="#06b6d4" radius={[4, 4, 0, 0]} />
          <Bar dataKey="terraformability" name="Terraformability" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

