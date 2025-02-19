
import { Card } from "@/components/ui/card";
import { Star } from "lucide-react";
import { Check } from "lucide-react";
import React from "react";

interface Review {
  id: number;
  author: string;
  rating: number;
  content: string;
  description: string;
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
  <div className="flex items-center justify-between py-0.5">
    <span className="text-xs text-muted-foreground">{label}</span>
    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
  </div>
);

export function ProductReviews({ reviews, className }: ProductReviewsProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Reviews</h2>
        <select className="text-sm border rounded-md px-2 py-1">
          <option>Sort by: Suggested</option>
          <option>Newest</option>
          <option>Highest Rating</option>
          <option>Lowest Rating</option>
        </select>
      </div>
      
      <Card className={className}>
        <div className="space-y-6">
          {reviews.map((review) => (
            <div key={review.id} className="border-b pb-6 last:border-b-0">
              <div className="flex flex-col gap-2">
                {/* Desktop Layout */}
                <div className="hidden md:flex justify-between">
                  <div className="space-y-1.5 max-w-[65%]">
                    <div className="flex gap-1">
                      {Array(5).fill(0).map((_, i) => (
                        <Star 
                          key={i} 
                          className={`w-3.5 h-3.5 ${
                            i < review.rating 
                              ? 'fill-yellow-400 text-yellow-400' 
                              : 'fill-gray-200 text-gray-200'
                          }`}
                        />
                      ))}
                    </div>
                    <h3 className="font-medium text-base">{review.content}</h3>
                    <p className="text-sm text-muted-foreground">{review.description}</p>
                  </div>
                  <div className="flex justify-end">
                    <div className="flex items-start text-sm text-green-600 whitespace-nowrap">
                      <Check className="w-3.5 h-3.5 mr-1" />
                      <span>Recommends this item</span>
                    </div>
                  </div>
                </div>

                {/* Mobile Layout */}
                <div className="md:hidden">
                  <div className="flex justify-end mb-2">
                    <div className="flex items-center text-xs text-green-600">
                      <Check className="w-3 h-3 mr-0.5" />
                      <span>Recommends this item</span>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex gap-1">
                      {Array(5).fill(0).map((_, i) => (
                        <Star 
                          key={i} 
                          className={`w-3.5 h-3.5 ${
                            i < review.rating 
                              ? 'fill-yellow-400 text-yellow-400' 
                              : 'fill-gray-200 text-gray-200'
                          }`}
                        />
                      ))}
                    </div>

                    <div className="space-y-1.5">
                      <h3 className="font-medium text-base">{review.content}</h3>
                      <p className="text-sm text-muted-foreground">{review.description}</p>
                    </div>
                  </div>
                </div>

                {/* Desktop User Info and Ratings */}
                <div className="hidden md:flex justify-between items-start mt-2">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full overflow-hidden flex-shrink-0">
                      <img 
                        src={review.avatar} 
                        alt={review.author}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">{review.author}</span>
                      <span className="text-xs text-muted-foreground">•</span>
                      <div className="text-xs text-muted-foreground">{review.date}</div>
                    </div>
                  </div>

                  <div className="space-y-0.5 min-w-[180px]">
                    <RatingCategory label="Item quality" rating={review.itemQuality} />
                    <RatingCategory label="Shipping" rating={review.shipping} />
                    <RatingCategory label="Customer service" rating={review.customerService} />
                  </div>
                </div>

                {/* Mobile User Info and Ratings */}
                <div className="md:hidden space-y-3 mt-3">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full overflow-hidden flex-shrink-0">
                      <img 
                        src={review.avatar} 
                        alt={review.author}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">{review.author}</span>
                      <span className="text-xs text-muted-foreground">•</span>
                      <div className="text-xs text-muted-foreground">{review.date}</div>
                    </div>
                  </div>

                  <div className="space-y-0.5">
                    <RatingCategory label="Item quality" rating={review.itemQuality} />
                    <RatingCategory label="Shipping" rating={review.shipping} />
                    <RatingCategory label="Customer service" rating={review.customerService} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
