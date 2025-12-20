"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import { StatusBadge } from "@/components/ui/status-badge"
import { ArrowLeft, Vote, Lock, User } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

export default function LoginPage() {
    const router = useRouter()
    const [formData, setFormData] = useState({
        matricNumber: "",
        password: "",
    })
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        // TODO: API call to authenticate
        setTimeout(() => {
            toast.success("Login successful!")
            router.push("/dashboard")
        }, 1500)
    }

    return (
        <main className="min-h-screen dark mesh-background flex items-center justify-center p-4">
            {/* Animated Background Elements */}
            <motion.div
                className="absolute top-20 right-20 w-96 h-96 border border-[#0ea5e9]/10 rounded-lg"
                animate={{ rotate: 360 }}
                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            />
            <motion.div
                className="absolute bottom-20 left-20 w-64 h-64 border border-[#10b981]/10 rounded-lg"
                animate={{ rotate: -360 }}
                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            />

            <div className="container mx-auto max-w-md z-10">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    {/* Logo/Header */}
                    <div className="text-center mb-8">
                        <Link href="/" className="inline-flex items-center text-[#0ea5e9] hover:underline mb-6">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Home
                        </Link>

                        <div className="flex justify-center mb-6">
                            <div className="w-20 h-20 bg-[#0ea5e9] rounded-2xl flex items-center justify-center animate-float">
                                <Vote className="w-12 h-12" />
                            </div>
                        </div>

                        <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
                        <p className="text-[#a3a3a3]">Sign in to access your voter dashboard</p>

                        <div className="flex justify-center mt-4">
                            <StatusBadge status="live" pulse />
                        </div>
                    </div>

                    {/* Login Form */}
                    <GlassCard depth="deep" className="p-8">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium mb-2">Matriculation Number</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#a3a3a3]" />
                                    <input
                                        type="text"
                                        required
                                        value={formData.matricNumber}
                                        onChange={(e) => setFormData({ ...formData, matricNumber: e.target.value })}
                                        className="w-full pl-12 pr-4 py-3 bg-[#1c1c1c] border border-[#404040] rounded-lg focus:border-[#0ea5e9] focus:outline-none transition-colors"
                                        placeholder="e.g., HU/2024/001"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#a3a3a3]" />
                                    <input
                                        type="password"
                                        required
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        className="w-full pl-12 pr-4 py-3 bg-[#1c1c1c] border border-[#404040] rounded-lg focus:border-[#0ea5e9] focus:outline-none transition-colors"
                                        placeholder="Enter your password"
                                    />
                                </div>
                            </div>

                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-[#0ea5e9] hover:bg-[#0ea5e9]/90 py-6 text-lg magnetic-hover disabled:opacity-50"
                            >
                                {isLoading ? "Signing in..." : "Sign In"}
                            </Button>
                        </form>

                        <div className="mt-6 pt-6 border-t border-[#404040]">
                            <p className="text-center text-sm text-[#a3a3a3]">
                                Don't have an account?{" "}
                                <Link href="/accredit" className="text-[#0ea5e9] hover:underline font-medium">
                                    Get Accredited
                                </Link>
                            </p>
                        </div>

                        {/* Warning for pending users */}
                        <div className="mt-4 p-4 bg-[#f59e0b]/10 border border-[#f59e0b]/30 rounded-lg">
                            <p className="text-sm text-[#f59e0b] text-center">
                                ⚠️ If your accreditation is still pending, you won't be able to access the voting booth
                            </p>
                        </div>
                    </GlassCard>
                </motion.div>
            </div>
        </main>
    )
}
