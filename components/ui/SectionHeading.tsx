"use client";

import { motion } from "framer-motion";
import { fadeUp, staggerContainer, viewportOnce } from "@/lib/animations";
import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  index: string;
  eyebrow: string;
  title: React.ReactNode;
  description?: string;
  align?: "left" | "center";
  className?: string;
}

/** Numbered mono eyebrow + architectural display title. */
export function SectionHeading({ index, eyebrow, title, description, align = "left", className }: SectionHeadingProps) {
  return (
    <motion.div
      variants={staggerContainer(0.1)}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      className={cn("flex max-w-3xl flex-col gap-5", align === "center" && "mx-auto items-center text-center", className)}
    >
      <motion.span variants={fadeUp} className="eyebrow">
        <span className="text-muted">{index}</span>
        <span className="h-px w-8 bg-gold/50" />
        {eyebrow}
      </motion.span>
      <motion.h2
        variants={fadeUp}
        className="text-[clamp(2rem,5vw,4rem)] leading-[1.02] font-bold tracking-[-0.02em] uppercase"
      >
        {title}
      </motion.h2>
      {description && (
        <motion.p variants={fadeUp} className="max-w-xl text-base leading-relaxed text-muted sm:text-lg">
          {description}
        </motion.p>
      )}
    </motion.div>
  );
}

/** Gold italic serif accent used inside display titles. */
export function Accent({ children }: { children: React.ReactNode }) {
  return <span className="font-serif font-medium tracking-normal text-gold normal-case italic">{children}</span>;
}
