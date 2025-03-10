import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { Toaster } from "sonner";
import { Analytics } from "@vercel/analytics/react";
import config from "@/app.config";
import Script from "next/script";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { ClerkProvider } from "@clerk/nextjs";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title:
    "Premium OnlyFans Leaks | Latest Content from Top Creators - DailyDoseOfLeak.com",
  description:
    "Discover the Latest and most Exclusive OnlyFans leaks at DailyDoseOfLeak.com. Browse Premium Content from Top Creators updated regularly. Join now for instant access to the hottest OnlyFans Leaks all in one place!",
  metadataBase: new URL(`https://www.${config.domain}`),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" className="h-full">
        <head>
          <meta name="rating" content="adult" />
          <Script
            async
            src="https://www.googletagmanager.com/gtag/js?id=G-0JYYRMHVG4"
          ></Script>
          <Script id="google-analytics">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-0JYYRMHVG4');
            `}
          </Script>
        </head>
        <body
          className={cn(
            "relative h-full font-sans antialiased",
            inter.className
          )}
        >
          <main className="relative flex flex-col min-h-screen">
            <Navbar />
            {children}
            <Analytics />
            <SpeedInsights />
            <Footer />
          </main>
          <Toaster richColors />
        </body>
      </html>
    </ClerkProvider>
  );
}
