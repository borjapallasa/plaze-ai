
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { CommunityImage } from "@/types/community-images";

interface CommunityImageGalleryProps {
  images: CommunityImage[];
  onImageSelect: (image: CommunityImage) => void;
  selectedImage?: CommunityImage;
}

export function CommunityImageGallery({ 
  images, 
  onImageSelect, 
  selectedImage 
}: CommunityImageGalleryProps) {
  if (!images || images.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      {/* Selected Image Display */}
      {selectedImage && (
        <Card className="p-4">
          <div className="aspect-video w-full bg-muted rounded-lg overflow-hidden">
            <img
              src={selectedImage.url}
              alt={selectedImage.alt_text || selectedImage.file_name}
              className="w-full h-full object-contain"
            />
          </div>
          <p className="text-sm text-muted-foreground mt-2 text-center">
            {selectedImage.file_name}
          </p>
        </Card>
      )}

      {/* Scrollable Image Gallery */}
      <div className="relative">
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {images.map((image) => (
            <button
              key={image.id}
              onClick={() => onImageSelect(image)}
              className={`flex-shrink-0 relative rounded-lg overflow-hidden transition-all hover:scale-105 ${
                selectedImage?.id === image.id 
                  ? 'ring-2 ring-primary shadow-lg' 
                  : 'hover:shadow-md'
              }`}
            >
              <div className="w-24 h-16 bg-muted">
                <img
                  src={image.url}
                  alt={image.alt_text || image.file_name}
                  className="w-full h-full object-cover"
                />
              </div>
              {image.is_primary && (
                <div className="absolute top-1 left-1 bg-primary/90 text-primary-foreground text-xs px-1 py-0.5 rounded">
                  Primary
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
