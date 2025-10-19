import { PropertyForm } from '@/presentation/components/organisms/PropertyForm';
import { getDictionary } from '@/i18n/get-dictionary';
import { HttpClient } from '@/infrastructure/http/HttpClient';
import { PropertyApiClient } from '@/infrastructure/api/PropertyApiClient';
import { PropertyImageApiClient } from '@/infrastructure/api/PropertyImageApiClient';
import Link from 'next/link';
import { notFound } from 'next/navigation';

interface EditPropertyPageProps {
  params: Promise<{
    lang: string;
    id: string;
  }>;
}

export default async function EditPropertyPage({ params }: EditPropertyPageProps) {
  const { lang, id } = await params;
  const dict = await getDictionary(lang);

  const httpClient = new HttpClient({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
    timeout: 30000,
    retries: 3,
    retryDelay: 1000,
  });

  const propertyApiClient = new PropertyApiClient(httpClient);
  const propertyImageApiClient = new PropertyImageApiClient(httpClient);

  let property;
  let images;

  try {
    property = await propertyApiClient.fetchPropertyById(id);
    
    try {
      const imagesResponse = await propertyImageApiClient.fetchPropertyImages(id);
      images = imagesResponse.images.map((img) => ({
        url: img.file,
        enabled: img.enabled,
      }));
    } catch (error) {
      console.error('Error loading images:', error);
      images = [];
    }
  } catch (error) {
    console.error('Error loading property:', error);
    notFound();
  }

  const initialData = {
    name: property.name,
    address: property.address,
    price: property.price,
    codeInternal: property.codeInternal,
    year: property.year,
    idOwner: property.idOwner,
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Link
            href={`/${lang}/properties`}
            className="inline-flex items-center text-sm text-accent hover:text-accent/80 transition-colors mb-4"
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            {dict.properties.backToProperties}
          </Link>
          
          <h1 className="text-3xl font-bold text-foreground">
            {dict.propertyForm.editTitle}
          </h1>
          <p className="mt-2 text-secondary">
            Update the property information below.
          </p>
        </div>

        <PropertyForm
          mode="edit"
          propertyId={id}
          initialData={initialData}
          initialImages={images}
        />
      </div>
    </div>
  );
}

