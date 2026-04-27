"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { CheckCircle2, ExternalLink, Loader2, XCircle } from "lucide-react"

import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import { getImageUrl } from "@/lib/api"

interface AccreditationRequest {
    id: string
    fullName: string
    matricNumber: string
    department: string
    idCardUrl: string
    createdAt: string
}

interface AccreditationQueueCardProps {
    request: AccreditationRequest
    onApprove: (id: string) => void
    onReject: (id: string, reason: string) => Promise<void>
}

export function AccreditationQueueCard({ request, onApprove, onReject }: AccreditationQueueCardProps) {
    const [isRejecting, setIsRejecting] = useState(false)
    const [rejectionReason, setRejectionReason] = useState("")
    const [isSubmittingRejection, setIsSubmittingRejection] = useState(false)

    const handleReject = async () => {
        const trimmedReason = rejectionReason.trim()
        if (!trimmedReason) return

        setIsSubmittingRejection(true)
        try {
            await onReject(request.id, trimmedReason)
        } finally {
            setIsSubmittingRejection(false)
        }
    }

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <GlassCard depth="medium" className="p-6">
                <div className="grid md:grid-cols-2 gap-6">
                    <div>
                        <div className="mb-4">
                            <label className="text-xs text-[#a3a3a3] uppercase tracking-wider">Full Name</label>
                            <p className="text-lg font-semibold">{request.fullName}</p>
                        </div>

                        <div className="mb-4">
                            <label className="text-xs text-[#a3a3a3] uppercase tracking-wider">Matric Number</label>
                            <p className="font-mono text-[#0ea5e9]">{request.matricNumber}</p>
                        </div>

                        <div className="mb-4">
                            <label className="text-xs text-[#a3a3a3] uppercase tracking-wider">Department</label>
                            <p>{request.department}</p>
                        </div>

                        <div>
                            <label className="text-xs text-[#a3a3a3] uppercase tracking-wider">Submitted</label>
                            <p className="text-sm">
                                {request.createdAt
                                    ? new Date(request.createdAt).toLocaleString(undefined, {
                                        dateStyle: "medium",
                                        timeStyle: "short",
                                    })
                                    : "Recently"}
                            </p>
                        </div>
                    </div>

                    <div>
                        <label className="text-xs text-[#a3a3a3] uppercase tracking-wider mb-2 block">Student ID Card</label>
                        <div className="relative aspect-video rounded-lg overflow-hidden bg-[#1c1c1c] mb-4 border border-[#404040]">
                            <img
                                src={getImageUrl(request.idCardUrl) || "/placeholder.svg"}
                                alt="Student ID"
                                className="w-full h-full object-contain"
                            />
                        </div>

                        <a
                            href={getImageUrl(request.idCardUrl) || "#"}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#0ea5e9] text-sm flex items-center gap-1 hover:underline"
                        >
                            View Full Size
                            <ExternalLink className="w-3 h-3" />
                        </a>
                    </div>
                </div>

                {isRejecting && (
                    <div className="mt-6 rounded-lg border border-[#ef4444]/30 bg-[#ef4444]/5 p-4">
                        <label className="mb-2 block text-sm font-medium text-foreground">
                            Rejection Reason
                        </label>
                        <textarea
                            value={rejectionReason}
                            onChange={(e) => setRejectionReason(e.target.value)}
                            rows={4}
                            className="w-full resize-none rounded-lg border border-[#404040] bg-[#1c1c1c] px-4 py-3 text-sm text-foreground focus:border-[#ef4444] focus:outline-none"
                            placeholder="Explain why this accreditation request is being rejected."
                        />
                        <p className="mt-2 text-xs text-muted-foreground">
                            This reason will be emailed to the student.
                        </p>

                        <div className="mt-4 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                            <Button
                                variant="outline"
                                className="border-[#404040] bg-transparent"
                                onClick={() => {
                                    setIsRejecting(false)
                                    setRejectionReason("")
                                }}
                                disabled={isSubmittingRejection}
                            >
                                Cancel
                            </Button>
                            <Button
                                className="bg-[#ef4444] hover:bg-[#ef4444]/90"
                                onClick={handleReject}
                                disabled={!rejectionReason.trim() || isSubmittingRejection}
                            >
                                {isSubmittingRejection ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Sending Rejection
                                    </>
                                ) : (
                                    <>
                                        <XCircle className="mr-2 h-4 w-4" />
                                        Reject and Notify
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                )}

                <div className="flex gap-3 mt-6 pt-6 border-t border-[#404040]">
                    <Button
                        className="flex-1 bg-[#10b981] hover:bg-[#10b981]/90 magnetic-hover"
                        onClick={() => onApprove(request.id)}
                        disabled={isRejecting}
                    >
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                        Approve
                    </Button>

                    <Button
                        variant="outline"
                        className="flex-1 border-[#ef4444] text-[#ef4444] hover:bg-[#ef4444]/10 magnetic-hover bg-transparent"
                        onClick={() => setIsRejecting(true)}
                        disabled={isRejecting}
                    >
                        <XCircle className="w-4 h-4 mr-2" />
                        Reject
                    </Button>
                </div>
            </GlassCard>
        </motion.div>
    )
}
