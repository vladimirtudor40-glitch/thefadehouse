"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import { buttonMotion } from "@/lib/animations";

/** Anchor styled as a button with the shared hover / tap spring. */
export function MotionLink(props: HTMLMotionProps<"a">) {
  return <motion.a {...buttonMotion} {...props} />;
}

/** Native button with the shared hover / tap spring. */
export function MotionButton({ type = "button", ...props }: HTMLMotionProps<"button">) {
  return <motion.button type={type} {...buttonMotion} {...props} />;
}
