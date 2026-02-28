import type { Metadata } from "next";
import "./globals.css";
import VisitorTracker from "@/components/providers/VisitorTracker";

export const metadata: Metadata = {
  title: "CasinoHub | En İyi Casino Bonusları",
  description: "En yüksek casino bonuslarını keşfedin. Özel teklifler ve promosyonlar ile kazanmaya başlayın!",
  keywords: ["casino", "bonus", "slot", "bahis", "promosyon"],
  openGraph: {
    title: "CasinoHub | En İyi Casino Bonusları",
    description: "En yüksek casino bonuslarını keşfedin.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body className="min-h-screen bg-background">
        <VisitorTracker />
        {children}
      </body>
    </html>
  );
}
