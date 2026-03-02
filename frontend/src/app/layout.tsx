import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/components/providers/Providers";
import { OrganizationJsonLd, WebSiteJsonLd } from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://casinohub.com"),
  title: {
    default: "CasinoHub | En İyi Casino Bonusları",
    template: "%s | CasinoHub",
  },
  description: "En yüksek casino bonuslarını keşfedin. Özel teklifler ve promosyonlar ile kazanmaya başlayın! Güvenilir casino siteleri ve hoşgeldin bonusları.",
  keywords: ["casino", "bonus", "slot", "bahis", "promosyon", "freespin", "hoşgeldin bonusu", "casino siteleri"],
  authors: [{ name: "CasinoHub" }],
  creator: "CasinoHub",
  publisher: "CasinoHub",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: "CasinoHub | En İyi Casino Bonusları",
    description: "En yüksek casino bonuslarını keşfedin. Özel teklifler ve promosyonlar ile kazanmaya başlayın!",
    type: "website",
    locale: "tr_TR",
    siteName: "CasinoHub",
  },
  twitter: {
    card: "summary_large_image",
    title: "CasinoHub | En İyi Casino Bonusları",
    description: "En yüksek casino bonuslarını keşfedin.",
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION || "",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" className="dark">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#d4af37" />
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
        <script dangerouslySetInnerHTML={{
          __html: `
            (function() {
              var theme = localStorage.getItem('theme');
              if (theme === 'light') {
                document.documentElement.classList.remove('dark');
              } else {
                document.documentElement.classList.add('dark');
              }
            })();
          `,
        }} />
      </head>
      <body className="min-h-screen bg-background">
        <OrganizationJsonLd />
        <WebSiteJsonLd />
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
