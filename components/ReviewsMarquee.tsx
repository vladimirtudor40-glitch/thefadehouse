"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ArrowUpRight, Star } from "lucide-react";
import { brand, reviews, stats, type Review } from "@/data/barbershopData";
import { Accent, SectionHeading } from "@/components/ui/SectionHeading";
import { cn, external } from "@/lib/utils";

function ReviewCard({ review }: { review: Review }) {
  return (
    <figure className="flex w-[300px] shrink-0 flex-col justify-between gap-6 rounded-3xl border border-line bg-obsidian p-6 transition-colors duration-500 hover:border-line-gold hover:bg-elevated sm:w-[380px] sm:p-7">
      <div className="flex flex-col gap-4">
        <div className="flex gap-1 text-gold" aria-label="5 din 5 stele">
          {Array.from({ length: 5 }, (_, i) => (
            <Star key={i} size={14} fill="currentColor" strokeWidth={0} aria-hidden="true" />
          ))}
        </div>
        <blockquote className="text-[15px] leading-relaxed text-alabaster/90">„{review.quote}”</blockquote>
      </div>
      <figcaption className="flex items-center justify-between gap-4 border-t border-line pt-4">
        <span className="flex items-center gap-3">
          <span className="inline-flex size-9 items-center justify-center rounded-full bg-elevated font-display text-sm font-bold text-gold">
            {review.name.charAt(0)}
          </span>
          <span className="text-sm font-semibold">{review.name}</span>
        </span>
        <span className="font-mono text-[10px] tracking-[0.12em] text-muted uppercase">{review.service}</span>
      </figcaption>
    </figure>
  );
}

function MarqueeRow({ items, reverse = false }: { items: Review[]; reverse?: boolean }) {
  return (
    <div className="group flex overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_8%,black_92%,transparent)]">
      <div
        className={cn(
          "flex w-max animate-marquee gap-4 pr-4 group-hover:[animation-play-state:paused]",
          reverse && "[animation-direction:reverse]",
        )}
        style={{ "--marquee-duration": `${items.length * 9}s` } as React.CSSProperties}
      >
        {/* Two copies: the track scrolls by exactly one copy for a seamless loop. */}
        {[...items, ...items].map((review, i) => (
          <div key={`${review.id}-${i}`} aria-hidden={i >= items.length}>
            <ReviewCard review={review} />
          </div>
        ))}
      </div>
    </div>
  );
}

export function ReviewsMarquee() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(".stat-value").forEach((el) => {
        const target = Number(el.dataset.value);
        const decimals = Number(el.dataset.decimals);
        const counter = { v: 0 };
        if (!reduceMotion) el.textContent = (0).toFixed(decimals);
        gsap.to(counter, {
          v: target,
          duration: reduceMotion ? 0.01 : 2.2,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 90%", once: true },
          onUpdate: () => {
            el.textContent = counter.v.toFixed(decimals);
          },
        });
      });
    }, root);
    return () => ctx.revert();
  }, []);

  const half = Math.ceil(reviews.length / 2);

  return (
    <section ref={rootRef} id="recenzii" className="relative overflow-hidden border-t border-line bg-obsidian/40 py-24 sm:py-32 lg:py-40">
      <div className="container-lux">
        <SectionHeading
          index="04"
          eyebrow="Social proof"
          align="center"
          title={
            <>
              Peste 750 de clienți <Accent>au dat 5 stele.</Accent>
            </>
          }
        />

        <dl className="mt-16 grid gap-px overflow-hidden rounded-3xl border border-line bg-line sm:grid-cols-3 lg:mt-20">
          {stats.map((stat) => (
            <div key={stat.label} className="flex flex-col items-center gap-3 bg-onyx px-6 py-10 text-center sm:py-14">
              <dd className="font-display text-[clamp(3rem,5.2vw,5.25rem)] leading-none font-bold tracking-[-0.04em] whitespace-nowrap">
                <span className="stat-value" data-value={stat.value} data-decimals={stat.decimals}>
                  {stat.value.toFixed(stat.decimals)}
                </span>
                <span className="text-gold">{stat.suffix}</span>
              </dd>
              <dt className="order-last font-mono text-[11px] tracking-[0.24em] text-muted uppercase">{stat.label}</dt>
            </div>
          ))}
        </dl>
      </div>

      <div className="mt-16 flex flex-col gap-4 lg:mt-20">
        <MarqueeRow items={reviews.slice(0, half)} />
        <MarqueeRow items={reviews.slice(half)} reverse />
      </div>

      <div className="container-lux mt-12 flex justify-center">
        <a href={brand.mapsUrl} {...external} className="btn-ghost">
          Toate recenziile pe Google
          <ArrowUpRight size={16} aria-hidden="true" />
        </a>
      </div>
    </section>
  );
}
