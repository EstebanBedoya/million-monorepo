import { PropertyDetailPage } from '../../../presentation/pages/PropertyDetailPage';

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function PropertyDetail({ params }: PageProps) {
  const { id } = await params;
  return <PropertyDetailPage id={id} />;
}