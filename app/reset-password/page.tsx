"use client"

import { Suspense, useMemo, useState } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import { ArrowLeft, Lock, ShieldCheck } from "lucide-react"
import { toast } from "sonner"

import { authAPI } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { GlassCard } from "@/components/ui/glass-card"

function ResetPasswordContent() {
    const searchParams = useSearchParams()
    const token = useMemo(() => searchParams.get("token") || "", [searchParams])
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [isSubmitted, setIsSubmitted] = useState(false)

    const getErrorMessage = (error: unknown) =>
        error instanceof Error ? error.message : "Unable to reset password"

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!token) {
            toast.error("This reset link is invalid or incomplete")
            return
        }

        if (password !== confirmPassword) {
            toast.error("Passwords do not match")
            return
        }

        setIsLoading(true)

        try {
            await authAPI.resetPassword(token, password)
            toast.success("Password reset successful")
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

                        <h1 className="text-3xl font-bold mb-2 text-foreground">Reset Password</h1>
                        <p className="text-muted-foreground">Choose a new password to regain access to your voter account.</p>
                    </div>

                    <GlassCard depth="deep" className="p-8">
                        {isSubmitted ? (
                            <div className="space-y-4 text-center">
                                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#10b981]/15">
                                    <ShieldCheck className="h-7 w-7 text-[#10b981]" />
                                </div>
                                <h2 className="text-xl font-semibold text-foreground">Password updated</h2>
                                <p className="text-sm text-muted-foreground">
                                    You can sign in now with your new password.
                                </p>
                                <Link href="/login" className="inline-flex text-sm font-medium text-[#0ea5e9] hover:underline">
                                    Go to login
                                </Link>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium mb-2 text-foreground/90">New Password</label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                        <input
                                            type="password"
                                            required
                                            minLength={6}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="w-full pl-12 pr-4 py-3 bg-white/5 dark:bg-black/20 border border-black/10 dark:border-white/10 rounded-lg focus:border-[#0ea5e9] focus:outline-none transition-colors"
                                            placeholder="Create a new password"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2 text-foreground/90">Confirm New Password</label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                        <input
                                            type="password"
                                            required
                                            minLength={6}
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            className="w-full pl-12 pr-4 py-3 bg-white/5 dark:bg-black/20 border border-black/10 dark:border-white/10 rounded-lg focus:border-[#0ea5e9] focus:outline-none transition-colors"
                                            placeholder="Re-enter your new password"
                                        />
                                    </div>
                                </div>

                                <Button
                                    type="submit"
                                    disabled={isLoading || !token}
                                    className="w-full bg-[#0ea5e9] hover:bg-[#0ea5e9]/90 py-6 text-lg disabled:opacity-50"
                                >
                                    {isLoading ? "Resetting..." : "Reset Password"}
                                </Button>

                                {!token && (
                                    <p className="text-center text-sm text-[#ef4444]">
                                        This reset link is missing a token. Please request a fresh password reset email.
                                    </p>
                                )}
                            </form>
                        )}
                    </GlassCard>
                </motion.div>
            </div>
        </main>
    )
}

export default function ResetPasswordPage() {
    return (
        <Suspense
            fallback={
                <main className="min-h-screen mesh-background flex items-center justify-center p-4">
                    <div className="container mx-auto max-w-md z-10">
                        <GlassCard depth="deep" className="p-8 text-center">
                            <p className="text-muted-foreground">Loading reset form...</p>
                        </GlassCard>
                    </div>
                </main>
            }
        >
            <ResetPasswordContent />
        </Suspense>
    )
}
