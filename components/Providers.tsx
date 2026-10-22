"use client";

import { MotionConfig } from "framer-motion";
import { ExperienceProvider } from "@/context/experience-context";
import { BookingProvider } from "@/context/booking-context";
import { Preloader } from "@/components/Preloader";
import { CustomCursor } from "@/components/CustomCursor";
import { BookingDrawer } from "@/components/BookingDrawer";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <ExperienceProvider>
        <BookingProvider>
          <Preloader />
          {children}
          <BookingDrawer />
          <CustomCursor />
          <div className="grain" aria-hidden="true" />
        </BookingProvider>
      </ExperienceProvider>
    </MotionConfig>
  );
}
