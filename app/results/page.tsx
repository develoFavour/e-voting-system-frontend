"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { GlassCard } from "@/components/ui/glass-card";
import { StatusBadge } from "@/components/ui/status-badge";
import { ArrowLeft, TrendingUp, Loader2, Crown, User } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { voteAPI, getImageUrl, authAPI } from "@/lib/api";
import { useRouter } from "next/navigation";

interface Candidate {
	name: string;
	party: string;
	votes: number;
	percentage: number;
	image: string;
}

interface PositionResult {
	position: string;
	candidates: Candidate[];
}

interface ProcessedCandidate {
	id: string;
	name: string;
	party: string;
	position: string;
	imageUrl: string;
	voteCount: number;
}

interface CandidateMap {
	[key: string]: ProcessedCandidate[];
}

export default function ResultsPage() {
	const [isLoading, setIsLoading] = useState(true);
	const [totalVotes, setTotalVotes] = useState(0);
	const [approvedVoters, setApprovedVoters] = useState(0);
	const [positionResults, setPositionResults] = useState<PositionResult[]>([]);
	const [mode, setMode] = useState<"turnout_only" | "full">("turnout_only");
	const [activePositionIndex, setActivePositionIndex] = useState(0);
	const router = useRouter();

	const fetchResults = async () => {
		try {
			const [results, approved] = await Promise.all([
				voteAPI.getLiveResults(),
				voteAPI.getApprovedVoters(),
			]);
			setTotalVotes(results.totalVotes || 0);
			setApprovedVoters(approved.approvedVoters || 0);
			setMode(results.mode || "turnout_only");

			if ((results.mode || "turnout_only") === "turnout_only") {
				setPositionResults([]);
				return;
			}

			// Process data similar to the public results page but in admin context
			const groupedResults: CandidateMap =
				results?.candidates?.reduce(
					(acc: CandidateMap, candidate: ProcessedCandidate) => {
						if (!acc[candidate.position]) acc[candidate.position] = [];
						acc[candidate.position].push(candidate);
						return acc;
					},
					{}
				) || {};

			const processedResults: PositionResult[] = Object.entries(
				groupedResults
			).map(([position, candidates]: [string, ProcessedCandidate[]]) => {
				const totalVotes = candidates.reduce(
					(sum: number, cand: ProcessedCandidate) =>
						sum + (cand.voteCount || 0),
					0
				);
				const processedCandidates = candidates
					.map((candidate: ProcessedCandidate) => {
						const percentage =
							totalVotes > 0
								? Math.round((candidate.voteCount / totalVotes) * 100)
								: 0;

						return {
							name: candidate.name,
							party: candidate.party,
							votes: candidate.voteCount,
							percentage: percentage,
							image: getImageUrl(candidate.imageUrl) || "/placeholder.svg",
						};
					})
					.sort((a: Candidate, b: Candidate) => b.votes - a.votes);

				return {
					position: position,
					candidates: processedCandidates,
				};
			});

			setPositionResults(processedResults);
		} catch (error) {
			console.error("Failed to fetch results:", error);
			toast.error("Failed to fetch election results.");
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		// Check auth first
		const user = authAPI.getCurrentUser();
		if (!user) {
			const currentPath = window.location.pathname;
			router.push(`/login?redirect=${currentPath}`);
			return;
		}

		fetchResults();
		const interval = setInterval(fetchResults, 10000); // Poll every 10s
		return () => clearInterval(interval);
	}, [router]);

	if (isLoading) {
		return (
			<main className="min-h-screen mesh-background flex items-center justify-center">
				<Loader2 className="w-12 h-12 text-[#0ea5e9] animate-spin" />
			</main>
		);
	}
	return (
		<main className="min-h-screen mesh-background py-8 px-4">
			<div className="container mx-auto max-w-6xl">
				{/* Header */}
				<motion.div
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					className="mb-8"
				>
					<Link
						href="/dashboard"
						className="inline-flex items-center text-[#0ea5e9] hover:underline mb-4"
					>
						<ArrowLeft className="w-4 h-4 mr-2" />
						Back to Dashboard
					</Link>
					<div className="flex items-center justify-between">
						<div>
							<h1 className="text-4xl font-bold mb-2 text-white">Election Results</h1>
							<p className="text-[#a3a3a3]">
								Real-time vote counting and statistics
							</p>
						</div>
						<StatusBadge
							status={mode === "full" ? "closed" : "live"}
							pulse={mode !== "full"}
						/>
					</div>
				</motion.div>

				{/* Stats Overview */}
				<div className="grid md:grid-cols-3 gap-6 mb-8">
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.1 }}
					>
						<GlassCard depth="medium" className="p-6">
							<div className="flex items-center gap-3 mb-2">
								<TrendingUp className="w-5 h-5 text-[#0ea5e9]" />
								<p className="text-sm text-[#a3a3a3]">Total Votes Cast</p>
							</div>
							<p className="text-3xl font-bold">
								{totalVotes.toLocaleString()}
							</p>
						</GlassCard>
					</motion.div>

					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.2 }}
					>
						<GlassCard depth="medium" className="p-6">
							<div className="flex items-center gap-3 mb-2">
								<TrendingUp className="w-5 h-5 text-[#10b981]" />
								<p className="text-sm text-[#a3a3a3]">Approved Voters</p>
							</div>
							<p className="text-3xl font-bold">
								{approvedVoters.toLocaleString()}
							</p>
						</GlassCard>
					</motion.div>

					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.3 }}
					>
						<GlassCard depth="medium" className="p-6">
							<div className="flex items-center gap-3 mb-2">
								<TrendingUp className="w-5 h-5 text-[#f59e0b]" />
								<p className="text-sm text-[#a3a3a3]">Voter Turnout</p>
							</div>
							<p className="text-3xl font-bold">
								{approvedVoters > 0
									? Math.round((totalVotes / approvedVoters) * 100)
									: 0}
								%
							</p>
						</GlassCard>
					</motion.div>
				</div>

				{/* Results by Position */}
				{mode === "turnout_only" ? (
					<GlassCard depth="deep" className="p-6">
						<h2 className="text-2xl font-bold mb-2">Live Turnout</h2>
						<p className="text-[#a3a3a3]">
							Candidate vote counts will be available after the election ends.
						</p>
					</GlassCard>
				) : positionResults.length > 0 ? (
					<div className="grid lg:grid-cols-12 gap-6">
						{/* Position Tabs Sidebar */}
						<div className="lg:col-span-4">
							<GlassCard depth="deep" className="p-4">
								<h3 className="text-lg font-bold mb-4">Positions</h3>
								<div className="space-y-2">
									{positionResults.map((position, index) => (
										<button
											key={position.position}
											onClick={() => setActivePositionIndex(index)}
											className={`w-full text-left p-3 rounded-lg transition-all ${activePositionIndex === index
												? "bg-[#0ea5e9] text-white"
												: "bg-[#1c1c1c] hover:bg-[#2a2a2a] text-[#a3a3a3]"
												}`}
										>
											<div className="font-medium">{position.position}</div>
											<div className="text-sm opacity-80">
												{position.candidates.length} candidates
											</div>
										</button>
									))}
								</div>
							</GlassCard>
						</div>

						{/* Selected Position Results */}
						<div className="lg:col-span-8">
							<GlassCard depth="deep" className="p-6">
								<motion.div
									key={activePositionIndex}
									initial={{ opacity: 0, x: 20 }}
									animate={{ opacity: 1, x: 0 }}
									transition={{ duration: 0.3 }}
								>
									<h2 className="text-2xl font-bold mb-6">
										{positionResults[activePositionIndex]?.position}
									</h2>

									<div className="space-y-4">
										{positionResults[activePositionIndex]?.candidates.map(
											(candidate: Candidate, candidateIndex: number) => (
												<div key={candidate.name} className="relative">
													{/* Winner Badge */}
													{candidateIndex === 0 && (
														<div className="absolute -top-2 -right-2 bg-linear-to-r from-yellow-400 to-yellow-600 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
															<Crown className="w-3 h-3" />
															Winner
														</div>
													)}

													<GlassCard depth="medium" className="p-4">
														<div className="flex items-center gap-4">
															{/* Candidate Image */}
															<div className="relative w-16 h-16 shrink-0">
																{candidate.image &&
																	!candidate.image.includes("placeholder.svg") ? (
																	<Image
																		src={candidate.image}
																		alt={candidate.name}
																		width={64}
																		height={64}
																		className="w-full h-full object-cover rounded-lg"
																		quality={80}
																		sizes="64px"
																	/>
																) : (
																	<div className="w-full h-full bg-[#1c1c1c] border border-[#404040] rounded-lg flex items-center justify-center">
																		<User className="w-8 h-8 text-[#404040]" />
																	</div>
																)}
															</div>

															{/* Candidate Info */}
															<div className="flex-1">
																<div className="flex items-center justify-between mb-2">
																	<div>
																		<p className="font-bold text-lg">
																			{candidate.name}
																		</p>
																		<p className="text-sm text-[#a3a3a3]">
																			{candidate.party}
																		</p>
																	</div>
																	<div className="text-right">
																		<p className="text-2xl font-bold text-[#0ea5e9]">
																			{candidate.votes}
																		</p>
																		<p className="text-sm text-[#a3a3a3]">
																			votes
																		</p>
																	</div>
																</div>

																{/* Progress Bar */}
																<div className="relative h-3 bg-[#0f0f0f] rounded-full overflow-hidden">
																	<motion.div
																		initial={{ width: 0 }}
																		animate={{
																			width: `${candidate.percentage}%`,
																		}}
																		transition={{
																			duration: 1,
																			delay: candidateIndex * 0.1,
																		}}
																		className={`absolute inset-y-0 left-0 rounded-full ${candidateIndex === 0
																			? "bg-linear-to-r from-yellow-400 to-yellow-600"
																			: "bg-[#0ea5e9]"
																			}`}
																	/>
																</div>

																<p className="text-right text-sm text-[#a3a3a3] mt-2">
																	{candidate.percentage}%
																</p>
															</div>
														</div>
													</GlassCard>
												</div>
											)
										)}
									</div>
								</motion.div>
							</GlassCard>
						</div>
					</div>
				) : (
					<GlassCard depth="deep" className="p-6">
						<h2 className="text-2xl font-bold mb-2">No Results Available</h2>
						<p className="text-[#a3a3a3]">
							Results will be displayed once an election concludes.
						</p>
					</GlassCard>
				)}
			</div>
		</main>
	);
}
