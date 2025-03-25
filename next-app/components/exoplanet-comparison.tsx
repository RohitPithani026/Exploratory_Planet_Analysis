"use client"

import { useState, useEffect } from "react"
import { Search, Globe, Sparkles, RefreshCw } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import ExoplanetCard from "./exoplanet-card"
import ExoplanetHabitabilityChart from "./exoplanet-habitability-chart"
import ExoplanetSizeComparison from "./exoplanet-size-comparison"
import { exoplanetData } from "@/lib/exoplanet-data"
import type { Exoplanet } from "@/lib/types"

export default function ExoplanetComparison() {
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedExoplanets, setSelectedExoplanets] = useState<Exoplanet[]>([])
    const [filteredExoplanets, setFilteredExoplanets] = useState<Exoplanet[]>(exoplanetData)
    const [activeTab, setActiveTab] = useState("search")
    const [habitabilityThreshold, setHabitabilityThreshold] = useState([0.5])

    // Properties that can be compared
    // const comparableProperties = [
    //     { value: "pl_rade", label: "Planet Radius (Earth radii)" },
    //     { value: "pl_bmasse", label: "Planet Mass (Earth masses)" },
    //     { value: "pl_orbper", label: "Orbital Period (days)" },
    //     { value: "pl_eqt", label: "Equilibrium Temperature (K)" },
    //     { value: "st_teff", label: "Star Temperature (K)" },
    //     { value: "st_mass", label: "Star Mass (Solar masses)" },
    //     { value: "st_rad", label: "Star Radius (Solar radii)" },
    //     { value: "habitability_score", label: "Habitability Score" },
    //     { value: "terraformability_score", label: "Terraformability Score" },
    //     { value: "surface_gravity", label: "Surface Gravity" },
    //     { value: "ESI", label: "Earth Similarity Index" },
    //     { value: "pl_water_probability", label: "Water Probability" },
    // ]

    useEffect(() => {
        let filtered = exoplanetData.filter((planet) => planet.pl_name.toLowerCase().includes(searchQuery.toLowerCase()))

        // Filter by habitability threshold if set
        if (habitabilityThreshold[0] > 0) {
            filtered = filtered.filter((planet) => (planet.habitability_score || 0) >= habitabilityThreshold[0])
        }

        setFilteredExoplanets(filtered)
    }, [searchQuery, habitabilityThreshold])

    const handleSelectExoplanet = (exoplanet: Exoplanet) => {
        if (selectedExoplanets.length < 5 && !selectedExoplanets.some((p) => p.pl_name === exoplanet.pl_name)) {
            setSelectedExoplanets([...selectedExoplanets, exoplanet])
            if (selectedExoplanets.length === 0) {
                setActiveTab("comparison")
            }
        }
    }

    const handleRemoveExoplanet = (name: string) => {
        setSelectedExoplanets(selectedExoplanets.filter((planet) => planet.pl_name !== name))
    }

    const clearSelection = () => {
        setSelectedExoplanets([])
    }

    return (
        <div className="space-y-6 dark">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2 p-1 bg-slate-900/90 border border-slate-800">
                    <TabsTrigger value="search" className="flex items-center gap-2 data-[state=active]:bg-slate-800">
                        <Search className="h-4 w-4" />
                        Search Exoplanets
                    </TabsTrigger>
                    <TabsTrigger
                        value="comparison"
                        disabled={selectedExoplanets.length === 0}
                        className="flex items-center gap-2 data-[state=active]:bg-slate-800"
                    >
                        <Globe className="h-4 w-4" />
                        Compare{" "}
                        {selectedExoplanets.length > 0 && (
                            <Badge variant="secondary" className="ml-1 bg-blue-900/50 text-blue-200">
                                {selectedExoplanets.length}
                            </Badge>
                        )}
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="search" className="space-y-6 pt-4">
                    <form className="hidden md:flex">
                        <div className="relative group">
                            <div className="flex flex-col sm:flex-row gap-4">
                                <div className="relative">
                                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-white/50" />
                                    <Input
                                        type="search"
                                        placeholder="Search exoplanets..."
                                        className="w-full sm:w-[300px] bg-white/5 border-white/10 pl-8 text-white placeholder:text-white/50"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>

                                {searchQuery && (
                                    <Button
                                        variant="outline"
                                        className="border-white/10 bg-white/5 text-white hover:bg-white/10"
                                        onClick={() => setSearchQuery("")}
                                    >
                                        <RefreshCw className="h-4 w-4 mr-2" />
                                        Clear
                                    </Button>
                                )}
                            </div>
                        </div>
                    </form>

                    {selectedExoplanets.length > 0 && (
                        <div className="flex flex-wrap gap-2 p-2 bg-slate-900/40 rounded-lg border border-slate-800">
                            <span className="text-sm font-medium text-muted-foreground px-2 py-1">Selected:</span>
                            {selectedExoplanets.map((planet) => (
                                <Badge key={planet.pl_name} variant="secondary" className="text-sm py-1 bg-slate-800">
                                    {planet.pl_name}
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-4 w-4 ml-1 hover:bg-slate-700"
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            handleRemoveExoplanet(planet.pl_name)
                                        }}
                                    >
                                        <span className="sr-only">Remove {planet.pl_name}</span>×
                                    </Button>
                                </Badge>
                            ))}
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredExoplanets.map((exoplanet) => {
                            const isSelected = selectedExoplanets.some((p) => p.pl_name === exoplanet.pl_name)
                            const habitabilityScore = exoplanet.habitability_score || 0
                            const waterProbability = exoplanet.pl_water_probability || 0

                            return (
                                <Card
                                    key={exoplanet.pl_name}
                                    className={`cursor-pointer transition-all hover:shadow-md overflow-hidden group bg-slate-900/60 border-slate-800 ${isSelected ? "ring-2 ring-blue-500 border-blue-500/50" : ""
                                        }`}
                                    onClick={() => handleSelectExoplanet(exoplanet)}
                                >
                                    <div className={`h-2 w-full ${getHabitabilityColor(habitabilityScore)}`} />
                                    <CardHeader className="pb-2">
                                        <div className="flex justify-between items-center">
                                            <CardTitle className="text-lg flex items-center gap-2">
                                                {exoplanet.pl_name}
                                                {habitabilityScore > 0.7 && <Sparkles className="h-4 w-4 text-amber-500" />}
                                            </CardTitle>
                                            {isSelected && (
                                                <Badge variant="secondary" className="bg-blue-900/50 text-blue-200">
                                                    Selected
                                                </Badge>
                                            )}
                                        </div>
                                        <CardDescription>
                                            {waterProbability > 0.5 ? "Potential water present" : "Rocky exoplanet"}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid grid-cols-2 gap-y-1 text-sm">
                                            <span className="text-muted-foreground">Radius:</span>
                                            <span>{exoplanet.pl_rade ? `${exoplanet.pl_rade.toFixed(2)} × Earth` : "Unknown"}</span>
                                            <span className="text-muted-foreground">Mass:</span>
                                            <span>{exoplanet.pl_bmasse ? `${exoplanet.pl_bmasse.toFixed(2)} × Earth` : "Unknown"}</span>
                                            <span className="text-muted-foreground">Orbit:</span>
                                            <span>{exoplanet.pl_orbper ? `${exoplanet.pl_orbper.toFixed(1)} days` : "Unknown"}</span>
                                        </div>

                                        <div className="mt-3 flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <div className="h-4 w-full bg-slate-800 rounded-full overflow-hidden">
                                                    <div
                                                        className={`h-full ${getHabitabilityColor(habitabilityScore)}`}
                                                        style={{ width: `${Math.max(5, habitabilityScore * 100)}%` }}
                                                    />
                                                </div>
                                                <span className="text-xs">{(habitabilityScore * 100).toFixed(0)}%</span>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                Compare
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            )
                        })}
                        {filteredExoplanets.length === 0 && (
                            <div className="col-span-full text-center py-12 bg-slate-900/30 rounded-lg border border-slate-800">
                                <Search className="h-12 w-12 mx-auto text-muted-foreground mb-3 opacity-50" />
                                <p className="text-muted-foreground">No exoplanets found matching your search criteria.</p>
                                <Button
                                    variant="outline"
                                    className="mt-4 border-slate-700"
                                    onClick={() => {
                                        setSearchQuery("")
                                        setHabitabilityThreshold([0])
                                    }}
                                >
                                    Reset Filters
                                </Button>
                            </div>
                        )}
                    </div>
                </TabsContent>

                <TabsContent value="comparison" className="space-y-6 pt-4">
                    {selectedExoplanets.length > 0 ? (
                        <>
                            <Card className="bg-slate-900/60 border-slate-800">
                                <CardHeader>
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                        <div>
                                            <CardTitle>Comparing {selectedExoplanets.length} Exoplanets</CardTitle>
                                            <CardDescription>Detailed comparison of selected celestial bodies</CardDescription>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {selectedExoplanets.map((planet) => {
                                                const habitabilityScore = planet.habitability_score || 0
                                                return (
                                                    <Badge
                                                        key={planet.pl_name}
                                                        variant="outline"
                                                        className={`text-sm py-1 border-l-4 ${getHabitabilityColor(habitabilityScore)}`}
                                                    >
                                                        {planet.pl_name}
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-4 w-4 ml-1 hover:bg-slate-700"
                                                            onClick={() => handleRemoveExoplanet(planet.pl_name)}
                                                        >
                                                            <span className="sr-only">Remove {planet.pl_name}</span>×
                                                        </Button>
                                                    </Badge>
                                                )
                                            })}
                                            <Button variant="outline" size="sm" onClick={clearSelection} className="border-slate-700">
                                                Clear All
                                            </Button>
                                        </div>
                                    </div>
                                </CardHeader>
                            </Card>

                            <Card className="overflow-hidden bg-slate-900/60 border-slate-800">
                                <CardHeader className="pb-0">
                                    <CardTitle>Visual Size Comparison</CardTitle>
                                    <CardDescription>Relative sizes of selected exoplanets (Earth radius = 1)</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <ExoplanetSizeComparison exoplanets={selectedExoplanets} />
                                </CardContent>
                            </Card>

                            <Card className="overflow-hidden bg-slate-900/60 border-slate-800">
                                <CardHeader className="pb-0">
                                    <CardTitle>Habitability Analysis</CardTitle>
                                    <CardDescription>Comparing habitability factors and Earth similarity</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <ExoplanetHabitabilityChart exoplanets={selectedExoplanets} />
                                </CardContent>
                            </Card>

                            <Card className="bg-slate-900/60 border-slate-800">
                                <CardHeader>
                                    <CardTitle>Detailed Information</CardTitle>
                                    <CardDescription>Comprehensive data about each selected exoplanet</CardDescription>
                                </CardHeader>
                                <CardContent className="p-0">
                                    <ScrollArea className="h-[600px]">
                                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 p-4">
                                            {selectedExoplanets.map((planet) => (
                                                <ExoplanetCard key={planet.pl_name} exoplanet={planet} onRemove={handleRemoveExoplanet} />
                                            ))}
                                        </div>
                                    </ScrollArea>
                                </CardContent>
                            </Card>
                        </>
                    ) : (
                        <div className="text-center py-16 bg-slate-900/30 rounded-lg border border-slate-800">
                            <Globe className="h-16 w-16 mx-auto text-muted-foreground mb-4 opacity-50" />
                            <h3 className="text-xl font-medium mb-2">No Exoplanets Selected</h3>
                            <p className="text-muted-foreground max-w-md mx-auto mb-6">
                                Select exoplanets from the search tab to compare their properties and characteristics.
                            </p>
                            <Button onClick={() => setActiveTab("search")}>Search Exoplanets</Button>
                        </div>
                    )}
                </TabsContent>
            </Tabs>
        </div>
    )
}

// Helper function for habitability color gradient
function getHabitabilityColor(score: number): string {
    if (score >= 0.8) return "bg-emerald-500"
    if (score >= 0.6) return "bg-green-500"
    if (score >= 0.4) return "bg-yellow-500"
    if (score >= 0.2) return "bg-orange-500"
    return "bg-red-500"
}