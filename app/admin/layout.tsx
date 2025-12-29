import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <SidebarProvider>
            <div className="flex min-h-screen mesh-background w-full">
                <AdminSidebar />
                <SidebarInset className="flex flex-col bg-transparent">
                    <header className="flex h-16 shrink-0 items-center gap-2 border-b border-black/10 dark:border-white/10 px-6 backdrop-blur-md sticky top-0 z-10 bg-white/50 dark:bg-black/50">
                        <SidebarTrigger className="-ml-1" />
                        <Separator orientation="vertical" className="mr-2 h-4" />
                        <div className="flex items-center gap-2 px-2 text-sm text-muted-foreground">
                            Admin Panel System
                        </div>
                    </header>
                    <div className="flex flex-1 flex-col gap-4 p-6 overflow-hidden">
                        {children}
                    </div>
                </SidebarInset>
            </div>
        </SidebarProvider>
    )
}
