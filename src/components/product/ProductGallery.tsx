
import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProductGalleryProps {
  image: string;
  className?: string;
}

export function ProductGallery({ image, className }: ProductGalleryProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const totalImages = 5;

  return (
    <div className={className}>
      {/* Mobile Layout */}
      <div className="lg:hidden space-y-4">
        {/* Main Image */}
        <div className="bg-card rounded-lg overflow-hidden aspect-square">
          <img 
            src={image} 
            alt="Product"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Navigation Controls */}
        <div className="flex flex-col items-center gap-3">
          {/* Arrows */}
          <div className="flex items-center justify-between w-full px-2">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8"
              onClick={() => setCurrentImageIndex((prev) => (prev === 0 ? totalImages - 1 : prev - 1))}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8"
              onClick={() => setCurrentImageIndex((prev) => (prev === totalImages - 1 ? 0 : prev + 1))}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          {/* Image Indicators */}
          <div className="flex gap-2">
            {Array(totalImages).fill(0).map((_, i) => (
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
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:flex gap-4">
        {/* Thumbnails on the left */}
        <div className="flex flex-col gap-4 w-24">
          {Array(totalImages).fill(0).map((_, i) => (
            <img 
              key={i}
              src={image} 
              alt={`Preview ${i + 1}`}
              className={`w-24 h-24 rounded-lg object-cover flex-shrink-0 cursor-pointer transition-opacity ${
                i === currentImageIndex ? 'ring-2 ring-primary' : 'hover:opacity-80'
              }`}
              onClick={() => setCurrentImageIndex(i)}
            />
          ))}
        </div>

        {/* Main image */}
        <div className="flex-1 bg-card rounded-lg overflow-hidden aspect-square">
          <img 
            src={image} 
            alt="Product"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
}
