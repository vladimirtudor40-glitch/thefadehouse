import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, JetBrains_Mono, Plus_Jakarta_Sans, Syne } from "next/font/google";
import { Providers } from "@/components/Providers";
import { brand } from "@/data/barbershopData";
import "lenis/dist/lenis.css";
import "./globals.css";

const syne = Syne({
  subsets: ["latin", "latin-ext"],
  variable: "--font-syne",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin", "latin-ext"],
  style: ["italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin", "latin-ext"],
  variable: "--font-jakarta",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin", "latin-ext"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  title: `${brand.name} — Frizerie Premium în Constanța`,
  description:
    "Skin fade, taper, contur de barbă cu briciul și pachete complete în centrul Constanței. 5.0 pe Google din peste 750 de recenzii. Programări pe WhatsApp: 0749 217 944.",
  openGraph: {
    title: `${brand.name} — Frizerie Premium în Constanța`,
    description: "Arta tunsorii perfecte în inima Constanței. Strada Constantin Brătescu 45.",
    locale: "ro_RO",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#0A0A0B",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="ro"
      className={`${syne.variable} ${cormorant.variable} ${jakarta.variable} ${jetbrains.variable}`}
    >
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
