import type { Metadata } from "next";
import { Inter, Instrument_Serif, Geist_Mono, Caveat } from "next/font/google";
import "./site.css";
import "./custom.css";
import { ContactProvider, SiteChrome, SiteFooter } from "@/components/chrome";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const instrument = Instrument_Serif({ subsets: ["latin"], weight: "400", style: ["normal", "italic"], variable: "--font-instrument" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" });
const caveat = Caveat({ subsets: ["latin"], weight: "500", variable: "--font-hand" });

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const description = "Punya Surana is an AI/ML engineer and full-stack developer in Pune, India. AI systems, agents and the web apps around them.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Punya Surana — AI engineer",
  description,
  openGraph: { title: "Punya Surana — AI engineer", description, type: "website", siteName: "Punya Surana" },
  twitter: { card: "summary_large_image", title: "Punya Surana — AI engineer", description },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN" data-nav-tone="ink" className={`${inter.variable} ${instrument.variable} ${geistMono.variable} ${caveat.variable}`}>
      <body><ContactProvider>
          <SiteChrome />
          <div id="site-shell">
            {children}
            <SiteFooter />
          </div>
        </ContactProvider></body>
    </html>
  );
}
