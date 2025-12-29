"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Plus, Loader2 } from "lucide-react";

import { adminAPI } from "@/lib/api";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function PositionsManagementPage() {
	const [positions, setPositions] = useState<any[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const [form, setForm] = useState({
		name: "",
		description: "",
		order: 1,
		maxSelections: 1,
	});

	const sortedPositions = useMemo(() => {
		return [...positions].sort((a, b) => {
			const ao = typeof a.order === "number" ? a.order : 0;
			const bo = typeof b.order === "number" ? b.order : 0;
			if (ao !== bo) return ao - bo;
			return String(a.name || "").localeCompare(String(b.name || ""));
		});
	}, [positions]);

	const fetchPositions = async () => {
		try {
			const data = await adminAPI.getStagedPositions();
			setPositions(data || []);
		} catch (err: any) {
			console.error("Failed to fetch staged positions:", err);
			toast.error(err?.message || "Failed to load positions");
			setPositions([]);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		fetchPositions();
	}, []);

	const handleCreate = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!form.name.trim()) {
			toast.error("Position name is required");
			return;
		}

		setIsSubmitting(true);
		try {
			await adminAPI.addPosition({
				name: form.name.trim(),
				description: form.description.trim() || undefined,
				order: Number.isFinite(form.order) ? Number(form.order) : 0,
				maxSelections: Number.isFinite(form.maxSelections)
					? Number(form.maxSelections)
					: 1,
			});
			toast.success("Position created");
			setForm({ name: "", description: "", order: 1, maxSelections: 1 });
			fetchPositions();
		} catch (err: any) {
			toast.error(err?.message || "Failed to create position");
		} finally {
			setIsSubmitting(false);
		}
	};

	if (isLoading) {
		return (
			<div className="flex flex-col items-center justify-center h-[60vh] gap-4">
				<Loader2 className="w-10 h-10 text-[#0ea5e9] animate-spin" />
				<p className="text-muted-foreground">Loading positions...</p>
			</div>
		);
	}

	return (
		<div className="space-y-6 animate-in fade-in duration-500">
			<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#404040]/50 pb-6">
				<div>
					<h1 className="text-3xl font-bold tracking-tight mb-1 text-foreground">Positions</h1>
					<p className="text-muted-foreground">
						Create positions for the next election. These positions will be
						attached when you start the election.
					</p>
				</div>
			</div>

			<GlassCard depth="deep" className="p-6">
				<form onSubmit={handleCreate} className="space-y-4">
					<div className="grid md:grid-cols-2 gap-4">
						<div>
							<label className="text-sm font-medium mb-1.5 block">Name</label>
							<Input
								required
								className="bg-white/5 dark:bg-black/20 border-black/10 dark:border-white/10"
								value={form.name}
								onChange={(e) => setForm({ ...form, name: e.target.value })}
								placeholder="e.g. President"
							/>
						</div>
						<div>
							<label className="text-sm font-medium mb-1.5 block">
								Description
							</label>
							<Input
								className="bg-white/5 dark:bg-black/20 border-black/10 dark:border-white/10"
								value={form.description}
								onChange={(e) =>
									setForm({ ...form, description: e.target.value })
								}
								placeholder="optional"
							/>
						</div>
					</div>

					<div className="grid md:grid-cols-2 gap-4">
						<div>
							<label className="text-sm font-medium mb-1.5 block">Order</label>
							<Input
								type="number"
								className="bg-white/5 dark:bg-black/20 border-black/10 dark:border-white/10"
								value={String(form.order)}
								onChange={(e) =>
									setForm({
										...form,
										order: parseInt(e.target.value || "0", 10),
									})
								}
								min={0}
							/>
						</div>
						<div>
							<label className="text-sm font-medium mb-1.5 block">
								Max selections
							</label>
							<Input
								type="number"
								className="bg-white/5 dark:bg-black/20 border-black/10 dark:border-white/10"
								value={String(form.maxSelections)}
								onChange={(e) =>
									setForm({
										...form,
										maxSelections: parseInt(e.target.value || "1", 10),
									})
								}
								min={1}
							/>
						</div>
					</div>

					<Button
						type="submit"
						disabled={isSubmitting}
						className="bg-[#0ea5e9] hover:bg-[#0ea5e9]/90 font-bold"
					>
						{isSubmitting ? (
							<Loader2 className="w-5 h-5 animate-spin" />
						) : (
							<>
								<Plus className="w-5 h-5 mr-2" />
								Create Position
							</>
						)}
					</Button>
				</form>
			</GlassCard>

			<div className="space-y-4">
				<div className="flex items-center justify-between">
					<h2 className="text-xl font-bold">Staged Positions</h2>
					<Button
						onClick={fetchPositions}
						variant="outline"
						className="bg-transparent border-[#404040]"
					>
						Refresh
					</Button>
				</div>

				{sortedPositions.length === 0 ? (
					<GlassCard depth="medium" className="p-6 text-[#a3a3a3]">
						No staged positions yet.
					</GlassCard>
				) : (
					<GlassCard depth="deep" className="p-0 overflow-hidden">
						<div className="px-6 py-4 border-b border-[#404040]/50 flex items-center justify-between">
							<div>
								<p className="text-sm text-muted-foreground">Total</p>
								<p className="text-xl font-bold text-foreground">{sortedPositions.length}</p>
							</div>
						</div>

						<div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3 text-xs text-[#a3a3a3] uppercase tracking-wide border-b border-[#404040]/50">
							<div className="col-span-6">Position</div>
							<div className="col-span-2 text-right">Order</div>
							<div className="col-span-2 text-right">Max</div>
							<div className="col-span-2 text-right">Created</div>
						</div>

						<div className="divide-y divide-[#404040]/30">
							{sortedPositions.map((p, index) => (
								<motion.div
									key={p.id}
									initial={{ opacity: 0, y: 6 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ delay: index * 0.02 }}
									className="px-6 py-4 hover:bg-white/5 transition-colors"
								>
									<div className="grid grid-cols-12 gap-4 items-start">
										<div className="col-span-12 md:col-span-6">
											<p className="text-lg font-bold leading-tight">
												{p.name}
											</p>
											{p.description ? (
												<p className="text-sm text-[#a3a3a3] mt-1 line-clamp-2">
													{p.description}
												</p>
											) : (
												<p className="text-sm text-[#a3a3a3] mt-1">
													No description
												</p>
											)}
										</div>

										<div className="col-span-6 md:col-span-2 text-left md:text-right mt-3 md:mt-0">
											<span className="inline-flex items-center px-2 py-1 rounded-md bg-white/5 border border-[#404040]/50 text-sm">
												{p.order ?? 0}
											</span>
										</div>

										<div className="col-span-6 md:col-span-2 text-right mt-3 md:mt-0">
											<span className="inline-flex items-center px-2 py-1 rounded-md bg-white/5 border border-[#404040]/50 text-sm">
												{p.maxSelections ?? 1}
											</span>
										</div>

										<div className="col-span-12 md:col-span-2 text-[#a3a3a3] text-sm text-left md:text-right mt-3 md:mt-0">
											{p.createdAt
												? new Date(p.createdAt).toLocaleDateString()
												: "-"}
										</div>
									</div>
								</motion.div>
							))}
						</div>
					</GlassCard>
				)}
			</div>
		</div>
	);
}
