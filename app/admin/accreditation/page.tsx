"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { UserCheck, Loader2, Search, Filter } from "lucide-react";
import { toast } from "sonner";
import { adminAPI } from "@/lib/api";
import { AccreditationQueueCard } from "@/components/admin/accreditation-queue-card";
import { GlassCard } from "@/components/ui/glass-card";
import { Input } from "@/components/ui/input";

export default function AccreditationPage() {
	const [pendingRequests, setPendingRequests] = useState<any[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [searchQuery, setSearchQuery] = useState("");

	const fetchRequests = async () => {
		try {
			const requests = await adminAPI.getPendingAccreditation();
			setPendingRequests(requests);
		} catch (error) {
			console.error("Failed to fetch requests:", error);
			toast.error("Failed to load accreditation queue");
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		fetchRequests();
	}, []);

	const handleApprove = async (id: string) => {
		try {
			await adminAPI.approveVoter(id);
			toast.success("Voter approved successfully");
			setPendingRequests((prev) => prev.filter((req) => req.id !== id));
		} catch (error: any) {
			toast.error(error.message || "Failed to approve voter");
		}
	};

	const handleReject = async (id: string) => {
		try {
			await adminAPI.rejectVoter(id);
			toast.error("Voter rejected");
			setPendingRequests((prev) => prev.filter((req) => req.id !== id));
		} catch (error: any) {
			toast.error(error.message || "Failed to reject voter");
		}
	};

	const filteredRequests = (pendingRequests || []).filter(
		(req) =>
			req.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
			req.matricNumber?.toLowerCase().includes(searchQuery.toLowerCase())
	);

	if (isLoading) {
		return (
			<div className="flex flex-col items-center justify-center h-[60vh] gap-4">
				<Loader2 className="w-10 h-10 text-[#0ea5e9] animate-spin" />
				<p className="text-[#a3a3a3]">Fetching pending requests...</p>
			</div>
		);
	}

	return (
		<div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
			<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
				<div>
					<h1 className="text-3xl font-bold tracking-tight mb-1">
						Accreditation Queue
					</h1>
					<p className="text-[#a3a3a3]">
						Verify and approve voter identity documents.
					</p>
				</div>
				<div className="flex items-center gap-3">
					<div className="relative w-64">
						<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#a3a3a3]" />
						<Input
							placeholder="Search voters..."
							className="pl-10 bg-[#1c1c1c] border-[#404040]"
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
						/>
					</div>
				</div>
			</div>

			<div className="grid gap-4">
				{filteredRequests.length > 0 ? (
					filteredRequests.map((request, index) => (
						<motion.div
							key={request.id}
							initial={{ opacity: 0, x: -20 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ delay: index * 0.05 }}
						>
							<AccreditationQueueCard
								request={request}
								onApprove={handleApprove}
								onReject={handleReject}
							/>
						</motion.div>
					))
				) : (
					<GlassCard
						depth="medium"
						className="py-20 flex flex-col items-center justify-center text-center"
					>
						<UserCheck className="w-16 h-16 mb-4 text-[#a3a3a3] opacity-20" />
						<h3 className="text-xl font-semibold mb-1">Queue is empty</h3>
						<p className="text-[#a3a3a3]">
							All pending accreditation requests have been processed.
						</p>
					</GlassCard>
				)}
			</div>
		</div>
	);
}
