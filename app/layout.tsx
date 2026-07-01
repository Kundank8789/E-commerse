import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { GoogleAnalytics } from '@next/third-parties/google';
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
  title: "Niwle - Premium Fashion & Jewellery",
  description: "Premium fashion & jewellery for modern lifestyle. Designed for elegance, crafted for you.",
  verification: {
    google: "MPwwNhKwHRbs5B4ThxHboTznHJSGFx6k1FvGV9fA-t8",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-16x16.png", type: "image/png", sizes: "16x16" },
      { url: "/favicon-32x32.png", type: "image/png", sizes: "32x32" },
      { url: "/favicon-48x48.png", type: "image/png", sizes: "48x48" },
    ],
    apple: [
      { url: "/apple-icon.png", type: "image/png", sizes: "180x180" },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-screen flex flex-col w-full overflow-x-hidden bg-white text-black">
        <Providers>
          <main className="flex-1 w-full">
            {children}
          </main>
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
      <GoogleAnalytics gaId="G-MLCCBFBW49" />
    </html>
  );
}