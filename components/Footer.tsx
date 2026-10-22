"use client";

import { ArrowUp, ArrowUpRight } from "lucide-react";
import { brand, navLinks, openingHours } from "@/data/barbershopData";
import { useBooking } from "@/context/booking-context";
import { useExperience } from "@/context/experience-context";
import { Emblem } from "@/components/ui/Emblem";
import { Magnetic } from "@/components/ui/Magnetic";
import { WhatsAppIcon } from "@/components/ui/BrandIcons";
import { external, whatsappLink } from "@/lib/utils";

export function Footer() {
  const { openBooking } = useBooking();
  const { scrollTo } = useExperience();
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden border-t border-line bg-obsidian pb-24 sm:pb-10">
      <div className="container-lux flex flex-col gap-16 pt-20 sm:pt-28">
        <div className="flex flex-col items-start justify-between gap-10 lg:flex-row lg:items-end">
          <h2 className="max-w-3xl text-[clamp(2.4rem,6vw,5.5rem)] leading-[0.98] font-extrabold tracking-[-0.03em] uppercase">
            Scaunul tău <span className="font-serif font-medium tracking-normal text-gold normal-case italic">te așteaptă.</span>
          </h2>
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <Magnetic>
              <button type="button" onClick={() => openBooking()} className="btn-gold min-h-14 w-full px-8 sm:w-auto">
                Programează-te
                <ArrowUpRight size={18} aria-hidden="true" />
              </button>
            </Magnetic>
            <a
              href={whatsappLink(`Bună ziua! Am o întrebare pentru ${brand.shortName}.`)}
              {...external}
              className="btn-ghost min-h-14 px-8"
            >
              <WhatsAppIcon size={18} />
              WhatsApp
            </a>
          </div>
        </div>

        <div className="grid gap-12 border-t border-line pt-14 sm:grid-cols-2 lg:grid-cols-4">
          <div className="flex flex-col gap-5">
            <Emblem size={56} className="text-gold" />
            <p className="max-w-xs text-sm leading-relaxed text-muted">{brand.tagline}</p>
          </div>

          <nav aria-label="Navigare subsol" className="flex flex-col gap-4">
            <p className="font-mono text-[11px] tracking-[0.22em] text-gold uppercase">Navigare</p>
            <ul className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={(e) => {
                      e.preventDefault();
                      scrollTo(link.href);
                    }}
                    className="inline-flex min-h-9 items-center text-sm text-alabaster/75 transition-colors hover:text-gold"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex flex-col gap-4">
            <p className="font-mono text-[11px] tracking-[0.22em] text-gold uppercase">Program</p>
            <ul className="flex flex-col gap-2 font-mono text-[13px] text-alabaster/75">
              <li className="flex justify-between gap-4">
                <span>Lun – Mar</span>
                <span>
                  {openingHours[0].open} – {openingHours[0].close}
                </span>
              </li>
              <li className="flex justify-between gap-4">
                <span>Miercuri</span>
                <span>
                  {openingHours[2].open} – {openingHours[2].close}
                </span>
              </li>
              <li className="flex justify-between gap-4">
                <span>Joi – Sâm</span>
                <span>
                  {openingHours[3].open} – {openingHours[3].close}
                </span>
              </li>
              <li className="flex justify-between gap-4 text-muted">
                <span>Duminică</span>
                <span>Închis</span>
              </li>
            </ul>
          </div>

          <div className="flex flex-col gap-4">
            <p className="font-mono text-[11px] tracking-[0.22em] text-gold uppercase">Contact</p>
            <a href={brand.mapsUrl} {...external} className="text-sm leading-relaxed text-alabaster/75 transition-colors hover:text-gold">
              {brand.street}
              <br />
              {brand.city}
            </a>
            <a href={brand.phoneHref} className="font-mono text-lg text-alabaster transition-colors hover:text-gold">
              {brand.phoneDisplay}
            </a>
          </div>
        </div>
      </div>

      <p
        aria-hidden="true"
        className="text-outline mt-16 text-center font-display text-[17vw] leading-[0.8] font-extrabold tracking-[-0.05em] whitespace-nowrap uppercase select-none"
      >
        Fade House
      </p>

      <div className="container-lux mt-10 flex flex-col-reverse items-start justify-between gap-4 border-t border-line pt-6 font-mono text-[11px] tracking-[0.12em] text-muted uppercase sm:flex-row sm:items-center">
        <p>
          © {year} {brand.name}
        </p>
        <button
          type="button"
          onClick={() => scrollTo(0)}
          className="inline-flex min-h-10 items-center gap-2 transition-colors hover:text-gold"
        >
          Înapoi sus <ArrowUp size={14} aria-hidden="true" />
        </button>
      </div>
    </footer>
  );
}
