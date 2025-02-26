
import React, { useState, useEffect } from "react";
import type { ProductImage } from "@/hooks/use-product-images";

interface ProductGalleryProps {
  images: ProductImage[];
  className?: string;
  priority?: boolean;
}

export function ProductGallery({ images, className, priority = false }: ProductGalleryProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const getImageSizes = (url: string) => {
    return {
      small: `${url}?w=400&q=75`,
      medium: `${url}?w=800&q=75`,
      large: `${url}?w=1200&q=75`,
      thumbnail: `${url}?w=200&q=75`
    };
  };

  useEffect(() => {
    if (images.length && currentImageIndex >= images.length) {
      setCurrentImageIndex(0);
    }
  }, [images, currentImageIndex]);

  const currentImage = images[currentImageIndex];
  const imageSizes = currentImage ? getImageSizes(currentImage.url) : null;

  if (!images.length || !imageSizes) {
    return null;
  }

  return (
    <div className={className}>
      {/* Desktop Layout */}
      <div className="hidden lg:block space-y-6">
        {/* Main image container */}
        <div className="w-full aspect-video bg-card rounded-lg overflow-hidden relative flex items-center justify-center">
          <img 
            src={imageSizes.large}
            alt={currentImage.alt_text || currentImage.file_name}
            className={`max-w-full max-h-full object-contain transition-opacity duration-300 ${
              isLoading ? 'opacity-0' : 'opacity-100'
            }`}
            onLoad={() => setIsLoading(false)}
            loading={priority ? "eager" : "lazy"}
            fetchPriority={priority ? "high" : "auto"}
            decoding="async"
            sizes="(min-width: 1024px) 50vw, 100vw"
            srcSet={`
              ${imageSizes.medium} 800w,
              ${imageSizes.large} 1200w
            `}
          />
          {isLoading && (
            <div className="absolute inset-0 bg-muted animate-pulse" />
          )}
        </div>

        {/* Thumbnails in a scrollable container below */}
        {images.length > 1 && (
          <div className="relative w-full px-1">
            <div className="flex gap-4 overflow-x-auto py-1 px-1 snap-x snap-mandatory -mx-1">
              {images.map((img, i) => {
                const thumbSizes = getImageSizes(img.url);
                return (
                  <button 
                    key={i}
                    className={`flex-shrink-0 cursor-pointer overflow-hidden rounded-lg transition-all snap-start ${
                      i === currentImageIndex ? 'ring-2 ring-primary' : 'hover:opacity-80'
                    }`}
                    onClick={() => setCurrentImageIndex(i)}
                  >
                    <div className="aspect-video w-24 relative">
                      <img 
                        src={thumbSizes.thumbnail}
                        alt={img.alt_text || img.file_name}
                        className="absolute inset-0 w-full h-full object-cover"
                        loading="lazy"
                        decoding="async"
                      />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Mobile Layout */}
      <div className="lg:hidden">
        <div className="aspect-video bg-card rounded-lg overflow-hidden relative flex items-center justify-center">
          <img 
            src={imageSizes.large}
            alt={currentImage.alt_text || currentImage.file_name}
            className={`max-w-full max-h-full object-contain transition-opacity duration-300 ${
              isLoading ? 'opacity-0' : 'opacity-100'
            }`}
            onLoad={() => setIsLoading(false)}
            loading={priority ? "eager" : "lazy"}
            fetchPriority={priority ? "high" : "auto"}
            decoding="async"
            sizes="(max-width: 768px) 100vw, 50vw"
            srcSet={`
              ${imageSizes.small} 400w,
              ${imageSizes.medium} 800w,
              ${imageSizes.large} 1200w
            `}
          />
          {isLoading && (
            <div className="absolute inset-0 bg-muted animate-pulse" />
          )}
        </div>
        {images.length > 1 && (
          <div className="flex justify-center gap-2 mt-4">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentImageIndex(i)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  i === currentImageIndex ? 'bg-primary' : 'bg-primary/50'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
