import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
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
  metadataBase: new URL('https://trouvetoncandidat.fr'),
  openGraph: {
    title: "TrouveTonCandidat.fr | Votez pour un programme, pas pour un visage",
    description: "Comparez les programmes des candidats 2027 de manière neutre et anonyme.",
    url: 'https://trouvetoncandidat.fr',
    siteName: 'TrouveTonCandidat.fr',
    locale: 'fr_FR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "TrouveTonCandidat.fr | Le comparateur politique neutre",
    description: "Qui défend vraiment vos idées pour 2027 ? Faites le test en 2 minutes.",
  },
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
    <html lang="fr">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased overflow-x-hidden w-full selection:bg-primary/10`}
      >
        <div className="flex flex-col min-h-screen w-full overflow-x-hidden">
          {children}
        </div>
        <Script
          src="https://cdnjs.buymeacoffee.com/1.0.0/widget.prod.min.js"
          data-name="BMC-Widget"
          data-cfasync="false"
          data-id="trouvetoncandidat"
          data-description="Support me on Buy me a coffee!"
          data-message="Ce projet est le vôtre. 🇫🇷 TrouveTonCandidat est un outil citoyen, indépendant et sans aucune subvention. Votre soutien nous aide à payer les serveurs et à rester 100% neutre."
          data-color="#5F7FFF"
          data-position="Right"
          data-x_margin="18"
          data-y_margin="18"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
