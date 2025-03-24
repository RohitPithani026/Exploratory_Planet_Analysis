"use client"

import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend, ResponsiveContainer } from "recharts"
import type { Exoplanet } from "@/lib/types"

interface ExoplanetRadarChartProps {
  exoplanets: Exoplanet[]
}

export default function ExoplanetRadarChart({ exoplanets }: ExoplanetRadarChartProps) {
  // Define the properties to compare
  const properties = [
    { key: "pl_rade_normalized", name: "Size" },
    { key: "pl_bmasse_normalized", name: "Mass" },
    { key: "pl_eqt_normalized", name: "Temperature" },
    { key: "surface_gravity_normalized", name: "Gravity" },
    { key: "habitability_score", name: "Habitability" },
    { key: "pl_water_probability", name: "Water" },
  ]

  // Normalize data for radar chart (values between 0-1)
  const normalizeData = (exoplanets: Exoplanet[]) => {
    // Create normalized versions of properties if they don't exist
    exoplanets.forEach((planet) => {
      // Normalize radius (Earth = 1)
      if (planet.pl_rade && !planet.pl_rade_normalized) {
        planet.pl_rade_normalized = normalizeValue(planet.pl_rade, 0, 15)
      }

      // Normalize mass (Earth = 1)
      if (planet.pl_bmasse && !planet.pl_bmasse_normalized) {
        planet.pl_bmasse_normalized = normalizeValue(planet.pl_bmasse, 0, 20)
      }

      // Normalize temperature (Earth-like = 1)
      if (planet.pl_eqt && !planet.pl_eqt_normalized) {
        // Earth-like temperatures around 288K
        const distanceFromEarthTemp = 1 - Math.abs(planet.pl_eqt - 288) / 500
        planet.pl_eqt_normalized = Math.max(0, Math.min(1, distanceFromEarthTemp))
      }

      // Ensure habitability score exists
      if (!planet.habitability_score) {
        planet.habitability_score = 0
      }

      // Ensure water probability exists
      if (!planet.pl_water_probability) {
        planet.pl_water_probability = 0
      }

      // Normalize surface gravity
      if (planet.surface_gravity && !planet.surface_gravity_normalized) {
        planet.surface_gravity_normalized = normalizeValue(planet.surface_gravity, 0, 10)
      }
    })

    return exoplanets
  }

  // Helper function to normalize values to 0-1 range
  const normalizeValue = (value: number, min: number, max: number) => {
    return Math.max(0, Math.min(1, (value - min) / (max - min)))
  }

  // Prepare data for the radar chart
  const normalizedExoplanets = normalizeData(exoplanets)

  // Transform data for the radar chart
  const radarData = properties.map((prop) => {
    const dataPoint: Record<string, any> = { property: prop.name }

    normalizedExoplanets.forEach((planet) => {
      dataPoint[planet.pl_name] = planet[prop.key] || 0
    })

    return dataPoint
  })

  // Generate colors for each exoplanet
  const colors = [
    "#3b82f6", // blue
    "#10b981", // emerald
    "#f59e0b", // amber
    "#8b5cf6", // violet
    "#ec4899", // pink
  ]

  return (
    <div className="w-full h-[500px]">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart outerRadius="80%" data={radarData}>
          <PolarGrid stroke="rgba(148, 163, 184, 0.2)" />
          <PolarAngleAxis dataKey="property" tick={{ fill: "hsl(var(--foreground))" }} />
          <PolarRadiusAxis
            angle={30}
            domain={[0, 1]}
            tick={{ fill: "hsl(var(--foreground))" }}
            stroke="rgba(148, 163, 184, 0.2)"
          />

          {normalizedExoplanets.map((planet, index) => (
            <Radar
              key={planet.pl_name}
              name={planet.pl_name}
              dataKey={planet.pl_name}
              stroke={colors[index % colors.length]}
              fill={colors[index % colors.length]}
              fillOpacity={0.3}
            />
          ))}

          <Legend />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  )
}

