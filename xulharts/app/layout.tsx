import type { Metadata } from "next";
import { Inria_Sans, Geist } from 'next/font/google';
import { Coiny } from 'next/font/google';
import "./globals.css";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  title: "xulharts",
  description: "Admin panel",
}

const inriaSans = Inria_Sans ({
  subsets: ['latin'],
  weight: ['300', '400', '700'],
  variable: '--font-inria',
})

const coiny = Coiny({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-coiny',
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={cn("font-sans", geist.variable)}>
      <body className={`${inriaSans.variable} ${coiny.variable} min-h-screen flex flex-col`}>{children}</body>
    </html>
  );
}
