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
              
              // Load cached settings for instant theme
              try {
                var cached = localStorage.getItem('site_settings_cache');
                if (cached) {
                  var settings = JSON.parse(cached);
                  var root = document.documentElement;
                  
                  if (settings.primaryColor) {
                    root.style.setProperty('--color-gold', settings.primaryColor);
                    var hex = settings.primaryColor.replace('#', '');
                    var r = parseInt(hex.substr(0, 2), 16);
                    var g = parseInt(hex.substr(2, 2), 16);
                    var b = parseInt(hex.substr(4, 2), 16);
                    root.style.setProperty('--color-gold-rgb', r + ', ' + g + ', ' + b);
                  }
                  
                  if (settings.secondaryColor) {
                    root.style.setProperty('--color-secondary', settings.secondaryColor);
                    var hex2 = settings.secondaryColor.replace('#', '');
                    var r2 = parseInt(hex2.substr(0, 2), 16);
                    var g2 = parseInt(hex2.substr(2, 2), 16);
                    var b2 = parseInt(hex2.substr(4, 2), 16);
                    root.style.setProperty('--color-secondary-rgb', r2 + ', ' + g2 + ', ' + b2);
                  }
                }
              } catch(e) {}
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
