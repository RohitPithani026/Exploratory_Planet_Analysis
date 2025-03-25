"use client"

import { Thermometer, Scale, Orbit, Calendar, Ruler, Droplets, Zap, Star } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Progress } from "@/components/ui/progress"
import type { Exoplanet } from "@/lib/types"

interface ExoplanetCardProps {
    exoplanet: Exoplanet
    onRemove: (name: string) => void
}

export default function ExoplanetCard({ exoplanet, onRemove }: ExoplanetCardProps) {
    const habitabilityScore = exoplanet.habitability_score || 0
    const terraformabilityScore = exoplanet.terraformability_score || 0
    const waterProbability = exoplanet.pl_water_probability || 0
    const esi = exoplanet.ESI || 0

    return (
        <Card className="h-full overflow-hidden bg-slate-900/60 border-slate-800">
            <div className={`h-2 w-full ${getHabitabilityColor(habitabilityScore)}`} />
            <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                    <CardTitle className="text-lg">{exoplanet.pl_name}</CardTitle>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 hover:bg-slate-800"
                        onClick={(e) => {
                            e.stopPropagation()
                            onRemove(exoplanet.pl_name)
                        }}
                    >
                        <span className="sr-only">Remove {exoplanet.pl_name}</span>×
                    </Button>
                </div>
                <CardDescription className="flex items-center gap-1">
                    <span className={`inline-block w-2 h-2 rounded-full ${getHabitabilityColor(habitabilityScore)}`}></span>
                    {habitabilityScore > 50
                        ? "Potentially Habitable"
                        : habitabilityScore > 30
                            ? "Moderate Habitability"
                            : "Low Habitability"}
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <div className="text-xs text-muted-foreground">Habitability</div>
                        <Progress
                            value={habitabilityScore}
                            className="h-2"
                            indicatorClassName={getHabitabilityColor(habitabilityScore)}
                        />
                        <div className="flex justify-between text-xs">
                            <span>0</span>
                            <span>{(habitabilityScore).toFixed(0)}%</span>
                            <span>100</span>
                        </div>
                    </div>

                    <div className="space-y-1">
                        <div className="text-xs text-muted-foreground">Earth Similarity</div>
                        <Progress value={esi * 100} className="h-2" indicatorClassName="bg-blue-500" />
                        <div className="flex justify-between text-xs">
                            <span>0</span>
                            <span>{(esi * 100).toFixed(0)}%</span>
                            <span>100</span>
                        </div>
                    </div>
                </div>

                <Separator className="bg-slate-800" />

                <div className="space-y-2">
                    <h4 className="text-sm font-medium flex items-center gap-1">
                        <Scale className="h-3.5 w-3.5" />
                        Physical Properties
                    </h4>
                    <div className="grid grid-cols-2 gap-1 text-sm">
                        <span className="text-muted-foreground flex items-center gap-1">
                            <Ruler className="h-3 w-3" /> Radius:
                        </span>
                        <span>{exoplanet.pl_rade ? `${exoplanet.pl_rade.toFixed(2)} × Earth` : "Unknown"}</span>
                        <span className="text-muted-foreground flex items-center gap-1">
                            <Scale className="h-3 w-3" /> Mass:
                        </span>
                        <span>{exoplanet.pl_bmasse ? `${exoplanet.pl_bmasse.toFixed(2)} × Earth` : "Unknown"}</span>
                        <span className="text-muted-foreground flex items-center gap-1">
                            <Thermometer className="h-3 w-3" /> Temp:
                        </span>
                        <span>{exoplanet.pl_eqt ? `${exoplanet.pl_eqt.toFixed(0)} K` : "Unknown"}</span>
                        <span className="text-muted-foreground flex items-center gap-1">
                            <Zap className="h-3 w-3" /> Gravity:
                        </span>
                        <span>{exoplanet.surface_gravity ? `${exoplanet.surface_gravity.toFixed(2)} g` : "Unknown"}</span>
                    </div>
                </div>

                <Separator className="bg-slate-800" />

                <div className="space-y-2">
                    <h4 className="text-sm font-medium flex items-center gap-1">
                        <Orbit className="h-3.5 w-3.5" />
                        Orbital Properties
                    </h4>
                    <div className="grid grid-cols-2 gap-1 text-sm">
                        <span className="text-muted-foreground flex items-center gap-1">
                            <Calendar className="h-3 w-3" /> Period:
                        </span>
                        <span>{exoplanet.pl_orbper ? `${exoplanet.pl_orbper.toFixed(1)} days` : "Unknown"}</span>
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <span className="text-muted-foreground flex items-center gap-1">
                                        <Droplets className="h-3 w-3" /> Water:
                                    </span>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Probability of liquid water</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                        <span>{waterProbability ? `${(waterProbability * 100).toFixed(0)}%` : "Unknown"}</span>
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <span className="text-muted-foreground flex items-center gap-1">
                                        <Zap className="h-3 w-3" /> Radiation:
                                    </span>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Radiation flux</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                        <span>{exoplanet.pl_radiation_flux ? `${exoplanet.pl_radiation_flux.toFixed(2)}` : "Unknown"}</span>
                    </div>
                </div>

                <Separator className="bg-slate-800" />

                <div className="space-y-2">
                    <h4 className="text-sm font-medium flex items-center gap-1">
                        <Star className="h-3.5 w-3.5" />
                        Star Properties
                    </h4>
                    <div className="grid grid-cols-2 gap-1 text-sm">
                        <span className="text-muted-foreground">Temperature:</span>
                        <span>{exoplanet.st_teff ? `${exoplanet.st_teff.toFixed(0)} K` : "Unknown"}</span>
                        <span className="text-muted-foreground">Mass:</span>
                        <span>{exoplanet.st_mass ? `${exoplanet.st_mass.toFixed(2)} × Sun` : "Unknown"}</span>
                        <span className="text-muted-foreground">Radius:</span>
                        <span>{exoplanet.st_rad ? `${exoplanet.st_rad.toFixed(2)} × Sun` : "Unknown"}</span>
                        <span className="text-muted-foreground">Metallicity:</span>
                        <span>{exoplanet.st_met ? `${exoplanet.st_met.toFixed(2)}` : "Unknown"}</span>
                    </div>
                </div>

                {terraformabilityScore > 0 && (
                    <>
                        <Separator className="bg-slate-800" />
                        <div className="space-y-1">
                            <h4 className="text-sm font-medium flex items-center gap-1">
                                <span className="text-blue-500">✦</span> Terraformability
                            </h4>
                            <Progress value={terraformabilityScore} className="h-2" indicatorClassName="bg-blue-500" />
                            <div className="flex justify-between text-xs">
                                <span>Low</span>
                                <span>{(terraformabilityScore).toFixed(0)}%</span>
                                <span>High</span>
                            </div>
                        </div>
                    </>
                )}
            </CardContent>
        </Card>
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