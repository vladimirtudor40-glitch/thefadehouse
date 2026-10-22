/**
 * Central content configuration for The Fade House - Barbershop.
 * Edit texts, prices (RON), schedule, contact details and images here —
 * every section of the site reads from this file.
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type ServiceCategoryId = "tuns" | "pachete" | "barba" | "junior";

export interface ServiceCategory {
  id: ServiceCategoryId;
  label: string;
  /** Photo shown in the floating hover preview of the services menu. */
  image: string;
  imageAlt: string;
}

export interface Service {
  id: string;
  category: ServiceCategoryId;
  name: string;
  description: string;
  /** Minutes. */
  duration: number;
  /** RON. */
  price: number;
  featured?: boolean;
}

export interface DaySchedule {
  day: string;
  /** "HH:MM" in Europe/Bucharest, or null when closed. */
  open: string | null;
  close: string | null;
}

export interface LookbookItem {
  id: string;
  title: string;
  caption: string;
  image: string;
  alt: string;
}

export interface Review {
  id: string;
  name: string;
  quote: string;
  service: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Builds an optimized Unsplash URL from a photo id. */
export const unsplash = (id: string, width = 1400) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${width}&q=80`;

// ---------------------------------------------------------------------------
// Brand & contact
// ---------------------------------------------------------------------------

/** Public address of the site, without a trailing slash. Change it here if a custom domain is added. */
export const SITE_URL = "https://vladimirtudor40-glitch.github.io/thefadehouse";

/** WhatsApp number in international format, digits only. Change it here once. */
export const WHATSAPP_NUMBER = "40749217944";

export const brand = {
  name: "The Fade House - Barbershop",
  shortName: "The Fade House",
  tagline: "Precision Cuts. Timeless Craft. The Gold Standard of Grooming in Constanța.",
  whatsappNumber: WHATSAPP_NUMBER,
  phoneDisplay: "0749 217 944",
  phoneHref: "tel:+40749217944",
  street: "Strada Constantin Brătescu 45",
  city: "900703 Constanța, România",
  area: "Zona Centrală",
  address: "Strada Constantin Brătescu 45, 900703 Constanța, România",
  coords: { lat: 44.1766398, lng: 28.6417787 },
  coordsDisplay: "44.1766° N, 28.6417° E",
  timeZone: "Europe/Bucharest",
  googleRating: 5.0,
  googleReviewCount: 750,
  get mapsUrl() {
    return `https://www.google.com/maps/search/?api=1&query=${this.coords.lat},${this.coords.lng}`;
  },
  get directionsUrl() {
    return `https://www.google.com/maps/dir/?api=1&destination=${this.coords.lat},${this.coords.lng}`;
  },
  get wazeUrl() {
    return `https://waze.com/ul?ll=${this.coords.lat},${this.coords.lng}&navigate=yes`;
  },
};

export const navLinks = [
  { label: "Filozofie", href: "#filozofie" },
  { label: "Servicii", href: "#servicii" },
  { label: "Lookbook", href: "#lookbook" },
  { label: "Recenzii", href: "#recenzii" },
  { label: "Contact", href: "#contact" },
] as const;

// ---------------------------------------------------------------------------
// Schedule — index 0 is Monday
// ---------------------------------------------------------------------------

export const openingHours: DaySchedule[] = [
  { day: "Luni", open: "09:00", close: "18:00" },
  { day: "Marți", open: "09:00", close: "18:00" },
  { day: "Miercuri", open: "09:00", close: "17:30" },
  { day: "Joi", open: "09:00", close: "18:00" },
  { day: "Vineri", open: "09:00", close: "18:00" },
  { day: "Sâmbătă", open: "09:00", close: "18:00" },
  { day: "Duminică", open: null, close: null },
];

/** Minutes between bookable start times in the booking drawer. */
export const SLOT_STEP_MINUTES = 30;
/** How many calendar days ahead the booking drawer offers. */
export const BOOKING_DAYS_AHEAD = 14;

// ---------------------------------------------------------------------------
// Hero
// ---------------------------------------------------------------------------

export const hero = {
  titleLines: ["Arta tunsorii", "perfecte", "în inima", "Constanței"],
  /** Index of the line rendered in the gold serif accent. */
  accentLine: 1,
  trustPill: "★ 5.0 pe Google Maps • Peste 750 recenzii verificate",
  subtitle:
    "Fade-uri curate, contururi trase cu briciul și o oră doar pentru tine. Programări la minut, espresso din partea casei și atenție chirurgicală la fiecare detaliu.",
  image: unsplash("1503951914875-452162b0f3f1", 2000),
  imageAlt: "Barber care finisează conturul bărbii unui client cu briciul, în lumină caldă și întunecată",
};

// ---------------------------------------------------------------------------
// The Craft (about + amenities)
// ---------------------------------------------------------------------------

