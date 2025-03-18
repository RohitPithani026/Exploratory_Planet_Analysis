import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import csv from "csv-parser";

interface ExoplanetData {
    [key: string]: string;
}

// Handle GET requests
export async function GET() {
    const results: ExoplanetData[] = [];
    const filePath = path.join(process.cwd(), "public", "exoplanet_scores_Final.csv");

    if (!fs.existsSync(filePath)) {
        return NextResponse.json({ error: "CSV file not found" }, { status: 404 });
    }

    return new Promise<Response>((resolve, reject) => {
        fs.createReadStream(filePath)
            .pipe(csv())
            .on("data", (data: ExoplanetData) => results.push(data))
            .on("end", () => resolve(NextResponse.json(results, { status: 200 }))) // ✅ Returns a Response
            .on("error", (err) =>
                reject(NextResponse.json({ error: "Failed to process CSV file", details: err.message }, { status: 500 }))
            );
    });
}
