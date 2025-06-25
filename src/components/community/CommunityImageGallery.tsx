
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import type { ProductImage } from '@/types/product-images';

interface CommunityImageGalleryProps {
  images: ProductImage[];
}

export function CommunityImageGallery({ images }: CommunityImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<ProductImage | null>(
    images.find(img => img.is_primary) || images[0] || null
  );

  if (!images || images.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      {/* Main selected image */}
      {selectedImage && (
        <Card className="overflow-hidden">
          <div className="aspect-video w-full">
            <img
              src={selectedImage.url}
              alt={selectedImage.alt_text || selectedImage.file_name}
              className="w-full h-full object-cover"
            />
          </div>
        </Card>
      )}

      {/* Scrollable thumbnail gallery */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {images.map((image) => (
            <button
              key={image.id}
              onClick={() => setSelectedImage(image)}
              className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                selectedImage?.id === image.id
                  ? 'border-primary shadow-md'
                  : 'border-muted hover:border-primary/50'
              }`}
            >
              <img
                src={image.url}
                alt={image.alt_text || image.file_name}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