export const craft = {
  statement:
    "Nu facem tunsori pe bandă rulantă. Fiecare client primește timpul lui, o consultație sinceră și o tunsoare verificată din toate unghiurile — pentru că diferența dintre bine și perfect stă în ultimul milimetru.",
  image: unsplash("1621605815971-fbc98d665033", 1400),
  imageAlt: "Mașini de tuns, foarfecă și pieptene așezate pe un blat de lemn închis",
  secondaryImage: unsplash("1512690459411-b9245aed614b", 1000),
  secondaryImageAlt: "Scaun de frizerie clasic din piele maro, sub lumini calde",
};

export const amenities = [
  {
    icon: "coffee",
    title: "Băuturi din partea casei",
    description: "Espresso proaspăt sau o băutură rece cât aștepți. Pe noi.",
  },
  {
    icon: "card",
    title: "Card & Contactless",
    description: "Plătești cu cardul, Apple Pay sau Google Pay, direct din telefon.",
  },
  {
    icon: "kid",
    title: "Potrivit și pentru copii",
    description: "Răbdare, glume și fade-uri curate pentru domnii cei mici.",
  },
  {
    icon: "timer",
    title: "Punctualitate la minut",
    description: "Intri la ora programată. Fără așteptare, fără grabă la scaun.",
  },
] as const;

// ---------------------------------------------------------------------------
// Services
// NOTE: The first service in each category matches the prices supplied by the
// shop; the rest are proposals — confirm them with the shop before launch.
// ---------------------------------------------------------------------------

export const serviceCategories: ServiceCategory[] = [
  {
    id: "tuns",
    label: "Tuns & Styling",
    image: unsplash("1605497788044-5a32c7078486", 700),
    imageAlt: "Barber care usucă și aranjează părul unui client zâmbitor",
  },
  {
    id: "pachete",
    label: "Pachete Complete",
    image: unsplash("1585747860715-2ba37e788b70", 700),
    imageAlt: "Interiorul unei frizerii cu oglinzi, cărămidă aparentă și scaune clasice",
  },
  {
    id: "barba",
    label: "Barbă & Shave",
    image: unsplash("1599351431613-18ef1fdd27e1", 700),
    imageAlt: "Barber care conturează barba unui client cu mașina de tuns",
  },
  {
    id: "junior",
    label: "Junior",
    image: unsplash("1534297635766-a262cdcb8ee4", 700),
    imageAlt: "Barber care tunde un băiețel cu mașina de tuns",
  },
];

export const services: Service[] = [
  // Tuns & Styling
  {
    id: "signature-skin-fade",
    category: "tuns",
    name: "Signature Skin Fade & Styling",
    description: "Fade până la piele, tranziție fără linii, contur cu briciul și styling cu produse premium.",
    duration: 45,
    price: 80,
    featured: true,
  },
  {
    id: "taper-fade",
    category: "tuns",
    name: "Taper / Low Fade",
    description: "Degrade discret la tâmple și ceafă, ideal pentru un look curat la birou.",
    duration: 45,
    price: 75,
  },
  {
    id: "scissor-cut",
    category: "tuns",
    name: "Tuns Clasic cu Foarfeca",
    description: "Lungimi păstrate, textură și volum lucrate integral cu foarfeca.",
    duration: 45,
    price: 75,
  },
  {
    id: "buzz-cut",
    category: "tuns",
    name: "Buzz Cut & Contur",
    description: "Tuns uniform cu mașina, contur precis și finisaj cu briciul.",
    duration: 30,
    price: 55,
  },
  // Pachete Complete
  {
    id: "complete-package",
    category: "pachete",
    name: "The Fade House Complete Package",
    description: "Tuns + Barbă + Spălat + Styling. Tot ritualul, într-o singură programare.",
    duration: 60,
    price: 110,
    featured: true,
  },
  {
    id: "gentlemans-ritual",
    category: "pachete",
    name: "Gentleman's Ritual",
    description: "Pachetul complet plus prosop cald, mască facială și masaj scurt al scalpului.",
    duration: 90,
    price: 150,
  },
  {
    id: "father-son",
    category: "pachete",
    name: "Father & Son",
    description: "Tuns adult + Junior Fade, unul după altul. Pentru tradiții care încep devreme.",
    duration: 85,
    price: 135,
  },
  // Barbă & Shave
  {
    id: "beard-sculpting",
    category: "barba",
    name: "Beard Sculpting & Hot Towel",
    description: "Formă gândită pentru fața ta, contur cu briciul, prosop cald și ulei de barbă.",
    duration: 30,
    price: 50,
    featured: true,
  },
  {
    id: "royal-shave",
    category: "barba",
    name: "Royal Shave cu Brici",
    description: "Bărbierit clasic în trei pași: prosop cald, spumă la pămătuf și brici drept.",
    duration: 40,
    price: 60,
  },
  {
    id: "beard-lineup",
    category: "barba",
    name: "Contur Barbă cu Brici",
    description: "Linii curate pe obraz și gât, între două tunsori.",
    duration: 15,
    price: 30,
  },
  // Junior
  {
    id: "junior-fade",
    category: "junior",
    name: "Junior Fade",
    description: "Fade complet pentru băieți până în 12 ani, cu răbdare și fără grabă.",
    duration: 40,
    price: 65,
    featured: true,
  },
  {
    id: "junior-classic",
    category: "junior",
    name: "Tuns Junior Clasic",
    description: "Tuns cu mașina și foarfeca, contur curat, pentru băieți până în 12 ani.",
    duration: 30,
    price: 50,
  },
];

