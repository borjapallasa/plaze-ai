
import { Card } from "@/components/ui/card";
import { Star } from "lucide-react";
import React from "react";

interface Review {
  id: number;
  author: string;
  rating: number;
  content: string;
  avatar: string;
}

interface ProductReviewsProps {
  reviews: Review[];
  className?: string;
}

export function ProductReviews({ reviews, className }: ProductReviewsProps) {
  return (
    <Card className={className}>
      <h2 className="text-xl font-semibold mb-6">Reviews</h2>
      <div className="space-y-6">
        {reviews.map((review) => (
          <div key={review.id} className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
              <img 
                src={review.avatar} 
                alt={review.author}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-medium">{review.author}</h3>
                <div className="flex items-center">
                  {Array(5).fill(0).map((_, i) => (
                    <Star 
                      key={i} 
                      className={`w-4 h-4 ${
                        i < review.rating 
                          ? 'fill-yellow-400 text-yellow-400' 
                          : 'fill-gray-200 text-gray-200'
                      }`}
                    />
                  ))}
                </div>
              </div>
              <p className="text-muted-foreground text-sm">{review.content}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
