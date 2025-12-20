"use client"

import { motion } from "framer-motion"
import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import { StatusBadge } from "@/components/ui/status-badge"
import { CountdownTimer } from "@/components/voting/countdown-timer"
import { Vote, CheckCircle2, User, LogOut, BarChart3 } from "lucide-react"
import Link from "next/link"

// Mock user data
const user = {
    name: "John Doe",
    matricNumber: "HU/2024/001",
    department: "Computer Science",
    status: "approved" as const,
    hasVoted: false,
}

export default function DashboardPage() {
    const endTime = new Date(Date.now() + 3 * 60 * 60 * 1000) // 3 hours from now

    return (
        <main className="min-h-screen dark mesh-background py-8 px-4">
            <div className="container mx-auto max-w-6xl">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-between mb-8"
                >
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-[#0ea5e9] rounded-lg flex items-center justify-center">
                            <Vote className="w-7 h-7" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold">Voter Dashboard</h1>
                            <p className="text-[#a3a3a3]">Welcome back, {user.name}</p>
                        </div>
                    </div>
                    <Button variant="outline" className="border-[#404040] hover:bg-[#1c1c1c] bg-transparent">
                        <LogOut className="w-4 h-4 mr-2" />
                        Logout
                    </Button>
                </motion.div>

                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Profile Card */}
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-1">
                        <GlassCard depth="deep" className="p-6">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-16 h-16 bg-[#0ea5e9]/20 rounded-full flex items-center justify-center">
                                    <User className="w-8 h-8 text-[#0ea5e9]" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg">{user.name}</h3>
                                    <StatusBadge status={user.status} />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div>
                                    <label className="text-xs text-[#a3a3a3] uppercase tracking-wider">Matric Number</label>
                                    <p className="font-mono text-[#0ea5e9]">{user.matricNumber}</p>
                                </div>

                                <div>
                                    <label className="text-xs text-[#a3a3a3] uppercase tracking-wider">Department</label>
                                    <p>{user.department}</p>
                                </div>

                                <div>
                                    <label className="text-xs text-[#a3a3a3] uppercase tracking-wider">Voting Status</label>
                                    <p className="flex items-center gap-2">
                                        {user.hasVoted ? (
                                            <>
                                                <CheckCircle2 className="w-4 h-4 text-[#10b981]" />
                                                <span className="text-[#10b981]">Vote Cast</span>
                                            </>
                                        ) : (
                                            <span className="text-[#f59e0b]">Not Voted</span>
                                        )}
                                    </p>
                                </div>
                            </div>
                        </GlassCard>
                    </motion.div>

                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Countdown */}
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                            <CountdownTimer endTime={endTime} />
                        </motion.div>

                        {/* Voting Card */}
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                            <GlassCard depth="deep" className="p-8 relative overflow-hidden">
                                {/* Decorative elements */}
                                <div className="absolute top-0 right-0 w-64 h-64 bg-[#0ea5e9]/10 rounded-full blur-3xl -z-10" />

                                <div className="flex items-start justify-between mb-6">
                                    <div>
                                        <h2 className="text-2xl font-bold mb-2">Student Union Government Election</h2>
                                        <p className="text-[#a3a3a3]">Cast your vote for the next student leaders</p>
                                    </div>
                                    <StatusBadge status="live" pulse />
                                </div>

                                <div className="grid md:grid-cols-2 gap-4 mb-6">
                                    <div className="p-4 bg-[#1c1c1c] rounded-lg">
                                        <p className="text-sm text-[#a3a3a3] mb-1">Total Positions</p>
                                        <p className="text-2xl font-bold">4</p>
                                    </div>
                                    <div className="p-4 bg-[#1c1c1c] rounded-lg">
                                        <p className="text-sm text-[#a3a3a3] mb-1">Total Candidates</p>
                                        <p className="text-2xl font-bold">12</p>
                                    </div>
                                </div>

                                {!user.hasVoted ? (
                                    <Link href="/vote">
                                        <Button className="w-full bg-[#0ea5e9] hover:bg-[#0ea5e9]/90 py-6 text-lg magnetic-hover group">
                                            Enter Voting Booth
                                            <Vote className="w-5 h-5 ml-2 group-hover:rotate-12 transition-transform" />
                                        </Button>
                                    </Link>
                                ) : (
                                    <div className="text-center py-6">
                                        <CheckCircle2 className="w-16 h-16 mx-auto mb-4 text-[#10b981]" />
                                        <p className="text-lg font-semibold text-[#10b981]">You have successfully cast your vote!</p>
                                        <p className="text-sm text-[#a3a3a3] mt-2">Thank you for participating in the election</p>
                                    </div>
                                )}
                            </GlassCard>
                        </motion.div>

                        {/* Results Link */}
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                            <Link href="/results">
                                <GlassCard depth="medium" className="p-6 magnetic-hover cursor-pointer group">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-[#10b981]/20 rounded-lg flex items-center justify-center">
                                                <BarChart3 className="w-6 h-6 text-[#10b981]" />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-lg">View Live Results</h3>
                                                <p className="text-sm text-[#a3a3a3]">See real-time election statistics</p>
                                            </div>
                                        </div>
                                        <motion.div
                                            className="text-[#0ea5e9]"
                                            animate={{ x: [0, 5, 0] }}
                                            transition={{ duration: 1.5, repeat: Infinity }}
                                        >
                                            →
                                        </motion.div>
                                    </div>
                                </GlassCard>
                            </Link>
                        </motion.div>
                    </div>
                </div>
            </div>
        </main>
    )
}