// ---------------------------------------------------------------------------
// Lookbook
// ---------------------------------------------------------------------------

export const lookbook: LookbookItem[] = [
  {
    id: "skin-fade",
    title: "Skin Fade",
    caption: "De la piele la lungime, fără nicio linie vizibilă.",
    image: unsplash("1567894340315-735d7c361db0", 1200),
    alt: "Barber care lucrează un skin fade cu mașina de tuns pe un client cu părul creț",
  },
  {
    id: "taper-fade",
    title: "Taper Fade",
    caption: "Degrade discret, curat de la tâmplă la ceafă.",
    image: unsplash("1520338661084-680395057c93", 1000),
    alt: "Barber care finisează cu mașina un taper fade la ceafa unui client",
  },
  {
    id: "textured-crop",
    title: "Textured Crop",
    caption: "Textură pe creștet, laterale scurte, aranjat cu degetele.",
    image: unsplash("1622286342621-4bd786c2447c", 1000),
    alt: "Barber care aranjează un textured crop cu laterale scurte",
  },
  {
    id: "razor-lineup",
    title: "Razor Beard Line-up",
    caption: "Contur tras cu briciul, simetric din toate unghiurile.",
    image: unsplash("1599351431202-1e0f0137899a", 1000),
    alt: "Barber cu brațe tatuate care trasează conturul bărbii unui client cu briciul",
  },
  {
    id: "beard-detail",
    title: "Beard Detail",
    caption: "Foarfecă, pieptene și răbdare pentru fiecare fir.",
    image: unsplash("1517832606299-7ae9b720a186", 1000),
    alt: "Fotografie alb-negru cu un barber care tunde barba unui client cu foarfeca",
  },
];

// ---------------------------------------------------------------------------
// Social proof
// TODO before launch: replace these cards with verbatim Google reviews (with
// the reviewers' permission). They summarise recurring themes for layout only.
// ---------------------------------------------------------------------------

export const stats = [
  { value: 5.0, decimals: 1, suffix: "★", label: "Rating Google" },
  { value: 750, decimals: 0, suffix: "+", label: "Recenzii 5 stele" },
  { value: 100, decimals: 0, suffix: "%", label: "Punctualitate" },
] as const;

export const reviews: Review[] = [
  {
    id: "r1",
    name: "Andrei M.",
    service: "Signature Skin Fade",
    quote: "Laur verifică tunsoarea din toate unghiurile până e perfectă. Atenție la detalii cum n-am mai văzut.",
  },
  {
    id: "r2",
    name: "Radu C.",
    service: "Complete Package",
    quote: "Am intrat fix la ora programată, zero așteptare. Cafea bună, atmosferă relaxată, rezultat impecabil.",
  },
  {
    id: "r3",
    name: "Mihai D.",
    service: "Beard Sculpting",
    quote: "Conturul bărbii e trasat ca la carte. Prosopul cald e un bonus pe care nu-l mai găsești ușor.",
  },
  {
    id: "r4",
    name: "Cristian P.",
    service: "Junior Fade",
    quote: "Băiatul meu de 6 ani a stat liniștit tot timpul. Răbdare, glume și o tunsoare foarte curată.",
  },
  {
    id: "r5",
    name: "Alexandru V.",
    service: "Taper Fade",
    quote: "Raport calitate-preț greu de egalat în Constanța. Echipa știe exact ce face.",
  },
  {
    id: "r6",
    name: "Bogdan S.",
    service: "Royal Shave",
    quote: "Precizie chirurgicală și o experiență pe care o aștepți cu drag. Singura frizerie în care mai merg.",
  },
  {
    id: "r7",
    name: "Ionuț T.",
    service: "Signature Skin Fade",
    quote: "Fade-ul ține frumos și după două săptămâni. Se vede că lucrează cu grijă, nu pe repede-înainte.",
  },
  {
    id: "r8",
    name: "Vlad N.",
    service: "Complete Package",
    quote: "Primit cu o băutură rece, tuns fără grabă, plătit contactless. Exact cum ar trebui să fie peste tot.",
  },
];

// ---------------------------------------------------------------------------
// Payments
// ---------------------------------------------------------------------------

export const paymentMethods = ["Visa", "Mastercard", "Apple Pay", "Google Pay"] as const;
