
import { Card } from "@/components/ui/card";
import { Star } from "lucide-react";
import { type Review } from "./types/review";
import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ProductReviewsProps {
  reviews: Review[];
  className?: string;
}

export function ProductReviews({ reviews, className }: ProductReviewsProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold tracking-tight">Reviews</h2>
        <Select defaultValue="recent">
          <SelectTrigger className="w-[180px] h-9 text-sm">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="recent">Most Recent</SelectItem>
            <SelectItem value="highest">Highest Rating</SelectItem>
            <SelectItem value="lowest">Lowest Rating</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <Card className={cn("divide-y divide-gray-100", className)}>
        {reviews.map((review) => (
          <div 
            key={review.id}
            className="p-6 transition-colors hover:bg-gray-50/50 sm:p-8"
          >
            <div className="space-y-4">
              {/* Star Rating */}
              <div className="flex gap-1.5">
                {Array(5).fill(0).map((_, i) => (
                  <Star 
                    key={i} 
                    className={cn(
                      "h-5 w-5 transition-colors",
                      i < review.rating 
                        ? "fill-yellow-400 text-yellow-400" 
                        : "fill-gray-200 text-gray-200"
                    )}
                  />
                ))}
              </div>

              {/* Review Content */}
              <div className="space-y-2">
                <h3 className="text-lg font-medium leading-6 text-gray-900">
                  {review.content}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {review.description}
                </p>
              </div>

              {/* Reviewer Info */}
              <div className="flex items-center gap-4 pt-2">
                <Avatar className="h-10 w-10 border border-gray-200">
                  <AvatarImage 
                    src={review.avatar} 
                    alt={review.author} 
                  />
                  <AvatarFallback>
                    {review.author.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-wrap items-center gap-2 text-sm">
                  <span className="font-medium text-gray-900">
                    {review.author}
                  </span>
                  <span className="text-gray-400">•</span>
                  <span className="text-gray-600">
                    {review.date}
                  </span>
                  {review.type && (
                    <>
                      <span className="text-gray-400">•</span>
                      <span className="text-gray-600 capitalize">
                        {review.type} review
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </Card>
    </div>
  );
}
