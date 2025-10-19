import type { Metadata } from "next";
import { Cinzel, Cairo } from "next/font/google";
import "../globals.css";
import { ReduxProvider } from "@/providers/ReduxProvider";
import { Header } from "@/presentation/components/organisms/Header";
import { i18n, type Locale } from '@/i18n';
import { getDictionary } from '@/i18n/get-dictionary';
import { I18nProvider } from '@/i18n/client';

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
  title: "MILLION - Find Your Dream Home",
  description: "Discover luxury real estate properties with elegant design and exceptional service",
};

export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ lang: locale }));
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}>) {
  const { lang } = await params;
  const dict = await getDictionary(lang as Locale);

  return (
    <html lang={lang}>
      <body
        className={`${cinzel.variable} ${cairo.variable} antialiased`}
        style={{ fontFamily: 'var(--font-cinzel)' }}
      >
        <ReduxProvider>
          <I18nProvider lang={lang as Locale} dict={dict}>
            <Header currentLang={lang as Locale} />
            {children}
          </I18nProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}

