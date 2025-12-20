"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import { UploadZone } from "@/components/accreditation/upload-zone"
import { ArrowLeft, CheckCircle2 } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

export default function AccreditPage() {
    const [formData, setFormData] = useState({
        matricNumber: "",
        fullName: "",
        department: "",
        faculty: "",
        password: "",
        confirmPassword: "",
    })
    const [idCard, setIdCard] = useState<File | null>(null)
    const [isSubmitted, setIsSubmitted] = useState(false)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        if (!idCard) {
            toast.error("Please upload your Student ID Card")
            return
        }

        if (formData.password !== formData.confirmPassword) {
            toast.error("Passwords do not match")
            return
        }

        // TODO: API call to submit accreditation
        console.log("Submitting:", formData, idCard)
        setIsSubmitted(true)
        toast.success("Accreditation request submitted successfully!")
    }

    if (isSubmitted) {
        return (
            <main className="min-h-screen dark mesh-background flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-md w-full"
                >
                    <GlassCard depth="deep" className="p-8 text-center">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2, type: "spring" }}
                            className="w-20 h-20 bg-[#10b981]/20 rounded-full flex items-center justify-center mx-auto mb-6"
                        >
                            <CheckCircle2 className="w-12 h-12 text-[#10b981]" />
                        </motion.div>

                        <h2 className="text-2xl font-bold mb-3">Submission Received!</h2>
                        <p className="text-[#a3a3a3] mb-6">
                            Your accreditation request has been submitted. You will be notified when your status changes to APPROVED.
                        </p>

                        <Link href="/">
                            <Button className="w-full bg-[#0ea5e9] hover:bg-[#0ea5e9]/90">
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Back to Home
                            </Button>
                        </Link>
                    </GlassCard>
                </motion.div>
            </main>
        )
    }

    return (
        <main className="min-h-screen dark mesh-background py-12 px-4">
            <div className="container mx-auto max-w-3xl">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <Link href="/" className="inline-flex items-center text-[#0ea5e9] hover:underline mb-4">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Home
                    </Link>
                    <h1 className="text-4xl font-bold mb-2">Voter Accreditation</h1>
                    <p className="text-[#a3a3a3]">
                        Complete your registration to participate in the upcoming elections
                    </p>
                </motion.div>

                {/* Form */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                    <GlassCard depth="deep" className="p-8">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Personal Information */}
                            <div>
                                <h3 className="text-xl font-semibold mb-4">Personal Information</h3>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Matriculation Number</label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.matricNumber}
                                            onChange={(e) => setFormData({ ...formData, matricNumber: e.target.value })}
                                            className="w-full px-4 py-3 bg-[#1c1c1c] border border-[#404040] rounded-lg focus:border-[#0ea5e9] focus:outline-none transition-colors"
                                            placeholder="e.g., HU/2024/001"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-2">Full Name</label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.fullName}
                                            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                            className="w-full px-4 py-3 bg-[#1c1c1c] border border-[#404040] rounded-lg focus:border-[#0ea5e9] focus:outline-none transition-colors"
                                            placeholder="Your full name"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-2">Faculty</label>
                                        <select
                                            required
                                            value={formData.faculty}
                                            onChange={(e) => setFormData({ ...formData, faculty: e.target.value })}
                                            className="w-full px-4 py-3 bg-[#1c1c1c] border border-[#404040] rounded-lg focus:border-[#0ea5e9] focus:outline-none transition-colors"
                                        >
                                            <option value="">Select Faculty</option>
                                            <option value="science">Science</option>
                                            <option value="engineering">Engineering</option>
                                            <option value="arts">Arts</option>
                                            <option value="social-sciences">Social Sciences</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-2">Department</label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.department}
                                            onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                                            className="w-full px-4 py-3 bg-[#1c1c1c] border border-[#404040] rounded-lg focus:border-[#0ea5e9] focus:outline-none transition-colors"
                                            placeholder="e.g., Computer Science"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Security */}
                            <div>
                                <h3 className="text-xl font-semibold mb-4">Account Security</h3>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Password</label>
                                        <input
                                            type="password"
                                            required
                                            value={formData.password}
                                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                            className="w-full px-4 py-3 bg-[#1c1c1c] border border-[#404040] rounded-lg focus:border-[#0ea5e9] focus:outline-none transition-colors"
                                            placeholder="Create a password"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-2">Confirm Password</label>
                                        <input
                                            type="password"
                                            required
                                            value={formData.confirmPassword}
                                            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                            className="w-full px-4 py-3 bg-[#1c1c1c] border border-[#404040] rounded-lg focus:border-[#0ea5e9] focus:outline-none transition-colors"
                                            placeholder="Confirm password"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* ID Upload */}
                            <div>
                                <h3 className="text-xl font-semibold mb-4">Identity Verification</h3>
                                <UploadZone onFileSelect={setIdCard} />
                            </div>

                            {/* Submit */}
                            <Button type="submit" className="w-full bg-[#0ea5e9] hover:bg-[#0ea5e9]/90 py-6 text-lg magnetic-hover">
                                Submit Accreditation Request
                            </Button>
                        </form>
                    </GlassCard>
                </motion.div>
            </div>
        </main>
    )
}
