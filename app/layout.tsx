import type { Metadata, Viewport } from "next";
import { Inter, Fraunces, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import ServiceWorkerRegister from "./components/ServiceWorkerRegister";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
  axes: ["SOFT", "opsz"],
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "VoiceFitCoach — Hands-free workouts, voice first.",
  description:
    "A voice-activated coach that builds AI-personalized fitness plans, syncs with your wearable in real time, and works offline. Built for busy professionals who don't have time for fiddly fitness apps.",
  applicationName: "VoiceFitCoach",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "VoiceFitCoach",
  },
  formatDetection: { telephone: false },
  icons: {
    icon: "/icon.svg",
    apple: "/apple-touch-icon.svg",
  },
};

export const viewport: Viewport = {
  themeColor: "#f3eee2",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${fraunces.variable} ${jetbrains.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ServiceWorkerRegister />
        {children}
      </body>
    </html>
  );
}
