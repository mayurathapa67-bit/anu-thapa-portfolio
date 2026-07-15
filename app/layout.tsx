import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getContent } from "@/lib/content";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair-var",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter-var",
  display: "swap",
});

const siteUrl = process.env.SITE_URL ?? "https://anu-thapa-portfolio.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Anu Thapa — Technical Writer",
    template: "%s | Anu Thapa",
  },
  description:
    "Anu Thapa is a Technical Writer in Brisbane, Australia, transforming complex information into clear, user-friendly documentation.",
  keywords: [
    "Technical Writer",
    "API Documentation",
    "User Manuals",
    "Software Documentation",
    "SDK Guides",
    "Anu Thapa",
  ],
  authors: [{ name: "Anu Thapa" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "Anu Thapa — Technical Writer",
    title: "Anu Thapa — Technical Writer",
    description:
      "Clarity Through Technical Writing. API docs, user guides, and technical manuals by Anu Thapa.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Anu Thapa — Technical Writer",
    description:
      "Clarity Through Technical Writing. API docs, user guides, and technical manuals by Anu Thapa.",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const content = await getContent();
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${inter.variable} h-full`}
    >
      <body className="flex min-h-full flex-col antialiased">
        <Navbar nav={content.nav} />
        <main className="flex-1">{children}</main>
        <Footer nav={content.nav} contact={content.contact} />
      </body>
    </html>
  );
}
