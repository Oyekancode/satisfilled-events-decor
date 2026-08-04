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
  metadataBase: new URL("https://satisfilled.com"),
  title: "SatisFilled Events & Decor",
  description:
    "Balloon decor, event styling and catering in Prague. Your satisfaction is our fulfillment.",
  icons: {
    icon: "/images/logo.png",
  },
  openGraph: {
    siteName: "SatisFilled Events & Decor",
    type: "website",
    images: [{ url: "/opengraph-image.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/opengraph-image.jpg"],
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
