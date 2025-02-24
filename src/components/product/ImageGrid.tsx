
import React from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import type { ProductImage } from "@/hooks/use-product-images";

interface ImageGridProps {
  images: ProductImage[];
  onImageClick: (image: ProductImage) => void;
  onRemoveImage: (imageId: number, storagePath: string) => void;
}

export function ImageGrid({ images, onImageClick, onRemoveImage }: ImageGridProps) {
  return (
    <div className="grid grid-cols-4 gap-4">
      {images.map((image) => (
        <div 
          key={image.id} 
          className="relative group aspect-square rounded-lg border bg-muted cursor-pointer overflow-hidden"
          onClick={() => onImageClick(image)}
        >
          <img
            src={image.url}
            alt={image.alt_text || image.file_name}
            className="w-full h-full object-cover rounded-lg transition-transform group-hover:scale-105"
          />
          <Button
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={(e) => {
              e.stopPropagation();
              onRemoveImage(image.id, image.storage_path);
            }}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ))}
    </div>
  );
}
