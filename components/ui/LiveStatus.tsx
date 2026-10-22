"use client";

import { useEffect, useState } from "react";
import { getOpenStatus, shopNow, type OpenStatus } from "@/lib/schedule";
import { cn } from "@/lib/utils";

/** Live open / closed badge, computed in Europe/Bucharest time. Renders after mount to avoid hydration drift. */
export function LiveStatus({ className }: { className?: string }) {
  const [status, setStatus] = useState<OpenStatus | null>(null);

  useEffect(() => {
    const update = () => setStatus(getOpenStatus(shopNow()));
    update();
    const id = window.setInterval(update, 30_000);
    return () => window.clearInterval(id);
  }, []);

  const label = !status
    ? "Program"
    : status.open
      ? `Deschis acum • Până la ${status.closesAt}`
      : `Închis • Deschide ${status.opensLabel} la ${status.opensAt}`;

  return (
    <span
      role="status"
      className={cn(
        "inline-flex items-center gap-2.5 rounded-full border border-line bg-white/[0.03] px-3.5 py-1.5 font-mono text-[10.5px] font-medium tracking-[0.12em] whitespace-nowrap text-alabaster/90 uppercase transition-opacity duration-500",
        status ? "opacity-100" : "opacity-0",
        className,
      )}
    >
      <span className="relative flex size-2">
        {status?.open && <span className="absolute inset-0 animate-pulse-ring rounded-full bg-open" />}
        <span className={cn("relative size-2 rounded-full", status?.open ? "bg-open" : "bg-amber")} />
      </span>
      {label}
    </span>
  );
}
