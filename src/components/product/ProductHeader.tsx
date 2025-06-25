
import React from "react";

interface ProductHeaderProps {
  title: string;
  seller: string;
  rating: number;
  className?: string;
  onContactSeller: () => void;
}

export function ProductHeader({ 
  title, 
  seller, 
  rating, 
  onContactSeller, 
  className = "" 
}: ProductHeaderProps) {
  return (
    <div className={className}>
      <h1 className="text-2xl font-semibold mb-3">{title}</h1>
      <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
        <span 
          className="hover:underline cursor-pointer transition-colors"
        >
          {seller}
        </span>
        <button 
          onClick={onContactSeller}
          className="font-bold hover:underline transition-colors"
          aria-label="Message seller"
          title="Message seller"
        >
          Message
        </button>
        <span className="mx-0.5">•</span>
        <span>{rating.toFixed(1)} Rating</span>
      </div>
    </div>
  );
}
