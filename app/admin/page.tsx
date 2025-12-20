"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import { StatusBadge } from "@/components/ui/status-badge"
import { AccreditationQueueCard } from "@/components/admin/accreditation-queue-card"
import {
    Users,
    UserCheck,
    Vote,
    BarChart3,
    Play,
    Pause,
    StopCircle,
    Menu,
    X,
} from "lucide-react"
import { toast } from "sonner"

// Mock data
const mockRequests = [
    {
        id: "1",
        name: "John Doe",
        matricNumber: "HU/2024/001",
        department: "Computer Science",
        idCardUrl: "/placeholder.svg",
        submittedAt: new Date().toISOString(),
    },
    {
        id: "2",
        name: "Jane Smith",
        matricNumber: "HU/2024/002",
        department: "Electrical Engineering",
        idCardUrl: "/placeholder.svg",
        submittedAt: new Date().toISOString(),
    },
]

const stats = [
    { label: "Total Registered", value: "1,234", icon: Users, color: "#0ea5e9" },
    { label: "Approved Voters", value: "987", icon: UserCheck, color: "#10b981" },
    { label: "Votes Cast", value: "456", icon: Vote, color: "#f59e0b" },
    { label: "Pending Requests", value: "23", icon: BarChart3, color: "#ef4444" },
]

