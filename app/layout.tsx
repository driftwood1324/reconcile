import type { Metadata, Viewport } from "next";
import { Inter, Lora } from "next/font/google";
import "./globals.css";
import BottomNav from "@/components/BottomNav";
import LockGate from "@/components/LockGate";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
  display: "swap",
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
