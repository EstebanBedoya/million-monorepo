import type { Metadata } from "next";
import { Cinzel, Cairo } from "next/font/google";
import "./globals.css";
import { ReduxProvider } from "../providers/ReduxProvider";

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "ESTATELY - Find Your Dream Home",
  description: "Discover luxury real estate properties with elegant design and exceptional service",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${cinzel.variable} ${cairo.variable} antialiased`}
        style={{ fontFamily: 'var(--font-cinzel)' }}
      >
        <ReduxProvider>
          {children}
        </ReduxProvider>
      </body>
    </html>
  );
}
