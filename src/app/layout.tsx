import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

import { Providers } from "@/providers/Provider";

import MainNavBar from "@/components/Navbar/MainNavBar";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Secure Escrow Service",
  description: "A reliable platform for secure and transparent transactions.",
  icons: "./talent.svg",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
        <Providers>
          <MainNavBar />
          {children}
        </Providers>
      </body>
    </html>
  );
}
