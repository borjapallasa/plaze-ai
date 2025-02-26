
import React, { useState, useEffect } from "react";
import type { ProductImage } from "@/hooks/use-product-images";
import { cn } from "@/lib/utils";

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

  const currentImage = images[currentImageIndex];
  const imageSizes = currentImage ? getImageSizes(currentImage.url) : null;

  useEffect(() => {
    if (images.length && currentImageIndex >= images.length) {
      setCurrentImageIndex(0);
    }
  }, [images, currentImageIndex]);

  if (!images.length || !imageSizes) {
    return null;
  }

  return (
    <div className={cn("space-y-4", className)}>
      {/* Main Image */}
      <div className="relative aspect-video bg-gradient-to-br from-blue-500/10 to-blue-600/10 rounded-lg overflow-hidden">
        <img 
          src={imageSizes.large}
          alt={currentImage.alt_text || currentImage.file_name}
          className={cn(
            "w-full h-full object-contain transition-opacity duration-300",
            isLoading ? 'opacity-0' : 'opacity-100'
          )}
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

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-4">
          {images.map((img, i) => {
            const thumbSizes = getImageSizes(img.url);
            return (
              <button
                key={i}
                onClick={() => setCurrentImageIndex(i)}
                className={cn(
                  "relative aspect-video rounded-lg overflow-hidden bg-gradient-to-br from-blue-500/10 to-blue-600/10",
                  "hover:ring-2 hover:ring-primary/50 transition-all duration-200",
                  i === currentImageIndex && "ring-2 ring-primary"
                )}
              >
                <img 
                  src={thumbSizes.thumbnail}
                  alt={img.alt_text || img.file_name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
