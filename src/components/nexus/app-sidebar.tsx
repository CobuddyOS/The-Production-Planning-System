"use client";

import * as React from "react";
import {
    Command,
    Settings2,
    Grid,
    Users,
    Inbox,
    Package,
    Map,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

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
        { title: "Dashboard", url: "/nexus", icon: Grid },
        { title: "Team", url: "/nexus/team", icon: Users },
        { title: "Requests", url: "/nexus/requests", icon: Inbox },
        { title: "Ballrooms", url: "/nexus/ballrooms", icon: Map },
        { title: "Inventory", url: "/nexus/inventory", icon: Package },
        { title: "Settings", url: "/nexus/settings", icon: Settings2 },
    ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const pathname = usePathname();

    return (
        <Sidebar variant="inset" {...props}>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/nexus">
                                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                                    <Command className="size-4" />
                                </div>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-semibold">Nexus Suite</span>
                                    <span className="truncate text-xs">Enterprise</span>
                                </div>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <SidebarMenu className="px-2 pt-4 group-data-[collapsible=icon]:px-0">
                    {data.navMain.map((item) => (
                        <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton asChild isActive={pathname === item.url} tooltip={item.title}>
                                <Link href={item.url}>
                                    <item.icon />
                                    <span>{item.title}</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    ))}
                </SidebarMenu>
            </SidebarContent>
            <SidebarFooter>
                <NavUser user={data.user} />
            </SidebarFooter>
        </Sidebar>
    );
}
