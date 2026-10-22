import { brand } from "@/data/barbershopData";

export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function formatPrice(value: number) {
  return `${new Intl.NumberFormat("ro-RO").format(value)} RON`;
}

export function formatDuration(minutes: number) {
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m ? `${h} h ${m} min` : `${h} h`;
}

/** wa.me deep link with a pre-filled, URL-encoded message. */
export function whatsappLink(message: string) {
  return `https://wa.me/${brand.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

/** Props for every link that leaves the site. */
export const external = { target: "_blank", rel: "noopener noreferrer" } as const;
