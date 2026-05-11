import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import Providers from "@/components/Providers";

import { Toaster } from "react-hot-toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MyStore",
  description: "Modern E-commerce Store",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en" data-scroll-behavior="smooth"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-screen flex flex-col w-full overflow-x-hidden bg-white text-black">

        <Providers>

          {/* MAIN CONTENT */}
          <main className="flex-1 w-full">
            {children}
          </main>

          {/* TOAST */}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: "#111",
                color: "#fff",
                borderRadius: "12px",
                padding: "14px 18px",
              },
            }}
          />

        </Providers>

      </body>
    </html>
  );
}