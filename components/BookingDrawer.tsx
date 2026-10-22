"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, Clock, Phone, X } from "lucide-react";
import { brand, serviceCategories, services } from "@/data/barbershopData";
import { useBooking } from "@/context/booking-context";
import { useExperience } from "@/context/experience-context";
import { WhatsAppIcon } from "@/components/ui/BrandIcons";
import { getBookingDays, getTimeSlots, shopNow, type BookingDay } from "@/lib/schedule";
import { bookingTotals, formatBookingMessage } from "@/lib/booking-message";
import { backdrop, easeLuxury } from "@/lib/animations";
import { cn, external, formatDuration, formatPrice, whatsappLink } from "@/lib/utils";

const steps = ["Servicii", "Data & ora", "Confirmare"] as const;

export function BookingDrawer() {
  const { isOpen, closeBooking } = useBooking();
  return <AnimatePresence>{isOpen && <Drawer onClose={closeBooking} />}</AnimatePresence>;
}

function Drawer({ onClose }: { onClose: () => void }) {
  const { selected, toggleService } = useBooking();
  const { setScrollLocked } = useExperience();
  const titleId = useId();
  const closeRef = useRef<HTMLButtonElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);

  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [now] = useState(() => shopNow());
  const days = useMemo(() => getBookingDays(now), [now]);
  const [dayKey, setDayKey] = useState<string | null>(null);
  const [time, setTime] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [note, setNote] = useState("");

  const chosen = useMemo(() => services.filter((s) => selected.includes(s.id)), [selected]);
  const totals = bookingTotals(chosen);
  const day = days.find((d) => d.key === dayKey) ?? null;
  const slots = useMemo(() => (day ? getTimeSlots(day, totals.duration, now) : []), [day, totals.duration, now]);

  // Default to the first day that still has a free slot for this duration.
  useEffect(() => {
    if (day && slots.length) return;
    const firstOpen = days.find((d) => !d.closed && getTimeSlots(d, totals.duration, now).length);
    setDayKey(firstOpen?.key ?? null);
  }, [day, slots.length, days, totals.duration, now]);

  // A longer selection can push the chosen slot past closing time.
  useEffect(() => {
    if (time && !slots.includes(time)) setTime(null);
  }, [slots, time]);

  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    setScrollLocked(true);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      setScrollLocked(false);
      window.removeEventListener("keydown", onKey);
      previouslyFocused?.focus();
    };
  }, [onClose, setScrollLocked]);

  const canContinue = step === 0 ? chosen.length > 0 : step === 1 ? Boolean(day && time) : name.trim().length > 1;

  const goTo = (next: number) => {
    setDirection(next > step ? 1 : -1);
    setStep(next);
    bodyRef.current?.scrollTo({ top: 0 });
  };

  const message =
    day && time ? formatBookingMessage({ services: chosen, dayLabel: day.longLabel, time, name, note }) : "";

  return (
    <motion.div className="fixed inset-0 z-[100] flex justify-end" initial="hidden" animate="visible" exit="exit">
      <motion.div
        variants={backdrop}
        onClick={onClose}
        aria-hidden="true"
        className="absolute inset-0 bg-onyx/75 backdrop-blur-sm"
      />

      <motion.aside
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ duration: 0.7, ease: easeLuxury }}
        className="relative z-10 flex h-[100dvh] w-full max-w-[540px] flex-col border-l border-line bg-obsidian shadow-deep"
      >
        <header className="flex flex-col gap-5 border-b border-line px-5 pt-5 pb-5 sm:px-8 sm:pt-7">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="eyebrow">Programare online</p>
              <h2 id={titleId} className="mt-2 text-2xl font-bold uppercase sm:text-3xl">
                {steps[step]}
              </h2>
            </div>
            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              aria-label="Închide programarea"
              className="inline-flex size-12 shrink-0 items-center justify-center rounded-full border border-line text-alabaster transition-colors hover:border-gold hover:text-gold"
            >
              <X size={20} />
            </button>
          </div>

          <ol className="grid grid-cols-3 gap-2" aria-label="Pașii programării">
            {steps.map((label, i) => (
              <li key={label} className="flex flex-col gap-2" aria-current={i === step ? "step" : undefined}>
                <span className="h-0.5 overflow-hidden rounded-full bg-white/10">
                  <motion.span
                    className="block h-full bg-gold"
                    initial={false}
                    animate={{ width: i <= step ? "100%" : "0%" }}
                    transition={{ duration: 0.5, ease: easeLuxury }}
                  />
                </span>
                <span
                  className={cn(
                    "font-mono text-[10px] tracking-[0.16em] uppercase",
                    i <= step ? "text-alabaster" : "text-muted",
                  )}
                >
                  0{i + 1} {label}
                </span>
              </li>
            ))}
          </ol>
        </header>

        <div ref={bodyRef} data-lenis-prevent className="flex-1 overflow-x-hidden overflow-y-auto overscroll-contain">
          <AnimatePresence mode="wait" custom={direction} initial={false}>
            <motion.div
              key={step}
              custom={direction}
              initial={{ opacity: 0, x: direction * 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction * -40 }}
              transition={{ duration: 0.35, ease: easeLuxury }}
              className="px-5 py-6 sm:px-8"
            >
              {step === 0 && <ServicesStep selected={selected} onToggle={toggleService} />}
              {step === 1 && (
                <ScheduleStep
                  days={days}
                  dayKey={dayKey}
                  onDay={(key) => {
                    setDayKey(key);
                    setTime(null);
                  }}
                  slots={slots}
                  time={time}
                  onTime={setTime}
                  duration={totals.duration}
                />
              )}
              {step === 2 && day && time && (
                <ConfirmStep
                  dayLabel={day.longLabel}
                  time={time}
                  chosen={chosen}
                  name={name}
                  onName={setName}
                  note={note}
                  onNote={setNote}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        <footer
          className="flex flex-col gap-4 border-t border-line bg-onyx/60 px-5 pt-4 pb-5 sm:px-8"
          style={{ paddingBottom: "max(1.25rem, env(safe-area-inset-bottom))" }}
        >
          <div className="flex items-center justify-between font-mono text-sm">
            <span className="flex items-center gap-2 text-muted">
              <Clock size={14} className="text-gold" aria-hidden="true" />
              {chosen.length ? formatDuration(totals.duration) : "—"}
            </span>
            <span className="text-muted">
              Total <span className="ml-2 text-lg text-gold">{formatPrice(totals.price)}</span>
            </span>
          </div>

          {step < 2 ? (
            <div className="flex gap-2">
              {step > 0 && (
                <button type="button" onClick={() => goTo(step - 1)} className="btn-ghost px-5" aria-label="Înapoi">
                  <ArrowLeft size={16} aria-hidden="true" />
                </button>
              )}
              <button
                type="button"
                disabled={!canContinue}
                onClick={() => goTo(step + 1)}
                className="btn-gold flex-1 disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none"
              >
                {step === 0 ? "Alege data și ora" : "Continuă"}
                <ArrowRight size={16} aria-hidden="true" />
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <div className="flex gap-2">
                <button type="button" onClick={() => goTo(1)} className="btn-ghost px-5" aria-label="Înapoi">
                  <ArrowLeft size={16} aria-hidden="true" />
                </button>
                <a
                  href={canContinue ? whatsappLink(message) : undefined}
                  {...external}
                  aria-disabled={!canContinue}
                  onClick={(e) => !canContinue && e.preventDefault()}
                  className={cn("btn-gold flex-1", !canContinue && "pointer-events-none opacity-40 shadow-none")}
                >
                  <WhatsAppIcon size={18} />
                  Confirmă prin WhatsApp
                </a>
              </div>
              <a href={brand.phoneHref} className="btn-ghost w-full">
                <Phone size={16} aria-hidden="true" />
                Sună direct ({brand.phoneDisplay})
              </a>
            </div>
          )}
        </footer>
      </motion.aside>
    </motion.div>
  );
}

