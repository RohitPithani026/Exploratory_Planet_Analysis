import { NextResponse } from "next/server"
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai"

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
        const { planetData, contentType } = await request.json()

        if (!planetData) {
            return NextResponse.json({ error: "Planet data is required" }, { status: 400 })
        }

        if (contentType === "summary") {
            return await generateSummary(planetData)
        } else if (contentType === "image") {
            return await generateImagePrompt(planetData)
        } else {
            return NextResponse.json({ error: "Invalid content type" }, { status: 400 })
        }
    } catch (error) {
        console.error("Error generating AI content:", error)
        return NextResponse.json(
            {
                error: "Failed to generate AI content",
                details: error instanceof Error ? error.message : "Unknown error",
                success: false,
            },
            { status: 500 },
        )
    }
}

async function generateSummary(planetData: PlanetData) {
    // Create a prompt for the AI based on the planet data
    const prompt = createSummaryPrompt(planetData)

    // Get the generative model (Gemini Pro)
    const model = genAI.getGenerativeModel({
        model: "gemini-2.0-flash",
        safetySettings: [
            {
                category: HarmCategory.HARM_CATEGORY_HARASSMENT,
                threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
            },
            {
                category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
                threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
            },
            {
                category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
                threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
            },
            {
                category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
                threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
            },
        ],
    })

    // Generate content
    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    return NextResponse.json({
        summary: text,
        success: true,
    })
}

async function generateImagePrompt(planetData: PlanetData) {
    // Create a prompt for the AI to generate an image description
    const prompt = createImagePrompt(planetData)

    // Get the generative model (Gemini Pro)
    const model = genAI.getGenerativeModel({
        model: "gemini-2.0-flash",
        safetySettings: [
            {
                category: HarmCategory.HARM_CATEGORY_HARASSMENT,
                threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
            },
            {
                category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
                threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
            },
            {
                category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
                threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
            },
            {
                category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
                threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
            },
        ],
    })

    // Generate content
    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    // Generate 4 different image prompts for different views of the planet
    const imagePrompts = [
        `A photorealistic view of exoplanet ${planetData.pl_name} from space, ${text}`,
        `The surface of exoplanet ${planetData.pl_name}, ${text}`,
        `The star system containing exoplanet ${planetData.pl_name}, showing its orbit around its host star`,
        `A close-up view of interesting geological features on exoplanet ${planetData.pl_name}, ${text}`,
    ]

    return NextResponse.json({
        imagePrompts,
        success: true,
    })
}

function createSummaryPrompt(planetData: PlanetData): string {
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
    Generate an engaging, easy-to-understand summary about the exoplanet ${pl_name} for non-scientists.
    
    Here's the scientific data about the planet:
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
    
    Make the summary engaging and educational for the general public. Use analogies and comparisons to Earth when possible.
    Explain what life might be like on this planet and whether humans could potentially visit or live there someday.
    Keep the tone conversational and exciting, highlighting the most interesting aspects of this exoplanet.
    
    Format the response in 3-4 short paragraphs with no headings or bullet points.
  `
}

function createImagePrompt(planetData: PlanetData): string {
    // Extract key information from the planet data
    const { pl_name, pl_rade, pl_bmasse, pl_orbper, pl_eqt, st_teff, habitability_score } = planetData

    // Determine planet type based on radius
    let planetType = "Earth-like"
    if (pl_rade < 0.5) planetType = "Sub-Earth rocky planet"
    else if (pl_rade < 1.6) planetType = "Earth-like rocky planet"
    else if (pl_rade < 4) planetType = "Super-Earth rocky planet"
    else if (pl_rade < 10) planetType = "Neptune-like gas planet with a thick atmosphere"
    else planetType = "Jupiter-like gas giant"

    // Determine climate based on temperature
    let climate = "temperate"
    if (pl_eqt < 200) climate = "frozen ice world"
    else if (pl_eqt < 270) climate = "cold"
    else if (pl_eqt < 320) climate = "temperate"
    else if (pl_eqt < 400) climate = "hot"
    else climate = "extremely hot molten surface"

    // Determine star color based on temperature
    let starColor = "yellow"
    if (st_teff > 30000) starColor = "blue"
    else if (st_teff > 10000) starColor = "blue-white"
    else if (st_teff > 7500) starColor = "white"
    else if (st_teff > 6000) starColor = "yellow-white"
    else if (st_teff > 5200) starColor = "yellow"
    else if (st_teff > 3700) starColor = "orange"
    else starColor = "red"

    // Determine if it has water based on habitability score
    const hasWater = habitability_score > 50 ? "with possible oceans and water features" : "likely without surface water"

    // Create a detailed prompt for the AI to generate an image description
    return `
    Create a detailed description for generating an image of exoplanet ${pl_name}.
    
    This is a ${planetType} that is ${pl_rade} times Earth's radius and ${pl_bmasse} times Earth's mass.
    It orbits a ${starColor} star every ${pl_orbper} days.
    The planet has a ${climate} climate with a surface temperature of ${pl_eqt} K.
    It is ${hasWater}.
    
    Describe the visual appearance of this planet in detail, including:
    - Colors and atmospheric appearance
    - Surface features like continents, oceans, mountains, or clouds if applicable
    - Any unique visual characteristics based on its properties
    - Lighting conditions based on its star type
    
    The description should be scientifically plausible but visually striking.
    Keep the description to 3-4 sentences focused only on visual appearance.
  `
}

