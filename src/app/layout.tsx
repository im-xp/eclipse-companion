import type { Metadata, Viewport } from "next";
import { Montserrat, Raleway, Space_Mono } from "next/font/google";
import "./globals.css";
import { AppHeader, AppNav } from "@/components/AppChrome";
import { ServiceWorkerRegister } from "@/components/ServiceWorkerRegister";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["700", "800"],
  variable: "--font-montserrat",
});

const raleway = Raleway({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-raleway",
});

const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-space-mono",
});

const SHARE_DESCRIPTION =
  "Festival map, schedule, and guides. Iceland Eclipse, Snæfellsnes Peninsula, 11–15 August 2026.";

export const metadata: Metadata = {
  metadataBase: new URL("https://app.icelandeclipse.com"),
  title: "Iceland Eclipse — Festival Companion",
  description: SHARE_DESCRIPTION,
  // opengraph-image.tsx is picked up automatically and attached to both cards.
  openGraph: {
    title: "Iceland Eclipse — Festival Guide",
    description: SHARE_DESCRIPTION,
    url: "https://app.icelandeclipse.com",
    siteName: "Iceland Eclipse",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Iceland Eclipse — Festival Guide",
    description: SHARE_DESCRIPTION,
  },
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Iceland Eclipse",
  },
  icons: {
    icon: [
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
};

export const viewport: Viewport = {
  themeColor: "#03040a",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${montserrat.variable} ${raleway.variable} ${spaceMono.variable}`}
    >
      <body className="min-h-dvh bg-eclipse-black text-moon-white">
        <AppHeader />
        <main className="pt-16 pb-20 min-h-dvh">{children}</main>
        <AppNav />
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
