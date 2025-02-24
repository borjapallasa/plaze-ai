
import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ProductImage } from "@/hooks/use-product-images";

interface ProductGalleryProps {
  images: ProductImage[];
  className?: string;
  priority?: boolean;
}

export function ProductGallery({ images, className, priority = false }: ProductGalleryProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Function to generate responsive image sizes
  const getImageSizes = (url: string) => {
    return {
      small: `${url}?w=400&q=75`,  // Mobile
      medium: `${url}?w=800&q=75`, // Tablet
      large: `${url}?w=1200&q=75`, // Desktop
      thumbnail: `${url}?w=200&q=75` // Thumbnails
    };
  };

  const currentImage = images[currentImageIndex];
  const imageSizes = currentImage ? getImageSizes(currentImage.url) : null;

  // Reset current index when images change
  useEffect(() => {
    if (images.length && currentImageIndex >= images.length) {
      setCurrentImageIndex(0);
    }
  }, [images, currentImageIndex]);

  if (!images.length || !imageSizes) {
    return null;
  }

  return (
    <div className={className}>
      {/* Mobile Layout */}
      <div className="lg:hidden space-y-4">
        {/* Main Image */}
        <div className="bg-card rounded-lg overflow-hidden aspect-square">
          <img 
            src={imageSizes.medium}
            alt={currentImage.alt_text || currentImage.file_name}
            className={`w-full h-full object-cover transition-opacity duration-300 ${
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

        {/* Navigation Controls */}
        {images.length > 1 && (
          <div className="flex flex-col items-center gap-3">
            <div className="flex items-center justify-between w-full px-2">
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8"
                onClick={() => setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              {/* Image Indicators */}
              <div className="flex gap-2">
                {images.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentImageIndex(i)}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      i === currentImageIndex 
                        ? 'bg-primary' 
                        : 'bg-muted hover:bg-muted-foreground/50'
                    }`}
                    aria-label={`Go to image ${i + 1}`}
                  />
                ))}
              </div>

              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8"
                onClick={() => setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:flex gap-4">
        {/* Thumbnails on the left */}
        {images.length > 1 && (
          <div className="flex flex-col gap-4 w-24">
            {images.map((img, i) => {
              const thumbSizes = getImageSizes(img.url);
              return (
                <img 
                  key={i}
                  src={thumbSizes.thumbnail}
                  alt={img.alt_text || img.file_name}
                  className={`w-24 h-24 rounded-lg object-cover flex-shrink-0 cursor-pointer transition-opacity ${
                    i === currentImageIndex ? 'ring-2 ring-primary' : 'hover:opacity-80'
                  }`}
                  onClick={() => setCurrentImageIndex(i)}
                  loading="lazy"
                  decoding="async"
                />
              );
            })}
          </div>
        )}

        {/* Main image */}
        <div className="flex-1 bg-card rounded-lg overflow-hidden aspect-square relative">
          <img 
            src={imageSizes.large}
            alt={currentImage.alt_text || currentImage.file_name}
            className={`w-full h-full object-cover transition-opacity duration-300 ${
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
      </div>
    </div>
  );
}
