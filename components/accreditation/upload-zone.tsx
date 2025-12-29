"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { motion } from "framer-motion"
import { Upload, X, CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface UploadZoneProps {
    onFileSelect: (file: File | null) => void
}

export function UploadZone({ onFileSelect }: UploadZoneProps) {
    const [file, setFile] = useState<File | null>(null)
    const [isDragging, setIsDragging] = useState(false)

    const handleDrag = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        if (e.type === "dragenter" || e.type === "dragover") {
            setIsDragging(true)
        } else if (e.type === "dragleave") {
            setIsDragging(false)
        }
    }, [])

    const handleDrop = useCallback(
        (e: React.DragEvent) => {
            e.preventDefault()
            e.stopPropagation()
            setIsDragging(false)

            const droppedFile = e.dataTransfer.files?.[0]
            if (droppedFile && droppedFile.type.startsWith("image/")) {
                setFile(droppedFile)
                onFileSelect(droppedFile)
            }
        },
        [onFileSelect],
    )

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0]
        if (selectedFile) {
            setFile(selectedFile)
            onFileSelect(selectedFile)
        }
    }

    const removeFile = () => {
        setFile(null)
        onFileSelect(null)
    }

    return (
        <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={cn(
                "relative border-2 border-dashed rounded-lg p-8 transition-all",
                isDragging ? "border-[#0ea5e9] bg-[#0ea5e9]/10" : "border-black/10 dark:border-white/10",
                file ? "border-[#10b981]" : "",
            )}
        >
            {!file ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
                    <Upload
                        className={cn("w-12 h-12 mx-auto mb-4 transition-colors", isDragging ? "text-[#0ea5e9]" : "text-muted-foreground")}
                    />
                    <p className="text-lg font-semibold mb-2 text-foreground">Upload Student ID Card</p>
                    <p className="text-sm text-muted-foreground mb-4">Drag and drop or click to browse</p>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileInput}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                </motion.div>
            ) : (
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-center justify-between"
                >
                    <div className="flex items-center gap-3">
                        <CheckCircle2 className="w-6 h-6 text-[#10b981]" />
                        <div>
                            <p className="font-semibold">{file.name}</p>
                            <p className="text-sm text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                        </div>
                    </div>
                    <button onClick={removeFile} className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-lg transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </motion.div>
            )}
        </div>
    )
}
