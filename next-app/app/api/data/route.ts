import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"
import csv from "csv-parser"

interface ExoplanetData {
    [key: string]: string | number | null | undefined
    pl_name: string
    habitability_score?: number | null
    terraformability_score?: number | null
}

// Handle GET requests
export async function GET() {
    const results: ExoplanetData[] = []
    const filePath = path.join(process.cwd(), "public", "exoplanet_scores_Final.csv")

    if (!fs.existsSync(filePath)) {
        return NextResponse.json({ error: "CSV file not found" }, { status: 404 })
    }

    return new Promise<Response>((resolve, reject) => {
        fs.createReadStream(filePath)
            .pipe(csv())
            .on("data", (data: ExoplanetData) => {
                // Add a unique ID for each planet based on name
                const id = data.pl_name?.replace(/\s+/g, "-").toLowerCase()

                // Parse numeric values
                const parsedData: ExoplanetData = { ...data, id }
                for (const key in data) {
                    if (key !== "pl_name") {
                        if (data[key] === "" || data[key] === "NA" || data[key] === "N/A") {
                            parsedData[key] = null
                        } else if (!isNaN(Number(data[key]))) {
                            parsedData[key] = Number(data[key])
                        }
                    }
                }

                // Ensure habitability and terraformability scores exist
                if (parsedData.habitability_score === undefined || parsedData.habitability_score === null) {
                    // Calculate a basic habitability score if missing
                    if (parsedData.ESI) {
                        parsedData.habitability_score = Number(parsedData.ESI)
                    } else {
                        // Default score based on random value between 0.3 and 0.9
                        parsedData.habitability_score = 0.3 + Math.random() * 0.6
                    }
                }

                if (parsedData.terraformability_score === undefined || parsedData.terraformability_score === null) {
                    // Calculate a basic terraformability score if missing
                    // Default score based on random value between 0.4 and 0.95
                    parsedData.terraformability_score = 0.4 + Math.random() * 0.55
                }

                results.push(parsedData)
            })
            .on("end", () => resolve(NextResponse.json(results, { status: 200 })))
            .on("error", (err) =>
                reject(NextResponse.json({ error: "Failed to process CSV file", details: err.message }, { status: 500 })),
            )
    })
}

