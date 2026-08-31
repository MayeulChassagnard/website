import type { Metadata } from "next";
import { Bodoni_Moda, Jost } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import Nav from "@/components/Nav";
import SiteFooter from "@/components/SiteFooter";
import Cursor from "@/components/motion/Cursor";
import SmoothScroll from "@/components/motion/SmoothScroll";
import LightboxProvider from "@/components/media/Lightbox";
import { ARTIST, ROLES } from "@/lib/content/site";
import { SITE_URL } from "@/lib/content/seo";
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
  // Shared links carry absolute URLs, and the card next to this file is
  // referenced relatively, so the site has to say where it lives.
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${ARTIST}, ${ROLES.join(" / ")}`,
    template: `%s, ${ARTIST}`,
  },
  description:
    "Photographie, film et volumes numériques. Travail visuel entre documentaire et fiction.",
  // The card itself is `opengraph-image.png` beside this file, which Next
  // finds on its own. Title and description are deliberately absent below:
  // every page inherits this block, and left out, each page's own pair is
  // what goes on its card. Same for `url`, which would otherwise have every
  // page give the home page as its address.
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: ARTIST,
  },
  twitter: {
    // Without this the card is a thumbnail beside the text, and the corridor
    // is unreadable at that size.
    card: "summary_large_image",
  },
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
