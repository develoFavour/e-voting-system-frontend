"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2, Search, Trash2, UserX, Users } from "lucide-react";
import { toast } from "sonner";

import { adminAPI } from "@/lib/api";
import { GlassCard } from "@/components/ui/glass-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";

type ManagedUserStatus = "APPROVED" | "REJECTED";

interface ManagedUser {
	id: string;
	matricNumber: string;
	fullName: string;
	email?: string;
	department: string;
	faculty: string;
	status: ManagedUserStatus;
	hasVoted: boolean;
	accreditationRejectionReason?: string;
	createdAt: string;
	updatedAt: string;
}

type StatusFilter = "ALL" | ManagedUserStatus;

export default function AdminUsersPage() {
	const [users, setUsers] = useState<ManagedUser[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [searchQuery, setSearchQuery] = useState("");
	const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
	const [userToRemove, setUserToRemove] = useState<ManagedUser | null>(null);
	const [isRemoving, setIsRemoving] = useState(false);

	const getErrorMessage = (error: unknown, fallback: string) =>
		error instanceof Error ? error.message : fallback;

	const fetchUsers = useCallback(async () => {
		try {
			const response = await adminAPI.getManagedUsers();
			setUsers(response);
		} catch (error: unknown) {
			toast.error(getErrorMessage(error, "Failed to load users"));
		} finally {
			setIsLoading(false);
		}
	}, []);

	useEffect(() => {
		fetchUsers();
	}, [fetchUsers]);

	const filteredUsers = useMemo(() => {
		const normalizedQuery = searchQuery.trim().toLowerCase();

		return users.filter((user) => {
			const matchesStatus =
				statusFilter === "ALL" || user.status === statusFilter;

			const matchesSearch =
				normalizedQuery === "" ||
				user.fullName.toLowerCase().includes(normalizedQuery) ||
				user.matricNumber.toLowerCase().includes(normalizedQuery) ||
				user.email?.toLowerCase().includes(normalizedQuery) ||
				user.department.toLowerCase().includes(normalizedQuery) ||
				user.faculty.toLowerCase().includes(normalizedQuery);

			return matchesStatus && matchesSearch;
		});
	}, [users, searchQuery, statusFilter]);

	const approvedCount = users.filter((user) => user.status === "APPROVED").length;
	const rejectedCount = users.filter((user) => user.status === "REJECTED").length;

	const handleRemoveUser = async () => {
		if (!userToRemove) return;

		setIsRemoving(true);
		try {
			await adminAPI.removeUser(userToRemove.id);
			setUsers((prev) => prev.filter((user) => user.id !== userToRemove.id));
			toast.success("User removed successfully");
			setUserToRemove(null);
		} catch (error: unknown) {
			toast.error(getErrorMessage(error, "Failed to remove user"));
		} finally {
			setIsRemoving(false);
		}
	};

	if (isLoading) {
		return (
			<div className="flex h-[60vh] flex-col items-center justify-center gap-4">
				<Loader2 className="h-10 w-10 animate-spin text-[#0ea5e9]" />
				<p className="text-[#a3a3a3]">Loading managed users...</p>
			</div>
		);
	}

	return (
		<div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
			<div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
				<div>
					<h1 className="mb-1 text-3xl font-bold tracking-tight">User Management</h1>
					<p className="text-muted-foreground">
						View approved and rejected voter accounts, and remove users when needed.
					</p>
				</div>

				<div className="grid gap-3 sm:grid-cols-3 lg:min-w-[640px]">
					<GlassCard depth="medium" className="p-4">
						<p className="text-xs uppercase tracking-wider text-muted-foreground">Managed Users</p>
						<p className="mt-2 text-2xl font-bold">{users.length}</p>
					</GlassCard>
					<GlassCard depth="medium" className="p-4">
						<p className="text-xs uppercase tracking-wider text-muted-foreground">Approved</p>
						<p className="mt-2 text-2xl font-bold text-[#10b981]">{approvedCount}</p>
					</GlassCard>
					<GlassCard depth="medium" className="p-4">
						<p className="text-xs uppercase tracking-wider text-muted-foreground">Rejected</p>
						<p className="mt-2 text-2xl font-bold text-[#ef4444]">{rejectedCount}</p>
					</GlassCard>
				</div>
			</div>

			<GlassCard depth="deep" className="p-6">
				<div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
					<div className="relative w-full lg:max-w-md">
						<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#a3a3a3]" />
						<Input
							placeholder="Search by name, matric number, email..."
							className="pl-10 bg-[#1c1c1c] border-[#404040]"
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
						/>
					</div>

					<div className="flex flex-wrap gap-2">
						{(["ALL", "APPROVED", "REJECTED"] as StatusFilter[]).map((filter) => (
							<Button
								key={filter}
								variant="outline"
								onClick={() => setStatusFilter(filter)}
								className={
									statusFilter === filter
										? "border-[#0ea5e9] bg-[#0ea5e9]/10 text-[#0ea5e9]"
										: "border-[#404040] bg-transparent"
								}
							>
								{filter === "ALL" ? "All Users" : filter}
							</Button>
						))}
					</div>
				</div>
			</GlassCard>

			<div className="grid gap-4">
				{filteredUsers.length > 0 ? (
					filteredUsers.map((user, index) => (
						<motion.div
							key={user.id}
							initial={{ opacity: 0, y: 16 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: index * 0.04 }}
						>
							<GlassCard depth="medium" className="p-6">
								<div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
									<div className="grid flex-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
										<div>
											<p className="text-xs uppercase tracking-wider text-muted-foreground">Full Name</p>
											<p className="mt-2 text-lg font-semibold">{user.fullName}</p>
										</div>
										<div>
											<p className="text-xs uppercase tracking-wider text-muted-foreground">Matric Number</p>
											<p className="mt-2 font-mono text-[#0ea5e9]">{user.matricNumber}</p>
										</div>
										<div>
											<p className="text-xs uppercase tracking-wider text-muted-foreground">Status</p>
											<div className="mt-2">
												<StatusBadge status={user.status} />
											</div>
										</div>
										<div>
											<p className="text-xs uppercase tracking-wider text-muted-foreground">Email</p>
											<p className="mt-2 break-all">{user.email || "No email"}</p>
										</div>
										<div>
											<p className="text-xs uppercase tracking-wider text-muted-foreground">Department</p>
											<p className="mt-2">{user.department}</p>
										</div>
										<div>
											<p className="text-xs uppercase tracking-wider text-muted-foreground">Faculty</p>
											<p className="mt-2">{user.faculty}</p>
										</div>
										<div>
											<p className="text-xs uppercase tracking-wider text-muted-foreground">Updated</p>
											<p className="mt-2">
												{new Date(user.updatedAt).toLocaleString(undefined, {
													dateStyle: "medium",
													timeStyle: "short",
												})}
											</p>
										</div>
										<div>
											<p className="text-xs uppercase tracking-wider text-muted-foreground">Has Voted</p>
											<p className="mt-2">{user.hasVoted ? "Yes" : "No"}</p>
										</div>
										{user.status === "REJECTED" && (
											<div className="md:col-span-2 xl:col-span-3">
												<p className="text-xs uppercase tracking-wider text-muted-foreground">Rejection Reason</p>
												<p className="mt-2 rounded-lg border border-[#ef4444]/20 bg-[#ef4444]/5 p-3 text-sm">
													{user.accreditationRejectionReason || "No reason recorded"}
												</p>
											</div>
										)}
									</div>

									<div className="flex xl:w-[220px] xl:justify-end">
										<Button
											variant="outline"
											className="w-full border-[#ef4444] bg-transparent text-[#ef4444] hover:bg-[#ef4444]/10 xl:w-auto"
											onClick={() => setUserToRemove(user)}
										>
											<Trash2 className="mr-2 h-4 w-4" />
											Remove User
										</Button>
									</div>
								</div>
							</GlassCard>
						</motion.div>
					))
				) : (
					<GlassCard
						depth="medium"
						className="flex flex-col items-center justify-center py-20 text-center"
					>
						<Users className="mb-4 h-16 w-16 text-[#a3a3a3] opacity-20" />
						<h3 className="mb-1 text-xl font-semibold">No users found</h3>
						<p className="text-[#a3a3a3]">
							There are no approved or rejected users matching your current filters.
						</p>
					</GlassCard>
				)}
			</div>

			<AnimatePresence>
				{userToRemove && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
						onClick={() => !isRemoving && setUserToRemove(null)}
					>
						<motion.div
							initial={{ scale: 0.94, opacity: 0 }}
							animate={{ scale: 1, opacity: 1 }}
							exit={{ scale: 0.94, opacity: 0 }}
							onClick={(e) => e.stopPropagation()}
							className="w-full max-w-lg"
						>
							<GlassCard depth="deep" className="p-8">
								<div className="mb-6 flex items-start gap-4">
									<div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#ef4444]/10 text-[#ef4444]">
										<UserX className="h-6 w-6" />
									</div>
									<div>
										<h2 className="text-2xl font-bold">Remove User</h2>
										<p className="mt-2 text-sm text-muted-foreground">
											This will permanently remove <strong>{userToRemove.fullName}</strong> from the database.
										</p>
									</div>
								</div>

								<div className="mb-6 rounded-lg border border-[#404040] bg-[#1c1c1c] p-4 text-sm">
									<p><span className="text-muted-foreground">Matric Number:</span> {userToRemove.matricNumber}</p>
									<p className="mt-2"><span className="text-muted-foreground">Status:</span> {userToRemove.status}</p>
								</div>

								<div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
									<Button
										variant="outline"
										className="border-[#404040] bg-transparent"
										onClick={() => setUserToRemove(null)}
										disabled={isRemoving}
									>
										Cancel
									</Button>
									<Button
										className="bg-[#ef4444] hover:bg-[#ef4444]/90"
										onClick={handleRemoveUser}
										disabled={isRemoving}
									>
										{isRemoving ? (
											<>
												<Loader2 className="mr-2 h-4 w-4 animate-spin" />
												Removing...
											</>
										) : (
											<>
												<Trash2 className="mr-2 h-4 w-4" />
												Remove User
											</>
										)}
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
