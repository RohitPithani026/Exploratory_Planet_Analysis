import { createGroq } from "@ai-sdk/groq"
import { streamText } from "ai"

export const maxDuration = 30

type PlanetData = Record<string, string | number | boolean | null | undefined>

function buildSystemPrompt(planet: PlanetData): string {
    const normalize = (score: number) => (score > 1 ? score : score * 100)

    const facts = [
        `Planet name: ${planet.pl_name}`,
        planet.pl_rade != null && `Radius: ${Number(planet.pl_rade).toFixed(2)}× Earth`,
        planet.pl_bmasse != null && `Mass: ${Number(planet.pl_bmasse).toFixed(2)}× Earth`,
        planet.pl_orbper != null && `Orbital period: ${Number(planet.pl_orbper).toFixed(1)} days`,
        planet.pl_eqt != null && `Equilibrium temperature: ${Number(planet.pl_eqt).toFixed(0)} K (Earth ~288 K)`,
        planet.st_teff != null && `Host star temperature: ${Number(planet.st_teff).toFixed(0)} K`,
        planet.sy_dist != null && `Distance from Earth: ${Number(planet.sy_dist).toFixed(1)} light years`,
        planet.habitability_score != null &&
            `Habitability score: ${normalize(Number(planet.habitability_score)).toFixed(1)}%`,
        planet.terraformability_score != null &&
            `Terraformability score: ${normalize(Number(planet.terraformability_score)).toFixed(1)}%`,
        planet.ESI != null && `Earth Similarity Index: ${Number(planet.ESI).toFixed(3)}`,
        planet.disc_year != null && `Discovery year: ${planet.disc_year}`,
        planet.disc_facility != null && `Discovered by: ${planet.disc_facility}`,
        planet.disc_method != null && `Discovery method: ${planet.disc_method}`,
    ]
        .filter(Boolean)
        .join("\n")

    return `You are an AI astrophysicist copilot embedded in an exoplanet research platform. The user is currently viewing the exoplanet ${planet.pl_name}.

Current planet data:
${facts}

Guidelines:
- Answer questions about this planet conversationally and accurately
- Use plain language — explain jargon when you use it
- Keep responses concise (2–4 sentences) unless asked for more detail
- Use Earth comparisons to make numbers intuitive
- If asked something unrelated to this planet or astronomy, gently redirect`
}

export async function POST(request: Request) {
    const { messages, planetData } = await request.json()

    if (!process.env.GROQ_API_KEY) {
        return new Response("GROQ_API_KEY not configured", { status: 500 })
    }

    const groq = createGroq({ apiKey: process.env.GROQ_API_KEY })

    const result = streamText({
        model: groq("openai/gpt-oss-20b"),
        system: buildSystemPrompt(planetData as PlanetData),
        messages,
        maxOutputTokens: 512,
        providerOptions: { groq: { reasoningEffort: "low" } },
    })

    return result.toTextStreamResponse()
}
