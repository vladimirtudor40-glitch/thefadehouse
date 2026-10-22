import { BOOKING_DAYS_AHEAD, SLOT_STEP_MINUTES, brand, openingHours } from "@/data/barbershopData";

const DAY_MS = 86_400_000;
const weekdayIndex: Record<string, number> = { Mon: 0, Tue: 1, Wed: 2, Thu: 3, Fri: 4, Sat: 5, Sun: 6 };
const weekdayNames = ["luni", "marți", "miercuri", "joi", "vineri", "sâmbătă", "duminică"];

export interface ShopNow {
  /** 0 = Monday … 6 = Sunday, in the shop's time zone. */
  weekday: number;
  /** Minutes since midnight in the shop's time zone. */
  minutes: number;
  /** Midnight UTC of the shop's calendar date — a stable key for day arithmetic. */
  dayStamp: number;
}

export const toMinutes = (hhmm: string) => {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
};

export const fromMinutes = (total: number) =>
  `${String(Math.floor(total / 60)).padStart(2, "0")}:${String(total % 60).padStart(2, "0")}`;

/** Current weekday / time in Europe/Bucharest, whatever the visitor's own time zone. */
export function shopNow(date = new Date()): ShopNow {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat("en-GB", {
      timeZone: brand.timeZone,
      weekday: "short",
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      hourCycle: "h23",
    })
      .formatToParts(date)
      .map((p) => [p.type, p.value]),
  );
  return {
    weekday: weekdayIndex[parts.weekday] ?? 0,
    minutes: Number(parts.hour) * 60 + Number(parts.minute),
    dayStamp: Date.UTC(Number(parts.year), Number(parts.month) - 1, Number(parts.day)),
  };
}

export type OpenStatus =
  | { open: true; closesAt: string }
  | { open: false; opensLabel: string; opensAt: string };

export function getOpenStatus(now: ShopNow): OpenStatus {
  const today = openingHours[now.weekday];
  if (today.open && today.close) {
    const opens = toMinutes(today.open);
    const closes = toMinutes(today.close);
    if (now.minutes >= opens && now.minutes < closes) return { open: true, closesAt: today.close };
    if (now.minutes < opens) return { open: false, opensLabel: "azi", opensAt: today.open };
  }
  for (let offset = 1; offset <= 7; offset++) {
    const weekday = (now.weekday + offset) % 7;
    const day = openingHours[weekday];
    if (day.open) {
      return { open: false, opensLabel: offset === 1 ? "mâine" : weekdayNames[weekday], opensAt: day.open };
    }
  }
  return { open: false, opensLabel: "în curând", opensAt: "" };
}

export interface BookingDay {
  key: string;
  dayStamp: number;
  weekday: number;
  /** e.g. "joi" */
  weekdayLabel: string;
  /** e.g. "23 oct." */
  dateLabel: string;
  /** e.g. "joi, 23 octombrie" — used in the WhatsApp message. */
  longLabel: string;
  isToday: boolean;
  closed: boolean;
}

export function getBookingDays(now: ShopNow, count = BOOKING_DAYS_AHEAD): BookingDay[] {
  return Array.from({ length: count }, (_, i) => {
    const dayStamp = now.dayStamp + i * DAY_MS;
    const date = new Date(dayStamp);
    const weekday = (date.getUTCDay() + 6) % 7;
    const fmt = (opts: Intl.DateTimeFormatOptions) => date.toLocaleDateString("ro-RO", { timeZone: "UTC", ...opts });
    return {
      key: date.toISOString().slice(0, 10),
      dayStamp,
      weekday,
      weekdayLabel: i === 0 ? "azi" : i === 1 ? "mâine" : weekdayNames[weekday],
      dateLabel: fmt({ day: "numeric", month: "short" }),
      longLabel: fmt({ weekday: "long", day: "numeric", month: "long" }),
      isToday: i === 0,
      closed: !openingHours[weekday].open,
    };
  });
}

/**
 * Start times on a day where a service of `duration` minutes still ends by
 * closing time. Today's slots start at least 30 minutes from now.
 */
export function getTimeSlots(day: BookingDay, duration: number, now: ShopNow): string[] {
  const schedule = openingHours[day.weekday];
  if (!schedule.open || !schedule.close) return [];
  const start = toMinutes(schedule.open);
  const lastStart = toMinutes(schedule.close) - Math.max(duration, SLOT_STEP_MINUTES);
  const earliest = day.isToday ? now.minutes + 30 : 0;
  const slots: string[] = [];
  for (let t = start; t <= lastStart; t += SLOT_STEP_MINUTES) {
    if (t >= earliest) slots.push(fromMinutes(t));
  }
  return slots;
}
