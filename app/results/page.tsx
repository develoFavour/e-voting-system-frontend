"use client"

import { motion } from "framer-motion"
import { GlassCard } from "@/components/ui/glass-card"
import { StatusBadge } from "@/components/ui/status-badge"
import { ArrowLeft, Trophy, TrendingUp } from "lucide-react"
import Link from "next/link"

// Mock results data
const results = [
    {
        position: "President",
        candidates: [
            { name: "John Doe", party: "Progressive Students Alliance", votes: 456, percentage: 62 },
            { name: "Jane Smith", party: "Unity Party", votes: 280, percentage: 38 },
        ],
    },
    {
        position: "Vice President",
        candidates: [
            { name: "Mike Johnson", party: "Progressive Students Alliance", votes: 520, percentage: 71 },
            { name: "Sarah Lee", party: "Unity Party", votes: 216, percentage: 29 },
        ],
    },
    {
        position: "General Secretary",
        candidates: [
            { name: "Sarah Williams", party: "Unity Party", votes: 410, percentage: 56 },
            { name: "Tom Brown", party: "Progressive Students Alliance", votes: 326, percentage: 44 },
        ],
    },
]

const stats = {
    totalVotes: 736,
    totalEligible: 987,
    turnout: 75,
}

export default function ResultsPage() {
    return (
        <main className="min-h-screen dark mesh-background py-8 px-4">
            <div className="container mx-auto max-w-6xl">
                {/* Header */}
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
                    <Link href="/dashboard" className="inline-flex items-center text-[#0ea5e9] hover:underline mb-4">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Dashboard
                    </Link>
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-4xl font-bold mb-2">Election Results</h1>
                            <p className="text-[#a3a3a3]">Real-time vote counting and statistics</p>
                        </div>
                        <StatusBadge status="live" pulse />
                    </div>
                </motion.div>

                {/* Stats Overview */}
                <div className="grid md:grid-cols-3 gap-6 mb-8">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                        <GlassCard depth="medium" className="p-6">
                            <div className="flex items-center gap-3 mb-2">
                                <TrendingUp className="w-5 h-5 text-[#0ea5e9]" />
                                <p className="text-sm text-[#a3a3a3]">Total Votes Cast</p>
                            </div>
                            <p className="text-3xl font-bold">{stats.totalVotes.toLocaleString()}</p>
                        </GlassCard>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                        <GlassCard depth="medium" className="p-6">
                            <div className="flex items-center gap-3 mb-2">
                                <TrendingUp className="w-5 h-5 text-[#10b981]" />
                                <p className="text-sm text-[#a3a3a3]">Eligible Voters</p>
                            </div>
                            <p className="text-3xl font-bold">{stats.totalEligible.toLocaleString()}</p>
                        </GlassCard>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                        <GlassCard depth="medium" className="p-6">
                            <div className="flex items-center gap-3 mb-2">
                                <TrendingUp className="w-5 h-5 text-[#f59e0b]" />
                                <p className="text-sm text-[#a3a3a3]">Voter Turnout</p>
                            </div>
                            <p className="text-3xl font-bold">{stats.turnout}%</p>
                        </GlassCard>
                    </motion.div>
                </div>

                {/* Results by Position */}
                <div className="space-y-6">
                    {results.map((position, index) => (
                        <motion.div
                            key={position.position}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 + index * 0.1 }}
                        >
                            <GlassCard depth="deep" className="p-6">
                                <h2 className="text-2xl font-bold mb-6">{position.position}</h2>

                                <div className="space-y-4">
                                    {position.candidates.map((candidate, candidateIndex) => (
                                        <div key={candidate.name} className="relative">
                                            {/* Winner Badge */}
                                            {candidateIndex === 0 && (
                                                <div className="absolute -top-2 -right-2 bg-[#10b981] text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                                                    <Trophy className="w-3 h-3" />
                                                    Leading
                                                </div>
                                            )}

                                            <div className="p-4 bg-[#1c1c1c] rounded-lg">
                                                <div className="flex items-center justify-between mb-3">
                                                    <div>
                                                        <p className="font-bold text-lg">{candidate.name}</p>
                                                        <p className="text-sm text-[#a3a3a3]">{candidate.party}</p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-2xl font-bold text-[#0ea5e9]">{candidate.votes}</p>
                                                        <p className="text-sm text-[#a3a3a3]">votes</p>
                                                    </div>
                                                </div>

                                                {/* Progress Bar */}
                                                <div className="relative h-3 bg-[#0f0f0f] rounded-full overflow-hidden">
                                                    <motion.div
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${candidate.percentage}%` }}
                                                        transition={{ duration: 1, delay: 0.5 + index * 0.1 + candidateIndex * 0.2 }}
                                                        className={`absolute inset-y-0 left-0 rounded-full ${candidateIndex === 0 ? "bg-[#10b981]" : "bg-[#0ea5e9]"
                                                            }`}
                                                    />
                                                </div>

                                                <p className="text-right text-sm text-[#a3a3a3] mt-2">{candidate.percentage}%</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </GlassCard>
                        </motion.div>
                    ))}
                </div>

                {/* Live Update Indicator */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                    className="mt-8 text-center"
                >
                    <p className="text-sm text-[#a3a3a3] flex items-center justify-center gap-2">
                        <motion.span
                            className="w-2 h-2 bg-[#10b981] rounded-full"
                            animate={{ opacity: [1, 0.3, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        />
                        Results update in real-time
                    </p>
                </motion.div>
            </div>
        </main>
    )
}
