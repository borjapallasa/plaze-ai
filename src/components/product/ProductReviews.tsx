
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
  <div className="flex items-center justify-between py-1.5">
    <span className="text-sm text-gray-600">{label}</span>
    <Star className="h-[18px] w-[18px] fill-yellow-400 text-yellow-400" />
  </div>
);

export function ProductReviews({ reviews, className }: ProductReviewsProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold tracking-tight">Reviews</h2>
        <div className="relative">
          <select className="appearance-none bg-white pl-3 pr-8 py-1.5 border rounded-lg text-sm">
            <option>Sort by: Suggested</option>
            <option>Newest</option>
            <option>Highest Rating</option>
            <option>Lowest Rating</option>
          </select>
        </div>
      </div>
      
      <Card className={className}>
        <div className="divide-y divide-gray-100">
          {reviews.map((review) => (
            <div key={review.id} className="px-8 py-7">
              <div className="flex flex-col md:flex-row md:gap-16">
                <div className="flex-1 space-y-4">
                  <div className="flex gap-1">
                    {Array(5).fill(0).map((_, i) => (
                      <Star 
                        key={i} 
                        className={`h-[18px] w-[18px] ${
                          i < review.rating 
                            ? 'fill-yellow-400 text-yellow-400' 
                            : 'fill-gray-200 text-gray-200'
                        }`}
                      />
                    ))}
                  </div>

                  <h3 className="text-lg font-medium text-gray-900">{review.content}</h3>
                  <p className="text-gray-600 leading-relaxed">{review.description}</p>
                  
                  <div className="flex items-center gap-3 pt-1">
                    <div className="h-10 w-10 rounded-full overflow-hidden">
                      <img 
                        src={review.avatar} 
                        alt={review.author}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-900">{review.author}</span>
                      <span className="text-gray-400">•</span>
                      <span className="text-gray-600">{review.date}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 md:mt-0 md:w-48">
                  <div className="flex items-center gap-1.5 text-sm text-green-600 mb-6">
                    <Check className="h-4 w-4" />
                    <span>Recommends this expert</span>
                  </div>
                  <div className="space-y-2">
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
