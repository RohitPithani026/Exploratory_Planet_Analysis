"use client"

import { useState } from "react"
import { Sparkles, ChevronDown, ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ChartExplainerProps {
    chartType: string
    chartLabel: string
    chartData: unknown
    children: React.ReactNode
}

export function ChartExplainer({ chartType, chartLabel, chartData, children }: ChartExplainerProps) {
    const [explanation, setExplanation] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [isExpanded, setIsExpanded] = useState(true)

    const handleClick = async () => {
        if (explanation) {
            setIsExpanded((v) => !v)
            return
        }
        setIsLoading(true)
        try {
            const res = await fetch("/api/ai/generate-content", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ contentType: "explain-chart", chartType, chartLabel, chartData }),
            })
            const data = await res.json()
            if (data.success && data.explanation) {
                setExplanation(data.explanation)
                setIsExpanded(true)
            }
        } catch {
            // silent — user can retry
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div>
            {children}
            <div className="mt-2 flex justify-end">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleClick}
                    disabled={isLoading}
                    className="h-7 gap-1 px-2 text-xs font-body text-purple-400/70 hover:text-purple-300 hover:bg-purple-500/10"
                >
                    <Sparkles className="h-3 w-3" />
                    {isLoading
                        ? "Explaining…"
                        : explanation
                        ? isExpanded
                            ? "Hide explanation"
                            : "Show explanation"
                        : "Explain this chart"}
                    {explanation && !isLoading && (
                        isExpanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />
                    )}
                </Button>
            </div>
            {explanation && isExpanded && (
                <div className="mt-2 rounded-xl border border-purple-500/20 bg-purple-500/5 px-4 py-3">
                    <div className="flex items-center gap-2 mb-1.5">
                        <Sparkles className="h-3 w-3 text-purple-400" />
                        <span className="text-xs font-display text-white/50 uppercase tracking-wide">
                            AI Explanation
                        </span>
                    </div>
                    <p className="text-sm font-body leading-relaxed text-white/75">{explanation}</p>
                </div>
            )}
        </div>
    )
}
