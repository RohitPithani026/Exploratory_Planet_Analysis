import { createGroq } from "@ai-sdk/groq"
import { generateText } from "ai"

export type AiUseCase = "habitability" | "image-prompt" | "fact-card" | "comparison"

interface UseCaseConfig {
    model: string
    systemPrompt: string
    maxTokens: number
}

const USE_CASE_CONFIG: Record<AiUseCase, UseCaseConfig> = {
    habitability: {
        model: "openai/gpt-oss-120b",
        systemPrompt:
            "You are an astrophysicist explaining exoplanet habitability to the general public. Use analogies and comparisons to Earth. Be engaging, accurate, and conversational.",
        maxTokens: 1024,
    },
    "image-prompt": {
        model: "openai/gpt-oss-20b",
        systemPrompt:
            "You are a visual artist specializing in scientifically accurate space art. Generate concise, vivid visual descriptions for generating images.",
        maxTokens: 512,
    },
    "fact-card": {
        model: "openai/gpt-oss-20b",
        systemPrompt:
            "You are a science communicator. Give a 2-3 sentence highlight of the most interesting thing about this exoplanet. Be punchy and specific.",
        maxTokens: 256,
    },
    comparison: {
        model: "openai/gpt-oss-120b",
        systemPrompt:
            "You are an astrophysicist comparing exoplanets. Be specific about what each difference means for habitability and human exploration potential.",
        maxTokens: 1024,
    },
}

let groqClient: ReturnType<typeof createGroq> | null = null

function getGroq(): ReturnType<typeof createGroq> {
    if (!process.env.GROQ_API_KEY) {
        throw new Error("GROQ_API_KEY is not set")
    }
    if (!groqClient) {
        groqClient = createGroq({ apiKey: process.env.GROQ_API_KEY })
    }
    return groqClient
}

export async function runAiUseCase(useCase: AiUseCase, prompt: string): Promise<string> {
    const config = USE_CASE_CONFIG[useCase]
    const groq = getGroq()

    const { text } = await generateText({
        model: groq(config.model),
        system: config.systemPrompt,
        prompt,
        maxOutputTokens: config.maxTokens,
        providerOptions: { groq: { reasoningEffort: "low" } },
    })

    return text
}
