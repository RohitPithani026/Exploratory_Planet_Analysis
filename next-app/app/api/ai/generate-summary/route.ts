import { NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"

// Initialize the Google Generative AI with your API key
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY || "")

interface PlanetData {
    pl_name: string;
    pl_rade: number;
    pl_bmasse: number;
    pl_orbper: number;
    pl_eqt: number;
    st_teff: number;
    st_mass: number;
    st_rad: number;
    sy_dist: number;
    disc_year: number;
    disc_facility: string;
    habitability_score: number;
    terraformability_score: number;
}

export async function POST(request: Request) {
    try {
        const { planetData } = await request.json()

        if (!planetData) {
            return NextResponse.json({ error: "Planet data is required" }, { status: 400 })
        }

        // Create a prompt for the AI based on the planet data
        const prompt = createPromptFromPlanetData(planetData)

        // Get the generative model (Gemini Pro)
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" })

        // Generate content
        const result = await model.generateContent(prompt)
        const response = await result.response
        const text = response.text()

        return NextResponse.json({
            summary: text,
            success: true,
        })
    } catch (error) {
        console.error("Error generating AI summary:", error)
        return NextResponse.json(
            {
                error: "Failed to generate AI summary",
                details: error instanceof Error ? error.message : "Unknown error",
                success: false,
            },
            { status: 500 },
        )
    }
}

function createPromptFromPlanetData(planetData: PlanetData): string {
    // Extract key information from the planet data
    const {
        pl_name,
        pl_rade,
        pl_bmasse,
        pl_orbper,
        pl_eqt,
        st_teff,
        st_mass,
        st_rad,
        sy_dist,
        disc_year,
        disc_facility,
        habitability_score,
        terraformability_score,
    } = planetData

    // Create a detailed prompt for the AI
    return `
    Generate a detailed scientific summary about the exoplanet ${pl_name} based on the following data:
    
    - Planet radius: ${pl_rade} Earth radii
    - Planet mass: ${pl_bmasse} Earth masses
    - Orbital period: ${pl_orbper} days
    - Equilibrium temperature: ${pl_eqt} K
    - Host star temperature: ${st_teff} K
    - Host star mass: ${st_mass} Solar masses
    - Host star radius: ${st_rad} Solar radii
    - Distance from Earth: ${sy_dist} light years
    - Discovery year: ${disc_year}
    - Discovery facility: ${disc_facility}
    - Habitability score: ${habitability_score}
    - Terraformability score: ${terraformability_score}
    
    Include information about:
    1. The planet's physical characteristics and how they compare to Earth
    2. The planet's potential for habitability based on its properties
    3. The star system it belongs to and how that affects the planet
    4. Any unique or interesting features of this exoplanet
    5. What future research might reveal about this planet
    
    Format the response in a way that would be engaging for a science enthusiast but still scientifically accurate.
  `
}

