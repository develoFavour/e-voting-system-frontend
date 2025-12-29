"use client"

import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

interface StatusBadgeProps {
    status: string
    pulse?: boolean
    className?: string
}

export function StatusBadge({ status, pulse = false, className }: StatusBadgeProps) {
    const statusConfig = {
        live: {
            bg: "bg-[#10b981]/20",
            text: "text-[#10b981]",
            border: "border-[#10b981]/50",
            label: "LIVE",
        },
        pending: {
            bg: "bg-[#f59e0b]/20",
            text: "text-[#f59e0b]",
            border: "border-[#f59e0b]/50",
            label: "PENDING",
        },
        approved: {
            bg: "bg-[#10b981]/20",
            text: "text-[#10b981]",
            border: "border-[#10b981]/50",
            label: "APPROVED",
        },
        rejected: {
            bg: "bg-[#ef4444]/20",
            text: "text-[#ef4444]",
            border: "border-[#ef4444]/50",
            label: "REJECTED",
        },
        closed: {
            bg: "bg-[#737373]/20",
            text: "text-[#737373]",
            border: "border-[#737373]/50",
            label: "CLOSED",
        },
    }

    const normalizedStatus = (status?.toLowerCase() || "pending") as keyof typeof statusConfig
    const config = statusConfig[normalizedStatus] || statusConfig.pending

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className={cn(
                "inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-semibold tracking-wider",
                config.bg,
                config.text,
                config.border,
                className,
            )}
        >
            {pulse && (
                <motion.span
                    className={cn("w-2 h-2 rounded-full", config.text.replace("text-", "bg-"))}
                    animate={{ opacity: [1, 0.3, 1] }}
                    transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                />
            )}
            {config.label}
        </motion.div>
    )
}
