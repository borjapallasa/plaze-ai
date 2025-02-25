
import React, { useState, useEffect } from "react";
import type { ProductImage } from "@/hooks/use-product-images";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import useEmblaCarousel from "embla-carousel-react";

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

  const [emblaRef, emblaApi] = useEmblaCarousel({ align: "center" });

  useEffect(() => {
    if (emblaApi) {
      const onSelect = () => {
        setCurrentImageIndex(emblaApi.selectedScrollSnap());
      };

      emblaApi.on('select', onSelect);
      
      // Initial sync
      onSelect();

      return () => {
        emblaApi.off('select', onSelect);
      };
    }
  }, [emblaApi]);

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
      <div className="lg:hidden">
        <Carousel>
          <div className="relative" ref={emblaRef}>
            <CarouselContent>
              {images.map((image, index) => {
                const sizes = getImageSizes(image.url);
                return (
                  <CarouselItem key={index}>
                    <div className="bg-card rounded-lg overflow-hidden aspect-square flex items-center justify-center">
                      <img 
                        src={sizes.medium}
                        alt={image.alt_text || image.file_name}
                        className={`max-w-full max-h-full object-contain transition-opacity duration-300 ${
                          isLoading ? 'opacity-0' : 'opacity-100'
                        }`}
                        onLoad={() => setIsLoading(false)}
                        loading={priority ? "eager" : "lazy"}
                        fetchPriority={priority ? "high" : "auto"}
                        decoding="async"
                        sizes="(max-width: 768px) 100vw, 50vw"
                        srcSet={`
                          ${sizes.small} 400w,
                          ${sizes.medium} 800w,
                          ${sizes.large} 1200w
                        `}
                      />
                      {isLoading && (
                        <div className="absolute inset-0 bg-muted animate-pulse" />
                      )}
                    </div>
                  </CarouselItem>
                );
              })}
            </CarouselContent>
            {images.length > 1 && (
              <>
                <CarouselPrevious className="left-2" />
                <CarouselNext className="right-2" />
              </>
            )}
          </div>
          {images.length > 1 && (
            <div className="flex justify-center gap-2 mt-4">
              {images.map((_, index) => (
                <button
                  key={index}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentImageIndex ? 'bg-primary' : 'bg-gray-300'
                  }`}
                  onClick={() => emblaApi?.scrollTo(index)}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          )}
        </Carousel>
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:flex gap-4">
        {/* Thumbnails on the left */}
        {images.length > 1 && (
          <div className="flex flex-col gap-4 w-24">
            {images.map((img, i) => {
              const thumbSizes = getImageSizes(img.url);
              return (
                <div 
                  key={i}
                  className={`w-24 h-24 rounded-lg flex-shrink-0 cursor-pointer overflow-hidden bg-card flex items-center justify-center ${
                    i === currentImageIndex ? 'ring-2 ring-primary' : 'hover:opacity-80'
                  }`}
                  onClick={() => setCurrentImageIndex(i)}
                >
                  <img 
                    src={thumbSizes.thumbnail}
                    alt={img.alt_text || img.file_name}
                    className="max-w-full max-h-full object-contain"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              );
            })}
          </div>
        )}

        {/* Main image */}
        <div className="flex-1 bg-card rounded-lg overflow-hidden aspect-square relative flex items-center justify-center">
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
      </div>
    </div>
  );
}
