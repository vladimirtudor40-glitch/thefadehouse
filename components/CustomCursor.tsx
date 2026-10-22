"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type CursorVariant = "default" | "link" | "book" | "explore";

const labels: Partial<Record<CursorVariant, string>> = { book: "Book", explore: "Explore" };

/**
 * Gold dot that tracks the mouse exactly, plus a ring that trails it with lerp.
 * Elements opt into a variant with `data-cursor="book" | "explore" | "link"`;
 * plain links and buttons get "link". Desktop (fine pointer) only.
 */
export function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const [variant, setVariant] = useState<CursorVariant>("default");
  const [visible, setVisible] = useState(false);
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const media = window.matchMedia("(hover: hover) and (pointer: fine)");
    const sync = () => setEnabled(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    document.documentElement.classList.add("has-custom-cursor");

    const target = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const ring = { ...target };
    let frame = 0;

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      target.x = e.clientX;
      target.y = e.clientY;
      setVisible(true);
      if (dotRef.current) dotRef.current.style.transform = `translate3d(${target.x}px, ${target.y}px, 0)`;
    };

    const onOver = (e: PointerEvent) => {
      const el = e.target instanceof Element ? e.target : null;
      const tagged = el?.closest<HTMLElement>("[data-cursor]");
      if (tagged) setVariant((tagged.dataset.cursor as CursorVariant) ?? "default");
      else setVariant(el?.closest("a, button, [role='tab'], label") ? "link" : "default");
    };

    const onLeave = () => setVisible(false);

    const loop = () => {
      ring.x += (target.x - ring.x) * 0.16;
      ring.y += (target.y - ring.y) * 0.16;
      if (ringRef.current) ringRef.current.style.transform = `translate3d(${ring.x}px, ${ring.y}px, 0)`;
      frame = requestAnimationFrame(loop);
    };
    frame = requestAnimationFrame(loop);

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerover", onOver, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerover", onOver);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      document.documentElement.classList.remove("has-custom-cursor");
    };
  }, [enabled]);

  if (!enabled) return null;

  const label = labels[variant];

  return (
    <div
      aria-hidden="true"
      className={cn("pointer-events-none fixed inset-0 z-[400] transition-opacity duration-300", visible ? "opacity-100" : "opacity-0")}
    >
      <div ref={ringRef} className="absolute top-0 left-0 will-change-transform">
        <div
          className={cn(
            "flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border transition-[width,height,background-color,border-color] duration-300 ease-(--ease-luxury)",
            variant === "default" && "size-9 border-gold/50",
            variant === "link" && "size-14 border-gold/80 bg-gold/10",
            label && "size-24 border-gold bg-gold",
          )}
        >
          <span
            className={cn(
              "font-mono text-[11px] font-medium tracking-[0.2em] text-onyx uppercase transition-opacity duration-200",
              label ? "opacity-100" : "opacity-0",
            )}
          >
            {label}
          </span>
        </div>
      </div>
      <div ref={dotRef} className="absolute top-0 left-0 will-change-transform">
        <div
          className={cn(
            "size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold transition-opacity duration-200",
            label ? "opacity-0" : "opacity-100",
          )}
        />
      </div>
    </div>
  );
}
