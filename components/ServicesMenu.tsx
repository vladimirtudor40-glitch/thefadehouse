"use client";

import { useMemo, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useMotionValue, useSpring } from "framer-motion";
import { ArrowRight, ArrowUpRight, Clock } from "lucide-react";
import { serviceCategories, services, type Service, type ServiceCategoryId } from "@/data/barbershopData";
import { useBooking } from "@/context/booking-context";
import { Accent, SectionHeading } from "@/components/ui/SectionHeading";
import { easeLuxury } from "@/lib/animations";
import { cn, formatDuration, formatPrice } from "@/lib/utils";

export function ServicesMenu() {
  const { openBooking } = useBooking();
  const [active, setActive] = useState<ServiceCategoryId>("tuns");
  const [hovered, setHovered] = useState<Service | null>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const visible = useMemo(() => services.filter((s) => s.category === active), [active]);
  const category = serviceCategories.find((c) => c.id === (hovered?.category ?? active))!;

  // Floating preview card follows the mouse with a soft spring.
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 260, damping: 28, mass: 0.5 });
  const springY = useSpring(y, { stiffness: 260, damping: 28, mass: 0.5 });

  const onPointerMove = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    x.set(e.clientX + 28);
    y.set(e.clientY - 120);
  };

  return (
    <section id="servicii" className="relative border-t border-line bg-obsidian/40 py-24 sm:py-32 lg:py-40">
      <div className="container-lux">
        <div className="flex flex-col justify-between gap-10 lg:flex-row lg:items-end">
          <SectionHeading
            index="02"
            eyebrow="Meniu servicii"
            title={
              <>
                Alege-ți <Accent>ritualul.</Accent>
              </>
            }
            description="Prețuri fixe, fără surprize. Durata e orientativă: nu ne grăbim niciodată la final."
          />

          <div
            role="tablist"
            aria-label="Categorii de servicii"
            className="no-scrollbar -mx-5 flex gap-1 overflow-x-auto px-5 sm:mx-0 sm:flex-wrap sm:px-0"
          >
            {serviceCategories.map((cat) => {
              const selected = cat.id === active;
              return (
                <button
                  key={cat.id}
                  role="tab"
                  type="button"
                  aria-selected={selected}
                  aria-controls="services-panel"
                  onClick={() => setActive(cat.id)}
                  className={cn(
                    "relative min-h-11 shrink-0 rounded-full px-5 text-[13px] font-semibold tracking-wide transition-colors duration-300",
                    selected ? "text-onyx" : "text-alabaster/70 hover:text-alabaster",
                  )}
                >
                  {selected && (
                    <motion.span
                      layoutId="services-tab"
                      className="absolute inset-0 rounded-full bg-gold"
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    />
                  )}
                  {!selected && <span className="absolute inset-0 rounded-full border border-line" />}
                  <span className="relative">{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div
          id="services-panel"
          role="tabpanel"
          ref={listRef}
          onPointerMove={onPointerMove}
          onPointerLeave={() => setHovered(null)}
          className="mt-14 border-t border-line lg:mt-20"
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.ul
              key={active}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.4, ease: easeLuxury }}
            >
              {visible.map((service, i) => (
                <li key={service.id} className="border-b border-line">
                  <button
                    type="button"
                    data-cursor="book"
                    onPointerEnter={(e) => e.pointerType === "mouse" && setHovered(service)}
                    onClick={() => {
                      setHovered(null);
                      openBooking(service.id);
                    }}
                    aria-label={`${service.name}, ${formatDuration(service.duration)}, ${formatPrice(service.price)}. Programează`}
                    className="group grid w-full grid-cols-[auto_1fr_auto] items-start gap-x-4 gap-y-2 rounded-2xl px-2 py-6 text-left transition-colors duration-500 hover:bg-elevated sm:grid-cols-[3.5rem_minmax(0,1fr)_auto] sm:items-center sm:px-5 sm:py-7"
                  >
                    <span className="pt-1 font-mono text-xs text-muted transition-colors group-hover:text-gold sm:pt-0">
                      {String(i + 1).padStart(2, "0")}
                    </span>

                    <span className="flex min-w-0 flex-col gap-2">
                      <span className="flex items-center gap-3 transition-transform duration-500 ease-(--ease-luxury) group-hover:translate-x-3">
                        <ArrowRight
                          size={18}
                          aria-hidden="true"
                          className="-ml-7 hidden shrink-0 text-gold opacity-0 transition-opacity duration-300 group-hover:opacity-100 sm:block"
                        />
                        <span className="font-display text-lg leading-tight font-bold sm:text-2xl">{service.name}</span>
                        {service.featured && (
                          <span className="hidden rounded-full border border-line-gold px-2 py-0.5 font-mono text-[9px] tracking-[0.18em] text-gold uppercase md:inline">
                            Signature
                          </span>
                        )}
                      </span>
                      <span className="max-w-xl text-sm leading-relaxed text-muted transition-transform duration-500 ease-(--ease-luxury) group-hover:translate-x-3">
                        {service.description}
                      </span>
                    </span>

                    <span className="flex flex-col items-end gap-2 sm:min-w-[18rem] sm:flex-row sm:items-center sm:gap-4">
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-line px-2.5 py-1 font-mono text-[11px] text-alabaster/80">
                        <Clock size={12} aria-hidden="true" className="text-gold" />
                        {formatDuration(service.duration)}
                      </span>
                      <span className="leader hidden h-3 flex-1 sm:block" aria-hidden="true" />
                      <span className="font-mono text-lg font-medium whitespace-nowrap text-gold sm:text-xl">
                        {formatPrice(service.price)}
                      </span>
                    </span>
                  </button>
                </li>
              ))}
            </motion.ul>
          </AnimatePresence>
        </div>

        <div className="mt-10 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          <p className="max-w-md text-sm text-muted">
            Vrei mai multe servicii în aceeași vizită? Le alegi pe toate în programare, iar noi calculăm totalul și durata.
          </p>
          <button type="button" onClick={() => openBooking()} className="btn-ghost">
            Construiește-ți programarea
            <ArrowUpRight size={16} aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* Floating preview (desktop mouse only) */}
      <motion.div
        aria-hidden="true"
        style={{ x: springX, y: springY }}
        className="pointer-events-none fixed top-0 left-0 z-[70] hidden lg:block"
      >
        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ opacity: 0, scale: 0.85, rotate: -4 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.35, ease: easeLuxury }}
              className="w-60 overflow-hidden rounded-2xl border border-line-gold bg-obsidian shadow-deep"
            >
              <div className="relative aspect-[4/3]">
                <Image src={category.image} alt="" fill sizes="240px" className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-obsidian to-transparent" />
              </div>
              <div className="flex items-center justify-between gap-3 px-4 pt-1 pb-4">
                <span className="truncate font-display text-sm font-bold">{hovered.name}</span>
                <span className="font-mono text-xs text-gold">{formatPrice(hovered.price)}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}
