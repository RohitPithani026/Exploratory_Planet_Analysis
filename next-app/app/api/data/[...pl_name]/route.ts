import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"
import { parse } from "csv-parse"

interface ExoplanetData {
    [key: string]: string | number
    pl_name: string
}

// Handle GET requests
export async function GET(
    request: Request,
    context: { params: Promise<{ pl_name?: string[] }> }, // params is a Promise
) {
    const { pl_name } = await context.params // Await the params before destructuring
    const planetName = pl_name?.join("/")

    if (!planetName) {
        return NextResponse.json({ error: "Planet name is required" }, { status: 400 })
    }

    const results: ExoplanetData[] = []
    const filePath = path.join(process.cwd(), "public", "exoplanet_scores_Final.csv")

    if (!fs.existsSync(filePath)) {
        return NextResponse.json({ error: "CSV file not found" }, { status: 404 })
    }

    // Decode the URL-encoded planet name
    const decodedPlanetName = decodeURIComponent(planetName)

    return new Promise<Response>((resolve, reject) => {
        fs.createReadStream(filePath)
            .pipe(
                parse({
                    columns: true,
                    skip_empty_lines: true,
                    trim: true,
                }),
            )
            .on("data", (data: Record<string, string>) => {
                const parsedData: ExoplanetData = { pl_name: data.pl_name || "" }
                for (const key in data) {
                    // Convert numeric values to numbers
                    const value = data[key]
                    parsedData[key] = !isNaN(Number(value)) && value !== "" ? Number(value) : value
                }
                results.push(parsedData)
            })
            .on("end", () => {
                // Find the specific exoplanet
                const exoplanet = results.find(
                    (planet) =>
                        planet.pl_name.toLowerCase() === decodedPlanetName.toLowerCase() ||
                        planet.pl_name.toLowerCase().replace(/\s+/g, "-") === decodedPlanetName.toLowerCase(),
                )

                if (exoplanet) {
                    resolve(NextResponse.json(exoplanet, { status: 200 }))
                } else {
                    resolve(NextResponse.json({ error: "Exoplanet not found" }, { status: 404 }))
                }
            })
            .on("error", (err) =>
                reject(NextResponse.json({ error: "Failed to process CSV file", details: err.message }, { status: 500 })),
            )
    })
}

