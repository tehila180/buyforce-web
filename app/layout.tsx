// app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import PayPalProvider from "@/app/providers/PayPalProvider";


const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = { title: "BuyForce", description: "BuyForce app" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="he">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <PayPalProvider>
          <Header />
          {children}
        </PayPalProvider>
      </body>
    </html>
  );
}
