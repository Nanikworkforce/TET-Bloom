import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";
import { AuthPermissionsProvider } from "@/lib/auth-permissions";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TET Bloom - Teacher Evaluation Tool",
  description: "A platform for educational institutions to manage teacher observations and feedback",
  icons: {
    icon: [
      { url: '/favicon.svg' },
      { url: '/favicon.ico' }
    ],
    apple: [
      { url: '/icons/app-icon.svg' },
    ],
  },
  appleWebApp: {
    title: "TET Bloom",
    statusBarStyle: "default"
  },
  // manifest: '/manifest.json' // Temporarily disabled due to syntax error
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="apple-touch-icon" href="/icons/app-icon.svg" />
        <link rel="apple-touch-icon-precomposed" href="/icons/app-icon.svg" />
        <meta name="theme-color" content="#4F46E5" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-background`}
      >
        <AuthProvider>
          <AuthPermissionsProvider>
            {children}
          </AuthPermissionsProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
