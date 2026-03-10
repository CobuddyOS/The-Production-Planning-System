"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

const atlasNav = [
    { label: "Overview", href: "/platform/atlas" },
    { label: "Categories", href: "/platform/atlas/categories" },
    { label: "Assets", href: "/platform/atlas/assets" },
    { label: "Bundles", href: "/platform/atlas/bundles" },
];

export default function AtlasLayout({ children }: { children: ReactNode }) {
    const pathname = usePathname();

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">
                        Atlas
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Global asset hub for all CoBuddy equipment.
                    </p>
                </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 border-b pb-2 text-sm">
                {atlasNav.map((item) => {
                    const active =
                        item.href === "/platform/atlas"
                            ? pathname === item.href
                            : pathname.startsWith(item.href);
                    return (
                        <AtlasNavLink key={item.href} href={item.href} active={active}>
                            {item.label}
                        </AtlasNavLink>
                    );
                })}
            </div>

            <div className="mt-2">{children}</div>
        </div>
    );
}

function AtlasNavLink({
    href,
    active,
    children,
}: {
    href: string;
    active?: boolean;
    children: ReactNode;
}) {
    return (
        <Link
            href={href}
            className={cn(
                "inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
                "hover:bg-muted hover:text-foreground",
                active &&
                    "bg-foreground text-background hover:bg-foreground hover:text-background"
            )}
        >
            {children}
        </Link>
    );
}

