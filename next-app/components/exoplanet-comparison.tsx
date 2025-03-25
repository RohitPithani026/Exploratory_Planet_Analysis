"use client"

import { useState, useEffect } from "react"
import { Search, Globe, Sparkles, RefreshCw, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useToast } from "@/hooks/use-toast"
import ExoplanetCard from "./exoplanet-card"
import ExoplanetHabitabilityChart from "./exoplanet-habitability-chart"
import ExoplanetSizeComparison from "./exoplanet-size-comparison"
import type { Exoplanet } from "@/lib/types"

export default function ExoplanetComparison() {
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedExoplanets, setSelectedExoplanets] = useState<Exoplanet[]>([])
    const [filteredExoplanets, setFilteredExoplanets] = useState<Exoplanet[]>([])
    const [allExoplanets, setAllExoplanets] = useState<Exoplanet[]>([])
    const [activeTab, setActiveTab] = useState("search")
    const [isLoading, setIsLoading] = useState(true)
    const { toast } = useToast()

    // Fetch exoplanet data
    useEffect(() => {
        const fetchExoplanets = async () => {
            try {
                setIsLoading(true)
                const response = await fetch("/api/data")
                if (!response.ok) {
                    throw new Error("Failed to fetch exoplanet data")
                }
                const data = await response.json()
                setAllExoplanets(data)
                setFilteredExoplanets(data.slice(0, 12)) // Show first 12 by default
                setIsLoading(false)
            } catch (error) {
                console.error("Error fetching exoplanet data:", error)
                setIsLoading(false)
                toast({
                    title: "Error",
                    description: "Failed to load exoplanet data. Please try again later.",
                    variant: "destructive",
                })
            }
        }

        fetchExoplanets()
    }, [toast])

    useEffect(() => {
        const filtered = allExoplanets.filter((planet) => planet.pl_name.toLowerCase().includes(searchQuery.toLowerCase()))

        setFilteredExoplanets(filtered.slice(0, 12)) // Limit to 12 planets for the UI
    }, [searchQuery, allExoplanets])

    const handleSelectExoplanet = (exoplanet: Exoplanet) => {
        if (selectedExoplanets.some((p) => p.pl_name === exoplanet.pl_name)) {
            // Already selected, do nothing
            return
        }

        if (selectedExoplanets.length < 5) {
            setSelectedExoplanets([...selectedExoplanets, exoplanet])
            if (selectedExoplanets.length === 0) {
                setActiveTab("comparison")
            }
        } else {
            toast({
                title: "Selection limit reached",
                description: "You can compare up to 5 planets at a time",
                variant: "destructive",
            })
        }
    }

    const handleRemoveExoplanet = (name: string) => {
        setSelectedExoplanets(selectedExoplanets.filter((planet) => planet.pl_name !== name))
    }

    const clearSelection = () => {
        setSelectedExoplanets([])
    }

    // Function to get planet type based on data
    const getPlanetType = (planet: Exoplanet) => {
        if (!planet.pl_rade) return "Unknown"

        if (planet.pl_rade < 0.5) return "Sub-Earth"
        if (planet.pl_rade < 1.6) return "Earth-like"
        if (planet.pl_rade < 4) return "Super-Earth"
        if (planet.pl_rade < 10) return "Neptune-like"
        return "Gas Giant"
    }

    const getBadgeColor = (type: string) => {
        switch (type) {
            case "Earth-like":
                return "bg-green-500/20 text-green-400 border-green-500/30"
            case "Super-Earth":
                return "bg-blue-500/20 text-blue-400 border-blue-500/30"
            case "Neptune-like":
                return "bg-indigo-500/20 text-indigo-400 border-indigo-500/30"
            case "Gas Giant":
                return "bg-purple-500/20 text-purple-400 border-purple-500/30"
            case "Sub-Earth":
                return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
            default:
                return "bg-gray-500/20 text-gray-400 border-gray-500/30"
        }
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
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-white/50" />
                            <Input
                                type="search"
                                placeholder="Search exoplanets..."
                                className="w-full bg-white/5 border-white/10 pl-8 text-white placeholder:text-white/50"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        {(searchQuery) && (
                            <Button
                                variant="outline"
                                className="border-white/10 bg-white/5 text-white hover:bg-white/10"
                                onClick={() => {
                                    setSearchQuery("")
                                }}
                            >
                                <RefreshCw className="h-4 w-4 mr-2" />
                                Clear
                            </Button>
                        )}
                    </div>

                    {selectedExoplanets.length > 0 && (
                        <div className="flex flex-wrap gap-2 p-2 bg-slate-900/40 rounded-lg border border-slate-800">
                            <span className="text-sm font-medium text-white/60 px-2 py-1">Selected:</span>
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

                    {isLoading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {Array.from({ length: 6 }).map((_, i) => (
                                <Card key={i} className="bg-slate-900/60 border-slate-800 animate-pulse">
                                    <div className="h-2 w-full bg-slate-800"></div>
                                    <CardHeader className="pb-2">
                                        <div className="h-5 w-3/4 bg-slate-800 rounded"></div>
                                        <div className="h-4 w-1/2 bg-slate-800 rounded mt-2"></div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-3">
                                            <div className="h-4 bg-slate-800 rounded"></div>
                                            <div className="h-4 bg-slate-800 rounded"></div>
                                            <div className="h-4 bg-slate-800 rounded"></div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {filteredExoplanets.map((exoplanet) => {
                                const isSelected = selectedExoplanets.some((p) => p.pl_name === exoplanet.pl_name)
                                const habitabilityScore = exoplanet.habitability_score || 0
                                const waterProbability = exoplanet.pl_water_probability || 0
                                const planetType = getPlanetType(exoplanet)

                                return (
                                    <Card
                                        key={exoplanet.pl_name}
                                        className={`cursor-pointer transition-all hover:shadow-md overflow-hidden group bg-slate-900/60 border-slate-800 ${isSelected ? "ring-2 ring-blue-500 border-blue-500/50" : ""}`}
                                        onClick={() => handleSelectExoplanet(exoplanet)}
                                    >
                                        <div className={`h-2 w-full ${getHabitabilityColor(habitabilityScore)}`} />
                                        <CardHeader className="pb-2">
                                            <div className="flex justify-between items-center">
                                            <CardTitle className="text-lg font-bold text-white">{exoplanet.pl_name}
                                                    {habitabilityScore > 50 && <Sparkles className="h-4 w-4 text-amber-500" />}
                                                </CardTitle>
                                                {isSelected && (
                                                    <Badge variant="secondary" className="bg-blue-900/50 text-blue-200">
                                                        Selected
                                                    </Badge>
                                                )}
                                            </div>
                                            <CardDescription>
                                                <Badge className={getBadgeColor(planetType)}>{planetType}</Badge>
                                                {waterProbability > 0.5 ? "• Potential water present" : ""}
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="grid grid-cols-2 gap-y-1 text-sm">
                                                <span className="text-white/60">Radius:</span>
                                                <span>{exoplanet.pl_rade ? `${exoplanet.pl_rade.toFixed(2)} × Earth` : "Unknown"}</span>
                                                <span className="text-white/60">Mass:</span>
                                                <span>{exoplanet.pl_bmasse ? `${exoplanet.pl_bmasse.toFixed(2)} × Earth` : "Unknown"}</span>
                                                <span className="text-white/60">Orbit:</span>
                                                <span>{exoplanet.pl_orbper ? `${exoplanet.pl_orbper.toFixed(1)} days` : "Unknown"}</span>
                                            </div>

                                            <div className="mt-3 flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <div className="h-4 w-full bg-slate-800 rounded-full overflow-hidden">
                                                        <div
                                                            className={`h-full ${getHabitabilityColor(habitabilityScore)}`}
                                                            style={{ width: `${Math.max(5, habitabilityScore)}%` }}
                                                        />
                                                    </div>  
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
                                    <Search className="h-12 w-12 mx-auto text-white/20 mb-3 opacity-50" />
                                    <p className="text-white/60">No exoplanets found matching your search criteria.</p>
                                    <Button
                                        variant="outline"
                                        className="mt-4 border-slate-700"
                                        onClick={() => {
                                            setSearchQuery("")
                                        }}
                                    >
                                        Reset Filters
                                    </Button>
                                </div>
                            )}
                        </div>
                    )}
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
                                                            <X className="h-3 w-3" />
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
                            <Globe className="h-16 w-16 mx-auto text-white/20 mb-4 opacity-50" />
                            <h3 className="text-xl font-medium mb-2">No Exoplanets Selected</h3>
                            <p className="text-white/60 max-w-md mx-auto mb-6">
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
    if (score >= 70) return "bg-emerald-500"
    if (score >= 50) return "bg-green-500"
    if (score >= 30) return "bg-yellow-500"
    if (score >= 10) return "bg-orange-500"
    return "bg-red-500"
}

