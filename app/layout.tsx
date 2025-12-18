import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import "./globals.css";
import Header from "@/components/Header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BuyForce",
  description: "Group Buying Platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="he">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        style={{ margin: 0 }}
      >
        <PayPalScriptProvider
          options={{
            clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID!,
            currency: "ILS",
          }}
        >
          <Header />
          {children}
        </PayPalScriptProvider>
      </body>
    </html>
  );
}
