"use client";

import { useEffect, useState, type MouseEvent } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { ArrowUpRight, Menu, Phone, X } from "lucide-react";
import { brand, navLinks } from "@/data/barbershopData";
import { useExperience } from "@/context/experience-context";
import { useBooking } from "@/context/booking-context";
import { Emblem } from "@/components/ui/Emblem";
import { LiveStatus } from "@/components/ui/LiveStatus";
import { Magnetic } from "@/components/ui/Magnetic";
import { easeLuxury } from "@/lib/animations";
import { cn } from "@/lib/utils";

export function Navbar() {
  const { loaded, scrollTo, setScrollLocked } = useExperience();
  const { openBooking, isOpen: bookingOpen } = useBooking();
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [pastHero, setPastHero] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Hide on scroll down, reveal on scroll up.
  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setHidden(y > prev && y > 240 && !menuOpen);
    setPastHero(y > window.innerHeight * 0.8);
  });

  useEffect(() => {
    if (!menuOpen) return;
    setScrollLocked(true);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      setScrollLocked(false);
      window.removeEventListener("keydown", onKey);
    };
  }, [menuOpen, setScrollLocked]);

  const go = (e: MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMenuOpen(false);
    // Let the menu unlock scrolling before Lenis animates.
    requestAnimationFrame(() => scrollTo(href));
  };

  const book = () => {
    setMenuOpen(false);
    openBooking();
  };

  return (
    <>
      <motion.header
        initial={{ y: -120, opacity: 0 }}
        animate={loaded ? { y: hidden ? -120 : 0, opacity: 1 } : { y: -120, opacity: 0 }}
        transition={{ duration: 0.8, ease: easeLuxury, delay: loaded && !pastHero ? 0.6 : 0 }}
        className="fixed inset-x-0 top-0 z-[60] px-3 pt-3 sm:px-5 sm:pt-4"
      >
        <nav
          aria-label="Navigare principală"
          className="glass mx-auto flex h-16 max-w-[1400px] items-center justify-between gap-4 rounded-full pr-2 pl-4 shadow-deep sm:pl-5"
        >
          <a
            href="#acasa"
            onClick={(e) => go(e, "#acasa")}
            className="flex items-center gap-3"
            aria-label={`${brand.shortName}, acasă`}
          >
            <Emblem size={34} className="text-gold" />
            <span className="flex flex-col leading-none">
              <span className="font-display text-[13px] font-bold tracking-[0.22em] whitespace-nowrap uppercase">
                The Fade House
              </span>
              <span className="mt-1 font-mono text-[9px] tracking-[0.3em] text-muted uppercase">Barbershop</span>
            </span>
          </a>

          <ul className="hidden items-center gap-1 lg:flex">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={(e) => go(e, link.href)}
                  className="group relative px-3.5 py-2 text-[13px] font-medium text-alabaster/80 transition-colors hover:text-alabaster"
                >
                  {link.label}
                  <span className="absolute inset-x-3.5 bottom-1 h-px origin-left scale-x-0 bg-gold transition-transform duration-300 ease-(--ease-luxury) group-hover:scale-x-100" />
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            <div className="hidden xl:block">
              <LiveStatus />
            </div>
            <div className="hidden sm:block">
              <Magnetic strength={0.25}>
                <button type="button" onClick={book} className="btn-gold min-h-11 px-5 text-xs">
                  Programează-te
                  <ArrowUpRight size={16} aria-hidden="true" />
                </button>
              </Magnetic>
            </div>
            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              aria-label={menuOpen ? "Închide meniul" : "Deschide meniul"}
              className="inline-flex size-12 items-center justify-center rounded-full border border-line bg-elevated text-alabaster lg:hidden"
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </nav>
      </motion.header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="mobile-menu"
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.6, ease: easeLuxury }}
            className="fixed inset-0 z-[55] flex flex-col bg-onyx px-6 pt-28 pb-8 lg:hidden"
          >
            <ul className="flex flex-col">
              {navLinks.map((link, i) => (
                <motion.li
                  key={link.href}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 + i * 0.06, duration: 0.6, ease: easeLuxury }}
                  className="border-b border-line"
                >
                  <a
                    href={link.href}
                    onClick={(e) => go(e, link.href)}
                    className="flex min-h-16 items-center justify-between font-display text-3xl font-bold uppercase"
                  >
                    {link.label}
                    <span className="font-mono text-xs text-gold">0{i + 1}</span>
                  </a>
                </motion.li>
              ))}
            </ul>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-auto flex flex-col gap-4"
            >
              <LiveStatus className="self-start" />
              <button type="button" onClick={book} className="btn-gold w-full">
                Programează-te acum
              </button>
              <a href={brand.phoneHref} className="btn-ghost w-full">
                <Phone size={16} aria-hidden="true" />
                {brand.phoneDisplay}
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* App-style booking bar on phones once the hero is out of view */}
      <AnimatePresence>
        {pastHero && !menuOpen && !bookingOpen && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ duration: 0.5, ease: easeLuxury }}
            className="fixed inset-x-3 bottom-3 z-[50] sm:hidden"
            style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
          >
            <div className="glass flex items-center gap-2 rounded-full p-1.5 shadow-deep">
              <a
                href={brand.phoneHref}
                aria-label={`Sună la ${brand.phoneDisplay}`}
                className="inline-flex size-12 shrink-0 items-center justify-center rounded-full border border-line bg-elevated text-gold"
              >
                <Phone size={18} />
              </a>
              <button type="button" onClick={book} className={cn("btn-gold min-h-12 flex-1")}>
                Programează-te
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