function ServicesStep({ selected, onToggle }: { selected: string[]; onToggle: (id: string) => void }) {
  return (
    <div className="flex flex-col gap-8">
      <p className="text-sm text-muted">Poți alege mai multe servicii. Totalul și durata se calculează automat.</p>
      {serviceCategories.map((cat) => (
        <fieldset key={cat.id} className="flex flex-col gap-2">
          <legend className="mb-3 font-mono text-[11px] tracking-[0.22em] text-gold uppercase">{cat.label}</legend>
          {services
            .filter((s) => s.category === cat.id)
            .map((service) => {
              const checked = selected.includes(service.id);
              return (
                <label
                  key={service.id}
                  className={cn(
                    "flex cursor-pointer items-center gap-4 rounded-2xl border p-4 transition-colors duration-300",
                    checked ? "border-gold/60 bg-gold/[0.06]" : "border-line hover:border-white/15 hover:bg-elevated",
                  )}
                >
                  <input type="checkbox" checked={checked} onChange={() => onToggle(service.id)} className="peer sr-only" />
                  <span
                    className={cn(
                      "flex size-6 shrink-0 items-center justify-center rounded-md border transition-colors peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-gold",
                      checked ? "border-gold bg-gold text-onyx" : "border-white/20",
                    )}
                  >
                    {checked && <Check size={14} strokeWidth={3} aria-hidden="true" />}
                  </span>
                  <span className="flex min-w-0 flex-1 flex-col gap-1">
                    <span className="text-[15px] leading-snug font-semibold">{service.name}</span>
                    <span className="font-mono text-[11px] text-muted">{formatDuration(service.duration)}</span>
                  </span>
                  <span className="font-mono text-sm whitespace-nowrap text-gold">{formatPrice(service.price)}</span>
                </label>
              );
            })}
        </fieldset>
      ))}
    </div>
  );
}

