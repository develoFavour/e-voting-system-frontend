"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { GlassCard } from "@/components/ui/glass-card"
import { Clock } from "lucide-react"

interface CountdownTimerProps {
    endTime: Date
}

export function CountdownTimer({ endTime }: CountdownTimerProps) {
    const [timeLeft, setTimeLeft] = useState({
        hours: 0,
        minutes: 0,
        seconds: 0,
    })

    useEffect(() => {
        const timer = setInterval(() => {
            const now = new Date().getTime()
            const distance = endTime.getTime() - now

            if (distance < 0) {
                clearInterval(timer)
                setTimeLeft({ hours: 0, minutes: 0, seconds: 0 })
                return
            }

            setTimeLeft({
                hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
                seconds: Math.floor((distance % (1000 * 60)) / 1000),
            })
        }, 1000)

        return () => clearInterval(timer)
    }, [endTime])

    return (
        <GlassCard depth="medium" className="p-6">
            <div className="flex items-center gap-3 mb-4">
                <Clock className="w-5 h-5 text-[#0ea5e9]" />
                <h3 className="font-semibold">Voting Closes In</h3>
            </div>

            <div className="flex gap-4 justify-center">
                {[
                    { label: "Hours", value: timeLeft.hours },
                    { label: "Minutes", value: timeLeft.minutes },
                    { label: "Seconds", value: timeLeft.seconds },
                ].map((item, index) => (
                    <div key={item.label} className="flex flex-col items-center">
                        <motion.div
                            key={item.value}
                            initial={{ scale: 1.2, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="w-16 h-16 bg-[#0ea5e9]/20 rounded-lg flex items-center justify-center mb-2"
                        >
                            <span className="text-2xl font-bold text-[#0ea5e9]">{String(item.value).padStart(2, "0")}</span>
                        </motion.div>
                        <span className="text-xs text-[#a3a3a3]">{item.label}</span>
                    </div>
                ))}
            </div>
        </GlassCard>
    )
}
