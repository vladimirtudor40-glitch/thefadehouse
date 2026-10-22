"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, Copy, MapPin, Navigation, Phone } from "lucide-react";
import { brand, openingHours } from "@/data/barbershopData";
import { LeafletMap } from "@/components/LeafletMap";
import { LiveStatus } from "@/components/ui/LiveStatus";
import { PaymentBadges } from "@/components/ui/PaymentBadges";
import { Accent, SectionHeading } from "@/components/ui/SectionHeading";
import { shopNow } from "@/lib/schedule";
import { fadeUp, staggerContainer, viewportOnce } from "@/lib/animations";
import { cn, external } from "@/lib/utils";

export function LocationSchedule() {
  const [today, setToday] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setToday(shopNow().weekday);
  }, []);

  const copyAddress = async () => {
    try {
      await navigator.clipboard.writeText(brand.address);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard blocked — the address is still visible to copy by hand.
    }
  };

  return (
    <section id="contact" className="relative py-24 sm:py-32 lg:py-40">
      <div className="container-lux">
        <SectionHeading
          index="05"
          eyebrow="Locație & program"
          title={
            <>
              Te așteptăm <Accent>pe Brătescu.</Accent>
            </>
          }
          description="În zona centrală a Constanței. Vino cu 5 minute înainte, cafeaua e deja pregătită."
        />

        <div className="mt-14 grid gap-4 lg:mt-20 lg:grid-cols-12">
          <motion.div
            variants={staggerContainer(0.08)}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            className="card flex flex-col gap-8 p-6 sm:p-9 lg:col-span-5"
          >
            <motion.div variants={fadeUp} className="flex flex-col gap-3">
              <span className="flex items-center gap-2 font-mono text-[11px] tracking-[0.22em] text-gold uppercase">
                <MapPin size={14} aria-hidden="true" /> Adresă
              </span>
              <p className="font-display text-2xl leading-tight font-bold">
                {brand.street}
                <span className="mt-1 block text-base font-medium text-muted">
                  {brand.city} · {brand.area}
                </span>
              </p>
              <p className="font-mono text-xs tracking-wider text-muted">{brand.coordsDisplay}</p>
              <button
                type="button"
                onClick={copyAddress}
                className="inline-flex min-h-10 w-fit items-center gap-2 font-mono text-[11px] tracking-[0.16em] text-alabaster/70 uppercase transition-colors hover:text-gold"
              >
                <Copy size={13} aria-hidden="true" />
                {copied ? "Adresă copiată" : "Copiază adresa"}
              </button>
            </motion.div>

            <motion.div variants={fadeUp} className="grid gap-2 sm:grid-cols-2">
              <a href={brand.wazeUrl} {...external} className="btn-gold">
                <Navigation size={16} aria-hidden="true" />
                Deschide în Waze
              </a>
              <a href={brand.directionsUrl} {...external} className="btn-ghost">
                Google Maps
                <ArrowUpRight size={16} aria-hidden="true" />
              </a>
            </motion.div>

            <motion.a
              variants={fadeUp}
              href={brand.phoneHref}
              className="group flex items-center justify-between gap-4 rounded-2xl border border-line p-4 transition-colors hover:border-line-gold hover:bg-elevated"
            >
              <span className="flex items-center gap-3">
                <span className="inline-flex size-11 items-center justify-center rounded-full bg-gold text-onyx">
                  <Phone size={18} aria-hidden="true" />
                </span>
                <span className="flex flex-col">
                  <span className="text-xs text-muted">Telefon & WhatsApp</span>
                  <span className="font-mono text-lg">{brand.phoneDisplay}</span>
                </span>
              </span>
              <ArrowUpRight size={18} aria-hidden="true" className="text-muted transition-colors group-hover:text-gold" />
            </motion.a>

            <motion.div variants={fadeUp} className="flex flex-col gap-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="font-mono text-[11px] tracking-[0.22em] text-gold uppercase">Program</span>
                <LiveStatus />
              </div>
              <dl className="flex flex-col">
                {openingHours.map((h, i) => {
                  const isToday = i === today;
                  return (
                    <div
                      key={h.day}
                      className={cn(
                        "flex items-center justify-between gap-4 border-b border-line px-3 py-2.5 text-sm transition-colors last:border-0",
                        isToday && "rounded-xl border-transparent bg-gold/10",
                      )}
                    >
                      <dt className={cn("flex items-center gap-2", isToday ? "font-semibold text-gold" : "text-alabaster/80")}>
                        {h.day}
                        {isToday && <span className="font-mono text-[9px] tracking-[0.2em] uppercase">· Azi</span>}
                      </dt>
                      <dd className={cn("font-mono", isToday ? "text-gold" : h.open ? "text-alabaster/80" : "text-muted")}>
                        {h.open ? `${h.open} – ${h.close}` : "Închis"}
                      </dd>
                    </div>
                  );
                })}
              </dl>
            </motion.div>

            <motion.div variants={fadeUp} className="flex flex-col gap-3">
              <span className="font-mono text-[11px] tracking-[0.22em] text-gold uppercase">Plată</span>
              <PaymentBadges />
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="relative min-h-[420px] overflow-hidden rounded-3xl border border-line lg:col-span-7 lg:min-h-0"
          >
            <LeafletMap className="absolute inset-0 z-0" />
            <div className="pointer-events-none absolute inset-x-0 top-0 z-[500] flex justify-end p-4 font-mono text-[10px] tracking-[0.2em] text-alabaster/70 uppercase">
              <span className="rounded-full bg-onyx/80 px-3 py-1.5 backdrop-blur">{brand.coordsDisplay}</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
