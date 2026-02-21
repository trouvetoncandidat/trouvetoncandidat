import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TrouveTonCandidat.fr | Le comparateur politique 100% neutre",
  description: "Comparez les programmes des candidats à l'élection présidentielle 2027 en 2 minutes. Algorithme Open Source, 100% anonyme.",
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased overflow-x-hidden w-full selection:bg-primary/10`}
      >
        <div className="flex flex-col min-h-screen w-full overflow-x-hidden">
          {children}
        </div>
      </body>
    </html>
  );
}
