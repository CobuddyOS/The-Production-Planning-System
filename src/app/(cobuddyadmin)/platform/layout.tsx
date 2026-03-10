import { CobuddyAdminSidebar } from "@/components/cobuddyadmin/app-sidebar";
import { Separator } from "@/components/ui/separator";
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { requireRole } from "@/lib/api/auth-guard";
import { redirect } from "next/navigation";

const COBUDDYADMIN_ALLOWED_ROLES = ["cobuddyadmin"] as const;

export default async function CobuddyAdminPlatformLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const result = await requireRole(COBUDDYADMIN_ALLOWED_ROLES);

    if (!result.ok) {
        const status = result.response.status;
        if (status === 401) redirect("/login");
        redirect("/debug/user");
    }

    return (
        <TooltipProvider>
            <SidebarProvider>
                <CobuddyAdminSidebar />
                <SidebarInset>
                    <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 border-b px-4">
                        <div className="flex items-center gap-2 w-full">
                            <SidebarTrigger className="-ml-1" />
                            <Separator orientation="vertical" className="mr-2 h-4" />
                            <div className="text-sm font-medium text-muted-foreground">
                                Cobuddy Admin Platform
                            </div>
                        </div>
                    </header>
                    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
                        {children}
                    </main>
                </SidebarInset>
            </SidebarProvider>
        </TooltipProvider>
    );
}

