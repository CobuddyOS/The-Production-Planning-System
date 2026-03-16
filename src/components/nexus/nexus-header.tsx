"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";

export function NexusHeader() {
  return (
    <div className="flex items-center gap-3 font-montserrat">
      <SidebarTrigger className="-ml-1" />
      <span className="text-xs uppercase tracking-[0.35em] text-muted-foreground font-orbitron">
        NEXUS
      </span>
    </div>
  );
}
