"use client"

import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import type { Exoplanet } from "@/lib/types"

interface ExoplanetScatterChartProps {
  exoplanets: Exoplanet[]
}

export default function ExoplanetScatterChart({ exoplanets }: ExoplanetScatterChartProps) {
  // Filter out exoplanets with missing data
  const validExoplanets = exoplanets.filter(
    (planet) =>
      planet.pl_rade !== null && planet.pl_rade !== undefined && planet.pl_eqt !== null && planet.pl_eqt !== undefined,
  )

  // Prepare data for the scatter chart
  const data = validExoplanets.map((planet) => ({
    name: planet.pl_name,
    radius: planet.pl_rade,
    temperature: planet.pl_eqt,
    habitability: planet.habitability_score || 0,
    mass: planet.pl_bmasse || 1, // Use 1 as default if mass is unknown
  }))

  return (
    <div className="w-full h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart
          margin={{
            top: 20,
            right: 20,
            bottom: 20,
            left: 20,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" opacity={0.1} stroke="hsl(var(--muted-foreground))" />
          <XAxis
            type="number"
            dataKey="radius"
            name="Radius"
            unit=" × Earth"
            tick={{ fill: "hsl(var(--foreground))" }}
            stroke="hsl(var(--muted-foreground))"
            label={{
              value: "Planet Radius (Earth radii)",
              position: "insideBottom",
              offset: -10,
              fill: "hsl(var(--foreground))",
            }}
          />
          <YAxis
            type="number"
            dataKey="temperature"
            name="Temperature"
            unit=" K"
            tick={{ fill: "hsl(var(--foreground))" }}
            stroke="hsl(var(--muted-foreground))"
            label={{
              value: "Equilibrium Temperature (K)",
              angle: -90,
              position: "insideLeft",
              fill: "hsl(var(--foreground))",
            }}
          />
          <ZAxis type="number" dataKey="mass" range={[50, 400]} name="Mass" unit=" × Earth" />
          <Tooltip
            cursor={{ strokeDasharray: "3 3" }}
            contentStyle={{
              backgroundColor: "hsl(var(--background))",
              borderColor: "hsl(var(--border))",
              borderRadius: "0.5rem",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
              padding: "8px 12px",
              color: "hsl(var(--foreground))",
            }}
            formatter={(value, name) => [`${typeof value === "number" ? value.toFixed(2) : value}`, name]}
            labelFormatter={(label) => `Planet: ${label}`}
          />
          <Legend />
          {validExoplanets.map((planet, index) => (
            <Scatter
              key={planet.pl_name}
              name={planet.pl_name}
              data={[data[index]]}
              fill={getHabitabilityColor(planet.habitability_score || 0)}
            />
          ))}
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  )
}

// Helper function for habitability color gradient
function getHabitabilityColor(score: number): string {
  if (score >= 0.8) return "hsl(152, 75%, 40%)" // emerald
  if (score >= 0.6) return "hsl(142, 71%, 45%)" // green
  if (score >= 0.4) return "hsl(48, 96%, 53%)" // yellow
  if (score >= 0.2) return "hsl(27, 96%, 61%)" // orange
  return "hsl(0, 84%, 60%)" // red
}

