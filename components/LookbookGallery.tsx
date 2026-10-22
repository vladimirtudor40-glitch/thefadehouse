"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { gsap } from "gsap";
import { X } from "lucide-react";
import { lookbook, type LookbookItem } from "@/data/barbershopData";
import { useExperience } from "@/context/experience-context";
import { Accent, SectionHeading } from "@/components/ui/SectionHeading";
import { backdrop, modalPanel } from "@/lib/animations";
import { cn } from "@/lib/utils";

/** Bento placement per card: [mobile, desktop]. */
const layout = [
  "col-span-2 row-span-2 lg:col-span-7 lg:row-span-2",
  "col-span-1 lg:col-span-5",
  "col-span-1 lg:col-span-5",
  "col-span-1 lg:col-span-5",
  "col-span-1 lg:col-span-7",
];

function TiltCard({ item, index, onOpen }: { item: LookbookItem; index: number; onOpen: () => void }) {
  const ref = useRef<HTMLButtonElement>(null);
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const rotateX = useSpring(useTransform(py, [0, 1], [7, -7]), { stiffness: 180, damping: 20 });
  const rotateY = useSpring(useTransform(px, [0, 1], [-9, 9]), { stiffness: 180, damping: 20 });
  const glareX = useTransform(px, [0, 1], ["0%", "100%"]);
  const glareY = useTransform(py, [0, 1], ["0%", "100%"]);
  const glare = useTransform(
    [glareX, glareY],
    ([gx, gy]) => `radial-gradient(circle at ${gx} ${gy}, rgb(212 175 55 / 0.22), transparent 55%)`,
  );

  const onMove = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse" || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    px.set((e.clientX - rect.left) / rect.width);
    py.set((e.clientY - rect.top) / rect.height);
  };

  const reset = () => {
    px.set(0.5);
    py.set(0.5);
  };

  return (
    <div className={cn("lookbook-card [perspective:1200px]", layout[index])}>
      <motion.button
        ref={ref}
        type="button"
        data-cursor="explore"
        onClick={onOpen}
        onPointerMove={onMove}
        onPointerLeave={reset}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        aria-label={`Deschide ${item.title}`}
        className="lookbook-clip group relative block size-full overflow-hidden rounded-3xl bg-obsidian text-left"
      >
        <Image
          src={item.image}
          alt={item.alt}
          fill
          sizes={index === 0 ? "(min-width: 1024px) 58vw, 100vw" : "(min-width: 1024px) 42vw, 50vw"}
          className="lookbook-img object-cover grayscale-[35%] transition-[filter] duration-700 group-hover:grayscale-0"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-onyx/90 via-onyx/10 to-transparent" />
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{ background: glare }}
        />
        <div className="absolute inset-x-0 bottom-0 flex flex-col gap-1.5 p-4 sm:p-6" style={{ transform: "translateZ(40px)" }}>
          <span className="font-mono text-[10px] tracking-[0.24em] text-gold uppercase">
            {String(index + 1).padStart(2, "0")} / {String(lookbook.length).padStart(2, "0")}
          </span>
          <span className="font-display text-lg leading-tight font-bold uppercase sm:text-2xl">{item.title}</span>
          <span className="hidden max-w-xs text-sm text-alabaster/70 sm:block">{item.caption}</span>
        </div>
      </motion.button>
    </div>
  );
}

export function LookbookGallery() {
  const { setScrollLocked } = useExperience();
  const rootRef = useRef<HTMLElement>(null);
  const [openItem, setOpenItem] = useState<LookbookItem | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(".lookbook-card").forEach((card, i) => {
        gsap.fromTo(
          card.querySelector(".lookbook-clip"),
          { clipPath: "inset(100% 0% 0% 0% round 24px)" },
          {
            clipPath: "inset(0% 0% 0% 0% round 24px)",
            duration: 1.3,
            delay: (i % 3) * 0.08,
            ease: "expo.inOut",
            scrollTrigger: { trigger: card, start: "top 88%" },
          },
        );
        gsap.fromTo(
          card.querySelector(".lookbook-img"),
          { scale: 1.3 },
          { scale: 1, duration: 1.8, ease: "expo.out", scrollTrigger: { trigger: card, start: "top 88%" } },
        );
      });
    }, root);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (!openItem) return;
    setScrollLocked(true);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenItem(null);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      setScrollLocked(false);
      window.removeEventListener("keydown", onKey);
    };
  }, [openItem, setScrollLocked]);

  return (
    <section ref={rootRef} id="lookbook" className="relative py-24 sm:py-32 lg:py-40">
      <div className="container-lux">
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <SectionHeading
            index="03"
            eyebrow="The Craft · Lookbook"
            title={
              <>
                Precizie, <Accent>din orice unghi.</Accent>
              </>
            }
          />
          <p className="max-w-sm text-muted lg:text-right">
            Fiecare tunsoare e verificată în oglindă din față, din profil și din spate înainte să te ridici din scaun.
          </p>
        </div>

        <div className="mt-14 grid auto-rows-[190px] grid-cols-2 gap-3 sm:auto-rows-[240px] sm:gap-4 lg:mt-20 lg:auto-rows-[280px] lg:grid-cols-12">
          {lookbook.map((item, i) => (
            <TiltCard key={item.id} item={item} index={i} onOpen={() => setOpenItem(item)} />
          ))}
        </div>
      </div>

      <AnimatePresence>
        {openItem && (
          <motion.div className="fixed inset-0 z-[90] flex items-center justify-center p-4 sm:p-10" initial="hidden" animate="visible" exit="exit">
            <motion.div
              variants={backdrop}
              onClick={() => setOpenItem(null)}
              aria-hidden="true"
              className="absolute inset-0 bg-onyx/90 backdrop-blur-md"
            />
            <motion.figure
              role="dialog"
              aria-modal="true"
              aria-label={openItem.title}
              variants={modalPanel}
              className="relative z-10 flex max-h-full w-full max-w-5xl flex-col overflow-hidden rounded-3xl border border-line bg-obsidian"
            >
              <div className="relative aspect-[4/3] max-h-[72dvh] w-full sm:aspect-[16/10]">
                <Image src={openItem.image} alt={openItem.alt} fill sizes="90vw" className="object-cover" />
              </div>
              <figcaption className="flex items-center justify-between gap-6 p-5 sm:p-7">
                <div>
                  <p className="font-display text-xl font-bold uppercase sm:text-2xl">{openItem.title}</p>
                  <p className="mt-1 text-sm text-muted">{openItem.caption}</p>
                </div>
                <button
                  type="button"
                  autoFocus
                  onClick={() => setOpenItem(null)}
                  aria-label="Închide"
                  className="inline-flex size-12 shrink-0 items-center justify-center rounded-full border border-line text-alabaster transition-colors hover:border-gold hover:text-gold"
                >
                  <X size={20} />
                </button>
              </figcaption>
            </motion.figure>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
