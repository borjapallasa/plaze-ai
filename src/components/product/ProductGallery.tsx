
import React from "react";

interface ProductGalleryProps {
  image: string;
  className?: string;
}

export function ProductGallery({ image, className }: ProductGalleryProps) {
  return (
    <div className={className}>
      <div className="flex gap-4">
        {/* Thumbnails on the left */}
        <div className="flex flex-col gap-4 w-24">
          {Array(5).fill(0).map((_, i) => (
            <img 
              key={i}
              src={image} 
              alt={`Preview ${i + 1}`}
              className="w-24 h-24 rounded-lg object-cover flex-shrink-0"
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
