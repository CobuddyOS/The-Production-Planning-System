import { AppSidebar } from "@/components/nexus/app-sidebar";
import {
    SidebarInset,
    SidebarProvider,
} from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { requireRole } from "@/lib/api/auth-guard";
import { ADMIN_ALLOWED_ROLES } from "@/features/admin";
import { redirect } from "next/navigation";
import { NexusHeader } from "@/components/nexus/nexus-header";

export default async function NexusLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const result = await requireRole(ADMIN_ALLOWED_ROLES);

    if (!result.ok) {
        const status = result.response.status;
        if (status === 401) {
            redirect("/login");
        }

        redirect("/debug/user");
    }

    return (
        <TooltipProvider>
            <SidebarProvider>
                <AppSidebar />
                <SidebarInset>
                    <header className="px-4 pt-4">
                        <NexusHeader />
                    </header>
                    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
                        {children}
                    </main>
                </SidebarInset>
            </SidebarProvider>
        </TooltipProvider>
    );
}
