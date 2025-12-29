"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
	Users,
	Plus,
	X,
	Upload,
	Trash2,
	Edit2,
	User,
	GraduationCap,
	Building2,
	FileText,
	Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { adminAPI, voteAPI, getImageUrl } from "@/lib/api";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";

export default function CandidateManagementPage() {
	const [candidates, setCandidates] = useState<any[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [stagedPositions, setStagedPositions] = useState<any[]>([]);
	const [showAddModal, setShowAddModal] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const [formData, setFormData] = useState({
		name: "",
		positionId: "",
		manifesto: "",
		department: "",
		level: "400",
	});
	const [selectedImage, setSelectedImage] = useState<File | null>(null);

	const levels = ["100", "200", "300", "400", "500"];

	const fetchCandidates = async () => {
		try {
			const data = await adminAPI.getCandidates();
			setCandidates(data || []);
		} catch (error) {
			console.error("Failed to fetch candidates:", error);
			toast.error("Failed to load candidates");
			setCandidates([]);
		}

		try {
			const posData = await adminAPI.getStagedPositions();
			setStagedPositions(posData || []);
			setFormData((prev) => {
				if (prev.positionId) return prev;
				if (posData && posData.length > 0) {
					return { ...prev, positionId: posData[0].id };
				}
				return prev;
			});
		} catch (error) {
			console.error("Failed to fetch staged positions:", error);
			setStagedPositions([]);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		fetchCandidates();
	}, []);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSubmitting(true);
		try {
			const selectedPos = stagedPositions.find(
				(p) => p.id === formData.positionId
			);
			if (!selectedPos) {
				toast.error("Please create/select a position first");
				return;
			}

			const data = new FormData();
			data.append("name", formData.name);
			data.append("positionId", selectedPos.id);
			data.append("position", selectedPos.name);
			data.append("manifesto", formData.manifesto);
			data.append("department", formData.department);
			data.append("level", formData.level);
			if (selectedImage) {
				data.append("image", selectedImage);
			}

			await adminAPI.addCandidate(data);
			toast.success("Candidate added successfully!");
			setShowAddModal(false);
			fetchCandidates();
			setFormData({
				name: "",
				positionId: selectedPos?.id || "",
				manifesto: "",
				department: "",
				level: "400",
			});
			setSelectedImage(null);
		} catch (error: any) {
			toast.error(error.message || "Failed to add candidate");
		} finally {
			setIsSubmitting(false);
		}
	};

	if (isLoading) {
		return (
			<div className="flex flex-col items-center justify-center h-[60vh] gap-4">
				<Loader2 className="w-10 h-10 text-[#0ea5e9] animate-spin" />
				<p className="text-[#a3a3a3]">Loading candidates...</p>
			</div>
		);
	}

	return (
		<div className="space-y-6 animate-in fade-in duration-500">
			<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#404040]/50 pb-6">
				<div>
					<h1 className="text-3xl font-bold tracking-tight mb-1">
						Candidate Management
					</h1>
					<p className="text-[#a3a3a3]">
						Add, edit, and organize candidates for the current election.
					</p>
				</div>
				<Button
					onClick={() => setShowAddModal(true)}
					className="bg-[#0ea5e9] hover:bg-[#0ea5e9]/90 h-12 px-6 font-bold"
				>
					<Plus className="w-5 h-5 mr-2" />
					New Candidate
				</Button>
			</div>

			{/* Candidates Grid */}
			<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
				{candidates && candidates.length > 0 ? (
					candidates.map((candidate, index) => (
						<motion.div
							key={candidate.id}
							initial={{ opacity: 0, scale: 0.95 }}
							animate={{ opacity: 1, scale: 1 }}
							transition={{ delay: index * 0.05 }}
						>
							<GlassCard depth="medium" className="overflow-hidden group">
								<div className="h-32 bg-gradient-to-r from-[#0ea5e9]/20 to-[#10b981]/20 relative">
									<div className="absolute -bottom-10 left-6">
										<div className="w-20 h-20 rounded-xl border-4 border-[#1c1c1c] overflow-hidden bg-[#1c1c1c]">
											<Image
												height={100}
												width={100}
												src={
													getImageUrl(candidate.imageUrl) ||
													`https://api.dicebear.com/7.x/avataaars/svg?seed=${candidate.name}`
												}
												alt={candidate.name}
												className="w-full h-full object-cover"
											/>
										</div>
									</div>
								</div>
								<div className="pt-12 p-6">
									<div className="flex items-start justify-between mb-4">
										<div>
											<h3 className="text-xl font-bold">{candidate.name}</h3>
											<p className="text-[#0ea5e9] font-medium text-sm">
												{candidate.position}
											</p>
										</div>
										<div className="flex gap-2">
											<button className="p-2 hover:bg-white/10 rounded-lg transition-colors text-[#a3a3a3] hover:text-white">
												<Edit2 className="w-4 h-4" />
											</button>
											<button className="p-2 hover:bg-red-500/10 rounded-lg transition-colors text-[#a3a3a3] hover:text-red-500">
												<Trash2 className="w-4 h-4" />
											</button>
										</div>
									</div>

									<div className="grid grid-cols-2 gap-y-3 gap-x-4 mb-6 text-sm">
										<div className="flex items-center gap-2 text-[#a3a3a3]">
											<Building2 className="w-4 h-4" />
											<span>{candidate.department}</span>
										</div>
										<div className="flex items-center gap-2 text-[#a3a3a3]">
											<GraduationCap className="w-4 h-4" />
											<span>{candidate.level} Level</span>
										</div>
									</div>

									<div className="pt-4 border-t border-[#404040]/50">
										<p className="text-xs text-[#a3a3a3] uppercase mb-2">
											Manifesto Snippet
										</p>
										<p className="text-sm text-gray-300 line-clamp-2 italic">
											&apos;{candidate.manifesto || "No manifesto provided."}
											&apos;
										</p>
									</div>
								</div>
							</GlassCard>
						</motion.div>
					))
				) : (
					<div className="col-span-full py-20 flex flex-col items-center justify-center text-center opacity-50">
						<Users className="w-20 h-20 mb-4" />
						<h3 className="text-2xl font-bold">No candidates added yet</h3>
						<p>
							Click the &apos;New Candidate&apos; button to start building your
							election list.
						</p>
					</div>
				)}
			</div>

			{/* Add Candidate Modal */}
			<AnimatePresence>
				{showAddModal && (
					<div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							onClick={() => setShowAddModal(false)}
							className="absolute inset-0 bg-black/80 backdrop-blur-sm"
						/>
						<motion.div
							initial={{ opacity: 0, scale: 0.95, y: 20 }}
							animate={{ opacity: 1, scale: 1, y: 0 }}
							exit={{ opacity: 0, scale: 0.95, y: 20 }}
							className="relative w-full max-w-2xl bg-[#1c1c1c] border border-[#404040] rounded-2xl overflow-hidden shadow-2xl"
						>
							<div className="flex items-center justify-between p-6 border-b border-[#404040]">
								<h2 className="text-2xl font-bold">Add New Candidate</h2>
								<button
									onClick={() => setShowAddModal(false)}
									className="p-2 hover:bg-white/10 rounded-lg"
								>
									<X className="w-6 h-6" />
								</button>
							</div>

							<form onSubmit={handleSubmit} className="p-6 space-y-6">
								<div className="grid md:grid-cols-2 gap-6">
									<div className="space-y-4">
										<div>
											<label className="text-sm font-medium mb-1.5 block">
												Full Name
											</label>
											<div className="relative">
												<User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#a3a3a3]" />
												<Input
													required
													className="pl-10 bg-[#0f0f0f] border-[#404040]"
													value={formData.name}
													onChange={(e) =>
														setFormData({ ...formData, name: e.target.value })
													}
													placeholder="e.g. Jane Smith"
												/>
											</div>
										</div>

										<div>
											<label className="text-sm font-medium mb-1.5 block">
												Position
											</label>
											<select
												className="w-full bg-[#0f0f0f] border border-[#404040] rounded-lg h-10 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#0ea5e9]"
												value={formData.positionId}
												onChange={(e) =>
													setFormData({
														...formData,
														positionId: e.target.value,
													})
												}
											>
												{stagedPositions.length === 0 ? (
													<option value="">
														No positions yet - create one first
													</option>
												) : (
													stagedPositions.map((p) => (
														<option key={p.id} value={p.id}>
															{p.name}
														</option>
													))
												)}
											</select>
										</div>

										<div>
											<label className="text-sm font-medium mb-1.5 block">
												Department
											</label>
											<div className="relative">
												<Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#a3a3a3]" />
												<Input
													required
													className="pl-10 bg-[#0f0f0f] border-[#404040]"
													value={formData.department}
													onChange={(e) =>
														setFormData({
															...formData,
															department: e.target.value,
														})
													}
													placeholder="e.g. Computer Science"
												/>
											</div>
										</div>
									</div>

									<div className="space-y-4">
										<div>
											<label className="text-sm font-medium mb-1.5 block">
												Academic Level
											</label>
											<select
												className="w-full bg-[#0f0f0f] border border-[#404040] rounded-lg h-10 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#0ea5e9]"
												value={formData.level}
												onChange={(e) =>
													setFormData({ ...formData, level: e.target.value })
												}
											>
												{levels.map((l) => (
													<option key={l} value={l}>
														{l} Level
													</option>
												))}
											</select>
										</div>

										<div>
											<label className="text-sm font-medium mb-1.5 block">
												Profile Image
											</label>
											<div className="relative">
												<Upload className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#a3a3a3]" />
												<input
													type="file"
													accept="image/*"
													onChange={(e) =>
														setSelectedImage(e.target.files?.[0] || null)
													}
													className="w-full pl-10 pr-4 py-2 bg-[#0f0f0f] border border-[#404040] rounded-lg text-sm file:hidden cursor-pointer"
												/>
											</div>
											{selectedImage && (
												<p className="text-xs text-[#10b981] mt-1 truncate">
													Selected: {selectedImage.name}
												</p>
											)}
										</div>
									</div>
								</div>

								<div>
									<label className="text-sm font-medium mb-1.5 block">
										Manifesto
									</label>
									<div className="relative">
										<FileText className="absolute left-3 top-3 w-4 h-4 text-[#a3a3a3]" />
										<textarea
											className="w-full pl-10 pr-4 py-3 bg-[#0f0f0f] border border-[#404040] rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#0ea5e9] min-h-[120px]"
											value={formData.manifesto}
											onChange={(e) =>
												setFormData({ ...formData, manifesto: e.target.value })
											}
											placeholder="Introduce the candidate and their vision..."
										/>
									</div>
								</div>

								<div className="flex gap-4 pt-4">
									<Button
										type="button"
										variant="outline"
										onClick={() => setShowAddModal(false)}
										className="flex-1 bg-transparent border-[#404040]"
									>
										Cancel
									</Button>
									<Button
										type="submit"
										disabled={isSubmitting}
										className="flex-1 bg-[#0ea5e9] hover:bg-[#0ea5e9]/90 font-bold"
									>
										{isSubmitting ? (
											<Loader2 className="w-5 h-5 animate-spin" />
										) : (
											"Add Candidate"
										)}
									</Button>
								</div>
							</form>
						</motion.div>
					</div>
				)}
			</AnimatePresence>
		</div>
	);
}
