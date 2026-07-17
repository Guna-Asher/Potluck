import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { NavBar } from "@/components/NavBar";
import { NetworkGuard } from "@/components/NetworkGuard";
import { PageTransition } from "@/components/PageTransition";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

const TITLE = "Potluck — Group money pools that pay for themselves";
const DESCRIPTION = "Collect money from a group without becoming the group's debt collector.";

// Vercel sets VERCEL_URL automatically on every deployment (preview and
// production) — falling back to it means OG/Twitter image URLs resolve
// correctly without needing a manually-configured domain env var.
const SITE_URL = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: TITLE,
  description: DESCRIPTION,
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans bg-neutral-50 text-neutral-900 antialiased`}>
        <Providers>
          <NavBar />
          <div className="mx-auto max-w-4xl px-6">
            <NetworkGuard />
          </div>
          <PageTransition>{children}</PageTransition>
        </Providers>
      </body>
    </html>
  );
}
