import type { Metadata } from "next";
import { Lexend_Deca, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Cursor from "@/components/Cursor";
import GrainOverlay from "@/components/GrainOverlay";
import SmoothScroll from "@/components/SmoothScroll";
import MouseTracker from "@/components/MouseTracker"; // Import the high-performance tracker wrapper

const lexendDeca = Lexend_Deca({
  variable: "--font-lexend-deca",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "Magrhea — Branding, Digital & Motion",
  description:
    "Magrhea is a creative studio crafting bold brands, digital experiences and motion design for clients who refuse to blend in.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${lexendDeca.variable} ${jetbrainsMono.variable} h-full antialiased custom-cursor-active`}
    >
      <body className="min-h-full flex flex-col bg-paper text-ink">
        {/* Injects raw document properties to sync Hero and Cursor instantly */}
        <MouseTracker /> 
        
        <SmoothScroll />
        <GrainOverlay />
        <Cursor />
        {children}
      </body>
    </html>
  );
}