import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { SpaceBackground } from "@/components/space-background"

export default function ExoplanetsLoading() {
    return (
        <div className="relative min-h-screen bg-[#030014]">
            <SpaceBackground />

            <div className="container py-6 space-y-8 relative z-10">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <Skeleton className="h-8 w-48 bg-white/5" />
                        <Skeleton className="h-4 w-64 bg-white/5 mt-2" />
                    </div>

                    <div className="flex gap-4">
                        <Skeleton className="h-10 w-[250px] bg-white/5" />
                        <Skeleton className="h-10 w-32 bg-white/5" />
                    </div>
                </div>

                <Skeleton className="h-10 w-64 bg-white/5" />

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {Array.from({ length: 12 }).map((_, i) => (
                        <Card key={i} className="bg-black/40 border-white/10">
                            <CardHeader className="pb-2">
                                <Skeleton className="h-4 w-3/4 bg-white/5" />
                                <Skeleton className="h-3 w-1/2 bg-white/5 mt-2" />
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <Skeleton className="h-3 w-full bg-white/5" />
                                <Skeleton className="h-3 w-full bg-white/5" />
                                <Skeleton className="h-3 w-3/4 bg-white/5" />
                            </CardContent>
                            <CardFooter>
                                <Skeleton className="h-8 w-full bg-white/5" />
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    )
}

