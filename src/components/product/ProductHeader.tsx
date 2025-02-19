
import { Star } from "lucide-react";
import React from "react";

interface ProductHeaderProps {
  title: string;
  seller: string;
  rating: number;
  className?: string;
}

export function ProductHeader({ title, seller, rating, className }: ProductHeaderProps) {
  return (
    <div className={className}>
      <h1 className="text-2xl font-semibold mb-4">{title}</h1>
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-full bg-accent" />
        <div>
          <h3 className="font-medium">{seller}</h3>
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm">{rating}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
