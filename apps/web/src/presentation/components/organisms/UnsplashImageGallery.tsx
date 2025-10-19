'use client';

import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { ImageCard } from '../molecules/ImageCard';
import { useDictionary } from '@/i18n/client';

interface SelectedImage {
  url: string;
  enabled: boolean;
}

interface UnsplashImageGalleryProps {
  selectedImages: SelectedImage[];
  onImagesChange: (images: SelectedImage[]) => void;
}

const UNSPLASH_CATEGORIES = [
  'house',
  'apartment',
  'villa',
  'interior',
  'architecture',
  'real-estate',
];

const SAMPLE_IMAGES = [
  'https://images.unsplash.com/photo-1568605114967-8130f3a36994',
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9',
  'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c',
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c',
  'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3',
  'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde',
  'https://images.unsplash.com/photo-1512917774080-9991f1c4c750',
  'https://images.unsplash.com/photo-1600210492493-0946911123ea',
  'https://images.unsplash.com/photo-1600573472550-8090b5e0745e',
  'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea',
  'https://images.unsplash.com/photo-1600585154526-990dced4db0d',
  'https://images.unsplash.com/photo-1600607687644-c7171b42498b',
];

export function UnsplashImageGallery({
  selectedImages,
  onImagesChange,
}: UnsplashImageGalleryProps) {
  const dict = useDictionary();
  const [searchTerm, setSearchTerm] = useState('house');
  const [availableImages, setAvailableImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadImages(searchTerm);
  }, []);

  const loadImages = (query: string) => {
    setIsLoading(true);
    
    const baseImages = SAMPLE_IMAGES.map(
      (url) => `${url}?auto=format&fit=crop&w=400&q=80`
    );
    
    const categoryImages = UNSPLASH_CATEGORIES.map(
      (category) =>
        `https://images.unsplash.com/photo-${Math.floor(
          1600000000000 + Math.random() * 100000000000
        )}?auto=format&fit=crop&w=400&q=80&sig=${category}`
    );

    setAvailableImages([...baseImages, ...categoryImages]);
    setIsLoading(false);
  };

  const handleSelectImage = (imageUrl: string) => {
    const isAlreadySelected = selectedImages.some((img) => img.url === imageUrl);

    if (isAlreadySelected) {
      onImagesChange(selectedImages.filter((img) => img.url !== imageUrl));
    } else {
      onImagesChange([...selectedImages, { url: imageUrl, enabled: true }]);
    }
  };

  const handleToggleEnabled = (imageUrl: string) => {
    onImagesChange(
      selectedImages.map((img) =>
        img.url === imageUrl ? { ...img, enabled: !img.enabled } : img
      )
    );
  };

  const isImageSelected = (imageUrl: string) => {
    return selectedImages.some((img) => img.url === imageUrl);
  };

  const getImageEnabledStatus = (imageUrl: string) => {
    const image = selectedImages.find((img) => img.url === imageUrl);
    return image?.enabled ?? true;
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          {dict.propertyForm?.images || 'Images'}
        </label>
        
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={dict.propertyForm?.searchImages || 'Search images on Unsplash'}
            className="flex-1 px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                loadImages(searchTerm);
              }
            }}
          />
          <button
            type="button"
            onClick={() => loadImages(searchTerm)}
            className="px-4 py-2 bg-accent text-accent-foreground rounded-md hover:bg-accent/90 transition-colors"
          >
            <Search className="w-5 h-5" />
          </button>
        </div>

        {selectedImages.length > 0 && (
          <div className="mb-4 p-3 bg-accent/10 border border-accent/20 rounded-md">
            <p className="text-sm text-foreground">
              {selectedImages.length} {selectedImages.length === 1 ? 'image' : 'images'} selected
              {' • '}
              {selectedImages.filter((img) => img.enabled).length} enabled
            </p>
          </div>
        )}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="aspect-square bg-muted animate-pulse rounded-lg"
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 max-h-96 overflow-y-auto p-1">
          {availableImages.map((imageUrl, index) => (
            <ImageCard
              key={`${imageUrl}-${index}`}
              imageUrl={imageUrl}
              isSelected={isImageSelected(imageUrl)}
              isEnabled={getImageEnabledStatus(imageUrl)}
              onSelect={() => handleSelectImage(imageUrl)}
              onToggleEnabled={() => handleToggleEnabled(imageUrl)}
              alt={`Property image ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

