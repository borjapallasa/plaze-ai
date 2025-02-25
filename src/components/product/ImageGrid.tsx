
import React from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import type { ProductImage } from "@/hooks/use-product-images";

interface ImageGridProps {
  images: ProductImage[];
  onImageClick: (image: ProductImage) => void;
  onRemoveImage: (imageId: number, storagePath: string) => void;
  onReorderImages?: (sourceId: number, targetId: number) => void;
}

export function ImageGrid({ images, onImageClick, onRemoveImage, onReorderImages }: ImageGridProps) {
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, image: ProductImage) => {
    e.dataTransfer.setData('imageId', image.id.toString());
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, targetImage: ProductImage) => {
    e.preventDefault();
    const sourceId = Number(e.dataTransfer.getData('imageId'));
    if (sourceId !== targetImage.id && onReorderImages) {
      onReorderImages(sourceId, targetImage.id);
    }
  };

  return (
    <div className="grid grid-cols-4 gap-4">
      {images.map((image) => (
        <div 
          key={image.id} 
          className={`relative group aspect-square rounded-lg border bg-muted cursor-move overflow-hidden ${
            image.is_primary ? 'ring-2 ring-primary' : ''
          }`}
          draggable
          onDragStart={(e) => handleDragStart(e, image)}
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, image)}
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
          {image.is_primary && (
            <div className="absolute bottom-2 left-2 px-2 py-1 bg-primary/80 text-primary-foreground rounded-md text-xs">
              Primary
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
