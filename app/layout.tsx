import supademoLogo from "@/public/supademo-logo.svg";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  fallback: ["serif"],
});

export const metadata: Metadata = {
  title: "Supademo YouTube Dashboard",
  description: "A YouTube dashboard app created by Supademo",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased bg-white`}>
        <header className="p-5 border-b border-slate-300 h-14">
          <Link href="/">
            <Image src={supademoLogo} alt="Supademo logo" width={112} />
          </Link>
        </header>
        {children}
      </body>
    </html>
  );
}
