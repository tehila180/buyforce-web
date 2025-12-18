// app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import PayPalProvider from "@/app/providers/PayPalProvider";
import { PayPalScriptProvider } from '@paypal/react-paypal-js';

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = { title: "BuyForce", description: "BuyForce app" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="he">
      <body>
        <PayPalScriptProvider
          options={{
            clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID!,
            currency: 'ILS',
            intent: 'capture',
          }}
        >
          {children}
        </PayPalScriptProvider>
      </body>
    </html>
  );
}
