import type { Metadata } from "next";
import { Geist, Playfair_Display, Dancing_Script } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
});

const dancingScript = Dancing_Script({
  variable: "--font-script",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SatisFilled Events & Decor",
  description:
    "Balloon decor, event styling and catering in Prague. Your satisfaction is our fulfillment.",
  icons: {
    icon: "/images/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${playfair.variable} ${dancingScript.variable} h-full antialiased`}
    >
      <body
        className="min-h-full flex flex-col bg-cream text-ink"
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
