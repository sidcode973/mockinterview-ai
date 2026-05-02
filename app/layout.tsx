import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import Footer from "@/components/layout/footer/Footer";
import Navbar from "@/components/layout/header/Navbar";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MockInterview AI — Ace Your Next Interview",
  description: "AI-powered mock interviews to help you land your dream job faster.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers themeProps={{ attribute: "class", defaultTheme: "dark" }}>
          
          <div className="relative flex flex-col min-h-screen">
            <Navbar/>
              <main className="container mx-auto max-w-7xl pt-7 px-6 flex-1 flex flex-col">
                 {children}
              </main>
            <Footer/>
          </div>
        </Providers>
      </body>
    </html>
  );
}