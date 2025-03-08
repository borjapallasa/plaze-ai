
import React from "react";
import { MessageCircle } from "lucide-react";

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
      <h1 className="text-2xl font-semibold mb-2">{title}</h1>
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
        <div className="flex items-center gap-1.5">
          <span 
            className="text-muted-foreground hover:underline cursor-pointer transition-colors"
          >
            {seller}
          </span>
          <button 
            onClick={onContactSeller}
            className="inline-flex items-center justify-center p-1 rounded-full hover:bg-muted/50 transition-colors"
            aria-label="Message seller"
            title="Message seller"
          >
            <MessageCircle className="h-4 w-4 text-muted-foreground" />
          </button>
          <span className="text-muted-foreground mx-0.5">•</span>
          <span className="text-muted-foreground">{rating.toFixed(1)} Rating</span>
        </div>
      </div>
    </div>
  );
}
