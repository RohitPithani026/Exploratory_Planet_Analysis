import { type NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
    try {
        // Get pagination parameters from URL
        const searchParams = req.nextUrl.searchParams
        const page = Number.parseInt(searchParams.get("page") || "1")
        const pageSize = Number.parseInt(searchParams.get("pageSize") || "20")

        // Validate pagination parameters
        const validatedPage = page > 0 ? page : 1
        const validatedPageSize = pageSize > 0 && pageSize <= 100 ? pageSize : 20

        // Fetch all data (in a production app, you might want to modify the NASA API query to support pagination if possible)
        const response = await fetch(
            "https://exoplanetarchive.ipac.caltech.edu/TAP/sync?query=select+pl_name,pl_rade,pl_bmasse,pl_orbper,pl_eqt,st_teff,st_mass,st_rad,st_met+from+pscomppars&format=json",
        )

        if (!response.ok) {
            throw new Error(`NASA API responded with status: ${response.status}`)
        }

        const allData = await response.json()

        // Calculate pagination values
        const totalItems = allData.length
        const totalPages = Math.ceil(totalItems / validatedPageSize)
        const startIndex = (validatedPage - 1) * validatedPageSize
        const endIndex = Math.min(startIndex + validatedPageSize, totalItems)

        // Get paginated data
        const paginatedData = allData.slice(startIndex, endIndex)

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
        })
    } catch (error) {
        console.error("Error fetching exoplanets:", error)
        return NextResponse.json({ error: "Failed to fetch exoplanet data" }, { status: 500 })
    }
}

