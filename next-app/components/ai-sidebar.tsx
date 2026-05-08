"use client"

import { useRef, useEffect, useState } from "react"
import { X, Send, Sparkles, Zap, AtomIcon, Map, Weight, ThermometerSnowflake, Orbit } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

type PlanetData = Record<string, string | number | boolean | null>

interface Message {
    id: string
    role: "user" | "assistant"
    content: string
}

interface AiSidebarProps {
    planetData?: PlanetData | null
    isOpen: boolean
    onClose: () => void
}

const PLANET_CHIPS = [
    "Could life exist here?",
    "Why is it so hot?",
    "Compare to Earth",
    "What's special about it?",
    "Habitable zone?",
    "Could we terraform it?",
]

const GENERAL_CHIPS = [
    "What makes a planet habitable?",
    "How do scientists discover exoplanets?",
    "What is Earth Similarity Index?",
    "Can we terraform exoplanets?",
    "What's a Super-Earth?",
    "How is the habitability score calculated?",
]

function useStreamingChat(planetData?: PlanetData | null) {
    const [messages, setMessages] = useState<Message[]>([])
    const [input, setInput] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const messagesRef = useRef<Message[]>([])
    messagesRef.current = messages

    const send = async (userText: string) => {
        if (!userText.trim() || isLoading) return
        const userMsg: Message = { id: `u-${Date.now()}`, role: "user", content: userText }
        const assistantId = `a-${Date.now()}`
        const assistantMsg: Message = { id: assistantId, role: "assistant", content: "" }
        setMessages((p) => [...p, userMsg, assistantMsg])
        setInput("")
        setIsLoading(true)
        try {
            const endpoint = planetData ? "/api/ai/chat" : "/api/ai/general-chat"
            const body = planetData
                ? JSON.stringify({
                    messages: [...messagesRef.current, userMsg].map(({ role, content }) => ({ role, content })),
                    planetData,
                })
                : JSON.stringify({
                    messages: [...messagesRef.current, userMsg].map(({ role, content }) => ({ role, content })),
                })
            const res = await fetch(endpoint, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body,
            })
            if (!res.body) throw new Error("no stream")
            const reader = res.body.getReader()
            const decoder = new TextDecoder()
            while (true) {
                const { done, value } = await reader.read()
                if (done) break
                const chunk = decoder.decode(value, { stream: true })
                setMessages((p) => p.map((m) => (m.id === assistantId ? { ...m, content: m.content + chunk } : m)))
            }
        } catch {
            setMessages((p) =>
                p.map((m) => (m.id === assistantId ? { ...m, content: "Something went wrong. Please try again." } : m))
            )
        } finally {
            setIsLoading(false)
        }
    }

    return {
        messages,
        input,
        setInput,
        isLoading,
        send,
        handleSubmit: (e: React.FormEvent) => { e.preventDefault(); send(input) },
        handleChange: (e: React.ChangeEvent<HTMLInputElement>) => setInput(e.target.value),
    }
}

function n(v: number) { return v > 1 ? v : v * 100 }

function ScoreBar({ label, value, color }: { label: string; value: number; color: string }) {
    return (
        <div
            className="rounded-xl p-3"
            style={{ background: `${color}0d`, border: `1px solid ${color}28` }}
        >
            <div className="flex items-center justify-between mb-2">
                <span className="font-body font-medium" style={{ fontSize: 9, letterSpacing: "0.12em", color: "rgba(255,255,255,0.45)" }}>
                    {label}
                </span>
                <span className="font-display font-bold" style={{ fontSize: 14, color }}>
                    {value.toFixed(1)}%
                </span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full" style={{ background: "rgba(255,255,255,0.06)" }}>
                <motion.div
                    className="h-full rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(value, 100)}%` }}
                    transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
                    style={{ background: `linear-gradient(90deg, ${color}88, ${color})`, boxShadow: `0 0 8px ${color}55` }}
                />
            </div>
        </div>
    )
}

function habitColor(pct: number) {
    if (pct > 70) return "#10b981"
    if (pct > 50) return "#3b82f6"
    if (pct > 30) return "#f59e0b"
    return "#ef4444"
}

