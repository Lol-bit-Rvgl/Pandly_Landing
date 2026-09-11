import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";

/* ---- Local fonts from public/assets/fonts/ ---- */
const cherryBomb = localFont({
  src: "../public/assets/fonts/CherryBombOne-Regular.ttf",
  variable: "--font-cherry-bomb",
  display: "swap",
  weight: "400",
});

const dynaPuff = localFont({
  src: "../public/assets/fonts/DynaPuff-Variable.ttf",
  variable: "--font-dyna-puff",
  display: "swap",
});

const lilitaOne = localFont({
  src: "../public/assets/fonts/LilitaOne-Regular.ttf",
  variable: "--font-lilita-one",
  display: "swap",
  weight: "400",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://pandly.app"),
  title: "Pandly — Donde tu identidad se vuelve real",
  description:
    "Salas de cine sincronizadas, chats de voz interactivos y círculos donde tu identidad cobra vida.",
  openGraph: {
    title: "Pandly — Donde tu identidad se vuelve real",
    description: "Salas de cine sincronizadas, chats de voz interactivos y círculos.",
    images: ["/assets/logo/PANDLY_LOGO_PERFECT_FOR_PRODUCTION.png"],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#000000",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${cherryBomb.variable} ${dynaPuff.variable} ${lilitaOne.variable}`}
    >
      <body
        style={{
          margin: 0,
          padding: 0,
          background: "#000",
          color: "#fff",
          fontFamily: "var(--font-dyna-puff), system-ui, sans-serif",
          minHeight: "100dvh",
          WebkitFontSmoothing: "antialiased",
          MozOsxFontSmoothing: "grayscale",
        }}
      >
        {children}
      </body>
    </html>
  );
}
