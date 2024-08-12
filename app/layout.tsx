import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { dev } from './environment';
import { inject } from '@vercel/analytics';
import { Analytics } from "@vercel/analytics/react"
import Script from 'next/script';

const inter = Inter({ subsets: ["latin"] });
inject({ mode: dev ? 'development' : 'production' });

export const metadata: Metadata = {
  title: "University Acceptance Assistant",
  description: "AI assistant for university application process",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <Script async src="https://www.googletagmanager.com/gtag/js?id=G-GT6CN7VECS" />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-GT6CN7VECS');
          `}
        </Script>
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
