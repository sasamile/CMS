import type { Metadata } from "next";
import localFont from "next/font/local";
import { auth } from "@/auth";

import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { Toaster } from "sonner";
import { SessionProvider } from "next-auth/react";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "CMS",
  description: "CMS CACTO",
  icons: {
    icon: "/icons/logo.png",
    shortcut: "/icons/logo.png",
    apple: "/icons/logo.png",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  return (
    <html lang="en">
      <head>
        <head>
          <link
            rel="shortcut icon"
            href="/icons/logo.png"
            type="image/x-icon"
          />
          <link rel="icon" href="/icons/logo.png" type="image/png" />
          <link rel="apple-touch-icon" href="/icons/logo.png" />
        </head>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SessionProvider session={session}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <Toaster richColors position="bottom-center" />
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
