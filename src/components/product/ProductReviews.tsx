
import { Card } from "@/components/ui/card";
import { Star } from "lucide-react";
import { Check } from "lucide-react";
import React from "react";

interface Review {
  id: number;
  author: string;
  rating: number;
  content: string;
  avatar: string;
  date: string;
  itemQuality: number;
  shipping: number;
  customerService: number;
}

interface ProductReviewsProps {
  reviews: Review[];
  className?: string;
}

const RatingCategory = ({ label, rating }: { label: string; rating: number }) => (
  <div className="flex items-center justify-between">
    <span className="text-sm text-muted-foreground">{label}</span>
    <div className="flex items-center gap-2">
      <span className="font-medium">{rating}</span>
      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
    </div>
  </div>
);

export function ProductReviews({ reviews, className }: ProductReviewsProps) {
  return (
    <Card className={className}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Reviews</h2>
        <select className="text-sm border rounded-md px-2 py-1">
          <option>Sort by: Suggested</option>
          <option>Newest</option>
          <option>Highest Rating</option>
          <option>Lowest Rating</option>
        </select>
      </div>
      <div className="space-y-8">
        {reviews.map((review) => (
          <div key={review.id} className="border-b pb-8 last:border-b-0">
            <div className="flex items-start justify-between mb-4">
              <div className="space-y-1">
                <div className="flex gap-1">
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
                <h3 className="font-medium text-lg">{review.content}</h3>
              </div>
              <div className="flex items-center text-sm text-green-600">
                <Check className="w-4 h-4 mr-1" />
                <span>Recommends this item</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                  <img 
                    src={review.avatar} 
                    alt={review.author}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <span className="font-medium">{review.author}</span>
                  <div className="text-sm text-muted-foreground">{review.date}</div>
                </div>
              </div>

              <div className="space-y-2">
                <RatingCategory label="Item quality" rating={review.itemQuality} />
                <RatingCategory label="Shipping" rating={review.shipping} />
                <RatingCategory label="Customer service" rating={review.customerService} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
