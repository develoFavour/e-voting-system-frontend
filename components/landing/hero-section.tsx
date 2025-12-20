"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { StatusBadge } from "@/components/ui/status-badge"
import { ArrowRight, Vote, Shield, CheckCircle } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export function HeroSection() {
    return (
        <section className="relative min-h-screen mb-4  flex items-center justify-center overflow-hidden">
            {/* Campus Background Image with Overlay */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="/campus-hero.jpg"
                    alt="Hallmark University Campus"
                    fill
                    className="object-cover"
                    priority
                />
                {/* Gradient Overlay for text readability */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#192f59]/55 via-[#192f59]/55 to-[#192f59]/35 dark:from-black/75 dark:via-black/65 dark:to-black/65" />
            </div>

            {/* Decorative Pattern Overlay */}
            <div className="absolute inset-0 z-0 opacity-10">
                <div className="absolute inset-0" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                }} />
            </div>

            <div className="container mx-auto px-4 z-10 pt-20">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="max-w-5xl mx-auto text-center"
                >
                    {/* University Seal/Badge */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                        className="mb-6 flex justify-center"
                    >
                        <div className="relative">
                            <div className="w-24 h-24 pt-2 rounded-full bg-white p-3 shadow-2xl">
                                <Image
                                    src="/hallmark.jpeg"
                                    alt="Hallmark University Logo"
                                    width={96}
                                    height={96}
                                    className="w-full h-full rounded-full object-contain"
                                />
                            </div>

                        </div>
                    </motion.div>

                    {/* Hero Title */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white">
                            <span className="block text-2xl md:text-3xl font-normal mb-3 text-white/90">
                                Welcome to
                            </span>
                            Hallmark University
                            <br />
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#0ea5e9] to-[#06b6d4]">
                                Student Elections Portal
                            </span>
                        </h1>
                    </motion.div>

                    {/* Subtitle */}
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="text-xl md:text-2xl text-white/90 mb-12 max-w-3xl mx-auto leading-relaxed"
                    >
                        Secure, transparent, and modern digital voting platform. Your voice matters in shaping the future of our university.
                    </motion.p>

                    {/* CTA Buttons */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
                    >
                        <Link href="/login">
                            <Button
                                size="lg"
                                className="bg-[#0ea5e9] hover:bg-[#0284c7] text-white px-10 py-7 text-lg font-semibold shadow-2xl shadow-[#0ea5e9]/50 magnetic-hover group"
                            >
                                <Vote className="mr-2 w-5 h-5" />
                                Vote Now
                                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </Link>

                        <Link href="/accredit">
                            <Button
                                size="lg"
                                variant="outline"
                                className="border-2 border-white/30 hover:bg-white/10 text-white px-10 py-7 text-lg font-semibold backdrop-blur-sm magnetic-hover bg-white/5"
                            >
                                Get Accredited
                            </Button>
                        </Link>
                    </motion.div>

                    {/* Trust Indicators */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-16"
                    >
                        {[
                            { icon: Shield, label: "Secure & Encrypted", desc: "Military-grade security" },
                            { icon: CheckCircle, label: "Identity Verified", desc: "Admin-approved voters only" },
                            { icon: Vote, label: "Real-time Results", desc: "Live vote counting" },
                        ].map((item, index) => (
                            <div
                                key={item.label}
                                className="glass-strong p-6 rounded-xl border border-white/10 backdrop-blur-md"
                            >
                                <item.icon className="w-8 h-8 text-[#0ea5e9] mx-auto mb-3" />
                                <h3 className="font-semibold text-white mb-1">{item.label}</h3>
                                <p className="text-sm text-white/70">{item.desc}</p>
                            </div>
                        ))}
                    </motion.div>
                </motion.div>
            </div>

            {/* Scroll Indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 1 }}
                className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
            >
                <motion.div
                    animate={{ y: [0, 10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-6 h-10 border-2 border-white/30 rounded-full flex items-start justify-center p-2"
                >
                    <motion.div
                        animate={{ y: [0, 12, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="w-1.5 h-1.5 bg-white rounded-full"
                    />
                </motion.div>
            </motion.div>
        </section>
    )
}

