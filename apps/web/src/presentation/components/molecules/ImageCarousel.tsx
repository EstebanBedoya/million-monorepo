'use client';

import { useState, useCallback, useRef, TouchEvent } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Image } from '../atoms/Image';
import { Button } from '../atoms/Button';
import { Icon } from '../atoms/Icon';
import { cn } from '../../../utils/cn';

export interface ImageCarouselProps {
  images: Array<{
    idPropertyImage?: string;
    idProperty?: string;
    file: string;
    enabled?: boolean;
  }> | string[];
  alt: string;
  className?: string;
}

export function ImageCarousel({ images, alt, className }: ImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<'left' | 'right' | null>(null);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  
  // Normalize images to a consistent format
  const normalizedImages = images.map((image, index) => {
    if (typeof image === 'string') {
      return {
        idPropertyImage: `img-${index}`,
        idProperty: 'unknown',
        file: image,
        enabled: true
      };
    }
    return {
      idPropertyImage: image.idPropertyImage || `img-${index}`,
      idProperty: image.idProperty || 'unknown',
      file: image.file,
      enabled: image.enabled !== false // Default to true if not specified
    };
  });
  
  // Filter only enabled images
  const enabledImages = normalizedImages.filter(image => image.enabled);
  
  const goToPrevious = useCallback(() => {
    setDirection('right');
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? enabledImages.length - 1 : prevIndex - 1
    );
    setTimeout(() => setDirection(null), 500);
  }, [enabledImages.length]);

  const goToNext = useCallback(() => {
    setDirection('left');
    setCurrentIndex((prevIndex) => 
      prevIndex === enabledImages.length - 1 ? 0 : prevIndex + 1
    );
    setTimeout(() => setDirection(null), 500);
  }, [enabledImages.length]);

  const goToSlide = useCallback((index: number) => {
    if (index > currentIndex) {
      setDirection('left');
    } else if (index < currentIndex) {
      setDirection('right');
    }
    setCurrentIndex(index);
    setTimeout(() => setDirection(null), 500);
  }, [currentIndex]);

  // Touch handlers for mobile swipe
  const handleTouchStart = (e: TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current - touchEndX.current > 50) {
      // Swiped left
      goToNext();
    }
    if (touchStartX.current - touchEndX.current < -50) {
      // Swiped right
      goToPrevious();
    }
  };

  // If no enabled images, show placeholder
  if (enabledImages.length === 0) {
    return (
      <div className={cn('relative h-[350px] md:h-[450px] rounded-lg overflow-hidden bg-secondary/10', className)}>
        <Image
          src="/placeholder-property.jpg"
          alt={alt}
          fill
          priority
          sizes="(max-width: 768px) 100vw, 66vw"
          className="object-cover"
          fallbackSrc="/placeholder-property.jpg"
        />
      </div>
    );
  }

  // If only one image, show it without controls
  if (enabledImages.length === 1) {
    return (
      <div className={cn('relative h-[350px] md:h-[450px] rounded-lg overflow-hidden bg-secondary/10', className)}>
        <Image
          src={enabledImages[0].file}
          alt={alt}
          fill
          priority
          sizes="(max-width: 768px) 100vw, 66vw"
          className="object-cover"
          fallbackSrc="/placeholder-property.jpg"
        />
      </div>
    );
  }

  return (
    <div 
      className={cn('relative h-[350px] md:h-[450px] rounded-lg overflow-hidden bg-secondary/10 group touch-pan-y', className)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Images Container with slide animation */}
      <div className="relative w-full h-full">
        {enabledImages.map((image, index) => (
          <div
            key={image.idPropertyImage}
            className={cn(
              'absolute inset-0 transition-all duration-500 ease-in-out',
              index === currentIndex && 'translate-x-0 opacity-100 z-10',
              index < currentIndex && direction === 'left' && '-translate-x-full opacity-0',
              index > currentIndex && direction === 'left' && 'translate-x-full opacity-0',
              index < currentIndex && direction === 'right' && '-translate-x-full opacity-0',
              index > currentIndex && direction === 'right' && 'translate-x-full opacity-0',
              index !== currentIndex && !direction && 'translate-x-full opacity-0'
            )}
          >
            <Image
              src={image.file}
              alt={`${alt} - Image ${index + 1}`}
              fill
              priority={index === currentIndex}
              sizes="(max-width: 768px) 100vw, 66vw"
              className="object-cover"
              fallbackSrc="/placeholder-property.jpg"
            />
          </div>
        ))}
      </div>

      {/* Gradient overlays for better readability */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/20 pointer-events-none" />
      
      {/* Navigation Arrows */}
      <Button
        variant="ghost"
        size="sm"
        onClick={goToPrevious}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-all duration-300 p-3 hover:scale-110 backdrop-blur-sm z-20"
        aria-label="Previous image"
      >
        <Icon icon={ChevronLeft} size="sm" />
      </Button>

      <Button
        variant="ghost"
        size="sm"
        onClick={goToNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-all duration-300 p-3 hover:scale-110 backdrop-blur-sm z-20"
        aria-label="Next image"
      >
        <Icon icon={ChevronRight} size="sm" />
      </Button>

      {/* Image Counter */}
      <div className="absolute top-4 right-4 bg-black/60 text-white px-3 py-1.5 rounded-full text-sm font-medium backdrop-blur-md z-20 shadow-lg">
        {currentIndex + 1} / {enabledImages.length}
      </div>

      {/* Thumbnail Navigation */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {enabledImages.map((image, index) => (
          <button
            key={image.idPropertyImage}
            onClick={() => goToSlide(index)}
            className={cn(
              'w-14 h-10 rounded-lg overflow-hidden border-2 transition-all duration-300 hover:scale-110 active:scale-95',
              index === currentIndex
                ? 'border-white shadow-xl scale-110 ring-2 ring-white/30'
                : 'border-white/40 hover:border-white/70 shadow-md'
            )}
            aria-label={`Go to image ${index + 1}`}
          >
            <Image
              src={image.file}
              alt={`Thumbnail ${index + 1}`}
              width={56}
              height={40}
              className="object-cover w-full h-full"
              fallbackSrc="/placeholder-property.jpg"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
