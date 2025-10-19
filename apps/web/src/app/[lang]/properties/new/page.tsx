import { PropertyForm } from '@/presentation/components/organisms/PropertyForm';
import { getDictionary } from '@/i18n/get-dictionary';
import Link from 'next/link';

interface NewPropertyPageProps {
  params: Promise<{
    lang: string;
  }>;
}

export default async function NewPropertyPage({ params }: NewPropertyPageProps) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

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
            {dict.propertyForm.createTitle}
          </h1>
          <p className="mt-2 text-secondary">
            Fill in the information below to create a new property listing.
          </p>
        </div>

        <PropertyForm mode="create" />
      </div>
    </div>
  );
}

