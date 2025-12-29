"use client"

import { motion } from "framer-motion"
import { Vote, Menu, X } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { authAPI } from "@/lib/api"
import { useEffect } from "react"
import { useRouter } from "next/navigation"

export function Navbar() {
    const router = useRouter()
    const [isOpen, setIsOpen] = useState(false)
    const [user, setUser] = useState<any>(null)

    useEffect(() => {
        // Simple check for auth
        const authUser = authAPI.getCurrentUser()
        setUser(authUser)
    }, [])

    const handleLogout = () => {
        authAPI.logout()
        setUser(null)
        router.push("/")
    }

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            className="fixed top-0 left-0 right-0 z-50 glass-strong border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-950/80"
        >
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-20">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="w-12 h-12 rounded-full overflow-hidden bg-transparent flex items-center justify-center group-hover:scale-105 transition-transform shadow-md">
                            <Image
                                src="/hallmark.jpeg"
                                alt="Hallmark University"
                                width={48}
                                height={48}
                                className="w-full h-full rounded-full object-contain p-1"
                            />
                        </div>
                        <div>
                            <h2 className="font-bold text-lg text-gray-900 dark:text-white">eVote</h2>
                            <p className="text-xs text-gray-600 dark:text-[#a3a3a3]">Hallmark University</p>
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-6">
                        <Link href="/" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors text-sm font-medium">
                            Home
                        </Link>
                        {user ? (
                            <Link href="/dashboard" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors text-sm font-medium">
                                Dashboard
                            </Link>
                        ) : null}
                        <Link href="/results" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors text-sm font-medium">
                            Results
                        </Link>
                        <ThemeToggle />
                        {user ? (
                            <Button onClick={handleLogout} variant="outline" className="border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5 bg-transparent">
                                Logout
                            </Button>
                        ) : (
                            <Link href="/login">
                                <Button className="bg-[#0ea5e9] hover:bg-[#0ea5e9]/90 magnetic-hover">Sign In</Button>
                            </Link>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button onClick={() => setIsOpen(!isOpen)} className="md:hidden">
                        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>

                {/* Mobile Menu */}
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden pb-4 space-y-3"
                    >
                        <Link
                            href="/"
                            className="block py-2 text-[#a3a3a3] hover:text-white transition-colors"
                            onClick={() => setIsOpen(false)}
                        >
                            Home
                        </Link>
                        {user && (
                            <Link
                                href="/dashboard"
                                className="block py-2 text-[#a3a3a3] hover:text-white transition-colors"
                                onClick={() => setIsOpen(false)}
                            >
                                Dashboard
                            </Link>
                        )}
                        <Link
                            href="/results"
                            className="block py-2 text-[#a3a3a3] hover:text-white transition-colors"
                            onClick={() => setIsOpen(false)}
                        >
                            Results
                        </Link>
                        {user ? (
                            <Button onClick={handleLogout} className="w-full bg-[#ef4444] hover:bg-[#ef4444]/90">
                                Logout
                            </Button>
                        ) : (
                            <Link href="/login" onClick={() => setIsOpen(false)}>
                                <Button className="w-full bg-[#0ea5e9] hover:bg-[#0ea5e9]/90">Sign In</Button>
                            </Link>
                        )}
                    </motion.div>
                )}
            </div>
        </motion.nav>
    )
}
