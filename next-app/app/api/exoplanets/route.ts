import { type NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import csv from "csv-parser";

interface ExoplanetData {
    [key: string]: string;
}

export async function GET(req: NextRequest) {
    try {
        // Get pagination parameters from URL
        const searchParams = req.nextUrl.searchParams;
        const page = Number.parseInt(searchParams.get("page") || "1");
        const pageSize = Number.parseInt(searchParams.get("pageSize") || "20");

        // Validate pagination parameters
        const validatedPage = page > 0 ? page : 1;
        const validatedPageSize = pageSize > 0 && pageSize <= 100 ? pageSize : 20;

        // File path for the CSV file
        const filePath = path.join(process.cwd(), "public", "exoplanet_scores_Final.csv");

        if (!fs.existsSync(filePath)) {
            return NextResponse.json({ error: "CSV file not found" }, { status: 404 });
        }

        // Read and parse CSV file
        const results: ExoplanetData[] = await new Promise((resolve, reject) => {
            const data: ExoplanetData[] = [];

            fs.createReadStream(filePath)
                .pipe(csv())
                .on("data", (row: Record<string, string>) => {
                    const formattedRow: Record<string, string | number> = {}; 

                    for (const key in row) {
                        const value = row[key].trim(); 

                        formattedRow[key] = isNaN(Number(value)) ? value : parseFloat(value);
                    }

                    data.push(formattedRow as ExoplanetData); 
                })
                .on("end", () => resolve(data))
                .on("error", (err) => reject(err));
        });

        // Calculate pagination values
        const totalItems = results.length;
        const totalPages = Math.ceil(totalItems / validatedPageSize);
        const startIndex = (validatedPage - 1) * validatedPageSize;
        const endIndex = Math.min(startIndex + validatedPageSize, totalItems);

        // Get paginated data
        const paginatedData = results.slice(startIndex, endIndex);

        return NextResponse.json({
            data: paginatedData,
            pagination: {
                page: validatedPage,
                pageSize: validatedPageSize,
                totalItems,
                totalPages,
                hasNextPage: validatedPage < totalPages,
                hasPrevPage: validatedPage > 1,
            },
        });
    } catch (error) {
        console.error("Error fetching exoplanets:", error);
        return NextResponse.json({ error: "Failed to fetch exoplanet data" }, { status: 500 });
    }
}
