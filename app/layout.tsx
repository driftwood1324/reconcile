import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import BottomNav from "@/components/BottomNav";
import AppBootstrap from "@/components/AppBootstrap";
import LockGate from "@/components/LockGate";
import TextScale from "@/components/TextScale";

const inter = localFont({
  src: "./fonts/inter-latin-variable.woff2",
  variable: "--font-inter",
  display: "swap",
  weight: "100 900",
});

const lora = localFont({
  src: "./fonts/lora-latin-variable.woff2",
  variable: "--font-lora",
  display: "swap",
  weight: "400 700",
});

export const metadata: Metadata = {
  title: "Reconcile",
  description: "A quiet companion for the Sacrament of Confession.",
  applicationName: "Reconcile",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Reconcile",
  },
};

export const viewport: Viewport = {
  themeColor: "#080d1a",
  width: "device-width",
  initialScale: 1,
  // Pinch-zoom is left enabled (WCAG 1.4.4) — important for a wide audience.
  // Editable fields use a ≥16px font so iOS doesn't auto-zoom on focus.
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} ${lora.variable} antialiased`}>
      <body>
        <AppBootstrap />
        <TextScale />
        <LockGate>
          <div className="app-shell">
            <main className="app-main">{children}</main>
            <BottomNav />
          </div>
        </LockGate>
      </body>
    </html>
  );
}
