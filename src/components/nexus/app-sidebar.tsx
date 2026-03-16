"use client";

import * as React from "react";
import {
    Settings2,
    Grid,
    Users,
    Inbox,
    Package,
    Map,
} from "lucide-react";
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
        name: "Admin",
        email: "admin@example.com",
        avatar: "/avatars/admin.jpg",
    },
    navMain: [
        { title: "BALLROOMS", url: "/nexus/ballrooms", icon: Map },
        { title: "INVENTORY", url: "/nexus/inventory", icon: Package },
        { title: "REQUEST", url: "/nexus/requests", icon: Inbox },
        { title: "TEAM", url: "/nexus/team", icon: Users },
        { title: "SETTINGS", url: "/nexus/settings", icon: Settings2 },
    ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const pathname = usePathname();

    return (
        <Sidebar
            variant="inset"
            className="border-r border-white/5 bg-[radial-gradient(120%_85%_at_50%_100%,rgba(255,255,255,0.08)_0%,rgba(136,86,255,0.28)_35%,rgba(0,0,0,0.7)_70%)] backdrop-blur-xl font-montserrat"
            {...props}
        >
            <SidebarHeader className="border-b border-white/5 pb-2">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild className="hover:bg-white/5 transition-colors">
                            <Link href="/nexus/ballrooms">
                                <div className="flex h-10 w-full items-center justify-center">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src="/cobuddy_logo.png"
                                        alt="Cobuddy"
                                        className="h-25 w-auto object-contain"
                                    />
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
                                isActive={pathname === item.url}
                                tooltip={item.title}
                                className={cn(
                                    "relative h-11 transition-all duration-300 rounded-lg px-4",
                                    pathname === item.url
                                        ? "bg-primary/10 text-primary shadow-[inset_0_0_10px_oklch(0.75_0.18_190_/_0.1)] after:absolute after:left-0 after:top-2 after:bottom-2 after:w-1 after:bg-primary after:rounded-r-full after:shadow-[0_0_10px_oklch(0.75_0.18_190_/_0.5)]"
                                        : "text-muted-foreground hover:bg-white/5 hover:text-white"
                                )}
                            >
                                <Link href={item.url} className="flex items-center gap-3">
                                    <item.icon className={cn(
                                        "size-5 transition-transform duration-300",
                                        pathname === item.url ? "scale-110 drop-shadow-[0_0_8px_oklch(0.75_0.18_190_/_0.5)]" : ""
                                    )} />
                                    <span className="font-semibold tracking-wide text-xs font-montserrat">{item.title}</span>
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
