"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import { CandidateCard } from "@/components/voting/candidate-card"
import { CountdownTimer } from "@/components/voting/countdown-timer"
import { ArrowLeft, CheckCircle2, Info } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

// Mock data
const positions = [
    { id: "president", name: "President" },
    { id: "vice-president", name: "Vice President" },
    { id: "gen-sec", name: "General Secretary" },
    { id: "treasurer", name: "Treasurer" },
]

const mockCandidates = {
    president: [
        {
            id: "p1",
            name: "John Doe",
            party: "Progressive Students Alliance",
            image: "/placeholder.svg",
            manifesto: "I will improve student welfare and infrastructure...",
        },
        {
            id: "p2",
            name: "Jane Smith",
            party: "Unity Party",
            image: "/placeholder.svg",
            manifesto: "Together we can build a better future...",
        },
    ],
    "vice-president": [
        {
            id: "vp1",
            name: "Mike Johnson",
            party: "Progressive Students Alliance",
            image: "/placeholder.svg",
            manifesto: "Supporting our president's vision...",
        },
    ],
    "gen-sec": [
        {
            id: "gs1",
            name: "Sarah Williams",
            party: "Unity Party",
            image: "/placeholder.svg",
            manifesto: "Transparent administration is key...",
        },
    ],
    treasurer: [
        {
            id: "t1",
            name: "David Brown",
            party: "Progressive Students Alliance",
            image: "/placeholder.svg",
            manifesto: "Fiscal responsibility matters...",
        },
    ],
}

export default function VotePage() {
    const [activePosition, setActivePosition] = useState("president")
    const [selections, setSelections] = useState<Record<string, string>>({})
    const [showManifesto, setShowManifesto] = useState<{ name: string; content: string } | null>(null)
    const [showReview, setShowReview] = useState(false)

    const handleSelect = (positionId: string, candidateId: string) => {
        setSelections({ ...selections, [positionId]: candidateId })
        toast.success("Selection updated")
    }

    const handleSubmit = () => {
        // TODO: API call to submit vote
        console.log("Submitting votes:", selections)
        toast.success("Vote cast successfully!")
    }

    const endTime = new Date(Date.now() + 3 * 60 * 60 * 1000) // 3 hours from now

    return (
        <main className="min-h-screen dark mesh-background py-8 px-4">
            <div className="container mx-auto max-w-7xl">
                {/* Header */}
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
                    <Link href="/dashboard" className="inline-flex items-center text-[#0ea5e9] hover:underline mb-4">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Dashboard
                    </Link>
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                            <h1 className="text-4xl font-bold mb-2">Voting Booth</h1>
                            <p className="text-[#a3a3a3]">Select your preferred candidates for each position</p>
                        </div>
                        <div className="md:w-80">
                            <CountdownTimer endTime={endTime} />
                        </div>
                    </div>
                </motion.div>

                <div className="grid lg:grid-cols-4 gap-6">
                    {/* Position Tabs */}
                    <div className="lg:col-span-1">
                        <GlassCard depth="medium" className="p-4 sticky top-4">
                            <h3 className="font-semibold mb-4 text-sm uppercase tracking-wider text-[#a3a3a3]">Positions</h3>
                            <div className="space-y-2">
                                {positions.map((position) => (
                                    <button
                                        key={position.id}
                                        onClick={() => setActivePosition(position.id)}
                                        className={`w-full text-left px-4 py-3 rounded-lg transition-all ${activePosition === position.id
                                                ? "bg-[#0ea5e9] text-white"
                                                : "hover:bg-[#1c1c1c] text-[#a3a3a3]"
                                            }`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <span className="font-medium">{position.name}</span>
                                            {selections[position.id] && <CheckCircle2 className="w-4 h-4 text-[#10b981]" />}
                                        </div>
                                    </button>
                                ))}
                            </div>

                            <Button
                                onClick={() => setShowReview(true)}
                                className="w-full mt-6 bg-[#10b981] hover:bg-[#10b981]/90 magnetic-hover"
                            >
                                Review & Submit
                            </Button>
                        </GlassCard>
                    </div>

                    {/* Candidates Grid */}
                    <div className="lg:col-span-3">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activePosition}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="grid md:grid-cols-2 gap-6"
                            >
                                {mockCandidates[activePosition as keyof typeof mockCandidates]?.map((candidate) => (
                                    <CandidateCard
                                        key={candidate.id}
                                        {...candidate}
                                        selected={selections[activePosition] === candidate.id}
                                        onSelect={(id) => handleSelect(activePosition, id)}
                                        onViewManifesto={(name, manifesto) => setShowManifesto({ name, content: manifesto })}
                                    />
                                ))}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>

                {/* Manifesto Modal */}
                <AnimatePresence>
                    {showManifesto && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                            onClick={() => setShowManifesto(null)}
                        >
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.9, opacity: 0 }}
                                onClick={(e) => e.stopPropagation()}
                                className="max-w-2xl w-full"
                            >
                                <GlassCard depth="deep" className="p-8">
                                    <h2 className="text-2xl font-bold mb-4">{showManifesto.name}'s Manifesto</h2>
                                    <p className="text-[#a3a3a3] mb-6">{showManifesto.content}</p>
                                    <Button onClick={() => setShowManifesto(null)} className="w-full bg-[#0ea5e9] hover:bg-[#0ea5e9]/90">
                                        Close
                                    </Button>
                                </GlassCard>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Review Modal */}
                <AnimatePresence>
                    {showReview && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                            onClick={() => setShowReview(false)}
                        >
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.9, opacity: 0 }}
                                onClick={(e) => e.stopPropagation()}
                                className="max-w-2xl w-full"
                            >
                                <GlassCard depth="deep" className="p-8">
                                    <h2 className="text-2xl font-bold mb-6">Review Your Selections</h2>

                                    <div className="space-y-4 mb-6">
                                        {positions.map((position) => (
                                            <div key={position.id} className="flex justify-between items-center p-4 bg-[#1c1c1c] rounded-lg">
                                                <span className="font-medium">{position.name}</span>
                                                <span className="text-[#0ea5e9]">
                                                    {selections[position.id]
                                                        ? mockCandidates[position.id as keyof typeof mockCandidates]?.find(
                                                            (c) => c.id === selections[position.id],
                                                        )?.name
                                                        : "Not selected"}
                                                </span>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="flex gap-3">
                                        <Button
                                            onClick={() => setShowReview(false)}
                                            variant="outline"
                                            className="flex-1 border-[#404040] hover:bg-[#1c1c1c] bg-transparent"
                                        >
                                            Go Back
                                        </Button>
                                        <Button onClick={handleSubmit} className="flex-1 bg-[#10b981] hover:bg-[#10b981]/90 magnetic-hover">
                                            Cast Vote
                                        </Button>
                                    </div>
                                </GlassCard>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </main>
    )
}