export function AiSidebar({ planetData, isOpen, onClose }: AiSidebarProps) {
    const bottomRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLInputElement>(null)
    const { messages, input, isLoading, send, handleSubmit, handleChange } = useStreamingChat(planetData)

    const lastMsg = messages[messages.length - 1]
    const isStreaming = isLoading && lastMsg?.role === "assistant"

    const isPlanetMode = !!planetData
    const CHIPS = isPlanetMode ? PLANET_CHIPS : GENERAL_CHIPS

    const hab = planetData?.habitability_score != null ? n(Number(planetData.habitability_score)) : null
    const hColor = hab != null ? habitColor(hab) : "#8b5cf6"

    const BATCH_SIZE = 3
    const totalBatches = Math.ceil(CHIPS.length / BATCH_SIZE)
    const [chipBatch, setChipBatch] = useState(0)
    const visibleChips = CHIPS.slice(chipBatch * BATCH_SIZE, chipBatch * BATCH_SIZE + BATCH_SIZE)

    useEffect(() => {
        if (messages.length > 0) return
        const id = setInterval(() => setChipBatch((b) => (b + 1) % totalBatches), 10000)
        return () => clearInterval(id)
    }, [messages.length, totalBatches])

    useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }) }, [messages])
    useEffect(() => { if (isOpen) setTimeout(() => inputRef.current?.focus(), 380) }, [isOpen])

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.18 }}
                        onClick={onClose}
                        className="fixed inset-0 z-[55]"
                        style={{ background: "rgba(2,4,12,0.72)", backdropFilter: "blur(6px)" }}
                    />

                    {/* Panel */}
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", damping: 30, stiffness: 300 }}
                        className="fixed right-0 top-0 z-[60] flex h-full w-full flex-col sm:w-[560px]"
                        style={{ background: "#03050f" }}
                    >
                        {/* Dot-grid texture */}
                        <div
                            className="pointer-events-none absolute inset-0 z-0"
                            style={{
                                backgroundImage: "radial-gradient(rgba(139,92,246,0.07) 1px, transparent 1px)",
                                backgroundSize: "22px 22px",
                            }}
                        />

                        {/* Left accent stripe */}
                        <motion.div
                            className="absolute left-0 top-0 bottom-0 z-10 w-[2px]"
                            style={{ background: "linear-gradient(180deg, transparent 0%, #7c3aed 25%, #6366f1 75%, transparent 100%)" }}
                            animate={{ opacity: [0.5, 1, 0.5] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        />

                        {/* Header */}
                        <div
                            className="relative z-10 flex-shrink-0"
                            style={{ borderBottom: "1px solid rgba(139,92,246,0.12)" }}
                        >
                            <div
                                className="pointer-events-none absolute inset-0"
                                style={{ background: "radial-gradient(ellipse 100% 200% at 50% 0%, rgba(88,28,235,0.11) 0%, transparent 65%)" }}
                            />

                            {/* Status bar */}
                            <div className="flex items-center justify-between px-6 pt-4 pb-0">
                                <div className="flex items-center gap-2">
                                    <motion.div
                                        className="h-2 w-2 rounded-full"
                                        style={{ background: "#22c55e", boxShadow: "0 0 6px #22c55e" }}
                                        animate={{ opacity: [1, 0.4, 1] }}
                                        transition={{ duration: 2, repeat: Infinity }}
                                    />
                                    <span className="font-body font-medium" style={{ fontSize: 11, letterSpacing: "0.14em", color: "rgba(255,255,255,0.55)" }}>
                                        EXOBOT · ONLINE
                                    </span>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="flex h-8 w-8 items-center justify-center rounded-lg transition-all"
                                    style={{ color: "rgba(255,255,255,0.45)" }}
                                    onMouseEnter={(e) => { e.currentTarget.style.color = "#fff"; e.currentTarget.style.background = "rgba(255,255,255,0.09)" }}
                                    onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(255,255,255,0.45)"; e.currentTarget.style.background = "transparent" }}
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            </div>

                            {/* Title area */}
                            <div className="px-6 pt-3 pb-5">
                                {isPlanetMode ? (
                                    <>
                                        <p className="font-body font-semibold" style={{ fontSize: 11, letterSpacing: "0.2em", color: "rgba(139,92,246,0.75)", marginBottom: 6 }}>
                                            CURRENTLY ANALYZING
                                        </p>
                                        <h2
                                            className="font-display font-bold leading-tight break-words"
                                            style={{
                                                fontSize: "clamp(20px, 4vw, 30px)",
                                                background: "linear-gradient(130deg, #fff 0%, #ddd6fe 45%, #a5b4fc 100%)",
                                                WebkitBackgroundClip: "text",
                                                WebkitTextFillColor: "transparent",
                                            }}
                                        >
                                            {String(planetData.pl_name)}
                                        </h2>

                                        {hab != null && (
                                            <div className="mt-4 grid grid-cols-2 gap-3">
                                                <ScoreBar label="HABITABILITY" value={hab} color={hColor} />
                                                {planetData.terraformability_score != null && (
                                                    <ScoreBar label="TERRAFORMABILITY" value={n(Number(planetData.terraformability_score))} color="#3b82f6" />
                                                )}
                                            </div>
                                        )}

                                        <div className="mt-4 grid grid-cols-4 gap-2">
                                            {[
                                                { Icon: Map, label: "Radius", value: planetData.pl_rade != null ? `${Number(planetData.pl_rade).toFixed(2)} R⊕` : "—", sub: planetData.pl_rade != null ? `${Number(planetData.pl_rade).toFixed(2)}× Earth` : "" },
                                                { Icon: Weight, label: "Mass", value: planetData.pl_bmasse != null ? `${Number(planetData.pl_bmasse).toFixed(2)} M⊕` : "—", sub: planetData.pl_bmasse != null ? `${Number(planetData.pl_bmasse).toFixed(1)}× Earth` : "" },
                                                { Icon: ThermometerSnowflake, label: "Temperature", value: planetData.pl_eqt != null ? `${Number(planetData.pl_eqt).toFixed(0)} K` : "—", sub: planetData.pl_eqt != null ? (() => { const d = Math.round(Number(planetData.pl_eqt) - 288); return `${d > 0 ? "+" : ""}${d}K vs Earth` })() : "" },
                                                { Icon: Orbit, label: "Orbital Period", value: planetData.pl_orbper != null ? `${Number(planetData.pl_orbper).toFixed(1)} days` : "—", sub: planetData.pl_orbper != null ? `${(Number(planetData.pl_orbper) / 365.25).toFixed(2)} yr` : "" },
                                            ].map(({ Icon, label, value, sub }) => (
                                                <div key={label} className="flex flex-col items-center rounded-xl py-3 px-1 text-center" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
                                                    <Icon className="h-3.5 w-3.5 mb-1.5" style={{ color: "#818cf8" }} />
                                                    <p className="font-body" style={{ fontSize: 9, color: "rgba(255,255,255,0.4)", letterSpacing: "0.04em", marginBottom: 3 }}>{label}</p>
                                                    <p className="font-display font-semibold leading-tight" style={{ fontSize: 11, color: "rgba(255,255,255,0.88)" }}>{value}</p>
                                                    {sub && <p className="font-body mt-0.5" style={{ fontSize: 9, color: "rgba(255,255,255,0.3)" }}>{sub}</p>}
                                                </div>
                                            ))}
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <p className="font-body font-semibold" style={{ fontSize: 11, letterSpacing: "0.2em", color: "rgba(139,92,246,0.75)", marginBottom: 6 }}>
                                            EXOPLANET RESEARCH ASSISTANT
                                        </p>
                                        <h2
                                            className="font-display font-bold leading-tight"
                                            style={{
                                                fontSize: "clamp(22px, 4vw, 32px)",
                                                background: "linear-gradient(130deg, #fff 0%, #ddd6fe 45%, #a5b4fc 100%)",
                                                WebkitBackgroundClip: "text",
                                                WebkitTextFillColor: "transparent",
                                            }}
                                        >
                                            EXOBOT
                                        </h2>
                                        <p className="font-body mt-1" style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", lineHeight: 1.5 }}>
                                            Ask anything about exoplanets, habitability, terraforming, and space science.
                                        </p>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Messages */}
                        <div
                            className="relative z-10 min-h-0 flex-1 overflow-y-auto py-5 px-5 space-y-6"
                            style={{ scrollbarWidth: "thin", scrollbarColor: "rgba(139,92,246,0.15) transparent" }}
                        >
                            {messages.length === 0 ? (
                                <div className="flex h-full flex-col items-center justify-center gap-6">
                                    {/* Icon */}
                                    <div className="relative">
                                        <div className="absolute -inset-6 rounded-full" style={{ background: "radial-gradient(circle, rgba(124,58,237,0.14) 0%, transparent 70%)" }} />
                                        <motion.div
                                            className="absolute -inset-3 rounded-full"
                                            style={{ border: "1px dashed rgba(124,58,237,0.2)" }}
                                            animate={{ rotate: 360 }}
                                            transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
                                        />
                                        <div
                                            className="relative flex h-14 w-14 items-center justify-center rounded-2xl"
                                            style={{
                                                background: "linear-gradient(135deg, rgba(124,58,237,0.22), rgba(79,70,229,0.14))",
                                                border: "1px solid rgba(124,58,237,0.28)",
                                                boxShadow: "0 0 24px rgba(124,58,237,0.18), inset 0 1px 0 rgba(255,255,255,0.06)",
                                            }}
                                        >
                                            <AtomIcon className="h-6 w-6" style={{ color: "#a78bfa" }} />
                                        </div>
                                    </div>

                                    {/* Copy */}
                                    <div className="text-center">
                                        <p className="font-body font-semibold" style={{ fontSize: 11, letterSpacing: "0.18em", color: "rgba(139,92,246,0.75)", marginBottom: 10 }}>
                                            EXOBOT IS READY
                                        </p>
                                        <p className="font-display font-semibold" style={{ fontSize: 17, color: "rgba(255,255,255,0.75)", lineHeight: 1.55 }}>
                                            {isPlanetMode ? (
                                                <>
                                                    Ask anything about{" "}
                                                    <span style={{ background: "linear-gradient(90deg, #c4b5fd, #818cf8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                                                        {String(planetData.pl_name)}
                                                    </span>
                                                    .
                                                </>
                                            ) : (
                                                <>
                                                    Ask anything about{" "}
                                                    <span style={{ background: "linear-gradient(90deg, #c4b5fd, #818cf8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                                                        exoplanets & space science
                                                    </span>
                                                    .
                                                </>
                                            )}
                                        </p>
                                    </div>

                                    {/* FAQ chips */}
                                    <div className="w-full space-y-1">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="font-body font-semibold" style={{ fontSize: 10, letterSpacing: "0.13em", color: "rgba(167,139,250,0.6)" }}>
                                                FREQUENTLY ASKED
                                            </span>
                                            <div className="flex gap-1">
                                                {Array.from({ length: totalBatches }).map((_, i) => (
                                                    <button
                                                        key={i}
                                                        onClick={() => setChipBatch(i)}
                                                        className="rounded-full transition-all"
                                                        style={{
                                                            width: i === chipBatch ? 16 : 6,
                                                            height: 6,
                                                            background: i === chipBatch ? "rgba(167,139,250,0.8)" : "rgba(255,255,255,0.15)",
                                                        }}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                        <AnimatePresence mode="wait">
                                            <motion.div
                                                key={chipBatch}
                                                initial={{ opacity: 0, y: 6 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -6 }}
                                                transition={{ duration: 0.25 }}
                                                className="space-y-1"
                                            >
                                                {visibleChips.map((chip) => (
                                                    <motion.button
                                                        key={chip}
                                                        whileHover={{ scale: 1.01 }}
                                                        whileTap={{ scale: 0.98 }}
                                                        onClick={() => send(chip)}
                                                        className="w-full rounded-xl px-4 py-2 text-center font-body transition-all"
                                                        style={{
                                                            fontSize: 13,
                                                            border: "1px solid rgba(124,58,237,0.22)",
                                                            background: "rgba(124,58,237,0.07)",
                                                            color: "rgba(196,181,253,0.85)",
                                                            lineHeight: 1.4,
                                                        }}
                                                        onMouseEnter={(e) => {
                                                            e.currentTarget.style.background = "rgba(124,58,237,0.14)"
                                                            e.currentTarget.style.borderColor = "rgba(124,58,237,0.38)"
                                                            e.currentTarget.style.color = "rgba(221,214,254,0.95)"
                                                        }}
                                                        onMouseLeave={(e) => {
                                                            e.currentTarget.style.background = "rgba(124,58,237,0.07)"
                                                            e.currentTarget.style.borderColor = "rgba(124,58,237,0.22)"
                                                            e.currentTarget.style.color = "rgba(196,181,253,0.85)"
                                                        }}
                                                    >
                                                        {chip}
                                                    </motion.button>
                                                ))}
                                            </motion.div>
                                        </AnimatePresence>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    {messages.map((msg, idx) => {
                                        const streaming = isStreaming && idx === messages.length - 1 && msg.role === "assistant"
                                        if (msg.role === "user") {
                                            return (
                                                <motion.div key={msg.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.22 }} className="flex justify-end">
                                                    <div style={{ maxWidth: "82%" }}>
                                                        <p className="font-body font-semibold text-right mb-1.5" style={{ fontSize: 10, letterSpacing: "0.14em", color: "rgba(255,255,255,0.4)" }}>YOU</p>
                                                        <div
                                                            className="rounded-2xl rounded-tr-sm px-4 py-3.5 font-body"
                                                            style={{
                                                                fontSize: 14.5, lineHeight: 1.65, color: "rgba(255,255,255,0.92)",
                                                                background: "linear-gradient(135deg, rgba(109,40,217,0.55), rgba(79,70,229,0.45))",
                                                                border: "1px solid rgba(124,58,237,0.28)",
                                                                boxShadow: "0 4px 24px rgba(109,40,217,0.2)",
                                                            }}
                                                        >
                                                            {msg.content}
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            )
                                        }

                                        return (
                                            <motion.div key={msg.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.22 }}>
                                                <div className="mb-2.5 flex items-center gap-2">
                                                    <div className="flex h-4 w-4 items-center justify-center rounded" style={{ background: "linear-gradient(135deg, #7c3aed, #4f46e5)", boxShadow: "0 0 8px rgba(124,58,237,0.4)" }}>
                                                        <Sparkles className="h-2.5 w-2.5 text-white" />
                                                    </div>
                                                    <span className="font-body font-bold" style={{ fontSize: 10, letterSpacing: "0.16em", color: "rgba(167,139,250,0.85)" }}>EXOBOT</span>
                                                    <div className="flex-1" style={{ height: 1, background: "rgba(124,58,237,0.15)" }} />
                                                </div>
                                                <div
                                                    className="rounded-xl px-4 py-4 font-body"
                                                    style={{
                                                        fontSize: 14.5, lineHeight: 1.75, color: "rgba(255,255,255,0.88)",
                                                        background: "rgba(10,12,26,0.7)",
                                                        border: "1px solid rgba(255,255,255,0.05)",
                                                        borderLeft: "2px solid rgba(124,58,237,0.45)",
                                                    }}
                                                >
                                                    {msg.content ? (
                                                        <>
                                                            {msg.content}
                                                            {streaming && (
                                                                <motion.span
                                                                    animate={{ opacity: [1, 0, 1] }}
                                                                    transition={{ duration: 0.65, repeat: Infinity }}
                                                                    className="ml-[2px] inline-block h-[14px] w-[2px] rounded-sm align-middle"
                                                                    style={{ background: "#a78bfa" }}
                                                                />
                                                            )}
                                                        </>
                                                    ) : (
                                                        <div className="flex items-center gap-1.5 py-1">
                                                            {[0, 0.18, 0.36].map((delay, i) => (
                                                                <motion.span key={i} className="h-1.5 w-1.5 rounded-full" style={{ background: "rgba(124,58,237,0.6)" }} animate={{ y: [0, -4, 0] }} transition={{ duration: 0.7, repeat: Infinity, delay }} />
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            </motion.div>
                                        )
                                    })}
                                    <div ref={bottomRef} />
                                </>
                            )}
                        </div>

                        {/* Quick chips after conversation */}
                        {messages.length > 0 && (
                            <div
                                className="relative z-10 flex flex-shrink-0 gap-1.5 overflow-x-auto px-5 py-3"
                                style={{ borderTop: "1px solid rgba(255,255,255,0.04)", scrollbarWidth: "none" }}
                            >
                                {CHIPS.map((chip) => (
                                    <button
                                        key={chip}
                                        onClick={() => send(chip)}
                                        className="flex-shrink-0 rounded-full font-body transition-all"
                                        style={{ fontSize: 11, padding: "5px 12px", border: "1px solid rgba(124,58,237,0.2)", background: "rgba(124,58,237,0.06)", color: "rgba(196,181,253,0.6)", whiteSpace: "nowrap" }}
                                        onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(124,58,237,0.14)"; e.currentTarget.style.color = "rgba(221,214,254,0.9)" }}
                                        onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(124,58,237,0.06)"; e.currentTarget.style.color = "rgba(196,181,253,0.6)" }}
                                    >
                                        {chip}
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Input */}
                        <div className="relative z-10 flex-shrink-0 px-4 pb-5 pt-3" style={{ borderTop: "1px solid rgba(124,58,237,0.1)" }}>
                            <form onSubmit={handleSubmit}>
                                <div
                                    className="flex items-center gap-2 rounded-2xl px-4 py-1 transition-all"
                                    style={{ background: "rgba(10,13,28,0.85)", border: "1px solid rgba(124,58,237,0.2)" }}
                                >
                                    <input
                                        ref={inputRef}
                                        value={input}
                                        onChange={handleChange}
                                        placeholder={isPlanetMode ? "Ask anything about this planet…" : "Ask anything about exoplanets…"}
                                        disabled={isLoading}
                                        className="flex-1 bg-transparent py-3 font-body text-white placeholder:text-white/20 focus:outline-none disabled:opacity-40"
                                        style={{ fontSize: 13.5 }}
                                        onFocus={(e) => {
                                            const wrapper = e.currentTarget.closest("div.flex") as HTMLElement
                                            if (wrapper) { wrapper.style.borderColor = "rgba(124,58,237,0.5)"; wrapper.style.boxShadow = "0 0 0 3px rgba(124,58,237,0.08)" }
                                        }}
                                        onBlur={(e) => {
                                            const wrapper = e.currentTarget.closest("div.flex") as HTMLElement
                                            if (wrapper) { wrapper.style.borderColor = "rgba(124,58,237,0.2)"; wrapper.style.boxShadow = "none" }
                                        }}
                                    />
                                    <motion.button
                                        type="submit"
                                        disabled={isLoading || !input.trim()}
                                        whileHover={!isLoading && input.trim() ? { scale: 1.08 } : {}}
                                        whileTap={!isLoading && input.trim() ? { scale: 0.92 } : {}}
                                        className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl transition-all disabled:cursor-not-allowed disabled:opacity-25"
                                        style={{
                                            background: input.trim() && !isLoading ? "linear-gradient(135deg, #7c3aed, #6d28d9)" : "rgba(255,255,255,0.06)",
                                            boxShadow: input.trim() && !isLoading ? "0 0 14px rgba(124,58,237,0.5)" : "none",
                                        }}
                                    >
                                        {isLoading ? (
                                            <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
                                                <Zap className="h-3.5 w-3.5 text-white/60" />
                                            </motion.div>
                                        ) : (
                                            <Send className="h-3.5 w-3.5 text-white" />
                                        )}
                                    </motion.button>
                                </div>
                            </form>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}