export default function AdminPage() {
    const [activeTab, setActiveTab] = useState("overview")
    const [electionStatus, setElectionStatus] = useState<"pending" | "live" | "closed">("pending")
    const [sidebarOpen, setSidebarOpen] = useState(false)

    const handleApprove = (id: string) => {
        toast.success("Voter approved successfully")
        console.log("Approved:", id)
    }

    const handleReject = (id: string) => {
        toast.error("Voter rejected")
        console.log("Rejected:", id)
    }

    const handleElectionControl = (action: "start" | "pause" | "end") => {
        if (action === "start") {
            setElectionStatus("live")
            toast.success("Election started!")
        } else if (action === "pause") {
            setElectionStatus("pending")
            toast.info("Election paused")
        } else {
            setElectionStatus("closed")
            toast.success("Election ended")
        }
    }

    return (
        <main className="min-h-screen dark mesh-background">
            <div className="flex">
                {/* Sidebar */}
                <motion.aside
                    initial={{ x: -300 }}
                    animate={{ x: sidebarOpen ? 0 : -300 }}
                    className="fixed lg:static inset-y-0 left-0 z-50 w-64 lg:translate-x-0"
                >
                    <GlassCard depth="deep" className="h-full rounded-none lg:rounded-r-lg p-6">
                        {/* Logo */}
                        <div className="mb-8 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-[#0ea5e9] rounded-lg flex items-center justify-center">
                                    <Vote className="w-6 h-6" />
                                </div>
                                <div>
                                    <h2 className="font-bold">eVote</h2>
                                    <p className="text-xs text-[#a3a3a3]">Admin Panel</p>
                                </div>
                            </div>
                            <button onClick={() => setSidebarOpen(false)} className="lg:hidden">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Navigation */}
                        <nav className="space-y-2">
                            {[
                                { id: "overview", label: "Overview", icon: BarChart3 },
                                { id: "accreditation", label: "Accreditation Queue", icon: UserCheck },
                                { id: "candidates", label: "Manage Candidates", icon: Users },
                                { id: "results", label: "Results", icon: Vote },
                            ].map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => {
                                        setActiveTab(item.id)
                                        setSidebarOpen(false)
                                    }}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${activeTab === item.id ? "bg-[#0ea5e9] text-white" : "hover:bg-[#1c1c1c] text-[#a3a3a3]"
                                        }`}
                                >
                                    <item.icon className="w-5 h-5" />
                                    <span className="font-medium">{item.label}</span>
                                </button>
                            ))}
                        </nav>
                    </GlassCard>
                </motion.aside>

                {/* Main Content */}
                <div className="flex-1 p-4 lg:p-8">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-4">
                            <button onClick={() => setSidebarOpen(true)} className="lg:hidden">
                                <Menu className="w-6 h-6" />
                            </button>
                            <div>
                                <h1 className="text-3xl font-bold">Admin Dashboard</h1>
                                <p className="text-[#a3a3a3]">Manage elections and voter accreditation</p>
                            </div>
                        </div>
                        <StatusBadge status={electionStatus} pulse={electionStatus === "live"} />
                    </div>

                    {/* Overview Tab */}
                    {activeTab === "overview" && (
                        <div className="space-y-6">
                            {/* Stats Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {stats.map((stat, index) => (
                                    <motion.div
                                        key={stat.label}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                    >
                                        <GlassCard depth="medium" className="p-6 magnetic-hover">
                                            <div className="flex items-center justify-between mb-4">
                                                <div
                                                    className="w-12 h-12 rounded-lg flex items-center justify-center"
                                                    style={{ backgroundColor: `${stat.color}20` }}
                                                >
                                                    <stat.icon className="w-6 h-6" style={{ color: stat.color }} />
                                                </div>
                                            </div>
                                            <p className="text-3xl font-bold mb-1">{stat.value}</p>
                                            <p className="text-sm text-[#a3a3a3]">{stat.label}</p>
                                        </GlassCard>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Election Controls */}
                            <GlassCard depth="deep" className="p-6">
                                <h3 className="text-xl font-bold mb-4">Election Controls</h3>
                                <div className="flex flex-wrap gap-3">
                                    <Button
                                        onClick={() => handleElectionControl("start")}
                                        disabled={electionStatus === "live"}
                                        className="bg-[#10b981] hover:bg-[#10b981]/90 disabled:opacity-50 magnetic-hover"
                                    >
                                        <Play className="w-4 h-4 mr-2" />
                                        Start Election
                                    </Button>
                                    <Button
                                        onClick={() => handleElectionControl("pause")}
                                        disabled={electionStatus !== "live"}
                                        variant="outline"
                                        className="border-[#f59e0b] text-[#f59e0b] hover:bg-[#f59e0b]/10 disabled:opacity-50 bg-transparent"
                                    >
                                        <Pause className="w-4 h-4 mr-2" />
                                        Pause Election
                                    </Button>
                                    <Button
                                        onClick={() => handleElectionControl("end")}
                                        disabled={electionStatus === "closed"}
                                        variant="outline"
                                        className="border-[#ef4444] text-[#ef4444] hover:bg-[#ef4444]/10 disabled:opacity-50 bg-transparent"
                                    >
                                        <StopCircle className="w-4 h-4 mr-2" />
                                        End Election
                                    </Button>
                                </div>
                            </GlassCard>
                        </div>
                    )}

                    {/* Accreditation Queue Tab */}
                    {activeTab === "accreditation" && (
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <h2 className="text-2xl font-bold">Pending Accreditation Requests</h2>
                                <span className="text-[#a3a3a3]">{mockRequests.length} pending</span>
                            </div>

                            <div className="space-y-4">
                                {mockRequests.map((request, index) => (
                                    <motion.div
                                        key={request.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                    >
                                        <AccreditationQueueCard request={request} onApprove={handleApprove} onReject={handleReject} />
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Other tabs placeholder */}
                    {activeTab === "candidates" && (
                        <GlassCard depth="medium" className="p-8 text-center">
                            <Users className="w-16 h-16 mx-auto mb-4 text-[#a3a3a3]" />
                            <h3 className="text-xl font-bold mb-2">Candidate Management</h3>
                            <p className="text-[#a3a3a3]">This feature will allow you to add and manage election candidates</p>
                        </GlassCard>
                    )}

                    {activeTab === "results" && (
                        <GlassCard depth="medium" className="p-8 text-center">
                            <BarChart3 className="w-16 h-16 mx-auto mb-4 text-[#a3a3a3]" />
                            <h3 className="text-xl font-bold mb-2">Election Results</h3>
                            <p className="text-[#a3a3a3]">Real-time results and analytics will be displayed here</p>
                        </GlassCard>
                    )}
                </div>
            </div>
        </main>
    )
}
