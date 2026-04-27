"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowLeft, KeyRound, User } from "lucide-react"
import { toast } from "sonner"

import { authAPI } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { GlassCard } from "@/components/ui/glass-card"

export default function ForgotPasswordPage() {
    const [matricNumber, setMatricNumber] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [isSubmitted, setIsSubmitted] = useState(false)

    const getErrorMessage = (error: unknown) =>
        error instanceof Error ? error.message : "We couldn't process your request"

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            const response = await authAPI.forgotPassword(matricNumber)
            toast.success(response.message || "If eligible, a reset link has been sent.")
            setIsSubmitted(true)
        } catch (error: unknown) {
            toast.error(getErrorMessage(error))
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <main className="min-h-screen mesh-background flex items-center justify-center p-4">
            <div className="container mx-auto max-w-md z-10">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <div className="text-center mb-8">
                        <Link href="/login" className="inline-flex items-center text-[#0ea5e9] hover:underline mb-6">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Login
                        </Link>

                        <h1 className="text-3xl font-bold mb-2 text-foreground">Forgot Password</h1>
                        <p className="text-muted-foreground">
                            Enter your matric number and we&apos;ll send a reset link to your registered email.
                        </p>
                    </div>

                    <GlassCard depth="deep" className="p-8">
                        {isSubmitted ? (
                            <div className="space-y-4 text-center">
                                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#0ea5e9]/15">
                                    <KeyRound className="h-7 w-7 text-[#0ea5e9]" />
                                </div>
                                <h2 className="text-xl font-semibold text-foreground">Check your email</h2>
                                <p className="text-sm text-muted-foreground">
                                    If your accredited voter account is eligible and has a registered email address, a reset link is on its way.
                                </p>
                                <Link href="/login" className="inline-flex text-sm font-medium text-[#0ea5e9] hover:underline">
                                    Return to login
                                </Link>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium mb-2 text-foreground/90">Matriculation Number</label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                        <input
                                            type="text"
                                            required
                                            value={matricNumber}
                                            onChange={(e) => setMatricNumber(e.target.value)}
                                            className="w-full pl-12 pr-4 py-3 bg-white/5 dark:bg-black/20 border border-black/10 dark:border-white/10 rounded-lg focus:border-[#0ea5e9] focus:outline-none transition-colors"
                                            placeholder="e.g., HU/2024/001"
                                        />
                                    </div>
                                </div>

                                <Button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full bg-[#0ea5e9] hover:bg-[#0ea5e9]/90 py-6 text-lg disabled:opacity-50"
                                >
                                    {isLoading ? "Sending..." : "Send Reset Link"}
                                </Button>

                                <p className="text-center text-xs text-muted-foreground">
                                    This works for approved voter accounts that have an email address on file.
                                </p>
                            </form>
                        )}
                    </GlassCard>
                </motion.div>
            </div>
        </main>
    )
}
