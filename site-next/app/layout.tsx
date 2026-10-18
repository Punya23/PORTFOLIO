import type { Metadata } from "next";
import { Inter, Fraunces, Geist_Mono, Caveat } from "next/font/google";
import "./site.css";
import "./custom.css";
import { ContactProvider, SiteChrome } from "@/components/chrome";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
// Accent serif (italic words). Kept on the --font-instrument variable because site.css reads it.
const instrument = Fraunces({ subsets: ["latin"], style: ["normal", "italic"], variable: "--font-instrument" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" });
const caveat = Caveat({ subsets: ["latin"], weight: "500", variable: "--font-hand" });

export const metadata: Metadata = {
  title: "Punya Surana — AI engineer",
  description: "Punya Surana is an AI/ML engineer and full-stack developer in Pune, India.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN" data-nav-tone="ink" className={`${inter.variable} ${instrument.variable} ${geistMono.variable} ${caveat.variable}`}>
      <body><ContactProvider><SiteChrome />{children}</ContactProvider></body>
    </html>
  );
}
