"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Bell, Globe, Lock, LogOut, Moon, Palette, Shield, Sun, User, Zap, Github } from "lucide-react"

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
import { useTheme } from "@/components/theme-provider"
import { useToast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"
import { useSession } from "next-auth/react"

export default function SettingsPage() {
    const {
        theme,
        setTheme,
        colorScheme,
        setColorScheme,
        particleEffects,
        setParticleEffects,
        blurEffects,
        setBlurEffects,
        animations,
        setAnimations,
        compactMode,
        setCompactMode,
        persistentSidebar,
        setPersistentSidebar,
        fontFamily,
        setFontFamily,
        fontSize,
        setFontSize,
    } = useTheme()

    const { toast } = useToast()

    const [activeSection, setActiveSection] = useState("appearance")
    const [isDirty, setIsDirty] = useState(false)
    const { data: session } = useSession()

    // Track changes to detect if settings have been modified
    useEffect(() => {
        setIsDirty(true)
    }, [
        particleEffects,
        blurEffects,
        animations,
        compactMode,
        persistentSidebar,
        fontFamily,
        fontSize,
        colorScheme,
        theme,
    ])

    const handleSaveChanges = () => {
        // In a real app, you might save these to a database
        toast({
            title: "Settings saved",
            description: "Your preferences have been updated successfully.",
        })
        setIsDirty(false)
    }

    const handleLogout = () => {
        toast({
            title: "Logged out",
            description: "You have been successfully logged out.",
        })
        // In a real app, you would use signOut() from next-auth
        setTimeout(() => {
            window.location.href = "/"
        }, 1500)
    }

    return (
        <div className={theme === "dark" ? "dark" : ""}>
            <div className="relative flex min-h-screen flex-col bg-[#030014] dark:bg-[#030014] text-white overflow-hidden">
                {particleEffects && <ParticleBackground />}
                {particleEffects && <SpaceBackground />}

                <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-black/50 backdrop-blur-xl supports-[backdrop-filter]:bg-black/20">
                    <motion.div
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: animations ? 0.5 : 0 }}
                        className="container flex h-16 items-center justify-between p-8"
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
                            
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setTheme(theme === "light" ? "dark" : "light")}
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
                                    <AvatarImage src={session?.user?.image || "/placeholder.svg?height=32&width=32"} alt="User" />
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
                            transition={{ duration: animations ? 0.5 : 0 }}
                            className="flex flex-col gap-6"
                        >
                            <div className="flex flex-col md:flex-row items-start justify-between gap-4">
                                <div>
                                    <h1 className="bg-gradient-to-r from-white to-indigo-200 bg-clip-text text-3xl font-bold tracking-tighter text-transparent">
                                        Settings
                                    </h1>
                                    <p className="text-white/60">Manage your account settings and preferences</p>
                                </div>
                                <Button
                                    onClick={handleSaveChanges}
                                    disabled={!isDirty}
                                    className="relative overflow-hidden rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg transition-all duration-300 hover:shadow-indigo-500/25 disabled:opacity-50"
                                >
                                    <span className="relative z-10 flex items-center">Save Changes</span>
                                </Button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: animations ? 0.3 : 0, delay: animations ? 0.1 : 0 }}
                                    className="md:col-span-1"
                                >
                                    <Card className="border-white/10 bg-black/30 backdrop-blur-sm shadow-xl overflow-hidden relative group h-full">
                                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                        <CardContent className="relative z-10 p-6">
                                            <nav className="space-y-1">
                                                {[
                                                    { name: "Account", icon: User, active: activeSection === "account" },
                                                    { name: "Appearance", icon: Palette, active: activeSection === "appearance" },
                                                    { name: "Notifications", icon: Bell, active: activeSection === "notifications" },
                                                    { name: "Security", icon: Shield, active: activeSection === "security" },
                                                    { name: "Privacy", icon: Lock, active: activeSection === "privacy" },
                                                    { name: "Performance", icon: Zap, active: activeSection === "performance" },
                                                ].map((item) => (
                                                    <div
                                                        key={item.name}
                                                        onClick={() => setActiveSection(item.name.toLowerCase())}
                                                        className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all duration-200 cursor-pointer ${item.active
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
                                                <Button variant="destructive" size="sm" className="mt-3 w-full" onClick={handleLogout}>
                                                    Log Out
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: animations ? 0.3 : 0, delay: animations ? 0.2 : 0 }}
                                    className="md:col-span-3"
                                >
                                    <Card className="border-white/10 bg-black/30 backdrop-blur-sm shadow-xl overflow-hidden relative group h-full">
                                        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                        <CardHeader className="relative z-10">
                                            <CardTitle className="text-xl text-white">
                                                {activeSection === "appearance" && "Appearance"}
                                                {activeSection === "account" && "Account"}
                                                {activeSection === "notifications" && "Notifications"}
                                                {activeSection === "security" && "Security"}
                                                {activeSection === "privacy" && "Privacy"}
                                                {activeSection === "performance" && "Performance"}
                                            </CardTitle>
                                            <CardDescription className="text-white/60">
                                                {activeSection === "appearance" && "Customize how ExoHabit looks and feels"}
                                                {activeSection === "account" && "Manage your account information"}
                                                {activeSection === "notifications" && "Control your notification preferences"}
                                                {activeSection === "security" && "Secure your account"}
                                                {activeSection === "privacy" && "Manage your privacy settings"}
                                                {activeSection === "performance" && "Optimize application performance"}
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent className="relative z-10 space-y-6">
                                            {activeSection === "appearance" && (
                                                <>
                                                    <div className="space-y-4">
                                                        <h3 className="text-lg font-medium text-white">Theme</h3>
                                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                            {[
                                                                { name: "System", value: "system", description: "Follow system settings" },
                                                                { name: "Dark", value: "dark", description: "Dark cosmic theme" },
                                                                { name: "Light", value: "light", description: "Light stellar theme" },
                                                            ].map((item) => (
                                                                <div
                                                                    key={item.name}
                                                                    onClick={() => setTheme(item.value as "dark" | "light" | "system")}
                                                                    className={`relative overflow-hidden rounded-lg border p-4 transition-all duration-200 cursor-pointer ${theme === item.value
                                                                        ? "border-indigo-500/50 bg-indigo-500/10"
                                                                        : "border-white/10 bg-white/5 hover:bg-white/10"
                                                                        }`}
                                                                >
                                                                    {theme === item.value && (
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
                                                                {
                                                                    name: "Cosmic Indigo",
                                                                    value: "cosmic-indigo",
                                                                    color: "from-indigo-500 to-purple-600",
                                                                },
                                                                { name: "Nebula Blue", value: "nebula-blue", color: "from-blue-500 to-cyan-600" },
                                                                {
                                                                    name: "Stellar Green",
                                                                    value: "stellar-green",
                                                                    color: "from-emerald-500 to-teal-600",
                                                                },
                                                                { name: "Solar Orange", value: "solar-orange", color: "from-orange-500 to-amber-600" },
                                                            ].map((item) => (
                                                                <div
                                                                    key={item.name}
                                                                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                                                    onClick={() => setColorScheme(item.value as any)}
                                                                    className={`relative overflow-hidden rounded-lg border p-4 transition-all duration-200 cursor-pointer ${colorScheme === item.value
                                                                            ? "border-indigo-500/50"
                                                                            : "border-white/10 hover:border-white/30"
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
                                                                <Switch id="animations" checked={animations} onCheckedChange={setAnimations} />
                                                            </div>
                                                            <div className="flex items-center justify-between">
                                                                <div>
                                                                    <Label htmlFor="particles" className="text-white">
                                                                        Particle Effects
                                                                    </Label>
                                                                    <p className="text-xs text-white/60">Show cosmic particle background</p>
                                                                </div>
                                                                <Switch id="particles" checked={particleEffects} onCheckedChange={setParticleEffects} />
                                                            </div>
                                                            <div className="flex items-center justify-between">
                                                                <div>
                                                                    <Label htmlFor="blur" className="text-white">
                                                                        Blur Effects
                                                                    </Label>
                                                                    <p className="text-xs text-white/60">Enable backdrop blur effects</p>
                                                                </div>
                                                                <Switch id="blur" checked={blurEffects} onCheckedChange={setBlurEffects} />
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
                                                                <Select value={fontFamily} onValueChange={setFontFamily}>
                                                                    <SelectTrigger className="border-white/10 bg-white/5 text-white">
                                                                        <SelectValue placeholder="Select font" />
                                                                    </SelectTrigger>
                                                                    <SelectContent className="border-white/10 bg-black/80 text-white backdrop-blur-xl">
                                                                        <SelectItem value="inter">Inter</SelectItem>
                                                                        <SelectItem value="poppins">Poppins</SelectItem>
                                                                        <SelectItem value="roboto">Roboto</SelectItem>
                                                                        <SelectItem value="montserrat">Montserrat</SelectItem>
                                                                    </SelectContent>
                                                                </Select>
                                                            </div>
                                                            <div className="space-y-2">
                                                                <Label htmlFor="font-size" className="text-white">
                                                                    Font Size
                                                                </Label>
                                                                <Select value={fontSize} onValueChange={setFontSize}>
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
                                                                <Switch id="compact" checked={compactMode} onCheckedChange={setCompactMode} />
                                                            </div>
                                                            <div className="flex items-center justify-between">
                                                                <div>
                                                                    <Label htmlFor="sidebar" className="text-white">
                                                                        Persistent Sidebar
                                                                    </Label>
                                                                    <p className="text-xs text-white/60">Keep sidebar visible on all pages</p>
                                                                </div>
                                                                <Switch
                                                                    id="sidebar"
                                                                    checked={persistentSidebar}
                                                                    onCheckedChange={setPersistentSidebar}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </>
                                            )}

                                            {activeSection === "account" && (
                                                <div className="space-y-6">
                                                    <div className="space-y-4">
                                                        <h3 className="text-lg font-medium text-white">Personal Information</h3>
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                            <div className="space-y-2">
                                                                <Label htmlFor="name" className="text-white">
                                                                    Full Name
                                                                </Label>
                                                                <Input
                                                                    id="name"
                                                                    defaultValue="John Doe"
                                                                    className="border-white/10 bg-white/5 text-white"
                                                                />
                                                            </div>
                                                            <div className="space-y-2">
                                                                <Label htmlFor="email" className="text-white">
                                                                    Email Address
                                                                </Label>
                                                                <Input
                                                                    id="email"
                                                                    type="email"
                                                                    defaultValue="john.doe@example.com"
                                                                    className="border-white/10 bg-white/5 text-white"
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <Separator className="bg-white/10" />

                                                    <div className="space-y-4">
                                                        <h3 className="text-lg font-medium text-white">Profile Picture</h3>
                                                        <div className="flex items-center gap-4">
                                                            <Avatar className="h-20 w-20">
                                                                <AvatarImage src={session?.user?.image ||"/placeholder.svg?height=80&width=80"} />
                                                                <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-xl">
                                                                    JD
                                                                </AvatarFallback>
                                                            </Avatar>
                                                            <div className="space-y-2">
                                                                <Button variant="outline" className="border-white/10 bg-white/5 text-white">
                                                                    Change Avatar
                                                                </Button>
                                                                <p className="text-xs text-white/40">JPG, GIF or PNG. Max size 2MB.</p>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <Separator className="bg-white/10" />

                                                    <div className="space-y-4">
                                                        <h3 className="text-lg font-medium text-white">Connected Accounts</h3>
                                                        <div className="space-y-3">
                                                            <div className="flex items-center justify-between p-3 border border-white/10 rounded-md bg-white/5">
                                                                <div className="flex items-center gap-3">
                                                                    <svg className="h-5 w-5" viewBox="0 0 24 24">
                                                                        <path
                                                                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                                                            fill="#4285F4"
                                                                        />
                                                                        <path
                                                                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                                                            fill="#34A853"
                                                                        />
                                                                        <path
                                                                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                                                            fill="#FBBC05"
                                                                        />
                                                                        <path
                                                                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                                                            fill="#EA4335"
                                                                        />
                                                                        <path d="M1 1h22v22H1z" fill="none" />
                                                                    </svg>
                                                                    <div>
                                                                        <p className="text-white">Google</p>
                                                                        <p className="text-xs text-white/40">Connected</p>
                                                                    </div>
                                                                </div>
                                                                <Button variant="outline" size="sm" className="border-white/10 bg-white/5 text-white">
                                                                    Disconnect
                                                                </Button>
                                                            </div>

                                                            <div className="flex items-center justify-between p-3 border border-white/10 rounded-md bg-white/5">
                                                                <div className="flex items-center gap-3">
                                                                    <Github className="h-5 w-5" />
                                                                    <div>
                                                                        <p className="text-white">GitHub</p>
                                                                        <p className="text-xs text-white/40">Not connected</p>
                                                                    </div>
                                                                </div>
                                                                <Button variant="outline" size="sm" className="border-white/10 bg-white/5 text-white">
                                                                    Connect
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            {activeSection === "notifications" && (
                                                <div className="space-y-6">
                                                    <div className="space-y-4">
                                                        <h3 className="text-lg font-medium text-white">Email Notifications</h3>
                                                        <div className="space-y-3">
                                                            <div className="flex items-center justify-between">
                                                                <div>
                                                                    <p className="text-white">New Discoveries</p>
                                                                    <p className="text-xs text-white/60">
                                                                        Get notified about newly discovered exoplanets
                                                                    </p>
                                                                </div>
                                                                <Switch defaultChecked />
                                                            </div>
                                                            <div className="flex items-center justify-between">
                                                                <div>
                                                                    <p className="text-white">Research Updates</p>
                                                                    <p className="text-xs text-white/60">Receive updates on your research projects</p>
                                                                </div>
                                                                <Switch defaultChecked />
                                                            </div>
                                                            <div className="flex items-center justify-between">
                                                                <div>
                                                                    <p className="text-white">System Announcements</p>
                                                                    <p className="text-xs text-white/60">Important system updates and announcements</p>
                                                                </div>
                                                                <Switch defaultChecked />
                                                            </div>
                                                            <div className="flex items-center justify-between">
                                                                <div>
                                                                    <p className="text-white">Marketing</p>
                                                                    <p className="text-xs text-white/60">Promotional content and newsletters</p>
                                                                </div>
                                                                <Switch />
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <Separator className="bg-white/10" />

                                                    <div className="space-y-4">
                                                        <h3 className="text-lg font-medium text-white">Push Notifications</h3>
                                                        <div className="space-y-3">
                                                            <div className="flex items-center justify-between">
                                                                <div>
                                                                    <p className="text-white">Enable Push Notifications</p>
                                                                    <p className="text-xs text-white/60">Receive notifications on your device</p>
                                                                </div>
                                                                <Switch defaultChecked />
                                                            </div>
                                                            <div className="flex items-center justify-between">
                                                                <div>
                                                                    <p className="text-white">Sound</p>
                                                                    <p className="text-xs text-white/60">Play a sound for new notifications</p>
                                                                </div>
                                                                <Switch defaultChecked />
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <Separator className="bg-white/10" />

                                                    <div className="space-y-4">
                                                        <h3 className="text-lg font-medium text-white">Notification Frequency</h3>
                                                        <div className="space-y-2">
                                                            <Select defaultValue="daily">
                                                                <SelectTrigger className="border-white/10 bg-white/5 text-white">
                                                                    <SelectValue placeholder="Select frequency" />
                                                                </SelectTrigger>
                                                                <SelectContent className="border-white/10 bg-black/80 text-white backdrop-blur-xl">
                                                                    <SelectItem value="realtime">Real-time</SelectItem>
                                                                    <SelectItem value="daily">Daily Digest</SelectItem>
                                                                    <SelectItem value="weekly">Weekly Summary</SelectItem>
                                                                </SelectContent>
                                                            </Select>
                                                            <p className="text-xs text-white/40">
                                                                How often you want to receive notification summaries
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            {activeSection === "security" && (
                                                <div className="space-y-6">
                                                    <div className="space-y-4">
                                                        <h3 className="text-lg font-medium text-white">Change Password</h3>
                                                        <div className="space-y-3">
                                                            <div className="space-y-2">
                                                                <Label htmlFor="current-password" className="text-white">
                                                                    Current Password
                                                                </Label>
                                                                <Input
                                                                    id="current-password"
                                                                    type="password"
                                                                    className="border-white/10 bg-white/5 text-white"
                                                                />
                                                            </div>
                                                            <div className="space-y-2">
                                                                <Label htmlFor="new-password" className="text-white">
                                                                    New Password
                                                                </Label>
                                                                <Input
                                                                    id="new-password"
                                                                    type="password"
                                                                    className="border-white/10 bg-white/5 text-white"
                                                                />
                                                            </div>
                                                            <div className="space-y-2">
                                                                <Label htmlFor="confirm-password" className="text-white">
                                                                    Confirm New Password
                                                                </Label>
                                                                <Input
                                                                    id="confirm-password"
                                                                    type="password"
                                                                    className="border-white/10 bg-white/5 text-white"
                                                                />
                                                            </div>
                                                            <Button className="mt-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
                                                                Update Password
                                                            </Button>
                                                        </div>
                                                    </div>

                                                    <Separator className="bg-white/10" />

                                                    <div className="space-y-4">
                                                        <h3 className="text-lg font-medium text-white">Two-Factor Authentication</h3>
                                                        <div className="space-y-3">
                                                            <div className="flex items-center justify-between">
                                                                <div>
                                                                    <p className="text-white">Enable 2FA</p>
                                                                    <p className="text-xs text-white/60">
                                                                        Add an extra layer of security to your account
                                                                    </p>
                                                                </div>
                                                                <Switch />
                                                            </div>
                                                            <Button variant="outline" className="border-white/10 bg-white/5 text-white">
                                                                Set Up Two-Factor Authentication
                                                            </Button>
                                                        </div>
                                                    </div>

                                                    <Separator className="bg-white/10" />

                                                    <div className="space-y-4">
                                                        <h3 className="text-lg font-medium text-white">Sessions</h3>
                                                        <div className="space-y-3">
                                                            <div className="p-3 border border-white/10 rounded-md bg-white/5">
                                                                <div className="flex items-center justify-between">
                                                                    <div>
                                                                        <p className="text-white">Current Session</p>
                                                                        <p className="text-xs text-white/40">San Francisco, CA • Chrome on macOS</p>
                                                                    </div>
                                                                    <Badge className="bg-green-500/20 text-green-400 hover:bg-green-500/30">Active</Badge>
                                                                </div>
                                                            </div>
                                                            <Button variant="outline" className="border-white/10 bg-white/5 text-white">
                                                                Log Out All Other Sessions
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            {activeSection === "privacy" && (
                                                <div className="space-y-6">
                                                    <div className="space-y-4">
                                                        <h3 className="text-lg font-medium text-white">Data Sharing</h3>
                                                        <div className="space-y-3">
                                                            <div className="flex items-center justify-between">
                                                                <div>
                                                                    <p className="text-white">Share Research Data</p>
                                                                    <p className="text-xs text-white/60">
                                                                        Allow your research data to be shared with the community
                                                                    </p>
                                                                </div>
                                                                <Switch defaultChecked />
                                                            </div>
                                                            <div className="flex items-center justify-between">
                                                                <div>
                                                                    <p className="text-white">Public Profile</p>
                                                                    <p className="text-xs text-white/60">
                                                                        Make your profile visible to other researchers
                                                                    </p>
                                                                </div>
                                                                <Switch defaultChecked />
                                                            </div>
                                                            <div className="flex items-center justify-between">
                                                                <div>
                                                                    <p className="text-white">Usage Analytics</p>
                                                                    <p className="text-xs text-white/60">Help improve ExoHabit by sharing usage data</p>
                                                                </div>
                                                                <Switch defaultChecked />
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <Separator className="bg-white/10" />

                                                    <div className="space-y-4">
                                                        <h3 className="text-lg font-medium text-white">Data Export</h3>
                                                        <div className="space-y-3">
                                                            <p className="text-sm text-white/60">
                                                                You can export all your data at any time. This includes your profile information,
                                                                research data, and analysis results.
                                                            </p>
                                                            <Button variant="outline" className="border-white/10 bg-white/5 text-white">
                                                                Request Data Export
                                                            </Button>
                                                        </div>
                                                    </div>

                                                    <Separator className="bg-white/10" />

                                                    <div className="space-y-4">
                                                        <h3 className="text-lg font-medium text-white">Account Deletion</h3>
                                                        <div className="space-y-3">
                                                            <p className="text-sm text-white/60">
                                                                Permanently delete your account and all associated data. This action cannot be undone.
                                                            </p>
                                                            <Button variant="destructive">Delete Account</Button>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            {activeSection === "performance" && (
                                                <div className="space-y-6">
                                                    <div className="space-y-4">
                                                        <h3 className="text-lg font-medium text-white">Data Caching</h3>
                                                        <div className="space-y-3">
                                                            <div className="flex items-center justify-between">
                                                                <div>
                                                                    <p className="text-white">Enable Caching</p>
                                                                    <p className="text-xs text-white/60">Cache data locally for faster loading</p>
                                                                </div>
                                                                <Switch defaultChecked />
                                                            </div>
                                                            <div className="flex items-center justify-between">
                                                                <div>
                                                                    <p className="text-white">Cache Size</p>
                                                                    <p className="text-xs text-white/60">Current cache: 24.5 MB</p>
                                                                </div>
                                                                <Button variant="outline" size="sm" className="border-white/10 bg-white/5 text-white">
                                                                    Clear Cache
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <Separator className="bg-white/10" />

                                                    <div className="space-y-4">
                                                        <h3 className="text-lg font-medium text-white">Image Quality</h3>
                                                        <div className="space-y-3">
                                                            <div className="flex items-center justify-between">
                                                                <div>
                                                                    <p className="text-white">Image Resolution</p>
                                                                    <p className="text-xs text-white/60">Set the quality of images and visualizations</p>
                                                                </div>
                                                                <Select defaultValue="high">
                                                                    <SelectTrigger className="w-32 border-white/10 bg-white/5 text-white">
                                                                        <SelectValue placeholder="Select quality" />
                                                                    </SelectTrigger>
                                                                    <SelectContent className="border-white/10 bg-black/80 text-white backdrop-blur-xl">
                                                                        <SelectItem value="low">Low</SelectItem>
                                                                        <SelectItem value="medium">Medium</SelectItem>
                                                                        <SelectItem value="high">High</SelectItem>
                                                                    </SelectContent>
                                                                </Select>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <Separator className="bg-white/10" />

                                                    <div className="space-y-4">
                                                        <h3 className="text-lg font-medium text-white">Network Settings</h3>
                                                        <div className="space-y-3">
                                                            <div className="flex items-center justify-between">
                                                                <div>
                                                                    <p className="text-white">Data Saver Mode</p>
                                                                    <p className="text-xs text-white/60">Reduce data usage when on cellular networks</p>
                                                                </div>
                                                                <Switch />
                                                            </div>
                                                            <div className="flex items-center justify-between">
                                                                <div>
                                                                    <p className="text-white">Background Sync</p>
                                                                    <p className="text-xs text-white/60">Sync data in the background</p>
                                                                </div>
                                                                <Switch defaultChecked />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
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

