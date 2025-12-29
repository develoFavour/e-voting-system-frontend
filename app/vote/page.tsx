"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { CandidateCard } from "@/components/voting/candidate-card";
import { CountdownTimer } from "@/components/voting/countdown-timer";
import { ArrowLeft, CheckCircle2, Info, Loader2, Vote, Users } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { voteAPI, getImageUrl } from "@/lib/api";
import { useRouter } from "next/navigation";

export default function VotePage() {
	const router = useRouter();
	const [activePosition, setActivePosition] = useState("");
	const [selections, setSelections] = useState<Record<string, string>>({});
	const [showManifesto, setShowManifesto] = useState<{
		name: string;
		content: string;
	} | null>(null);
	const [showReview, setShowReview] = useState(false);
	const [candidatesByPosition, setCandidatesByPosition] = useState<
		Record<string, any[]>
	>({});
	const [positions, setPositions] = useState<{ id: string; name: string }[]>(
		[]
	);
	const [isLoading, setIsLoading] = useState(true);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [election, setElection] = useState<any>(null);
	const [hasPreviousElection, setHasPreviousElection] = useState(false);

	const missingPositions = positions.filter(
		(p) => !selections[p.id] && (candidatesByPosition[p.id] || []).length > 0
	);
	const emptyPositions = positions.filter(
		(p) => (candidatesByPosition[p.id] || []).length === 0
	);

	useEffect(() => {
		const fetchElectionAndCandidates = async () => {
			try {
				// Fetch current election status
				const electionData = await voteAPI.getCurrentElection();
				setElection(electionData.election);

				// Only fetch candidates if election is live
				if (electionData.election?.status === "live") {
					const [positionsData, candidates] = await Promise.all([
						voteAPI.getPositions(),
						voteAPI.getCandidates(),
					]);

					const posList = (positionsData || []).map((p: any) => ({
						id: p.id,
						name: p.name,
					}));
					setPositions(posList);

					// Group candidates by positionId
					const grouped: Record<string, any[]> = {};
					for (const pos of posList) {
						grouped[pos.id] = (candidates || [])
							.filter((cand: any) => cand.positionId === pos.id)
							.map((candidate: any) => ({
								id: candidate.id,
								name: candidate.name,
								party: candidate.party,
								image: getImageUrl(candidate.imageUrl) || "/placeholder.svg",
								manifesto: candidate.manifesto,
							}));
					}

					setCandidatesByPosition(grouped);
					if (posList.length > 0) {
						setActivePosition(posList[0].id);
					}
				} else if (!electionData.election) {
					// Check if there was any election at all
					const results = await voteAPI.getLiveResults();
					if (results.totalVotes > 0 || results.candidates?.length > 0) {
						setHasPreviousElection(true);
					}
				}
			} catch (error) {
				console.error("Failed to load election data:", error);
				toast.error("Failed to load election data");
			} finally {
				setIsLoading(false);
			}
		};

		fetchElectionAndCandidates();
	}, []);

	const handleSelect = (positionId: string, candidateId: string) => {
		setSelections({ ...selections, [positionId]: candidateId });
		toast.success("Selection updated");
	};

	const openReview = () => {
		if (missingPositions.length > 0) {
			toast.error(
				`Please vote all positions. Missing: ${missingPositions
					.map((p) => p.name)
					.join(", ")}`
			);
			return;
		}
		setShowReview(true);
	};

	const handleSubmit = async () => {
		if (missingPositions.length > 0) {
			toast.error("Please complete your ballot before submitting.");
			return;
		}

		setIsSubmitting(true);
		try {
			await voteAPI.castVote(selections);
			toast.success("Vote cast successfully!");
			router.push("/dashboard");
		} catch (error: any) {
			console.log("Error", error);
			toast.error(error.message || "Failed to cast vote");
		} finally {
			setIsSubmitting(false);
			setShowReview(false);
		}
	};

	const endTime = election?.end_time ? new Date(election.end_time) : null;

	// Show different states based on election status
	if (!election) {
		return (
			<main className="min-h-screen dark mesh-background flex items-center justify-center">
				<GlassCard depth="deep" className="p-8 max-w-md text-center">
					<h2 className="text-2xl font-bold mb-4">No Election Started</h2>
					<p className="text-[#a3a3a3] mb-6">
						There is currently no active or previous election record found.
						Please check back later when an election is configured.
					</p>
					<Link href="/dashboard">
						<Button className="bg-[#0ea5e9] hover:bg-[#0ea5e9]/90">
							Back to Dashboard
						</Button>
					</Link>
				</GlassCard>
			</main>
		);
	}

	if (election.status === "pending") {
		return (
			<main className="min-h-screen dark mesh-background flex items-center justify-center">
				<GlassCard depth="deep" className="p-8 max-w-md text-center">
					<h2 className="text-2xl font-bold mb-4">Election Starting Soon</h2>
					<p className="text-[#a3a3a3] mb-6">
						The election has been created but not yet started. Please wait for
						the administrator to open the voting booth.
					</p>
					<Link href="/dashboard">
						<Button className="bg-[#10b981] hover:bg-[#10b981]/90">
							Back to Dashboard
						</Button>
					</Link>
				</GlassCard>
			</main>
		);
	}

	if (election.status === "closed") {
		return (
			<main className="min-h-screen dark mesh-background flex items-center justify-center">
				<GlassCard depth="deep" className="p-8 max-w-md text-center">
					<h2 className="text-2xl font-bold mb-4">Election Concluded</h2>
					<p className="text-[#a3a3a3] mb-6">
						This election has ended. You can view the final results on the
						results page.
					</p>
					<div className="flex flex-col gap-3">
						<Link href="/results">
							<Button className="w-full bg-[#10b981] hover:bg-[#10b981]/90">
								View Results
							</Button>
						</Link>
						<Link href="/dashboard">
							<Button
								variant="outline"
								className="w-full border-[#404040] hover:bg-[#1c1c1c] bg-transparent"
							>
								Back to Dashboard
							</Button>
						</Link>
					</div>
				</GlassCard>
			</main>
		);
	}

	if (isLoading) {
		return (
			<main className="min-h-screen dark mesh-background flex items-center justify-center">
				<Loader2 className="w-12 h-12 text-[#0ea5e9] animate-spin" />
			</main>
		);
	}

	return (
		<main className="min-h-screen mesh-background py-8 px-4">
			<div className="container mx-auto max-w-7xl">
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
					<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
						<div>
							<h1 className="text-4xl font-bold mb-2 text-white">Voting Booth</h1>
							<p className="text-[#a3a3a3]">
								Select your preferred candidates for each position
							</p>
						</div>
						<div className="md:w-80">
							{endTime && <CountdownTimer endTime={endTime} />}
						</div>
					</div>
				</motion.div>

				<div className="grid lg:grid-cols-4 gap-6">
					{/* Position Tabs */}
					<div className="lg:col-span-1">
						<GlassCard depth="medium" className="p-4 sticky top-4">
							<h3 className="font-semibold mb-4 text-sm uppercase tracking-wider text-[#a3a3a3]">
								Positions
							</h3>
							<div className="space-y-2">
								{positions.map((position) => (
									<button
										key={position.id}
										onClick={() => setActivePosition(position.id)}
										className={`w-full text-left px-4 py-3 rounded-lg transition-all ${activePosition === position.id
											? "bg-[#0ea5e9] text-white"
											: "hover:bg-[#1c1c1c] text-[#a3a3a3]"
											}`}
									>
										<div className="flex items-center justify-between">
											<span className="font-medium">{position.name}</span>
											{selections[position.id] && (
												<CheckCircle2 className="w-4 h-4 text-[#10b981]" />
											)}
										</div>
									</button>
								))}
							</div>

							<Button
								onClick={openReview}
								disabled={positions.length === 0}
								className="w-full mt-6 bg-[#10b981] hover:bg-[#10b981]/90 magnetic-hover"
							>
								Review & Submit
							</Button>
						</GlassCard>
					</div>

					{/* Candidates Grid */}
					<div className="lg:col-span-3">
						<AnimatePresence mode="wait">
							<motion.div
								key={activePosition}
								initial={{ opacity: 0, x: 20 }}
								animate={{ opacity: 1, x: 0 }}
								exit={{ opacity: 0, x: -20 }}
								className="grid md:grid-cols-2 gap-6"
							>
								{candidatesByPosition[activePosition]?.length > 0 ? (
									candidatesByPosition[activePosition].map((candidate) => (
										<CandidateCard
											key={candidate.id}
											{...candidate}
											selected={selections[activePosition] === candidate.id}
											onSelect={(id) => handleSelect(activePosition, id)}
											onViewManifesto={(name, manifesto) =>
												setShowManifesto({ name, content: manifesto })
											}
										/>
									))
								) : (
									<motion.div
										initial={{ opacity: 0, scale: 0.95 }}
										animate={{ opacity: 1, scale: 1 }}
										className="col-span-full py-20 flex flex-col items-center justify-center text-center"
									>
										<div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6 border border-white/10">
											<Users className="w-10 h-10 text-[#525252]" />
										</div>
										<h3 className="text-2xl font-bold text-white mb-2">
											No Candidates Available
										</h3>
										<p className="text-[#a3a3a3] max-w-sm">
											There are currently no candidates registered for the{" "}
											<span className="text-[#0ea5e9] font-medium">
												{positions.find((p) => p.id === activePosition)?.name}
											</span>{" "}
											position. You can still proceed to vote for other sectors.
										</p>
									</motion.div>
								)}
							</motion.div>
						</AnimatePresence>
					</div>
				</div>

				{/* Manifesto Modal */}
				<AnimatePresence>
					{showManifesto && (
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
							onClick={() => setShowManifesto(null)}
						>
							<motion.div
								initial={{ scale: 0.9, opacity: 0 }}
								animate={{ scale: 1, opacity: 1 }}
								exit={{ scale: 0.9, opacity: 0 }}
								onClick={(e) => e.stopPropagation()}
								className="max-w-2xl w-full"
							>
								<GlassCard depth="deep" className="p-8">
									<h2 className="text-2xl font-bold mb-4 text-white">
										{showManifesto.name}&apos;s Manifesto
									</h2>
									<p className="text-[#d4d4d4] mb-6 leading-relaxed">
										{showManifesto.content}
									</p>
									<Button
										onClick={() => setShowManifesto(null)}
										className="w-full bg-[#0ea5e9] hover:bg-[#0ea5e9]/90 text-white font-bold"
									>
										Close
									</Button>
								</GlassCard>
							</motion.div>
						</motion.div>
					)}
				</AnimatePresence>

				{/* Review Modal */}
				<AnimatePresence>
					{showReview && (
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
							onClick={() => setShowReview(false)}
						>
							<motion.div
								initial={{ scale: 0.9, opacity: 0 }}
								animate={{ scale: 1, opacity: 1 }}
								exit={{ scale: 0.9, opacity: 0 }}
								onClick={(e) => e.stopPropagation()}
								className="max-w-2xl w-full"
							>
								<GlassCard depth="deep" className="p-8">
									<h2 className="text-2xl font-bold mb-6 text-white">
										Review Your Selections
									</h2>

									<div className="space-y-4 mb-6">
										{positions.map((position) => (
											<div
												key={position.id}
												className="flex justify-between items-center p-4 bg-white/5 border border-[#404040] rounded-lg"
											>
												<span className="font-medium text-white">
													{position.name}
												</span>
												<span className="text-[#0ea5e9]">
													{selections[position.id]
														? candidatesByPosition[position.id]?.find(
															(c) => c.id === selections[position.id]
														)?.name
														: (candidatesByPosition[position.id] || []).length ===
															0
															? "N/A (No Candidates)"
															: "Not selected"}
												</span>
											</div>
										))}
									</div>

									<div className="flex gap-3">
										<Button
											onClick={() => setShowReview(false)}
											variant="outline"
											className="flex-1 border-[#404040] hover:bg-white/5 bg-transparent text-white"
										>
											Go Back
										</Button>
										<Button
											onClick={handleSubmit}
											disabled={isSubmitting || missingPositions.length > 0}
											className="flex-1 bg-[#10b981] hover:bg-[#10b981]/90 text-white font-bold magnetic-hover disabled:opacity-50"
										>
											{isSubmitting ? (
												<Loader2 className="w-4 h-4 animate-spin" />
											) : (
												"Cast Vote"
											)}
										</Button>
									</div>
								</GlassCard>
							</motion.div>
						</motion.div>
					)}
				</AnimatePresence>
			</div>
		</main>
	);
}
