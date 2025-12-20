"use client"

import { motion } from "framer-motion"
import { GlassCard } from "@/components/ui/glass-card"
import { UserCheck, ShieldCheck, Vote } from "lucide-react"

const steps = [
    {
        icon: UserCheck,
        title: "Register",
        description: "Submit your matriculation details and upload your student ID for verification",
    },
    {
        icon: ShieldCheck,
        title: "Get Verified",
        description: "Admin reviews and approves your accreditation request within 24 hours",
    },
    {
        icon: Vote,
        title: "Cast Your Vote",
        description: "Access the secure voting booth and select your preferred candidates",
    },
]

export function HowItWorks() {
    return (
        <section className="py-24 relative bg-gray-50 dark:bg-transparent">
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-white">How It Works</h2>
                    <p className="text-gray-600 dark:text-[#a3a3a3] text-lg">Three simple steps to make your voice heard</p>
                </motion.div>

                <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {steps.map((step, index) => (
                        <motion.div
                            key={step.title}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.2 }}
                        >
                            <GlassCard depth="medium" className="p-8 magnetic-hover relative bg-white dark:bg-[#1c1c1c]/60 border border-gray-200 dark:border-white/10">
                                {/* Step number */}
                                <div className="absolute -top-4 -right-4 w-12 h-12 bg-[#0ea5e9] rounded-full flex items-center justify-center font-bold text-lg text-white shadow-lg">
                                    {index + 1}
                                </div>

                                {/* Icon */}
                                <div className="w-16 h-16 bg-[#0ea5e9]/20 rounded-lg flex items-center justify-center mb-6">
                                    <step.icon className="w-8 h-8 text-[#0ea5e9]" />
                                </div>

                                {/* Content */}
                                <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">{step.title}</h3>
                                <p className="text-gray-600 dark:text-[#a3a3a3] text-pretty">{step.description}</p>
                            </GlassCard>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}

