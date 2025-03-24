interface ScoreBarProps {
    label: string
    value: number
    color: "yellow" | "green" | "blue" | "red" | "purple"
    className?: string
}

export function ScoreBar({ label, value, color, className = "" }: ScoreBarProps) {
    // Ensure value is between 0 and 100
    const normalizedValue = Math.min(Math.max(value, 0), 100)

    // Color mapping
    const colorClasses = {
        yellow: "bg-yellow-500",
        green: "bg-green-500",
        blue: "bg-blue-500",
        red: "bg-red-500",
        purple: "bg-purple-500",
    }

    // Text color mapping
    const textColorClasses = {
        yellow: "text-yellow-500",
        green: "text-green-500",
        blue: "text-blue-500",
        red: "text-red-500",
        purple: "text-purple-500",
    }

    return (
        <div className={`w-full ${className}`}>
            <div className="flex justify-between mb-1">
                <span className="text-xs font-medium text-white/80">{label}</span>
                <span className={`text-xs font-medium ${textColorClasses[color]}`}>{Math.round(normalizedValue)} %</span>
            </div>
            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                <div className={`h-full ${colorClasses[color]} rounded-full`} style={{ width: `${normalizedValue}%` }} />
            </div>
        </div>
    )
}

