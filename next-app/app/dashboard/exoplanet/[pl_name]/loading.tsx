import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function ExoplanetDetailsLoading() {
    return (
        <div className="relative min-h-screen">
                <div className="container py-6 space-y-6 relative z-10">
                    <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                        <Skeleton className="h-9 w-36 bg-white/5" />
                        <div className="flex gap-2">
                            <Skeleton className="h-9 w-32 bg-white/5" />
                            <Skeleton className="h-9 w-36 bg-white/5" />
                        </div>
                    </div>

                    <div className="grid gap-6 md:grid-cols-3">
                        <Card className="bg-black/40 border-white/10 md:col-span-2">
                            <CardHeader className="pb-2">
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                                    <div>
                                        <Skeleton className="h-8 w-48 bg-white/5" />
                                        <Skeleton className="h-4 w-72 bg-white/5 mt-2" />
                                    </div>
                                    <Skeleton className="h-6 w-24 bg-white/5" />
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <Skeleton className="h-20 w-full bg-white/5" />

                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {[...Array(4)].map((_, i) => (
                                        <Skeleton key={i} className="h-20 w-full bg-white/5" />
                                    ))}
                                </div>

                                <Skeleton className="h-10 w-72 bg-white/5" />

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {[...Array(4)].map((_, i) => (
                                        <Skeleton key={i} className="h-12 w-full bg-white/5" />
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        <div className="space-y-6">
                            <Card className="bg-black/40 border-white/10">
                                <CardHeader className="pb-2">
                                    <Skeleton className="h-6 w-40 bg-white/5" />
                                </CardHeader>
                                <CardContent>
                                    <Skeleton className="h-64 w-full bg-white/5" />
                                </CardContent>
                            </Card>

                            <Card className="bg-black/40 border-white/10">
                                <CardHeader className="pb-2">
                                    <Skeleton className="h-6 w-40 bg-white/5" />
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {[...Array(3)].map((_, i) => (
                                        <Skeleton key={i} className="h-16 w-full bg-white/5" />
                                    ))}
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    <Card className="bg-black/40 border-white/10">
                        <CardHeader>
                            <Skeleton className="h-6 w-40 bg-white/5" />
                            <Skeleton className="h-4 w-72 bg-white/5 mt-2" />
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                {[...Array(4)].map((_, i) => (
                                    <Skeleton key={i} className="h-32 w-full bg-white/5" />
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
        </div>
    )
}

