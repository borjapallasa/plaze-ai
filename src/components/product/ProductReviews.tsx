
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
  <div className="flex items-center justify-between py-1">
    <span className="text-sm text-muted-foreground">{label}</span>
    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
  </div>
);

export function ProductReviews({ reviews, className }: ProductReviewsProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Reviews</h2>
        <select className="text-sm border rounded-md px-3 py-1.5">
          <option>Sort by: Suggested</option>
          <option>Newest</option>
          <option>Highest Rating</option>
          <option>Lowest Rating</option>
        </select>
      </div>
      
      <Card className={className}>
        <div className="divide-y">
          {reviews.map((review) => (
            <div key={review.id} className="p-6">
              <div className="flex flex-col">
                {/* Desktop Layout */}
                <div className="hidden md:flex justify-between">
                  <div className="space-y-4 max-w-[65%]">
                    <div className="flex gap-1.5">
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
                    <p className="text-base text-muted-foreground">{review.description}</p>
                    
                    <div className="flex items-center gap-3 pt-2">
                      <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                        <img 
                          src={review.avatar} 
                          alt={review.author}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{review.author}</span>
                        <span className="text-sm text-muted-foreground">•</span>
                        <div className="text-sm text-muted-foreground">{review.date}</div>
                      </div>
                    </div>
                  </div>
                  <div className="min-w-[200px] flex flex-col">
                    <div className="flex items-center text-sm text-green-600 whitespace-nowrap justify-end mb-6">
                      <Check className="w-4 h-4 mr-1" />
                      <span>Recommends this expert</span>
                    </div>
                    <div className="space-y-2">
                      <RatingCategory label="Expertise" rating={review.itemQuality} />
                      <RatingCategory label="Communication" rating={review.shipping} />
                      <RatingCategory label="Service quality" rating={review.customerService} />
                    </div>
                  </div>
                </div>

                {/* Mobile Layout */}
                <div className="md:hidden space-y-4">
                  <div className="flex justify-between items-start">
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
                    <div className="flex items-center text-sm text-green-600">
                      <Check className="w-4 h-4 mr-1" />
                      <span>Recommends this expert</span>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <h3 className="font-medium text-lg">{review.content}</h3>
                    <p className="text-base text-muted-foreground">{review.description}</p>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                      <img 
                        src={review.avatar} 
                        alt={review.author}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{review.author}</span>
                      <span className="text-sm text-muted-foreground">•</span>
                      <div className="text-sm text-muted-foreground">{review.date}</div>
                    </div>
                  </div>

                  <div className="space-y-2 pt-2">
                    <RatingCategory label="Expertise" rating={review.itemQuality} />
                    <RatingCategory label="Communication" rating={review.shipping} />
                    <RatingCategory label="Service quality" rating={review.customerService} />
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
