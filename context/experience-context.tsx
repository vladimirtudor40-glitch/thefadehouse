"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface ExperienceContextValue {
  /** True once the preloader curtains have opened. */
  loaded: boolean;
  markLoaded: () => void;
  /** Smooth-scrolls to a "#section" (or a number). Falls back to native scrolling. */
  scrollTo: (target: string | number) => void;
  /** Pauses inertia scrolling while a drawer or menu is open. */
  setScrollLocked: (locked: boolean) => void;
}

const ExperienceContext = createContext<ExperienceContextValue | null>(null);

const NAV_OFFSET = -88;

export function ExperienceProvider({ children }: { children: React.ReactNode }) {
  const [loaded, setLoaded] = useState(false);
  const [lenis, setLenis] = useState<Lenis | null>(null);

  // Lenis drives the scroll; GSAP's ticker drives Lenis so ScrollTrigger stays in sync.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const instance = new Lenis({ lerp: 0.09, wheelMultiplier: 0.95 });
    instance.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => instance.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    setLenis(instance);
    return () => {
      gsap.ticker.remove(tick);
      instance.destroy();
      setLenis(null);
    };
  }, []);

  const scrollTo = useCallback(
    (target: string | number) => {
      if (lenis) {
        lenis.scrollTo(target, { offset: typeof target === "string" ? NAV_OFFSET : 0, duration: 1.4 });
        return;
      }
      if (typeof target === "number") window.scrollTo({ top: target });
      else document.querySelector(target)?.scrollIntoView({ block: "start" });
    },
    [lenis],
  );

  const setScrollLocked = useCallback(
    (locked: boolean) => {
      document.documentElement.style.overflow = locked ? "hidden" : "";
      if (locked) lenis?.stop();
      else lenis?.start();
    },
    [lenis],
  );

  const markLoaded = useCallback(() => setLoaded(true), []);

  const value = useMemo<ExperienceContextValue>(
    () => ({ loaded, markLoaded, scrollTo, setScrollLocked }),
    [loaded, markLoaded, scrollTo, setScrollLocked],
  );

  return <ExperienceContext.Provider value={value}>{children}</ExperienceContext.Provider>;
}

export function useExperience() {
  const ctx = useContext(ExperienceContext);
  if (!ctx) throw new Error("useExperience trebuie folosit în interiorul <ExperienceProvider>.");
  return ctx;
}
