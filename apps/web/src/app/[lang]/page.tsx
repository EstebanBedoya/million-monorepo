import { redirect } from 'next/navigation';
import type { Locale } from '@/i18n';

interface PageProps {
  params: Promise<{
    lang: Locale;
  }>;
}

export default async function Home({ params }: PageProps) {
  const { lang } = await params;
  redirect(`/${lang}/properties`);
}

