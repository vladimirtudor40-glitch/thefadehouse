import { brand, type Service } from "@/data/barbershopData";
import { formatDuration, formatPrice } from "@/lib/utils";

export interface BookingDetails {
  services: Service[];
  /** e.g. "joi, 23 octombrie" */
  dayLabel: string;
  time: string;
  name: string;
  note?: string;
}

export function bookingTotals(services: Service[]) {
  return {
    price: services.reduce((sum, s) => sum + s.price, 0),
    duration: services.reduce((sum, s) => sum + s.duration, 0),
  };
}

/** Romanian booking request sent through WhatsApp. */
export function formatBookingMessage({ services, dayLabel, time, name, note }: BookingDetails) {
  const { price, duration } = bookingTotals(services);
  const lines = [
    `Bună ziua! Aș dori o programare la ${brand.shortName}:`,
    "",
    "✂️ SERVICII",
    ...services.map((s) => `• ${s.name} (${formatDuration(s.duration)}) — ${formatPrice(s.price)}`),
    "",
    `📅 Ziua: ${dayLabel}`,
    `🕐 Ora: ${time}`,
    `⏱ Durată estimată: ${formatDuration(duration)}`,
    `💰 Total: ${formatPrice(price)}`,
  ];
  if (name.trim()) lines.push(`👤 Nume: ${name.trim()}`);
  if (note?.trim()) lines.push(`📝 Mențiuni: ${note.trim()}`);
  lines.push("", "Vă rog să-mi confirmați disponibilitatea. Mulțumesc!");
  return lines.join("\n");
}
