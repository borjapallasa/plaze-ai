
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Star, Loader2, User, CheckCircle, Package } from "lucide-react";
import { cn } from "@/lib/utils";
import { useExpertReviews } from "@/hooks/expert/useExpertReviews";
import { useParams } from "react-router-dom";
import { ReviewActions } from "@/components/reviews/ReviewActions";
import { toStartCase } from "@/lib/utils";

interface ReviewsTabProps {
  expertUuid?: string;
}

export function ReviewsTab({
  expertUuid
}: ReviewsTabProps) {
  const { id } = useParams();
  
  // Use the id from URL params if expertUuid is not provided
  const targetExpertUuid = expertUuid || id;
  
  const {
    data: reviews = [],
    isLoading,
    error
  } = useExpertReviews(targetExpertUuid);

  // Calculate stats from real data
  const totalReviews = reviews.length;
  const averageRating = totalReviews > 0 ? reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews : 0;
  const ratingDistribution = [5, 4, 3, 2, 1].map(rating => {
    const count = reviews.filter(r => r.rating === rating).length;
    const percentage = totalReviews > 0 ? count / totalReviews * 100 : 0;
    return {
      rating,
      count,
      percentage
    };
  });

  // Get status badge color
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'published':
        return 'default';
      case 'pending':
        return 'secondary';
      case 'not published':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary/70" />
        <span className="ml-3 text-muted-foreground">Loading reviews...</span>
      </div>;
  }

  if (error) {
    return <div className="text-center py-8">
        <p className="text-muted-foreground">Error loading reviews. Please try again.</p>
      </div>;
  }

  // If no reviews, show only the empty state
  if (totalReviews === 0) {
    return (
      <div className="space-y-4 sm:space-y-6">
        <Card className="border-dashed border-2 border-muted-foreground/30">
          <div className="flex flex-col items-center justify-center py-20 px-6 text-center max-w-md mx-auto">
            {/* Icon Circle */}
            <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center mb-6">
              <Star className="h-12 w-12 text-muted-foreground" />
            </div>
            
            {/* Title */}
            <h3 className="text-xl font-semibold mb-3 text-foreground">
              No reviews yet
            </h3>
            
            {/* Description */}
            <p className="text-muted-foreground text-base leading-relaxed mb-6 max-w-sm">
              This seller doesn't have any reviews yet. Check back later as customers leave feedback on their products.
            </p>
          </div>
        </Card>
      </div>
    );
  }

  return <div className="space-y-4 sm:space-y-6">
      {/* Overview Stats */}
      <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-2 sm:pb-2">
            <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-center space-x-2">
              <span className="text-xl sm:text-2xl font-bold">
                {averageRating.toFixed(1)}
              </span>
              <div className="flex">
                {Array(5).fill(0).map((_, i) => <Star key={i} className={cn("h-3 w-3 sm:h-4 sm:w-4", i < Math.floor(averageRating) ? "fill-yellow-400 text-yellow-400" : "fill-gray-200 text-gray-200")} />)}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2 sm:pb-2">
            <CardTitle className="text-sm font-medium">Total Reviews</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-xl sm:text-2xl font-bold">{totalReviews}</div>
            <p className="text-xs text-muted-foreground">across all products</p>
          </CardContent>
        </Card>
      </div>

      {/* Rating Distribution */}
      <Card>
        <CardHeader className="pb-3 sm:pb-4">
          <CardTitle className="text-base sm:text-lg">Rating Distribution</CardTitle>
          <CardDescription className="text-sm">Breakdown of ratings across all reviews</CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-2 sm:space-y-3">
            {ratingDistribution.map(({
            rating,
            count,
            percentage
          }) => <div key={rating} className="flex items-center space-x-2 sm:space-x-3">
                <div className="flex items-center space-x-1 w-10 sm:w-12">
                  <span className="text-sm">{rating}</span>
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                </div>
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div className="bg-yellow-400 h-2 rounded-full" style={{
                width: `${percentage}%`
              }} />
                </div>
                <span className="text-sm text-muted-foreground w-6 sm:w-8 text-right">{count}</span>
              </div>)}
          </div>
        </CardContent>
      </Card>

      {/* Recent Reviews */}
      <Card>
        <CardHeader className="pb-3 sm:pb-4">
          <CardTitle className="text-base sm:text-lg">Recent Reviews</CardTitle>
          <CardDescription className="text-sm">Latest feedback from your customers</CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-4 sm:space-y-6">
            {reviews.map((review, index) => <div key={review.id}>
                <div className="flex items-start space-x-3 p-3 sm:p-4 rounded-lg border bg-card">
                  <Avatar className="h-8 w-8 sm:h-9 sm:w-9 flex-shrink-0">
                    <AvatarImage src={review.avatar || undefined} alt={review.author} />
                    <AvatarFallback className="bg-muted">
                      <User className="h-4 w-4 text-muted-foreground" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-2 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium text-sm sm:text-base truncate">{review.author}</h4>
                          {review.verified && (
                            <div className="flex items-center gap-1 bg-green-50 text-green-700 px-2 py-0.5 rounded-full">
                              <CheckCircle className="h-3 w-3" />
                              <span className="text-xs font-medium">Verified</span>
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-2">
                          <div className="flex items-center space-x-1">
                            {Array(5).fill(0).map((_, i) => <Star key={i} className={cn("h-3 w-3", i < review.rating ? "fill-yellow-400 text-yellow-400" : "fill-gray-200 text-gray-200")} />)}
                          </div>
                          <span className="text-xs text-muted-foreground">{review.date}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0 self-start">
                        {/* Review Status Badge */}
                        <Badge 
                          variant={getStatusBadgeVariant(review.status)} 
                          className="text-xs capitalize"
                        >
                          {toStartCase(review.status)}
                        </Badge>
                        {review.type && <Badge variant="outline" className="text-xs capitalize">
                            {review.type}
                          </Badge>}
                      </div>
                    </div>
                    
                    {/* Product info with icon */}
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-gray-50 px-2 py-1.5 rounded w-fit">
                      <Package className="h-3 w-3 flex-shrink-0" />
                      <span className="truncate">{review.productName}</span>
                    </div>
                    
                    <div className="space-y-1">
                      <h5 className="font-medium text-sm leading-tight">{review.content}</h5>
                      {review.description && <p className="text-sm text-muted-foreground leading-relaxed">
                          {review.description}
                        </p>}
                    </div>

                    {/* Review Actions for pending reviews */}
                    <ReviewActions reviewId={review.id} status={review.status || 'published'} />
                  </div>
                </div>
                {index < reviews.length - 1 && <Separator className="my-4 sm:my-6" />}
              </div>)}
          </div>
        </CardContent>
      </Card>
    </div>;
}
