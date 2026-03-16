"use client";

import * as React from "react";
import { Circle, Command, Map } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

import { NavUser } from "@/components/nexus/nav-user";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";

const data = {
    user: {
        name: "Cobuddy Admin",
        email: "cobuddyadmin@example.com",
        avatar: "/avatars/admin.jpg",
    },
    navMain: [
        { title: "ATLAS", url: "/platform/atlas", icon: Map },
        { title: "ORB", url: "/platform/orb", icon: Circle },
    ],
};

export function CobuddyAdminSidebar({
    ...props
}: React.ComponentProps<typeof Sidebar>) {
    const pathname = usePathname();

    return (
        <Sidebar
            variant="inset"
            className="border-r border-white/5 bg-sidebar/50 backdrop-blur-xl"
            {...props}
        >
            <SidebarHeader className="border-b border-white/5 pb-2">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild className="hover:bg-white/5 transition-colors">
                            <Link href="/platform">
                                <div className="flex aspect-square size-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-blue-600 text-white shadow-[0_0_15px_oklch(0.75_0.18_190_/_0.4)]">
                                    <Command className="size-5" />
                                </div>
                                <div className="grid flex-1 text-left text-sm leading-tight ml-2">
                                    <span className="truncate font-bold tracking-tight text-white">Cobuddy Admin</span>
                                    <span className="truncate text-[10px] uppercase tracking-widest text-primary font-bold">System OS</span>
                                </div>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent className="px-2 pt-6">
                <SidebarMenu className="gap-2 group-data-[collapsible=icon]:px-0">
                    {data.navMain.map((item) => (
                        <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton
                                asChild
                                isActive={pathname.startsWith(item.url)}
                                tooltip={item.title}
                                className={cn(
                                    "relative h-11 transition-all duration-300 rounded-lg px-4",
                                    pathname.startsWith(item.url)
                                        ? "bg-primary/10 text-primary shadow-[inset_0_0_10px_oklch(0.75_0.18_190_/_0.1)] after:absolute after:left-0 after:top-2 after:bottom-2 after:w-1 after:bg-primary after:rounded-r-full after:shadow-[0_0_10px_oklch(0.75_0.18_190_/_0.5)]"
                                        : "text-muted-foreground hover:bg-white/5 hover:text-white"
                                )}
                            >
                                <Link href={item.url} className="flex items-center gap-3">
                                    <item.icon className={cn(
                                        "size-5 transition-transform duration-300",
                                        pathname.startsWith(item.url) ? "scale-110 drop-shadow-[0_0_8px_oklch(0.75_0.18_190_/_0.5)]" : ""
                                    )} />
                                    <span className="font-semibold tracking-wide text-xs">{item.title}</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    ))}
                </SidebarMenu>
            </SidebarContent>
            <SidebarFooter className="border-t border-white/5 pt-2">
                <NavUser user={data.user} />
            </SidebarFooter>
        </Sidebar>
    );
}

