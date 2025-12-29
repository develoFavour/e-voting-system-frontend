import { cn } from "@/lib/utils"
import type { HTMLAttributes } from "react"

interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
    depth?: "shallow" | "medium" | "deep"
}

export function GlassCard({ className, depth = "medium", children, ...props }: GlassCardProps) {
    const depthClasses = {
        shallow: "glass shadow-lg",
        medium: "glass-strong shadow-xl",
        deep: "glass-strong shadow-2xl border border-black/10 dark:border-white/10",
    }

    return (
        <div className={cn("rounded-lg", depthClasses[depth], className)} {...props}>
            {children}
        </div>
    )
}
