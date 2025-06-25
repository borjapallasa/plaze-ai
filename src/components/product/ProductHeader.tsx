
import React from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { useExpertName } from "@/hooks/use-expert-name";

interface ProductHeaderProps {
  title: string;
  seller: string;
  rating: number;
  className?: string;
  onContactSeller: () => void;
  expertUuid?: string;
  shortDescription?: string;
}

export function ProductHeader({ 
  title, 
  seller, 
  rating, 
  onContactSeller, 
  className = "",
  expertUuid,
  shortDescription
}: ProductHeaderProps) {
  const { data: expertName } = useExpertName(expertUuid);
  
  const renderStars = () => {
    return Array(5).fill(0).map((_, index) => {
      const starValue = index + 1;
      const isActive = starValue <= rating;
      
      return (
        <Star 
          key={index}
          className={cn(
            "h-3 w-3",
            isActive 
              ? "fill-yellow-400 text-yellow-400" 
              : "fill-gray-200 text-gray-200"
          )}
        />
      );
    });
  };

  const capitalizeFirstLetter = (str: string) => {
    if (!str) return str;
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const displayName = expertName ? capitalizeFirstLetter(expertName) : seller;

  return (
    <div className={className}>
      <h1 className="text-2xl font-semibold mb-3">{title}</h1>
      <div className="flex items-center gap-1 text-xs text-muted-foreground mb-3">
        <span className="font-bold">
          {displayName}
        </span>
        <span className="mx-0.5">•</span>
        <div className="flex gap-0.5">
          {renderStars()}
        </div>
      </div>
      {shortDescription && (
        <div className="text-sm text-muted-foreground leading-relaxed">
          {shortDescription}
        </div>
      )}
    </div>
  );
}
