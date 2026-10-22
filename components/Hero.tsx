"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { brand, hero } from "@/data/barbershopData";
import { useExperience } from "@/context/experience-context";
import { useBooking } from "@/context/booking-context";
import { Magnetic } from "@/components/ui/Magnetic";
import { cn } from "@/lib/utils";

export function Hero() {
  const { loaded, scrollTo } = useExperience();
  const { openBooking } = useBooking();
  const rootRef = useRef<HTMLElement>(null);

  // Hide entrance targets before the curtains open, and wire the scroll parallax.
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const ctx = gsap.context(() => {
      gsap.set(".hero-line", { yPercent: 115 });
      gsap.set(".hero-fade", { opacity: 0, y: 24 });
      gsap.set(".hero-media", { scale: 1.25 });

      if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        gsap.to(".hero-parallax", {
          yPercent: 22,
          ease: "none",
          scrollTrigger: { trigger: root, start: "top top", end: "bottom top", scrub: true },
        });
        gsap.to(".hero-content", {
          yPercent: -18,
          opacity: 0.2,
          ease: "none",
          scrollTrigger: { trigger: root, start: "top top", end: "bottom top", scrub: true },
        });
      }
    }, root);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (!loaded || !rootRef.current) return;
    const ctx = gsap.context(() => {
      gsap
        .timeline()
        .to(".hero-media", { scale: 1, duration: 2.2, ease: "expo.out" }, 0)
        .to(".hero-line", { yPercent: 0, duration: 1.3, stagger: 0.1, ease: "expo.out" }, 0.25)
        .to(".hero-fade", { opacity: 1, y: 0, duration: 1, stagger: 0.1, ease: "power3.out" }, 0.7);
    }, rootRef.current);
    return () => ctx.kill();
  }, [loaded]);

  return (
    <section ref={rootRef} id="acasa" className="relative flex min-h-[100svh] flex-col overflow-hidden">
      {/* Photo: GSAP parallax wrapper → entrance scale → CSS Ken Burns */}
      <div className="hero-parallax absolute inset-0 -top-[10%] h-[120%]">
        <div className="hero-media relative size-full">
          <div className="relative size-full animate-ken-burns">
            <Image
              src={hero.image}
              alt={hero.imageAlt}
              fill
              priority
              sizes="100vw"
              className="object-cover object-[60%_center] brightness-[0.62] contrast-[1.08] saturate-[0.85]"
            />
          </div>
        </div>
      </div>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-onyx via-onyx/55 to-onyx/30" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-onyx/85 via-onyx/30 to-transparent" />

      <div className="hero-content container-lux relative z-10 flex flex-1 flex-col justify-end pt-32 pb-10 sm:pb-14">
        <div className="hero-fade mb-7 w-fit rounded-full p-px shimmer-border">
          <p className="rounded-full bg-onyx/90 px-4 py-2 font-mono text-[10px] tracking-[0.16em] text-alabaster uppercase sm:text-[11px] sm:tracking-[0.2em]">
            <span className="text-gold">★ 5.0</span> pe Google Maps
            <span className="mx-2 text-gold/60">•</span>
            <span className="hidden min-[400px]:inline">Peste </span>750+ recenzii
            <span className="hidden sm:inline"> verificate</span>
          </p>
        </div>

        <h1 className="text-[clamp(1.75rem,min(8.2vw,12.5vh),7.4rem)] leading-[0.94] font-extrabold tracking-[-0.03em] uppercase">
          {hero.titleLines.map((line, i) => (
            <span key={line} className="block overflow-hidden pb-[0.06em]">
              <span
                className={cn(
                  "hero-line block will-change-transform",
                  i === hero.accentLine &&
                    "font-serif text-[1.08em] leading-[0.9] font-medium tracking-[-0.01em] text-gold normal-case italic",
                )}
              >
                {line}
              </span>
            </span>
          ))}
        </h1>

        <div className="mt-8 flex flex-col gap-8 lg:mt-10 lg:flex-row lg:items-end lg:justify-between">
          <p className="hero-fade max-w-md text-base leading-relaxed text-alabaster/75 sm:text-lg">{hero.subtitle}</p>

          <div className="hero-fade flex flex-col gap-3 sm:flex-row sm:items-center">
            <Magnetic>
              <button
                type="button"
                onClick={() => openBooking()}
                data-cursor="link"
                className="btn-gold min-h-14 w-full px-8 sm:w-auto"
              >
                Programează-te acum
                <ArrowUpRight size={18} aria-hidden="true" />
              </button>
            </Magnetic>
            <a
              href="#servicii"
              onClick={(e) => {
                e.preventDefault();
                scrollTo("#servicii");
              }}
              className="btn-ghost min-h-14 px-8"
            >
              Explorează serviciile
            </a>
          </div>
        </div>

        <div className="hero-fade mt-12 hidden items-center justify-between border-t border-line pt-5 font-mono text-[11px] tracking-[0.18em] text-muted uppercase sm:flex">
          <span>{brand.street} · Constanța</span>
          <span className="hidden md:inline">{brand.coordsDisplay}</span>
          <button
            type="button"
            onClick={() => scrollTo("#filozofie")}
            className="inline-flex items-center gap-2 text-alabaster/80 transition-colors hover:text-gold"
          >
            Scroll
            <ArrowDown size={14} className="animate-bounce" aria-hidden="true" />
          </button>
        </div>
      </div>
    </section>
  );
}
