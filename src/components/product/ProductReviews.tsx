
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, MessageCircle } from "lucide-react";
import { type Review } from "./types/review";
import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ProductReviewsProps {
  reviews: Review[];
  className?: string;
  selectedVariant?: string;
  productUuid?: string;
  onLeaveReview?: (variantId: string) => void;
}

const getReviewTypeText = (reviewType: string) => {
  switch (reviewType) {
    case 'product':
      return 'Purchased a product';
    case 'service':
      return 'Hired a service';
    case 'community':
      return 'Joined a community';
    case 'job':
      return 'Completed a job';
    case 'purchase':
      return 'Verified purchase';
    default:
      return 'Verified review';
  }
};

export function ProductReviews({ 
  reviews, 
  className, 
  selectedVariant, 
  productUuid, 
  onLeaveReview 
}: ProductReviewsProps) {
  console.log('ProductReviews received:', { reviews, productUuid, selectedVariant, onLeaveReview });

  const handleLeaveReview = () => {
    if (selectedVariant && onLeaveReview) {
      console.log('Calling onLeaveReview with variant:', selectedVariant);
      onLeaveReview(selectedVariant);
    } else {
      console.log('Cannot leave review - missing:', { selectedVariant, onLeaveReview });
    }
  };

  // If no reviews, show the empty state
  if (!reviews || reviews.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold tracking-tight">Reviews</h2>
          {selectedVariant && onLeaveReview && (
            <Button 
              onClick={handleLeaveReview}
              variant="outline"
              size="sm"
            >
              Leave a Review
            </Button>
          )}
        </div>
        
        <Card className={cn("p-12 text-center", className)}>
          <div className="flex flex-col items-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
              <MessageCircle className="w-8 h-8 text-gray-400" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-medium text-gray-900">
                Be the first to leave a review
              </h3>
              <p className="text-gray-600 max-w-md">
                Share your experience with this product to help others make informed decisions.
              </p>
            </div>
            <div className="flex gap-1.5 mt-4">
              {Array(5).fill(0).map((_, i) => (
                <Star 
                  key={i} 
                  className="h-6 w-6 fill-gray-200 text-gray-200"
                />
              ))}
            </div>
            {selectedVariant && onLeaveReview && (
              <Button 
                onClick={handleLeaveReview}
                className="mt-4"
              >
                Leave a Review
              </Button>
            )}
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold tracking-tight">Reviews ({reviews.length})</h2>
        <div className="flex items-center gap-4">
          {selectedVariant && onLeaveReview && (
            <Button 
              onClick={handleLeaveReview}
              variant="outline"
              size="sm"
            >
              Leave a Review
            </Button>
          )}
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
                  {(review as any).reviewType && (
                    <>
                      <span className="text-gray-400">•</span>
                      <span className="text-gray-600">
                        {getReviewTypeText((review as any).reviewType)}
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
