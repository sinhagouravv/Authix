import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import VendorShell from "@/components/VendorShell";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Authix | Vendor",
  description: "Manage your 3FA applications and API keys.",
  icons: {
    icon: "/AuthixLogo.svg",
    shortcut: "/AuthixLogo.svg",
    apple: "/AuthixLogo.svg",
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
      data-scroll-behavior="smooth"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-screen bg-[#f8fafc]">
        <VendorShell>
          {children}
        </VendorShell>
      </body>
    </html>
  );
}
