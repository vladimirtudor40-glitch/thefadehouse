"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { Baby, Coffee, Nfc, Timer, type LucideIcon } from "lucide-react";
import { amenities, craft } from "@/data/barbershopData";
import { Accent, SectionHeading } from "@/components/ui/SectionHeading";
import { fadeUp, staggerContainer, viewportOnce } from "@/lib/animations";

const amenityIcons: Record<(typeof amenities)[number]["icon"], LucideIcon> = {
  coffee: Coffee,
  card: Nfc,
  kid: Baby,
  timer: Timer,
};

export function AboutCraft() {
  const rootRef = useRef<HTMLElement>(null);
  const words = craft.statement.split(" ");

  useEffect(() => {
    const root = rootRef.current;
    if (!root || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      // Statement lights up word by word as it scrolls through the viewport.
      gsap.fromTo(
        ".craft-word",
        { opacity: 0.16 },
        {
          opacity: 1,
          stagger: 0.05,
          ease: "none",
          scrollTrigger: { trigger: ".craft-statement", start: "top 80%", end: "bottom 45%", scrub: true },
        },
      );
      gsap.fromTo(
        ".craft-reveal",
        { clipPath: "inset(100% 0% 0% 0%)" },
        {
          clipPath: "inset(0% 0% 0% 0%)",
          duration: 1.4,
          ease: "expo.inOut",
          scrollTrigger: { trigger: ".craft-reveal", start: "top 85%" },
        },
      );
      gsap.fromTo(
        ".craft-reveal img",
        { scale: 1.35 },
        { scale: 1, duration: 1.8, ease: "expo.out", scrollTrigger: { trigger: ".craft-reveal", start: "top 85%" } },
      );
      gsap.to(".craft-float", {
        yPercent: -30,
        ease: "none",
        scrollTrigger: { trigger: root, start: "top bottom", end: "bottom top", scrub: true },
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={rootRef} id="filozofie" className="relative py-24 sm:py-32 lg:py-40">
      <div className="container-lux">
        <div className="grid gap-16 lg:grid-cols-12 lg:gap-12">
          <div className="flex flex-col gap-10 lg:col-span-6">
            <SectionHeading
              index="01"
              eyebrow="Filozofia"
              title={
                <>
                  Diferența stă în <Accent>ultimul</Accent> milimetru.
                </>
              }
            />
            <p className="craft-statement text-xl leading-[1.55] font-light text-alabaster sm:text-2xl lg:text-[1.7rem]">
              {words.map((word, i) => (
                <span key={i} className="craft-word">
                  {word}{" "}
                </span>
              ))}
            </p>
          </div>

          <div className="relative lg:col-span-6 lg:pl-10">
            <div className="craft-reveal relative aspect-[4/5] overflow-hidden rounded-3xl">
              <Image src={craft.image} alt={craft.imageAlt} fill sizes="(min-width: 1024px) 45vw, 100vw" className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-onyx/60 to-transparent" />
              <span className="absolute bottom-5 left-5 font-mono text-[11px] tracking-[0.2em] text-alabaster/80 uppercase">
                Unelte calibrate zilnic
              </span>
            </div>
            <div className="craft-float absolute -bottom-10 -left-4 hidden w-[42%] overflow-hidden rounded-2xl border-4 border-onyx shadow-deep sm:block lg:-left-6">
              <div className="relative aspect-square">
                <Image src={craft.secondaryImage} alt={craft.secondaryImageAlt} fill sizes="20vw" className="object-cover" />
              </div>
            </div>
          </div>
        </div>

        <motion.ul
          variants={staggerContainer(0.08)}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="mt-24 grid gap-px overflow-hidden rounded-3xl border border-line bg-line sm:grid-cols-2 lg:mt-32 lg:grid-cols-4"
        >
          {amenities.map((item, i) => {
            const Icon = amenityIcons[item.icon];
            return (
              <motion.li
                key={item.title}
                variants={fadeUp}
                className="group relative flex flex-col gap-5 bg-obsidian p-7 transition-colors duration-500 hover:bg-elevated sm:p-8"
              >
                <div className="flex items-center justify-between">
                  <span className="inline-flex size-12 items-center justify-center rounded-full border border-line-gold text-gold transition-colors duration-500 group-hover:bg-gold group-hover:text-onyx">
                    <Icon size={20} strokeWidth={1.6} aria-hidden="true" />
                  </span>
                  <span className="font-mono text-xs text-muted">0{i + 1}</span>
                </div>
                <h3 className="font-display text-lg font-bold">{item.title}</h3>
                <p className="text-sm leading-relaxed text-muted">{item.description}</p>
              </motion.li>
            );
          })}
        </motion.ul>
      </div>
    </section>
  );
}
