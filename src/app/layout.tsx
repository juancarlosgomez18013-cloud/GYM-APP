import type { Metadata, Viewport } from "next";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

export const metadata: Metadata = {
  title: "GymFuel - AI-Powered Diet Planner",
  description:
    "Smart nutrition tracking powered by AI. Scan groceries, photograph your fridge, and get personalized meal plans.",
  manifest: "/manifest.webmanifest",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#16a34a",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased min-h-screen bg-background font-sans">
        {children}
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
