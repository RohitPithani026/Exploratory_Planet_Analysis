import { NextResponse } from "next/server"
import { runAiUseCase } from "@/lib/ai"

export const maxDuration = 30

interface PlanetData {
    pl_name: string
    pl_rade: number
    pl_bmasse: number
    pl_orbper: number
    pl_eqt: number
    st_teff: number
    st_mass: number
    st_rad: number
    sy_dist: number
    disc_year: number
    disc_facility: string
    habitability_score: number
    terraformability_score: number
}

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { contentType } = body

        if (contentType === "explain-chart") {
            const { chartType, chartLabel, chartData } = body
            const text = await runAiUseCase("fact-card", buildChartExplainPrompt(chartType, chartLabel, chartData))
            return NextResponse.json({ explanation: text, success: true })
        }

        const { planetData } = body

        if (!planetData) {
            return NextResponse.json({ error: "Planet data is required" }, { status: 400 })
        }

        if (contentType === "summary") {
            const text = await runAiUseCase("habitability", buildNarrativePrompt(planetData))
            return NextResponse.json({ summary: text, success: true })
        }

        if (contentType === "image") {
            const text = await runAiUseCase("image-prompt", buildImagePrompt(planetData))
            const imagePrompts = [
                `A photorealistic view of exoplanet ${planetData.pl_name} from space, ${text}`,
                `The surface of exoplanet ${planetData.pl_name}, ${text}`,
                `The star system containing exoplanet ${planetData.pl_name}, showing its orbit around its host star`,
                `A close-up view of interesting geological features on exoplanet ${planetData.pl_name}, ${text}`,
            ]
            return NextResponse.json({ imagePrompts, success: true })
        }

        if (contentType === "fact-card") {
            const text = await runAiUseCase("fact-card", buildSummaryPrompt(planetData))
            return NextResponse.json({ summary: text, success: true })
        }

        if (contentType === "comparison") {
            return NextResponse.json(
                { error: "Comparison not yet implemented", success: false },
                { status: 501 }
            )
        }

        return NextResponse.json({ error: "Invalid content type" }, { status: 400 })
    } catch (error) {
        console.error("Error generating AI content:", error)
        return NextResponse.json(
            {
                error: "Failed to generate AI content",
                details: error instanceof Error ? error.message : "Unknown error",
                success: false,
            },
            { status: 500 }
        )
    }
}

function buildChartExplainPrompt(chartType: string, chartLabel: string, chartData: unknown): string {
    const dataStr = JSON.stringify(chartData).slice(0, 800)
    return `Explain the following ${chartLabel} chart to a curious non-scientist in 2–3 plain sentences. Focus on what the data means, not just what it shows. Chart type: ${chartType}. Data: ${dataStr}. Output only the explanation, no headings.`
}

function buildNarrativePrompt(p: PlanetData): string {
    return `Write a vivid 2-3 sentence narrative about exoplanet ${p.pl_name} for a curious non-scientist — flowing prose, not a bulleted list or checklist. Paint a picture of what this world is like and what makes it noteworthy: its scale and environment, and its place in the search for habitable worlds. Weave the numbers into natural sentences rather than reciting them one by one.
Data: radius ${p.pl_rade}× Earth, mass ${p.pl_bmasse}× Earth, temp ${p.pl_eqt}K, habitability ${p.habitability_score}%, terraformability ${p.terraformability_score}%, distance ${p.sy_dist} ly, discovered ${p.disc_year} by ${p.disc_facility}.
Output only the narrative — no headings, no bullet points, no emoji.`
}

function buildSummaryPrompt(p: PlanetData): string {
    return `Summarize exoplanet ${p.pl_name} in exactly 4 bullet points for a curious non-scientist. Use plain English, no jargon.
Data: radius ${p.pl_rade}× Earth, mass ${p.pl_bmasse}× Earth, temp ${p.pl_eqt}K, habitability ${p.habitability_score}%, terraformability ${p.terraformability_score}%, distance ${p.sy_dist} ly.
Format — one line each, start each with the emoji exactly:
🌡️ Temperature: one sentence about how hot/cold it is compared to Earth.
🌍 Size: one sentence about how big it is.
💧 Water: one sentence about water/life likelihood.
⭐ Verdict: one sentence on overall habitability.
Output only the 4 lines, nothing else.`
}

function buildImagePrompt(p: PlanetData): string {
    const type =
        p.pl_rade < 1.6 ? "rocky Earth-like" : p.pl_rade < 4 ? "Super-Earth" : "gas giant"
    const climate =
        p.pl_eqt < 270 ? "frozen" : p.pl_eqt < 320 ? "temperate" : "scorching hot"
    const water =
        p.habitability_score > 50 ? "with possible oceans" : "without surface water"
    return `Visual description for a ${type} planet with ${climate} climate, ${water}, orbiting a ${p.st_teff}K star. Write 1-2 vivid sentences on appearance only. No planet name, no repetition.`
}
