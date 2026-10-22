"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";

interface BookingContextValue {
  isOpen: boolean;
  /** Service ids picked in step 1. */
  selected: string[];
  /** Opens the drawer, optionally pre-selecting a service. */
  openBooking: (serviceId?: string) => void;
  closeBooking: () => void;
  toggleService: (serviceId: string) => void;
}

const BookingContext = createContext<BookingContextValue | null>(null);

export function BookingProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);

  const openBooking = useCallback((serviceId?: string) => {
    if (serviceId) setSelected((prev) => (prev.includes(serviceId) ? prev : [...prev, serviceId]));
    setIsOpen(true);
  }, []);

  const toggleService = useCallback((serviceId: string) => {
    setSelected((prev) => (prev.includes(serviceId) ? prev.filter((id) => id !== serviceId) : [...prev, serviceId]));
  }, []);

  const closeBooking = useCallback(() => setIsOpen(false), []);

  const value = useMemo<BookingContextValue>(
    () => ({ isOpen, selected, openBooking, closeBooking, toggleService }),
    [isOpen, selected, openBooking, closeBooking, toggleService],
  );

  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>;
}

export function useBooking() {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error("useBooking trebuie folosit în interiorul <BookingProvider>.");
  return ctx;
}