interface ScheduleStepProps {
  days: BookingDay[];
  dayKey: string | null;
  onDay: (key: string) => void;
  slots: string[];
  time: string | null;
  onTime: (time: string) => void;
  duration: number;
}

function ScheduleStep({ days, dayKey, onDay, slots, time, onTime, duration }: ScheduleStepProps) {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-3">
        <p className="font-mono text-[11px] tracking-[0.22em] text-gold uppercase">Ziua</p>
        <div className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 pb-1 sm:-mx-8 sm:px-8" role="radiogroup" aria-label="Alege ziua">
          {days.map((d) => {
            const active = d.key === dayKey;
            return (
              <button
                key={d.key}
                type="button"
                role="radio"
                aria-checked={active}
                disabled={d.closed}
                onClick={() => onDay(d.key)}
                className={cn(
                  "flex min-w-[4.75rem] shrink-0 flex-col items-center gap-1 rounded-2xl border px-3 py-3 transition-colors duration-300",
                  active && "border-gold bg-gold text-onyx",
                  !active && !d.closed && "border-line hover:border-gold/50 hover:bg-elevated",
                  d.closed && "cursor-not-allowed border-line/50 opacity-35",
                )}
              >
                <span className={cn("text-[11px] font-semibold capitalize", active ? "text-onyx/70" : "text-muted")}>
                  {d.weekdayLabel}
                </span>
                <span className="font-mono text-sm font-medium">{d.dateLabel}</span>
                {d.closed && <span className="font-mono text-[9px] uppercase">Închis</span>}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <p className="font-mono text-[11px] tracking-[0.22em] text-gold uppercase">Ora de început</p>
        {slots.length ? (
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4" role="radiogroup" aria-label="Alege ora">
            {slots.map((slot) => {
              const active = slot === time;
              return (
                <button
                  key={slot}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  onClick={() => onTime(slot)}
                  className={cn(
                    "min-h-12 rounded-xl border font-mono text-sm transition-colors duration-300",
                    active ? "border-gold bg-gold text-onyx" : "border-line hover:border-gold/50 hover:bg-elevated",
                  )}
                >
                  {slot}
                </button>
              );
            })}
          </div>
        ) : (
          <p className="rounded-2xl border border-line p-5 text-sm text-muted">
            Nu mai sunt intervale libere în ziua aleasă pentru {formatDuration(duration)}. Alege altă zi.
          </p>
        )}
        <p className="text-xs leading-relaxed text-muted">
          Intervalele respectă programul salonului. Confirmarea finală o primești de la noi pe WhatsApp.
        </p>
      </div>
    </div>
  );
}

interface ConfirmStepProps {
  dayLabel: string;
  time: string;
  chosen: typeof services;
  name: string;
  onName: (v: string) => void;
  note: string;
  onNote: (v: string) => void;
}

function ConfirmStep({ dayLabel, time, chosen, name, onName, note, onNote }: ConfirmStepProps) {
  return (
    <div className="flex flex-col gap-7">
      <div className="rounded-3xl border border-line-gold bg-gold/[0.04] p-5">
        <p className="font-mono text-[11px] tracking-[0.22em] text-gold uppercase">Rezumat</p>
        <p className="mt-3 font-display text-xl font-bold first-letter:uppercase">
          {dayLabel} · <span className="font-mono font-medium">{time}</span>
        </p>
        <ul className="mt-4 flex flex-col gap-2 border-t border-line pt-4 text-sm">
          {chosen.map((s) => (
            <li key={s.id} className="flex justify-between gap-4">
              <span className="text-alabaster/85">{s.name}</span>
              <span className="font-mono whitespace-nowrap text-muted">{formatPrice(s.price)}</span>
            </li>
          ))}
        </ul>
      </div>

      <label className="flex flex-col gap-2">
        <span className="font-mono text-[11px] tracking-[0.22em] text-gold uppercase">Numele tău</span>
        <input
          type="text"
          value={name}
          onChange={(e) => onName(e.target.value)}
          autoComplete="name"
          placeholder="Ex: Andrei Popescu"
          className="min-h-13 rounded-2xl border border-line bg-onyx px-4 py-3.5 text-base text-alabaster placeholder:text-muted/60 focus:border-gold focus:outline-none"
        />
      </label>
      <label className="flex flex-col gap-2">
        <span className="font-mono text-[11px] tracking-[0.22em] text-gold uppercase">
          Mențiuni <span className="text-muted normal-case">(opțional)</span>
        </span>
        <textarea
          value={note}
          onChange={(e) => onNote(e.target.value)}
          rows={3}
          placeholder="Ex: barber preferat, stilul dorit, vin cu băiatul…"
          className="resize-none rounded-2xl border border-line bg-onyx px-4 py-3.5 text-base text-alabaster placeholder:text-muted/60 focus:border-gold focus:outline-none"
        />
      </label>
      <p className="text-xs leading-relaxed text-muted">
        Apăsând „Confirmă prin WhatsApp” se deschide conversația cu mesajul gata completat. Programarea e confirmată
        după ce îți răspundem.
      </p>
    </div>
  );
}
