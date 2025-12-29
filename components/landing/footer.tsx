"use client";

import { motion } from "framer-motion";
import { Vote, Github, Twitter, Linkedin, Facebook, Mail, Globe, ShieldCheck } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="relative bg-[#0f0f0f] border-t border-white/5 pt-20 pb-10 overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#0ea5e9]/5 blur-[120px] rounded-full -translate-y-1/2" />
            <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-[#10b981]/5 blur-[100px] rounded-full translate-y-1/2" />

            <div className="container mx-auto px-4 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    {/* Brand Section */}
                    <div className="space-y-6">
                        <Link href="/" className="flex items-center gap-3 group">
                            <div className="p-2 bg-[#0ea5e9] rounded-lg group-hover:rotate-12 transition-transform duration-300">
                                <Vote className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <span className="text-xl font-bold text-white tracking-tight">eVote</span>
                                <p className="text-[10px] text-[#0ea5e9] font-bold uppercase tracking-widest leading-none">Hallmark University</p>
                            </div>
                        </Link>
                        <p className="text-[#a3a3a3] leading-relaxed max-w-xs">
                            Empowering Hallmark students through secure, transparent, and user-centric digital voting solutions.
                        </p>
                        <div className="flex items-center gap-4">
                            <a href="#" className="p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors text-[#a3a3a3] hover:text-[#0ea5e9]">
                                <Twitter className="w-5 h-5" />
                            </a>
                            <a href="#" className="p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors text-[#a3a3a3] hover:text-[#0ea5e9]">
                                <Linkedin className="w-5 h-5" />
                            </a>
                            <a href="#" className="p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors text-[#a3a3a3] hover:text-[#0ea5e9]">
                                <Facebook className="w-5 h-5" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-white font-bold mb-6 text-lg tracking-tight">Elections</h3>
                        <ul className="space-y-4">
                            <li><Link href="/results" className="text-[#a3a3a3] hover:text-white hover:translate-x-1 transition-all inline-block">Latest Results</Link></li>
                            <li><Link href="/login" className="text-[#a3a3a3] hover:text-white hover:translate-x-1 transition-all inline-block">Student Voting</Link></li>
                            <li><Link href="/accredit" className="text-[#a3a3a3] hover:text-white hover:translate-x-1 transition-all inline-block">Voter Accreditation</Link></li>
                            <li><Link href="/admin/login" className="text-[#a3a3a3] hover:text-white hover:translate-x-1 transition-all inline-block">Admin Portal</Link></li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h3 className="text-white font-bold mb-6 text-lg tracking-tight">Resources</h3>
                        <ul className="space-y-4">
                            <li><a href="#" className="text-[#a3a3a3] hover:text-white hover:translate-x-1 transition-all inline-block">Help Center</a></li>
                            <li><a href="#" className="text-[#a3a3a3] hover:text-white hover:translate-x-1 transition-all inline-block">Voting Policy</a></li>
                            <li><a href="#" className="text-[#a3a3a3] hover:text-white hover:translate-x-1 transition-all inline-block">System Status</a></li>
                            <li><a href="#" className="text-[#a3a3a3] hover:text-white hover:translate-x-1 transition-all inline-block">Security Protocols</a></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div className="glass-strong p-6 rounded-2xl border border-white/5">
                        <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                            <ShieldCheck className="w-5 h-5 text-[#0ea5e9]" />
                            Security Verified
                        </h3>
                        <p className="text-sm text-[#a3a3a3] mb-6">
                            The Hallmark eVote system uses end-to-end encryption for ballot secrecy.
                        </p>
                        <div className="space-y-3">
                            <div className="flex items-center gap-3 text-sm text-[#a3a3a3]">
                                <Mail className="w-4 h-4 text-[#0ea5e9]" />
                                elearn@hallmark.edu.ng
                            </div>
                            <div className="flex items-center gap-3 text-sm text-[#a3a3a3]">
                                <Globe className="w-4 h-4 text-[#0ea5e9]" />
                                www.hallmark.edu.ng
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="text-sm text-[#525252]">
                        © {currentYear} Hallmark University. All rights reserved.
                    </div>
                    <div className="flex items-center gap-8 text-sm text-[#525252]">
                        <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                        <a href="#" className="hover:text-white transition-colors">Accessibility</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
