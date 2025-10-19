'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Check, ImageOff } from 'lucide-react';

interface ImageCardProps {
  imageUrl: string;
  isSelected: boolean;
  isEnabled: boolean;
  onSelect: () => void;
  onToggleEnabled: () => void;
  alt?: string;
}

export function ImageCard({
  imageUrl,
  isSelected,
  isEnabled,
  onSelect,
  onToggleEnabled,
  alt = 'Property image',
}: ImageCardProps) {
  const [imageError, setImageError] = useState(false);

  return (
    <div
      className={`relative group rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
        isSelected
          ? 'border-accent shadow-lg scale-105'
          : 'border-border hover:border-accent/50'
      }`}
      onClick={onSelect}
    >
      <div className="aspect-square relative bg-muted">
        {!imageError ? (
          <Image
            src={imageUrl}
            alt={alt}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-secondary">
            <ImageOff className="w-12 h-12" />
          </div>
        )}

        {isSelected && (
          <div className="absolute top-2 right-2 bg-accent text-white rounded-full p-1">
            <Check className="w-5 h-5" />
          </div>
        )}
      </div>

      {isSelected && (
        <div
          className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            onClick={onToggleEnabled}
            className={`w-full px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              isEnabled
                ? 'bg-green-500 text-white hover:bg-green-600'
                : 'bg-gray-500 text-white hover:bg-gray-600'
            }`}
          >
            {isEnabled ? 'Enabled' : 'Disabled'}
          </button>
        </div>
      )}
    </div>
  );
}

