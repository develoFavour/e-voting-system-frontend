"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import {
	Users,
	UserCheck,
	Vote,
	BarChart3,
	Play,
	Pause,
	StopCircle,
	TrendingUp,
} from "lucide-react";
import { toast } from "sonner";
import { adminAPI } from "@/lib/api";

export default function AdminOverviewPage() {
	const [electionStatus, setElectionStatus] = useState<
		"pending" | "live" | "closed"
	>("pending");
	const [statsData, setStatsData] = useState({
		totalRegistered: 0,
		approvedVoters: 0,
		votesCast: 0,
		pendingRequests: 0,
		stagedPositions: 0,
		stagedCandidates: 0,
		demographics: {
			departments: [] as { _id: string; count: number }[],
			faculties: [] as { _id: string; count: number }[],
		},
	});
	const [election, setElection] = useState<any>(null);
	const [showStartElectionModal, setShowStartElectionModal] = useState(false);
	const [showStartConfirmationModal, setShowStartConfirmationModal] =
		useState(false);
	const [electionForm, setElectionForm] = useState({
		title: "",
		description: "",
		duration: 180, // Default 3 hours in minutes
	});
	const [isLoading, setIsLoading] = useState(true);
	const [activities, setActivities] = useState<any[]>([]);

	const formatTime = (dateString: string) => {
		const now = new Date();
		const date = new Date(dateString);
		const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

		if (diffInSeconds < 60) return "just now";
		if (diffInSeconds < 3600)
			return `${Math.floor(diffInSeconds / 60)} mins ago`;
		if (diffInSeconds < 86400)
			return `${Math.floor(diffInSeconds / 3600)} hours ago`;
		return date.toLocaleDateString();
	};

	const fetchAdminData = async () => {
		try {
			const stats = await adminAPI.getDashboardStats();

			setStatsData({
				totalRegistered: stats.totalRegistered,
				approvedVoters: stats.approvedVoters,
				votesCast: stats.votesCast,
				pendingRequests: stats.pendingRequests,
				stagedPositions: stats.stagedPositions || 0,
				stagedCandidates: stats.stagedCandidates || 0,
				demographics: {
					departments: stats.demographics?.departments || [],
					faculties: stats.demographics?.faculties || [],
				},
			});

			// Set election data and status
			if (stats.election) {
				setElection(stats.election);
				setElectionStatus(stats.election.status);
			} else {
				setElection(null);
				setElectionStatus("pending");
			}

			// Fetch recent activities
			const activitiesData = await adminAPI.getRecentActivities();
			setActivities(activitiesData || []);
		} catch (error) {
			console.error("Failed to fetch admin data:", error);
			toast.error("Failed to load dashboard statistics");
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		fetchAdminData();
	}, []);

	const handleElectionControl = async (action: "start" | "pause" | "end") => {
		try {
			if (action === "start") {
				// Show confirmation modal first
				setShowStartConfirmationModal(true);
			} else if (action === "pause") {
				setElectionStatus("pending");
				toast.info("Election paused");
			} else {
				await adminAPI.endElection();
				setElectionStatus("closed");
				toast.success("Election ended");
				// Refresh data
				fetchAdminData();
			}
		} catch (error: any) {
			toast.error(error.message || "Action failed");
		}
	};

	const handleStartConfirmation = () => {
		setShowStartConfirmationModal(false);
		setShowStartElectionModal(true);
	};

	const handleStartElection = async () => {
		try {
			await adminAPI.startElection(
				electionForm.title,
				electionForm.description,
				electionForm.duration
			);
			setElectionStatus("live");
			toast.success("Election started successfully!");
			setShowStartElectionModal(false);
			// Reset form
			setElectionForm({
				title: "",
				description: "",
				duration: 180,
			});
			// Refresh data
			fetchAdminData();
		} catch (error: any) {
			toast.error(error.message || "Failed to start election");
		}
	};

	const stats = [
		{
			label: "Total Registered",
			value: statsData.totalRegistered.toLocaleString(),
			icon: Users,
			color: "#0ea5e9",
			trend: "+12%",
		},
		{
			label: "Approved Voters",
			value: statsData.approvedVoters.toLocaleString(),
			icon: UserCheck,
			color: "#10b981",
			trend: "+8%",
		},
		{
			label: "Votes Cast",
			value: statsData.votesCast.toLocaleString(),
			icon: Vote,
			color: "#f59e0b",
			trend: "+24%",
		},
		{
			label: "Pending Requests",
			value: statsData.pendingRequests.toLocaleString(),
			icon: BarChart3,
			color: "#ef4444",
			trend: "Latest",
		},
	];

	return (
		<div className="space-y-8 animate-in fade-in duration-500">
			<div>
				<h1 className="text-3xl font-bold tracking-tight mb-2">
					Election Overview
				</h1>
				<p className="text-muted-foreground">
					Real-time statistics and controls for the current election cycle.
				</p>
			</div>

			{/* Stats Grid */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
				{stats.map((stat, index) => (
					<motion.div
						key={stat.label}
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: index * 0.1 }}
					>
						<GlassCard
							depth="medium"
							className="p-6 group hover:border-[#0ea5e9]/50 transition-colors"
						>
							<div className="flex items-center justify-between mb-4">
								<div
									className="w-12 h-12 rounded-xl flex items-center justify-center bg-opacity-10"
									style={{ backgroundColor: `${stat.color}20` }}
								>
									<stat.icon
										className="w-6 h-6"
										style={{ color: stat.color }}
									/>
								</div>
								<span className="text-xs font-medium text-[#10b981] flex items-center gap-1">
									<TrendingUp className="w-3 h-3" />
									{stat.trend}
								</span>
							</div>
							<p className="text-3xl font-bold mb-1 text-foreground">{stat.value}</p>
							<p className="text-sm text-muted-foreground font-medium">{stat.label}</p>
						</GlassCard>
					</motion.div>
				))}
			</div>

			<div className="grid lg:grid-cols-2 gap-8">
				{/* Election Controls */}
				<GlassCard depth="deep" className="p-8 relative overflow-hidden">
					<div className="flex items-center justify-between mb-6">
						<h3 className="text-xl font-bold">Election Control Center</h3>
						<StatusBadge
							status={electionStatus}
							pulse={electionStatus === "live"}
						/>
					</div>
					<p className="text-muted-foreground mb-8 text-sm">
						As an administrator, you have the authority to manage the election
						lifecycle. Please ensure all candidates are verified before
						starting.
					</p>
					<div className="flex flex-col sm:flex-row gap-4">
						{electionStatus !== "live" ? (
							<div className="flex-1 space-y-2">
								<Button
									onClick={() => handleElectionControl("start")}
									disabled={statsData.stagedPositions === 0 || statsData.stagedCandidates === 0}
									className="bg-[#10b981] hover:bg-[#10b981]/90 h-14 px-8 text-lg w-full font-bold disabled:opacity-50 disabled:cursor-not-allowed"
								>
									<Play className="w-5 h-5 mr-3" />
									Start Election
								</Button>
								{/* {(statsData.stagedPositions === 0 || statsData.stagedCandidates === 0) && (
									<p className="text-xs text-[#ef4444] text-center font-medium">
										{statsData.stagedPositions === 0
											? "Create at least one position to be able to start the election"
											: "Add candidates to positions to be able to start the election"}
									</p>
								)} */}
							</div>
						) : (
							<>
								<Button
									onClick={() => handleElectionControl("pause")}
									variant="outline"
									className="border-[#f59e0b] text-[#f59e0b] hover:bg-[#f59e0b]/10 h-14 px-8 text-lg flex-1 bg-transparent font-bold"
								>
									<Pause className="w-5 h-5 mr-3" />
									Pause
								</Button>
								<Button
									onClick={() => handleElectionControl("end")}
									variant="outline"
									className="border-[#ef4444] text-[#ef4444] hover:bg-[#ef4444]/10 h-14 px-8 text-lg flex-1 bg-transparent font-bold"
								>
									<StopCircle className="w-5 h-5 mr-3" />
									End
								</Button>
							</>
						)}
					</div>
				</GlassCard>

				{/* Quick Actions / Activity Placeholder */}
				<GlassCard depth="deep" className="p-8">
					<h3 className="text-xl font-bold mb-6">Recent Activity</h3>
					<div className="space-y-6 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
						{activities.length > 0 ? (
							activities.map((activity, i) => (
								<div key={activity.id || i} className="flex items-center gap-4 text-sm">
									<div className="w-8 h-8 rounded-full bg-[#404040] flex items-center justify-center text-[10px] font-bold">
										{activity.adminName?.[0] || activity.type?.[0] || "A"}
									</div>
									<div className="flex-1">
										<p className="font-medium text-foreground">
											{activity.message}
										</p>
										<p className="text-muted-foreground text-xs">
											{formatTime(activity.created_at)}
										</p>
									</div>
								</div>
							))
						) : (
							<div className="text-center py-8 text-muted-foreground italic">
								No recent activities found.
							</div>
						)}
					</div>
				</GlassCard>
			</div>

			{/* Demographics Section */}
			<div className="grid lg:grid-cols-2 gap-8">
				<GlassCard depth="deep" className="p-8">
					<h3 className="text-xl font-bold mb-6 flex items-center gap-2">
						<Users className="w-5 h-5 text-[#0ea5e9]" />
						Voter Distribution by Faculty
					</h3>
					<div className="space-y-4">
						{statsData.demographics.faculties.length > 0 ? (
							statsData.demographics.faculties.map((f, i) => (
								<div key={f._id || i} className="space-y-2">
									<div className="flex justify-between text-sm">
										<span className="font-medium">{f._id || "Unknown"}</span>
										<span className="text-muted-foreground">{f.count} voters</span>
									</div>
									<div className="h-2 bg-[#1c1c1c] rounded-full overflow-hidden">
										<motion.div
											initial={{ width: 0 }}
											animate={{
												width: statsData.totalRegistered > 0
													? `${(f.count / statsData.totalRegistered) * 100}%`
													: "0%",
											}}
											className="h-full bg-[#0ea5e9]"
										/>
									</div>
								</div>
							))
						) : (
							<p className="text-center text-muted-foreground py-4">No data available</p>
						)}
					</div>
				</GlassCard>

				<GlassCard depth="deep" className="p-8">
					<h3 className="text-xl font-bold mb-6 flex items-center gap-2">
						<BarChart3 className="w-5 h-5 text-[#10b981]" />
						Voter Distribution by Department
					</h3>
					<div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
						{statsData.demographics.departments.length > 0 ? (
							statsData.demographics.departments.map((d, i) => (
								<div key={d._id || i} className="space-y-2">
									<div className="flex justify-between text-sm">
										<span className="font-medium">{d._id || "Unknown"}</span>
										<span className="text-muted-foreground">{d.count} voters</span>
									</div>
									<div className="h-2 bg-[#1c1c1c] rounded-full overflow-hidden">
										<motion.div
											initial={{ width: 0 }}
											animate={{
												width: statsData.totalRegistered > 0
													? `${(d.count / statsData.totalRegistered) * 100}%`
													: "0%",
											}}
											className="h-full bg-[#10b981]"
										/>
									</div>
								</div>
							))
						) : (
							<p className="text-center text-muted-foreground py-4">No data available</p>
						)}
					</div>
				</GlassCard>
			</div>

			{/* Start Election Confirmation Modal */}
			<AnimatePresence>
				{showStartConfirmationModal && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						className="fixed inset-0 bg-black/40 dark:bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
						onClick={() => setShowStartConfirmationModal(false)}
					>
						<motion.div
							initial={{ scale: 0.9, opacity: 0 }}
							animate={{ scale: 1, opacity: 1 }}
							exit={{ scale: 0.9, opacity: 0 }}
							onClick={(e) => e.stopPropagation()}
							className="max-w-md w-full"
						>
							<GlassCard depth="deep" className="p-8 bg-white/90 dark:bg-transparent">
								<h2 className="text-2xl font-bold mb-4">Start Election</h2>
								<p className="text-muted-foreground mb-6">
									Are you sure you want to start the election? Once started,
									voters will be able to cast their votes and the countdown
									timer will begin.
								</p>
								<div className="flex gap-3">
									<Button
										onClick={() => setShowStartConfirmationModal(false)}
										variant="outline"
										className="flex-1 border-gray-200 dark:border-[#404040] hover:bg-gray-100 dark:hover:bg-[#1c1c1c] bg-transparent text-gray-900 dark:text-white"
									>
										Cancel
									</Button>
									<Button
										onClick={handleStartConfirmation}
										className="flex-1 bg-[#10b981] hover:bg-[#10b981]/90 magnetic-hover"
									>
										Continue
									</Button>
								</div>
							</GlassCard>
						</motion.div>
					</motion.div>
				)}
			</AnimatePresence>

			{/* Start Election Modal */}
			<AnimatePresence>
				{showStartElectionModal && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						className="fixed inset-0 bg-black/40 dark:bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
						onClick={() => setShowStartElectionModal(false)}
					>
						<motion.div
							initial={{ scale: 0.9, opacity: 0 }}
							animate={{ scale: 1, opacity: 1 }}
							exit={{ scale: 0.9, opacity: 0 }}
							onClick={(e) => e.stopPropagation()}
							className="max-w-2xl w-full"
						>
							<GlassCard depth="deep" className="p-8 bg-white/90 dark:bg-transparent">
								<h2 className="text-2xl font-bold mb-6">Start New Election</h2>

								<div className="space-y-4 mb-6">
									<div>
										<label className="text-sm font-medium mb-1.5 block">
											Election Title
										</label>
										<input
											type="text"
											className="w-full bg-white dark:bg-[#0f0f0f] border border-gray-200 dark:border-[#404040] rounded-lg h-10 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#0ea5e9] text-gray-900 dark:text-white"
											value={electionForm.title}
											onChange={(e) =>
												setElectionForm({
													...electionForm,
													title: e.target.value,
												})
											}
											placeholder="e.g. Student Union Election 2025"
										/>
									</div>

									<div>
										<label className="text-sm font-medium mb-1.5 block">
											Description
										</label>
										<textarea
											className="w-full bg-white dark:bg-[#0f0f0f] border border-gray-200 dark:border-[#404040] rounded-lg h-20 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#0ea5e9] resize-none text-gray-900 dark:text-white"
											value={electionForm.description}
											onChange={(e) =>
												setElectionForm({
													...electionForm,
													description: e.target.value,
												})
											}
											placeholder="Brief description of the election..."
										/>
									</div>

									<div>
										<label className="text-sm font-medium mb-1.5 block">
											Duration (minutes)
										</label>
										<input
											type="number"
											className="w-full bg-white dark:bg-[#0f0f0f] border border-gray-200 dark:border-[#404040] rounded-lg h-10 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#0ea5e9] text-gray-900 dark:text-white"
											value={electionForm.duration}
											onChange={(e) =>
												setElectionForm({
													...electionForm,
													duration: parseInt(e.target.value) || 0,
												})
											}
											placeholder="180"
											min="1"
										/>
									</div>
								</div>

								<div className="flex gap-3">
									<Button
										onClick={() => setShowStartElectionModal(false)}
										variant="outline"
										className="flex-1 border-gray-200 dark:border-[#404040] hover:bg-gray-100 dark:hover:bg-[#1c1c1c] bg-transparent text-gray-900 dark:text-white"
									>
										Cancel
									</Button>
									<Button
										onClick={handleStartElection}
										disabled={!electionForm.title || electionForm.duration <= 0}
										className="flex-1 bg-[#10b981] hover:bg-[#10b981]/90 magnetic-hover disabled:opacity-50"
									>
										Start Election
									</Button>
								</div>
							</GlassCard>
						</motion.div>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
}
