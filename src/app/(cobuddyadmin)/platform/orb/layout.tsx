"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

const orbNav = [
    { label: "Overview", href: "/platform/orb" },
    { label: "Asset Requests", href: "/platform/orb/assets" },
    { label: "Ballroom Requests", href: "/platform/orb/ballrooms" },
];

export default function OrbLayout({ children }: { children: ReactNode }) {
    const pathname = usePathname();

    return (
        <div className="flex flex-col gap-4 font-montserrat">
            <div className="flex items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-semibold tracking-tight font-orbitron">
                        ORB
                    </h1>
                    <p className="text-sm text-muted-foreground font-orbitron">
                        Operational Request Bridge — review and approve tenant resources.
                    </p>
                </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 border-b pb-2 text-sm">
                {orbNav.map((item) => {
                    const active =
                        item.href === "/platform/orb"
                            ? pathname === item.href
                            : pathname.startsWith(item.href);
                    return (
                        <OrbNavLink key={item.href} href={item.href} active={active}>
                            {item.label}
                        </OrbNavLink>
                    );
                })}
            </div>

            <div className="mt-2">{children}</div>
        </div>
    );
}

function OrbNavLink({
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
                "inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-medium transition-colors neon-pill",
                active && "neon-pill-active"
            )}
        >
            {children}
        </Link>
    );
}
