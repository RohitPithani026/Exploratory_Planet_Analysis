"use client"

import type React from "react"

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
import { Textarea } from "@/components/ui/textarea"
import { Upload, FileUp, Database, AlertCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface ExoplanetData {
    [key: string]: string | number | boolean | null
    pl_name: string
}

interface ImportDataDialogProps {
    onImportSuccess: (data: ExoplanetData) => void
}

export function ImportDataDialog({ onImportSuccess }: ImportDataDialogProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [jsonData, setJsonData] = useState("")
    const [file, setFile] = useState<File | null>(null)
    const [error, setError] = useState<string | null>(null)
    const { toast } = useToast()
    const [activeTab, setActiveTab] = useState("file");

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setFile(e.target.files[0])
            setError(null)
        }
    }

    const handleJsonChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setJsonData(e.target.value)
        setError(null)
    }

    const handleImportFromFile = async () => {
        if (!file) {
            setError("Please select a file to import")
            return
        }

        setIsLoading(true)
        setError(null)

        try {
            const reader = new FileReader()

            reader.onload = (event) => {
                try {
                    const result = event.target?.result
                    if (typeof result === "string") {
                        const data = JSON.parse(result)
                        onImportSuccess(data)
                        setIsOpen(false)
                        toast({
                            title: "Data imported successfully",
                            description: "The exoplanet data has been imported successfully.",
                        })
                    }
                } catch (err) {
                    console.error("Error parsing JSON:", err);
                    setError("Invalid JSON file. Please check the file format.")
                } finally {
                    setIsLoading(false)
                }
            }

            reader.onerror = () => {
                setError("Error reading file")
                setIsLoading(false)
            }

            reader.readAsText(file)
        } catch (err) {
            console.error("Error parsing:", err);
            setError("Error processing file")
            setIsLoading(false)
        }
    }

    const handleImportFromJson = () => {
        if (!jsonData.trim()) {
            setError("Please enter JSON data")
            return
        }

        setIsLoading(true)
        setError(null)

        try {
            const data = JSON.parse(jsonData)
            onImportSuccess(data)
            setIsOpen(false)
            toast({
                title: "Data imported successfully",
                description: "The exoplanet data has been imported successfully.",
            })
        } catch (err) {
            console.error("Error in JSON:", err);
            setError("Invalid JSON data. Please check the format.")
        } finally {
            setIsLoading(false)
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
                    <Database className="mr-2 h-4 w-4" />
                    Import Data
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-black/80 border-white/10 text-white backdrop-blur-sm">
                <DialogHeader>
                    <DialogTitle className="font-display">Import Exoplanet Data</DialogTitle>
                    <DialogDescription className="text-white/60 font-body">
                        Import exoplanet data from a file or paste JSON directly.
                    </DialogDescription>
                </DialogHeader>

                <Tabs defaultValue="file" className="w-full" onValueChange={setActiveTab}>
                    <TabsList className="grid w-full grid-cols-2 bg-white/5 border border-white/10">
                        <TabsTrigger
                            value="file"
                            className="data-[state=active]:bg-white/10 data-[state=active]:text-white text-white/70"
                        >
                            <FileUp className="mr-2 h-4 w-4" />
                            From File
                        </TabsTrigger>
                        <TabsTrigger
                            value="json"
                            className="data-[state=active]:bg-white/10 data-[state=active]:text-white text-white/70"
                        >
                            <Database className="mr-2 h-4 w-4" />
                            JSON Input
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="file" className="mt-4">
                        <div className="space-y-4">
                            <div className="grid w-full items-center gap-1.5">
                                <Label htmlFor="file" className="text-white font-body">
                                    Upload JSON File
                                </Label>
                                <div className="flex items-center gap-2">
                                    <Input
                                        id="file"
                                        type="file"
                                        accept=".json"
                                        onChange={handleFileChange}
                                        className="bg-white/5 border-white/10 text-white font-body"
                                    />
                                </div>
                            </div>

                            {file && (
                                <div className="text-sm text-white/70 font-body">
                                    Selected file: {file.name} ({(file.size / 1024).toFixed(2)} KB)
                                </div>
                            )}
                        </div>
                    </TabsContent>

                    <TabsContent value="json" className="mt-4">
                        <div className="space-y-4">
                            <div className="grid w-full gap-1.5">
                                <Label htmlFor="json" className="text-white font-body">
                                    Paste JSON Data
                                </Label>
                                <Textarea
                                    id="json"
                                    placeholder="Paste your JSON data here..."
                                    value={jsonData}
                                    onChange={handleJsonChange}
                                    className="min-h-[200px] bg-white/5 border-white/10 text-white font-body"
                                />
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>

                {error && (
                    <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-3 text-white/80 flex items-start gap-2">
                        <AlertCircle className="h-5 w-5 text-red-400 mt-0.5 flex-shrink-0" />
                        <p className="text-sm font-body">{error}</p>
                    </div>
                )}

                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => setIsOpen(false)}
                        className="border-white/10 bg-white/5 text-white hover:bg-white/10 font-body"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={activeTab === "file" ? handleImportFromFile : handleImportFromJson}
                        disabled={isLoading}
                        className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-body"
                    >
                        {isLoading ? (
                            <>
                                <div className="animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full" />
                                Importing...
                            </>
                        ) : (
                            <>
                                <Upload className="mr-2 h-4 w-4" />
                                Import
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

