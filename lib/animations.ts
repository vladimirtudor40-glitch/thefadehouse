import type { Transition, Variants } from "framer-motion";

/** Luxury ease-out curve used for every tween on the site. */
export const easeLuxury = [0.22, 1, 0.36, 1] as const;

/** Soft spring for layout morphs, hovers and taps. */
export const springSoft: Transition = { type: "spring", stiffness: 100, damping: 20 };

/** Snappier spring for small UI elements (pills, buttons). */
export const springSnappy: Transition = { type: "spring", stiffness: 380, damping: 30 };

/** Shared viewport config for scroll-triggered reveals. */
export const viewportOnce = { once: true, margin: "-80px" } as const;

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: easeLuxury } },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.6, ease: easeLuxury } },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.92, y: 20 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.7, ease: easeLuxury } },
};

export const staggerContainer = (staggerChildren = 0.12, delayChildren = 0): Variants => ({
  hidden: {},
  visible: { transition: { staggerChildren, delayChildren } },
});

/** Masked line reveal: wrap each line in an overflow-hidden span. */
export const lineReveal: Variants = {
  hidden: { opacity: 0, y: "105%" },
  visible: { opacity: 1, y: "0%", transition: { duration: 0.9, ease: easeLuxury } },
};

/** Product cards entering / leaving the filtered grid. */
export const cardPresence: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: springSoft },
  exit: { opacity: 0, scale: 0.9, transition: { duration: 0.2, ease: easeLuxury } },
};

/** Mobile drawer + its staggered links. */
export const drawer: Variants = {
  hidden: { opacity: 0, y: -12, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.35, ease: easeLuxury, staggerChildren: 0.06, delayChildren: 0.08 },
  },
  exit: { opacity: 0, y: -8, scale: 0.98, transition: { duration: 0.18, ease: easeLuxury } },
};

export const drawerItem: Variants = {
  hidden: { opacity: 0, x: -16 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease: easeLuxury } },
  exit: { opacity: 0, transition: { duration: 0.1 } },
};

/** Modal backdrop + panel. */
export const backdrop: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.25 } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

export const modalPanel: Variants = {
  hidden: { opacity: 0, y: 40, scale: 0.97 },
  visible: { opacity: 1, y: 0, scale: 1, transition: springSoft },
  exit: { opacity: 0, y: 24, scale: 0.98, transition: { duration: 0.18, ease: easeLuxury } },
};

/** Button micro-interactions. */
export const buttonMotion = {
  whileHover: { scale: 1.03 },
  whileTap: { scale: 0.97 },
  transition: springSnappy,
} as const;
