"use client"

import { useState } from "react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Share2, Link, Copy, Check, Twitter, Facebook, Mail } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface ShareDialogProps {
    planetName: string
    planetUrl: string
    planetData: Record<string, unknown>
}

export function ShareDialog({ planetName, planetUrl }: ShareDialogProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [copied, setCopied] = useState(false)
    const { toast } = useToast()

    const handleCopyLink = () => {
        navigator.clipboard
            .writeText(planetUrl)
            .then(() => {
                setCopied(true)
                setTimeout(() => setCopied(false), 2000)
                toast({
                    title: "Link copied",
                    description: "The link has been copied to your clipboard.",
                })
            })
            .catch((err) => {
                console.error("Error copying to clipboard:", err)
                toast({
                    title: "Error",
                    description: "Failed to copy link to clipboard.",
                    variant: "destructive",
                })
            })
    }

    const handleShareTwitter = () => {
        const text = `Check out this amazing exoplanet: ${planetName}!`
        const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(planetUrl)}`
        window.open(url, "_blank")
        setIsOpen(false)
    }

    const handleShareFacebook = () => {
        const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(planetUrl)}`
        window.open(url, "_blank")
        setIsOpen(false)
    }

    const handleShareEmail = () => {
        const subject = `Check out this amazing exoplanet: ${planetName}!`
        const body = `I found this interesting exoplanet and thought you might like to check it out: ${planetUrl}`
        const url = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
        window.location.href = url
        setIsOpen(false)
    }

    const handleShareNative = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: `Exoplanet: ${planetName}`,
                    text: `Check out this amazing exoplanet: ${planetName}!`,
                    url: planetUrl,
                })
                setIsOpen(false)
            } catch (error) {
                console.error("Error sharing:", error)
            }
        } else {
            handleCopyLink()
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button
                    variant="outline"
                    size="sm"
                    className="border-white/10 bg-white/5 text-white hover:bg-white/10 font-body"
                >
                    <Share2 className="mr-2 h-4 w-4" />
                    Share
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-black/80 border-white/10 text-white backdrop-blur-sm">
                <DialogHeader>
                    <DialogTitle className="font-display">Share {planetName}</DialogTitle>
                    <DialogDescription className="text-white/60 font-body">
                        Share this exoplanet with others or copy the link.
                    </DialogDescription>
                </DialogHeader>

                <Tabs defaultValue="link" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 bg-white/5 border border-white/10">
                        <TabsTrigger
                            value="link"
                            className="data-[state=active]:bg-white/10 data-[state=active]:text-white text-white/70"
                        >
                            <Link className="mr-2 h-4 w-4" />
                            Copy Link
                        </TabsTrigger>
                        <TabsTrigger
                            value="social"
                            className="data-[state=active]:bg-white/10 data-[state=active]:text-white text-white/70"
                        >
                            <Share2 className="mr-2 h-4 w-4" />
                            Social Media
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="link" className="mt-4">
                        <div className="space-y-4">
                            <div className="grid w-full items-center gap-1.5">
                                <Label htmlFor="link" className="text-white font-body">
                                    Share Link
                                </Label>
                                <div className="flex items-center gap-2">
                                    <Input
                                        id="link"
                                        value={planetUrl}
                                        readOnly
                                        className="bg-white/5 border-white/10 text-white font-body"
                                    />
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={handleCopyLink}
                                        className="border-white/10 bg-white/5 text-white hover:bg-white/10"
                                    >
                                        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                                    </Button>
                                </div>
                            </div>

                            <Button
                                className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-body"
                                onClick={handleShareNative}
                            >
                                <Share2 className="mr-2 h-4 w-4" />
                                Share Now
                            </Button>
                        </div>
                    </TabsContent>

                    <TabsContent value="social" className="mt-4">
                        <div className="grid grid-cols-3 gap-4">
                            <Button
                                variant="outline"
                                className="flex flex-col items-center gap-2 h-auto py-4 border-white/10 bg-white/5 text-white hover:bg-white/10 font-body"
                                onClick={handleShareTwitter}
                            >
                                <Twitter className="h-6 w-6" />
                                <span className="text-xs">Twitter</span>
                            </Button>
                            <Button
                                variant="outline"
                                className="flex flex-col items-center gap-2 h-auto py-4 border-white/10 bg-white/5 text-white hover:bg-white/10 font-body"
                                onClick={handleShareFacebook}
                            >
                                <Facebook className="h-6 w-6" />
                                <span className="text-xs">Facebook</span>
                            </Button>
                            <Button
                                variant="outline"
                                className="flex flex-col items-center gap-2 h-auto py-4 border-white/10 bg-white/5 text-white hover:bg-white/10 font-body"
                                onClick={handleShareEmail}
                            >
                                <Mail className="h-6 w-6" />
                                <span className="text-xs">Email</span>
                            </Button>
                        </div>
                    </TabsContent>
                </Tabs>

                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => setIsOpen(false)}
                        className="border-white/10 bg-white/5 text-white hover:bg-white/10 font-body"
                    >
                        Close
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

