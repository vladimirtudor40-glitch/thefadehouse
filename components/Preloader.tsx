"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { useExperience } from "@/context/experience-context";
import { Emblem } from "@/components/ui/Emblem";

/**
 * Fullscreen counter 000 → 100%, then the screen splits into two curtains.
 * The hero entrance starts as the curtains begin to open.
 */
export function Preloader() {
  const experience = useExperience();
  // The timeline runs once; read the latest callbacks through a ref instead of restarting it.
  const experienceRef = useRef(experience);
  experienceRef.current = experience;
  const [done, setDone] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    experienceRef.current.setScrollLocked(true);
    const markLoaded = () => experienceRef.current.markLoaded();

    const ctx = gsap.context(() => {
      const progress = { value: 0 };
      const tl = gsap.timeline({
        onComplete: () => {
          experienceRef.current.setScrollLocked(false);
          setDone(true);
        },
      });

      tl.from(".pl-emblem", { scale: 0.6, opacity: 0, rotate: -40, duration: reduceMotion ? 0.01 : 0.9, ease: "expo.out" })
        .from(".pl-fade", { opacity: 0, y: 12, stagger: 0.08, duration: 0.6, ease: "power3.out" }, "<0.15")
        .to(
          progress,
          {
            value: 100,
            duration: reduceMotion ? 0.2 : 1.8,
            ease: "power2.inOut",
            onUpdate: () => {
              const v = Math.round(progress.value);
              if (counterRef.current) counterRef.current.textContent = String(v).padStart(3, "0");
              gsap.set(".pl-bar", { scaleX: v / 100 });
            },
          },
          "<",
        )
        .to(".pl-content", { opacity: 0, y: -16, duration: 0.45, ease: "power2.in" }, "+=0.15")
        .add(markLoaded)
        .to(".pl-top", { yPercent: -100, duration: reduceMotion ? 0.01 : 1.15, ease: "expo.inOut" }, "<0.05")
        .to(".pl-bottom", { yPercent: 100, duration: reduceMotion ? 0.01 : 1.15, ease: "expo.inOut" }, "<");
    }, root);

    return () => ctx.revert();
  }, []);

  if (done) return null;

  return (
    <div ref={rootRef} className="fixed inset-0 z-[300]" aria-hidden="true">
      <div className="pl-top absolute inset-x-0 top-0 h-1/2 border-b border-gold/20 bg-onyx" />
      <div className="pl-bottom absolute inset-x-0 bottom-0 h-1/2 bg-onyx" />

      <div className="pl-content absolute inset-0 flex flex-col items-center justify-center gap-8 px-6">
        <Emblem size={88} className="pl-emblem text-gold" />
        <div className="pl-fade flex flex-col items-center gap-2 text-center">
          <span className="font-display text-sm font-bold tracking-[0.42em] text-alabaster uppercase">The Fade House</span>
          <span className="font-mono text-[10px] tracking-[0.36em] text-muted uppercase">Barbershop · Constanța</span>
        </div>
        <div className="pl-fade flex w-56 flex-col gap-3">
          <div className="h-px w-full bg-white/10">
            <div className="pl-bar h-full origin-left scale-x-0 bg-gold" />
          </div>
          <div className="flex justify-between font-mono text-xs text-muted">
            <span>LOADING</span>
            <span className="text-gold">
              <span ref={counterRef}>000</span>%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
