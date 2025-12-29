"use client";

import * as React from "react";
import {
	BarChart3,
	UserCheck,
	Users,
	Vote,
	LayoutDashboard,
	ListOrdered,
	LogOut,
	ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarProvider,
	SidebarTrigger,
	SidebarGroup,
	SidebarGroupLabel,
	SidebarGroupContent,
} from "@/components/ui/sidebar";
import { authAPI } from "@/lib/api";
import { toast } from "sonner";

const items = [
	{
		title: "Overview",
		url: "/admin",
		icon: LayoutDashboard,
	},
	{
		title: "Positions",
		url: "/admin/positions",
		icon: ListOrdered,
	},
	{
		title: "Accreditation",
		url: "/admin/accreditation",
		icon: UserCheck,
	},
	{
		title: "Candidates",
		url: "/admin/candidates",
		icon: Users,
	},
	{
		title: "Live Results",
		url: "/admin/results",
		icon: BarChart3,
	},
];

export function AdminSidebar() {
	const pathname = usePathname();
	const router = useRouter();

	const handleLogout = () => {
		authAPI.logout();
		toast.success("Logged out successfully");
		router.push("/login");
	};

	return (
		<Sidebar
			variant="inset"
			collapsible="icon"
			className="border-r border-black/10 dark:border-white/10"
		>
			<SidebarHeader className="p-4">
				<div className="flex items-center gap-3">
					<div className="flex aspect-square size-10 items-center justify-center rounded-lg bg-[#0ea5e9] text-white">
						<Vote className="size-6" />
					</div>
					<div className="flex flex-col gap-0.5 leading-none group-data-[collapsible=icon]:hidden">
						<span className="font-bold text-lg text-foreground">eVote</span>
						<span className="text-xs text-muted-foreground">Admin Panel</span>
					</div>
				</div>
			</SidebarHeader>
			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupLabel className="group-data-[collapsible=icon]:hidden">
						Management
					</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu>
							{items.map((item) => (
								<SidebarMenuItem key={item.title}>
									<SidebarMenuButton
										asChild
										isActive={pathname === item.url}
										tooltip={item.title}
										className={
											pathname === item.url
												? "bg-[#0ea5e9]/10 text-[#0ea5e9]"
												: ""
										}
									>
										<Link href={item.url}>
											<item.icon className="size-5" />
											<span>{item.title}</span>
										</Link>
									</SidebarMenuButton>
								</SidebarMenuItem>
							))}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>
			<SidebarFooter className="p-4 border-t border-[#404040]/50">
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton
							onClick={handleLogout}
							tooltip="Logout"
							className="text-red-500 hover:text-red-400 hover:bg-red-500/10"
						>
							<LogOut className="size-5" />
							<span>Logout</span>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarFooter>
		</Sidebar>
	);
}
