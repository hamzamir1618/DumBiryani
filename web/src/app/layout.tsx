import type { Metadata } from "next";
import {
  Amiri,
  Cormorant_Garamond,
  Jost,
  Noto_Naskh_Arabic,
  Reem_Kufi,
} from "next/font/google";
import "./globals.css";
import { BasketProvider } from "@/components/basket";
import { introScript, themeScript } from "@/components/chrome";
import { HomeIntro } from "@/components/intro";
import { HomeMasthead } from "@/components/masthead";
import { ArchDefs } from "@/components/ornament";
import { ScrollDriver } from "@/components/scroll-driver";
import { BasketDrawer, SiteNav } from "@/components/site-nav";

/* A high-contrast old-style roman: the closest Latin equivalent to the hand
   that cuts an inscription into a tile panel. */
const display = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
});

const ui = Jost({ variable: "--font-jost", subsets: ["latin"] });

/* Amiri is a proper Naskh calligraphic face; Noto backs it for the Urdu
   letters Amiri does not carry. */
const amiri = Amiri({
  variable: "--font-amiri",
  subsets: ["arabic"],
  weight: ["400", "700"],
});
const naskh = Noto_Naskh_Arabic({
  variable: "--font-naskh",
  subsets: ["arabic"],
  weight: ["400", "600"],
});
const kufi = Reem_Kufi({
  variable: "--font-kufi",
  subsets: ["arabic"],
  weight: ["500", "700"],
});

export const metadata: Metadata = {
  title: "Dum Biryani · Sealed with dough, opened at your table",
  description:
    "Aged rice and raw-marinated meat sealed into a handi and left on the embers. Karachi, Lahore and Islamabad since 2019.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${display.variable} ${ui.variable} ${amiri.variable} ${naskh.variable} ${kufi.variable} h-full`}
    >
      <head>
        {/* Sets the theme before first paint, so a dark page never flashes. */}
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        {/* Decides the title card before the first pixel, for the same reason. */}
        <script dangerouslySetInnerHTML={{ __html: introScript }} />
      </head>
      <body className="min-h-full">
        <ArchDefs />
        <HomeIntro />
        <ScrollDriver />
        <BasketProvider>
          <HomeMasthead />
          <SiteNav />
          <main>{children}</main>
          <BasketDrawer />
        </BasketProvider>
      </body>
    </html>
  );
}
