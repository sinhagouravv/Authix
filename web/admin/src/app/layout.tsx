import { Geist, Geist_Mono, JetBrains_Mono } from "next/font/google";


import "./globals.css";
import { AlertProvider } from "@/context/AlertContext";
import { DeleteModalProvider } from "@/context/DeleteModalContext";
import { CalendarProvider } from "@/context/CalendarContext";
import { ExportProvider } from "@/context/ExportContext";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Authix | Admin Panel",
  description: "Secure administrative control center for the Authix platform.",
};

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} ${jetbrainsMono.variable} antialiased`}>
        <AlertProvider>
          <DeleteModalProvider>
            <CalendarProvider>
              <ExportProvider>
                {children}
              </ExportProvider>
            </CalendarProvider>
          </DeleteModalProvider>
        </AlertProvider>
      </body>
    </html>
  );
}
