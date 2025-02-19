
import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProductGalleryProps {
  image: string;
  className?: string;
}

export function ProductGallery({ image, className }: ProductGalleryProps) {
  return (
    <div className={className}>
      {/* Mobile Layout */}
      <div className="lg:hidden space-y-4">
        {/* Arrow Navigation */}
        <div className="flex items-center justify-between px-2">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm text-muted-foreground">1 of 5</span>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Main Image */}
        <div className="bg-card rounded-lg overflow-hidden aspect-square">
          <img 
            src={image} 
            alt="Product"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:flex gap-4">
        {/* Thumbnails on the left */}
        <div className="flex flex-col gap-4 w-24">
          {Array(5).fill(0).map((_, i) => (
            <img 
              key={i}
              src={image} 
              alt={`Preview ${i + 1}`}
              className="w-24 h-24 rounded-lg object-cover flex-shrink-0 cursor-pointer hover:opacity-80 transition-opacity"
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
