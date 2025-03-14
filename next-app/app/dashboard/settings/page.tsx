"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Bell, Globe, Lock, LogOut, Moon, Palette, Search, Shield, Sun, User, Zap } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ParticleBackground } from "@/components/particle-background"
import { SpaceBackground } from "@/components/space-background"

export default function SettingsPage() {
    const [theme, setTheme] = useState<"light" | "dark">("dark")

    const toggleTheme = () => {
        const newTheme = theme === "light" ? "dark" : "light"
        setTheme(newTheme)
        document.documentElement.classList.toggle("dark")
    }

    return (
        <div className={theme === "dark" ? "dark" : ""}>
            <div className="relative flex min-h-screen flex-col bg-[#030014] dark:bg-[#030014] text-white overflow-hidden">
                <ParticleBackground />
                <SpaceBackground />

                <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-black/50 backdrop-blur-xl supports-[backdrop-filter]:bg-black/20">
                    <motion.div
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        className="container flex h-16 items-center justify-between"
                    >
                        <div className="flex items-center gap-2 md:gap-4">
                            <Link href="/dashboard" className="flex items-center gap-2 group">
                                <div className="relative">
                                    <div className="absolute -inset-0.5 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 opacity-75 blur group-hover:opacity-100 transition-opacity duration-300"></div>
                                    <div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-black">
                                        <Globe className="h-5 w-5 text-indigo-400" />
                                    </div>
                                </div>
                                <span className="bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-xl font-bold text-transparent hidden md:inline">
                                    ExoHabit
                                </span>
                            </Link>
                            <nav className="hidden md:flex items-center gap-6 text-sm">
                                <Link
                                    href="/dashboard"
                                    className="font-medium text-white/70 transition-colors hover:text-indigo-300 relative group"
                                >
                                    Dashboard
                                    <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-gradient-to-r from-indigo-500 to-purple-600 group-hover:w-full transition-all duration-300"></span>
                                </Link>
                                <Link
                                    href="/dashboard/exoplanets"
                                    className="font-medium text-white/70 transition-colors hover:text-indigo-300 relative group"
                                >
                                    Exoplanets
                                    <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-gradient-to-r from-indigo-500 to-purple-600 group-hover:w-full transition-all duration-300"></span>
                                </Link>
                                <Link
                                    href="/dashboard/profile"
                                    className="font-medium text-white/70 transition-colors hover:text-indigo-300 relative group"
                                >
                                    Profile
                                    <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-gradient-to-r from-indigo-500 to-purple-600 group-hover:w-full transition-all duration-300"></span>
                                </Link>
                                <Link
                                    href="/dashboard/settings"
                                    className="font-medium text-white transition-colors hover:text-indigo-300 relative group"
                                >
                                    Settings
                                    <span className="absolute -bottom-1 left-0 h-0.5 w-full bg-gradient-to-r from-indigo-500 to-purple-600 transition-all duration-300"></span>
                                </Link>
                            </nav>
                        </div>
                        <div className="flex items-center gap-4">
                            <form className="hidden md:flex">
                                <div className="relative group">
                                    <div className="absolute -inset-0.5 rounded-full bg-gradient-to-r from-indigo-500/50 to-purple-600/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"></div>
                                    <div className="relative">
                                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-white/40" />
                                        <Input
                                            type="search"
                                            placeholder="Search exoplanets..."
                                            className="w-64 rounded-full border-white/10 bg-white/5 pl-8 text-white placeholder:text-white/30 focus:border-indigo-500/50 focus:ring-indigo-500/50"
                                        />
                                    </div>
                                </div>
                            </form>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={toggleTheme}
                                className="text-white hover:bg-white/10 relative group"
                            >
                                <div className="absolute inset-0 rounded-full bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                                <span className="sr-only">Toggle theme</span>
                            </Button>
                            <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 relative group">
                                <div className="absolute inset-0 rounded-full bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                <Bell className="h-5 w-5" />
                                <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-indigo-500"></span>
                                <span className="sr-only">Notifications</span>
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="rounded-full border border-white/10 bg-white/5 hover:bg-white/10 transition-all duration-300"
                            >
                                <Avatar className="h-8 w-8">
                                    <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
                                    <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
                                        JD
                                    </AvatarFallback>
                                </Avatar>
                            </Button>
                        </div>
                    </motion.div>
                </header>

                <main className="flex-1 p-4 md:p-6 z-10">
                    <div className="container">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="flex flex-col gap-6"
                        >
                            <div className="flex flex-col md:flex-row items-start justify-between gap-4">
                                <div>
                                    <h1 className="bg-gradient-to-r from-white to-indigo-200 bg-clip-text text-3xl font-bold tracking-tighter text-transparent">
                                        Settings
                                    </h1>
                                    <p className="text-white/60">Manage your account settings and preferences</p>
                                </div>
                                <Button className="relative overflow-hidden rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg transition-all duration-300 hover:shadow-indigo-500/25">
                                    <span className="relative z-10 flex items-center">Save Changes</span>
                                </Button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3, delay: 0.1 }}
                                    className="md:col-span-1"
                                >
                                    <Card className="border-white/10 bg-black/30 backdrop-blur-sm shadow-xl overflow-hidden relative group h-full">
                                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                        <CardContent className="relative z-10 p-6">
                                            <nav className="space-y-1">
                                                {[
                                                    { name: "Account", icon: User, active: false },
                                                    { name: "Appearance", icon: Palette, active: true },
                                                    { name: "Notifications", icon: Bell, active: false },
                                                    { name: "Security", icon: Shield, active: false },
                                                    { name: "Privacy", icon: Lock, active: false },
                                                    { name: "Performance", icon: Zap, active: false },
                                                ].map((item) => (
                                                    <div
                                                        key={item.name}
                                                        className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all duration-200 ${item.active
                                                                ? "bg-gradient-to-r from-indigo-500/20 to-purple-600/20 text-white"
                                                                : "text-white/70 hover:bg-white/10 hover:text-white"
                                                            }`}
                                                    >
                                                        <item.icon className={`h-5 w-5 ${item.active ? "text-indigo-400" : "text-white/60"}`} />
                                                        <span>{item.name}</span>
                                                        {item.active && <div className="ml-auto h-1.5 w-1.5 rounded-full bg-indigo-400"></div>}
                                                    </div>
                                                ))}
                                            </nav>

                                            <Separator className="my-6 bg-white/10" />

                                            <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-4">
                                                <div className="flex items-center gap-3">
                                                    <LogOut className="h-5 w-5 text-red-400" />
                                                    <div>
                                                        <h4 className="font-medium text-white">Log out</h4>
                                                        <p className="text-xs text-white/60">Sign out of your account</p>
                                                    </div>
                                                </div>
                                                <Button variant="destructive" size="sm" className="mt-3 w-full">
                                                    Log Out
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3, delay: 0.2 }}
                                    className="md:col-span-3"
                                >
                                    <Card className="border-white/10 bg-black/30 backdrop-blur-sm shadow-xl overflow-hidden relative group h-full">
                                        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                        <CardHeader className="relative z-10">
                                            <CardTitle className="text-xl text-white">Appearance</CardTitle>
                                            <CardDescription className="text-white/60">
                                                Customize how ExoHabit looks and feels
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent className="relative z-10 space-y-6">
                                            <div className="space-y-4">
                                                <h3 className="text-lg font-medium text-white">Theme</h3>
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                    {[
                                                        { name: "System", description: "Follow system settings" },
                                                        { name: "Dark", description: "Dark cosmic theme", active: true },
                                                        { name: "Light", description: "Light stellar theme" },
                                                    ].map((item) => (
                                                        <div
                                                            key={item.name}
                                                            className={`relative overflow-hidden rounded-lg border p-4 transition-all duration-200 ${item.active
                                                                    ? "border-indigo-500/50 bg-indigo-500/10"
                                                                    : "border-white/10 bg-white/5 hover:bg-white/10"
                                                                }`}
                                                        >
                                                            {item.active && (
                                                                <div className="absolute top-0 right-0">
                                                                    <div className="h-12 w-12 translate-x-6 -translate-y-6 rotate-45 bg-indigo-500/20"></div>
                                                                </div>
                                                            )}
                                                            <div className="relative z-10">
                                                                <h4 className="font-medium text-white">{item.name}</h4>
                                                                <p className="text-xs text-white/60">{item.description}</p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            <Separator className="bg-white/10" />

                                            <div className="space-y-4">
                                                <h3 className="text-lg font-medium text-white">Color Scheme</h3>
                                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                                    {[
                                                        { name: "Cosmic Indigo", color: "from-indigo-500 to-purple-600", active: true },
                                                        { name: "Nebula Blue", color: "from-blue-500 to-cyan-600" },
                                                        { name: "Stellar Green", color: "from-emerald-500 to-teal-600" },
                                                        { name: "Solar Orange", color: "from-orange-500 to-amber-600" },
                                                    ].map((item) => (
                                                        <div
                                                            key={item.name}
                                                            className={`relative overflow-hidden rounded-lg border p-4 transition-all duration-200 ${item.active ? "border-indigo-500/50" : "border-white/10 hover:border-white/30"
                                                                }`}
                                                        >
                                                            <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-20`}></div>
                                                            <div className="relative z-10 flex flex-col items-center">
                                                                <div className={`h-6 w-24 rounded-full bg-gradient-to-r ${item.color} mb-2`}></div>
                                                                <p className="text-sm text-white">{item.name}</p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            <Separator className="bg-white/10" />

                                            <div className="space-y-4">
                                                <h3 className="text-lg font-medium text-white">UI Effects</h3>
                                                <div className="space-y-3">
                                                    <div className="flex items-center justify-between">
                                                        <div>
                                                            <Label htmlFor="animations" className="text-white">
                                                                Animations
                                                            </Label>
                                                            <p className="text-xs text-white/60">Enable UI animations and transitions</p>
                                                        </div>
                                                        <Switch id="animations" defaultChecked />
                                                    </div>
                                                    <div className="flex items-center justify-between">
                                                        <div>
                                                            <Label htmlFor="particles" className="text-white">
                                                                Particle Effects
                                                            </Label>
                                                            <p className="text-xs text-white/60">Show cosmic particle background</p>
                                                        </div>
                                                        <Switch id="particles" defaultChecked />
                                                    </div>
                                                    <div className="flex items-center justify-between">
                                                        <div>
                                                            <Label htmlFor="blur" className="text-white">
                                                                Blur Effects
                                                            </Label>
                                                            <p className="text-xs text-white/60">Enable backdrop blur effects</p>
                                                        </div>
                                                        <Switch id="blur" defaultChecked />
                                                    </div>
                                                </div>
                                            </div>

                                            <Separator className="bg-white/10" />

                                            <div className="space-y-4">
                                                <h3 className="text-lg font-medium text-white">Font Settings</h3>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div className="space-y-2">
                                                        <Label htmlFor="font-family" className="text-white">
                                                            Font Family
                                                        </Label>
                                                        <Select defaultValue="inter">
                                                            <SelectTrigger className="border-white/10 bg-white/5 text-white">
                                                                <SelectValue placeholder="Select font" />
                                                            </SelectTrigger>
                                                            <SelectContent className="border-white/10 bg-black/80 text-white backdrop-blur-xl">
                                                                <SelectItem value="inter">Inter</SelectItem>
                                                                <SelectItem value="roboto">Roboto</SelectItem>
                                                                <SelectItem value="poppins">Poppins</SelectItem>
                                                                <SelectItem value="montserrat">Montserrat</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label htmlFor="font-size" className="text-white">
                                                            Font Size
                                                        </Label>
                                                        <Select defaultValue="medium">
                                                            <SelectTrigger className="border-white/10 bg-white/5 text-white">
                                                                <SelectValue placeholder="Select size" />
                                                            </SelectTrigger>
                                                            <SelectContent className="border-white/10 bg-black/80 text-white backdrop-blur-xl">
                                                                <SelectItem value="small">Small</SelectItem>
                                                                <SelectItem value="medium">Medium</SelectItem>
                                                                <SelectItem value="large">Large</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                </div>
                                            </div>

                                            <Separator className="bg-white/10" />

                                            <div className="space-y-4">
                                                <h3 className="text-lg font-medium text-white">Layout</h3>
                                                <div className="space-y-3">
                                                    <div className="flex items-center justify-between">
                                                        <div>
                                                            <Label htmlFor="compact" className="text-white">
                                                                Compact Mode
                                                            </Label>
                                                            <p className="text-xs text-white/60">Reduce spacing between elements</p>
                                                        </div>
                                                        <Switch id="compact" />
                                                    </div>
                                                    <div className="flex items-center justify-between">
                                                        <div>
                                                            <Label htmlFor="sidebar" className="text-white">
                                                                Persistent Sidebar
                                                            </Label>
                                                            <p className="text-xs text-white/60">Keep sidebar visible on all pages</p>
                                                        </div>
                                                        <Switch id="sidebar" defaultChecked />
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            </div>
                        </motion.div>
                    </div>
                </main>
            </div>
        </div>
    )
}

