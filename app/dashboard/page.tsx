"use client";

import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { CountdownTimer } from "@/components/voting/countdown-timer";
import {
	Vote,
	CheckCircle2,
	User,
	LogOut,
	BarChart3,
	Loader2,
} from "lucide-react";
import Link from "next/link";
import { authAPI, userAPI, adminAPI, voteAPI } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function DashboardPage() {
	const router = useRouter();
	const [userData, setUserData] = useState<any>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [isLogoutLoading, setIsLogoutLoading] = useState(false);
	const [election, setElection] = useState<any>(null);
	const [candidates, setCandidates] = useState<any[]>([]);
	const [isElectionLoading, setIsElectionLoading] = useState(true);

	useEffect(() => {
		const fetchDashboardData = async () => {
			try {
				// First try to get from localStorage for instant feedback
				const cachedUser = authAPI.getCurrentUser();
				if (cachedUser) {
					setUserData(cachedUser);
				}

				// Then fetch fresh data from API
				const freshUser = await userAPI.getProfile();
				setUserData(freshUser);
				// Cache the fresh data
				localStorage.setItem("user", JSON.stringify(freshUser));

				// Fetch election data
				try {
					const electionData = await voteAPI.getCurrentElection();
					setElection(electionData.election);

					// Only fetch candidates if election is live
					if (electionData.election?.status === "live") {
						const candidatesData = await voteAPI.getCandidates();
						setCandidates(candidatesData);
					}
				} catch (electionError) {
					console.log("No active election found");
					setElection(null);
					setCandidates([]);
				}
			} catch (error: any) {
				console.error("Failed to fetch dashboard data:", error);
			} finally {
				setIsLoading(false);
				setIsElectionLoading(false);
			}
		};

		fetchDashboardData();
	}, []);

	const handleLogout = () => {
		setIsLogoutLoading(true);
		try {
			authAPI.logout();
			toast.success("Logged out successfully");
			router.push("/login");
		} catch (error) {
			toast.error("Logout failed");
		} finally {
			setIsLogoutLoading(false);
		}
	};

	const endTime = election?.end_time ? new Date(election.end_time) : null;

	// Calculate positions and candidates from real data
	const totalPositions =
		candidates.length > 0
			? [...new Set(candidates.map((c: any) => c.position))].length
			: 0;
	const totalCandidates = candidates.length;

	if (isLoading && !userData) {
		return (
			<main className="min-h-screen mesh-background flex items-center justify-center">
				<div className="flex flex-col items-center gap-4">
					<Loader2 className="w-12 h-12 text-[#0ea5e9] animate-spin" />
					<p className="text-[#a3a3a3]">Loading your dashboard...</p>
				</div>
			</main>
		);
	}

	// Fallback if user data is missing
	const user = userData || {
		fullName: "User",
		matricNumber: "---",
		department: "---",
		status: "pending",
		hasVoted: false,
	};

	return (
		<main className="min-h-screen mesh-background py-12 px-4">
			<div className="container mx-auto max-w-7xl">
				{/* Header */}
				<motion.div
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					className="flex items-center justify-between mb-8"
				>
					<div className="flex items-center gap-4">
						<div className="w-12 h-12 bg-[#0ea5e9] rounded-lg flex items-center justify-center">
							<Vote className="w-7 h-7" />
						</div>
						<div>
							<h1 className="text-3xl font-bold">
								Student&apos;s Vote Dashboard
							</h1>
							<p className="text-[#a3a3a3]">Welcome back, {user.fullName}</p>
						</div>
					</div>
					<Button
						onClick={handleLogout}
						disabled={isLogoutLoading}
						variant="outline"
						className="border-[#404040] hover:bg-[#1c1c1c] bg-transparent"
					>
						{isLogoutLoading ? (
							<Loader2 className="w-4 h-4 mr-2 animate-spin" />
						) : (
							<LogOut className="w-4 h-4 mr-2" />
						)}
						Logout
					</Button>
				</motion.div>

				<div className="grid lg:grid-cols-3 gap-6">
					{/* Profile Card */}
					<motion.div
						initial={{ opacity: 0, x: -20 }}
						animate={{ opacity: 1, x: 0 }}
						className="lg:col-span-1"
					>
						<GlassCard depth="deep" className="p-6">
							<div className="flex items-center gap-3 mb-6">
								<div className="w-16 h-16 bg-[#0ea5e9]/20 rounded-full flex items-center justify-center">
									<User className="w-8 h-8 text-[#0ea5e9]" />
								</div>
								<div>
									<h3 className="font-bold text-lg">{user.fullName}</h3>
									<StatusBadge status={user.status} />
								</div>
							</div>

							<div className="space-y-3">
								<div>
									<label className="text-xs text-[#a3a3a3] uppercase tracking-wider">
										Matric Number
									</label>
									<p className="font-mono text-[#0ea5e9]">
										{user.matricNumber}
									</p>
								</div>

								<div>
									<label className="text-xs text-[#a3a3a3] uppercase tracking-wider">
										Department
									</label>
									<p>{user.department}</p>
								</div>

								<div>
									<label className="text-xs text-[#a3a3a3] uppercase tracking-wider">
										Voting Status
									</label>
									<p className="flex items-center gap-2">
										{isElectionLoading ? (
											<span className="w-16 h-4 bg-white/5 animate-pulse rounded" />
										) : !election ? (
											<span className="text-[#a3a3a3]">N/A</span>
										) : user.hasVoted ? (
											<>
												<CheckCircle2 className="w-4 h-4 text-[#10b981]" />
												<span className="text-[#10b981]">Vote Cast</span>
											</>
										) : (
											<span className="text-[#f59e0b]">Not Voted</span>
										)}
									</p>
								</div>
							</div>
						</GlassCard>
					</motion.div>

					{/* Main Content */}
					<div className="lg:col-span-2 space-y-6">
						{/* Countdown */}
						{election?.status === "live" && endTime && (
							<motion.div
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: 0.1 }}
							>
								<CountdownTimer endTime={endTime} />
							</motion.div>
						)}

						{/* Voting Card */}
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.2 }}
						>
							<GlassCard depth="deep" className="p-8 relative overflow-hidden">
								<div className="flex items-start justify-between mb-6">
									<div>
										<h2 className="text-2xl font-bold mb-2">
											{isElectionLoading ? (
												<span className="block w-64 h-8 bg-white/5 animate-pulse rounded" />
											) : (
												election?.title || "No Election Started Yet"
											)}
										</h2>
										<div className="text-[#a3a3a3]">
											{isElectionLoading ? (
												<div className="w-full h-4 bg-white/5 animate-pulse rounded mt-2" />
											) : (
												election?.description ||
												"There is currently no election configured in the system. Please wait for the admin to create one."
											)}
										</div>
									</div>
									{!isElectionLoading && election && (
										<StatusBadge
											status={election.status}
											pulse={election.status === "live"}
										/>
									)}
								</div>

								{election?.status === "live" && (
									<div className="grid md:grid-cols-2 gap-4 mb-6">
										<div className="p-4 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-lg">
											<p className="text-sm text-[#a3a3a3] mb-1">
												Total Positions
											</p>
											<p className="text-2xl font-bold">{totalPositions}</p>
										</div>
										<div className="p-4 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-lg">
											<p className="text-sm text-[#a3a3a3] mb-1">
												Total Candidates
											</p>
											<p className="text-2xl font-bold">{totalCandidates}</p>
										</div>
									</div>
								)}

								{election?.status === "live" && !user.hasVoted ? (
									<Link href="/vote">
										<Button className="w-full bg-[#0ea5e9] hover:bg-[#0ea5e9]/90 py-6 text-lg magnetic-hover group">
											Enter Voting Booth
											<Vote className="w-5 h-5 ml-2 group-hover:rotate-12 transition-transform" />
										</Button>
									</Link>
								) : election?.status === "live" && user.hasVoted ? (
									<div className="text-center py-6">
										<CheckCircle2 className="w-16 h-16 mx-auto mb-4 text-[#10b981]" />
										<p className="text-lg font-semibold text-[#10b981]">
											You have successfully cast your vote!
										</p>
										<p className="text-sm text-[#a3a3a3] mt-2">
											Thank you for participating in the election
										</p>
									</div>
								) : election?.status === "pending" ? (
									<div className="text-center py-6">
										<p className="text-lg font-semibold text-[#f59e0b]">
											Election Starting Soon
										</p>
										<p className="text-sm text-[#a3a3a3] mt-2">
											Please wait for the administrator to start the voting
											process
										</p>
									</div>
								) : election?.status === "closed" ? (
									<div className="text-center py-6">
										<p className="text-lg font-semibold text-[#ef4444]">
											Election Concluded
										</p>
										<p className="text-sm text-[#a3a3a3] mt-2">
											The voting period has ended. Results are now available for
											viewing.
										</p>
									</div>
								) : (
									<div className="text-center py-6 border-2 border-dashed border-black/10 dark:border-white/10 rounded-xl bg-black/5 dark:bg-white/5">
										<Vote className="w-12 h-12 mx-auto mb-3 text-[#525252]" />
										<p className="text-[#a3a3a3]">
											No active or scheduled election at this time.
										</p>
									</div>
								)}
							</GlassCard>
						</motion.div>

						{/* Results Link */}
						{!isElectionLoading && election && (
							<motion.div
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: 0.3 }}
							>
								<Link href="/results">
									<GlassCard
										depth="medium"
										className="p-6 magnetic-hover cursor-pointer group"
									>
										<div className="flex items-center justify-between">
											<div className="flex items-center gap-4">
												<div className="w-12 h-12 bg-[#10b981]/20 rounded-lg flex items-center justify-center">
													<BarChart3 className="w-6 h-6 text-[#10b981]" />
												</div>
												<div>
													<div className="flex items-center gap-2">
														<h3 className="font-bold text-lg">
															{election?.status === "closed"
																? "View Concluded Results"
																: "View Live Results"}
														</h3>
														{election?.status === "closed" && (
															<span className="px-2 py-0.5 bg-[#ef4444]/20 text-[#ef4444] text-[10px] font-bold rounded-full uppercase border border-[#ef4444]/30">
																Concluded
															</span>
														)}
													</div>
													<p className="text-sm text-[#a3a3a3]">
														{election?.status === "closed"
															? "Check the final election outcomes"
															: "See real-time election statistics"}
													</p>
												</div>
											</div>
											<motion.div
												className="text-[#0ea5e9]"
												animate={{ x: [0, 5, 0] }}
												transition={{ duration: 1.5, repeat: Infinity }}
											>
												→
											</motion.div>
										</div>
									</GlassCard>
								</Link>
							</motion.div>
						)}
					</div>
				</div>
			</div>
		</main>
	);
}
