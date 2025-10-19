import { PropertyDetailPage } from '@/presentation/pages/PropertyDetailPage';
import type { Locale } from '@/i18n';

interface PageProps {
  params: Promise<{
    lang: Locale;
    id: string;
  }>;
}

export default async function PropertyDetail({ params }: PageProps) {
  const { id } = await params;
  
  return <PropertyDetailPage id={id} />;
}

