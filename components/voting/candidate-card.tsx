"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import { Check, FileText } from "lucide-react"
import { cn } from "@/lib/utils"

interface CandidateCardProps {
    id: string
    name: string
    party: string
    image: string
    manifesto: string
    selected: boolean
    onSelect: (id: string) => void
    onViewManifesto: (name: string, manifesto: string) => void
}

export function CandidateCard({
    id,
    name,
    party,
    image,
    manifesto,
    selected,
    onSelect,
    onViewManifesto,
}: CandidateCardProps) {
    const [isHovered, setIsHovered] = useState(false)

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ y: -4 }}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
        >
            <GlassCard
                depth="medium"
                className={cn(
                    "p-6 cursor-pointer transition-all",
                    selected ? "border-2 border-[#10b981] shadow-[0_0_20px_rgba(16,185,129,0.3)]" : "border border-[#404040]",
                )}
                onClick={() => onSelect(id)}
            >
                {/* Candidate Image */}
                <div className="relative mb-4">
                    <img src={image || "/placeholder.svg"} alt={name} className="w-full aspect-square object-cover rounded-lg" />
                    {selected && (
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute top-2 right-2 w-10 h-10 bg-[#10b981] rounded-full flex items-center justify-center"
                        >
                            <Check className="w-6 h-6 text-white" />
                        </motion.div>
                    )}
                </div>

                {/* Candidate Info */}
                <h3 className="text-xl font-bold mb-1">{name}</h3>
                <p className="text-[#a3a3a3] text-sm mb-4">{party}</p>

                {/* Actions */}
                <div className="flex gap-2">
                    <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 border-[#404040] hover:bg-[#1c1c1c] bg-transparent"
                        onClick={(e) => {
                            e.stopPropagation()
                            onViewManifesto(name, manifesto)
                        }}
                    >
                        <FileText className="w-4 h-4 mr-2" />
                        Manifesto
                    </Button>

                    <Button
                        size="sm"
                        className={cn(
                            "flex-1",
                            selected ? "bg-[#10b981] hover:bg-[#10b981]/90" : "bg-[#0ea5e9] hover:bg-[#0ea5e9]/90",
                        )}
                    >
                        {selected ? "Selected" : "Select"}
                    </Button>
                </div>
            </GlassCard>
        </motion.div>
    )
}
