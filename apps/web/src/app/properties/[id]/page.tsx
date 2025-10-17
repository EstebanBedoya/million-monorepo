import { PropertyDetailPage } from '../../../presentation/pages/PropertyDetailPage';

interface PageProps {
  params: {
    id: string;
  };
}

export default function PropertyDetail({ params }: PageProps) {
  return <PropertyDetailPage id={params.id} />;
}