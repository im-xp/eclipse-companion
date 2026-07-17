import type { Metadata, Viewport } from "next";
import { Montserrat, Raleway, Space_Mono } from "next/font/google";
import "../globals.css";
import { AppHeader, AppNav } from "@/components/AppChrome";
import { ServiceWorkerRegister } from "@/components/ServiceWorkerRegister";
import { Analytics } from "@/components/Analytics";
import { asLocale, getDict, LOCALES } from "@/lib/i18n";
import { LocaleProvider } from "@/lib/i18n/LocaleProvider";

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

// Both locales are built statically; src/proxy.ts rewrites clean URLs into
// this tree per host + IP country (icelandeclipse.com = en, eclipse.is = is
// unless the visitor is outside Iceland).
export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}
export const dynamicParams = false;

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: Pick<LayoutProps, "params">): Promise<Metadata> {
  const dict = getDict(asLocale((await params).locale));
  return {
    metadataBase: new URL(dict.meta.baseUrl),
    title: dict.meta.title,
    description: dict.meta.description,
    // opengraph-image.tsx is picked up automatically and attached to both cards.
    openGraph: {
      title: dict.meta.ogTitle,
      description: dict.meta.description,
      url: dict.meta.baseUrl,
      siteName: "Iceland Eclipse",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: dict.meta.ogTitle,
      description: dict.meta.description,
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
}

export const viewport: Viewport = {
  themeColor: "#03040a",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default async function RootLayout({ children, params }: LayoutProps) {
  const locale = asLocale((await params).locale);
  return (
    <html
      lang={locale}
      className={`${montserrat.variable} ${raleway.variable} ${spaceMono.variable}`}
    >
      <body className="min-h-dvh bg-eclipse-black text-moon-white">
        <LocaleProvider locale={locale}>
          <AppHeader />
          <main className="pt-16 pb-20 min-h-dvh">{children}</main>
          <AppNav />
          <ServiceWorkerRegister />
        </LocaleProvider>
        <Analytics />
      </body>
    </html>
  );
}
