import type { Metadata } from "next";
import { Bodoni_Moda, Jost } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import Nav from "@/components/Nav";
import SiteFooter from "@/components/SiteFooter";
import Cursor from "@/components/motion/Cursor";
import SmoothScroll from "@/components/motion/SmoothScroll";
import LightboxProvider from "@/components/media/Lightbox";
import { ARTIST, ROLES } from "@/lib/content/site";
import "./globals.css";

// Display face: extreme stroke contrast, used large and sparingly.
const bodoni = Bodoni_Moda({
  variable: "--font-bodoni",
  weight: ["400", "500"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  display: "swap",
});

// Wall-label face: geometric, near-neutral, wide tracking at small sizes.
const jost = Jost({
  variable: "--font-jost",
  weight: ["300", "400", "500"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: `${ARTIST}, ${ROLES.join(" / ")}`,
    template: `%s, ${ARTIST}`,
  },
  description:
    "Photographie, film et volumes numériques. Travail visuel entre documentaire et fiction.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="fr" className={`${bodoni.variable} ${jost.variable}`}>
      <body className="flex min-h-svh flex-col bg-void text-bone">
        <LightboxProvider>
          <SmoothScroll>
            <Cursor />
            <Nav />
            <main className="flex-1">{children}</main>
            <SiteFooter />
          </SmoothScroll>
        </LightboxProvider>
      </body>
      {process.env.NEXT_PUBLIC_GA_ID && (
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
      )}
    </html>
  );
}
