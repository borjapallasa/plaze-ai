
import { Star } from "lucide-react";
import React from "react";

interface ProductHeaderProps {
  title: string;
  seller: string;
  rating: number;
  className?: string;
}

export function ProductHeader({ title, seller, rating, className }: ProductHeaderProps) {
  // Convert rating to number of full and half stars
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className={className}>
      <div className="flex items-center gap-4 mb-2">
        <h3 className="text-lg font-semibold">{seller}</h3>
        <div className="flex items-center gap-1">
          {/* Full stars */}
          {[...Array(fullStars)].map((_, i) => (
            <Star key={`full-${i}`} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
          ))}
          
          {/* Half star */}
          {hasHalfStar && (
            <span className="relative">
              <Star className="w-5 h-5 text-gray-200" />
              <Star className="absolute top-0 left-0 w-5 h-5 fill-yellow-400 text-yellow-400 [clip-path:inset(0_50%_0_0)]" />
            </span>
          )}
          
          {/* Empty stars */}
          {[...Array(emptyStars)].map((_, i) => (
            <Star key={`empty-${i}`} className="w-5 h-5 text-gray-200" />
          ))}
        </div>
      </div>
      
      <h1 className="text-2xl font-semibold">{title}</h1>
    </div>
  );
}
