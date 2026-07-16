import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { NavBar } from "@/components/NavBar";
import { NetworkGuard } from "@/components/NetworkGuard";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Potluck",
  description: "Collect money from a group without becoming the group's debt collector.",
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
          {children}
        </Providers>
      </body>
    </html>
  );
}
