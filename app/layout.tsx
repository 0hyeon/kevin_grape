import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

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
  title: "Kevin Grape | 케빈포도",
  description: "산지 직송 프리미엄 포도 — 금향포도, 슈팅스타포도, 샤인머스켓",
  openGraph: {
    title: "Kevin Grape | 케빈포도",
    description: "산지 직송 프리미엄 포도 — 금향포도, 슈팅스타포도, 샤인머스켓",
    images: [
      {
        url: "/images/2870953181_L1.jpg",
        width: 1200,
        height: 630,
        alt: "Kevin Grape 케빈포도",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kevin Grape | 케빈포도",
    description: "산지 직송 프리미엄 포도 — 금향포도, 슈팅스타포도, 샤인머스켓",
    images: ["/images/2870953181_L1.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
