
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export function ReviewsTab() {
  // Mock data - in a real app, this would come from props or API
  const reviews = [
    {
      id: 1,
      author: "Sarah Johnson",
      rating: 5,
      content: "Excellent work and fast delivery",
      description: "The UI kit exceeded my expectations. Great attention to detail and very professional work. Will definitely work with this seller again.",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
      date: "2 days ago",
      product: "UI Kit Pro"
    },
    {
      id: 2,
      author: "Michael Chen",
      rating: 4,
      content: "Great quality templates",
      description: "Really impressed with the quality of the templates. They saved me hours of work. Minor issues with documentation but overall very satisfied.",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d",
      date: "1 week ago",
      product: "Landing Templates"
    },
    {
      id: 3,
      author: "Emily Rodriguez",
      rating: 5,
      content: "Perfect for my project",
      description: "Exactly what I was looking for. The design system is well organized and easy to implement. Highly recommend!",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80",
      date: "2 weeks ago",
      product: "Design System"
    },
    {
      id: 4,
      author: "David Wilson",
      rating: 4,
      content: "Good value for money",
      description: "Solid work overall. The components are well crafted and the seller was responsive to questions.",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e",
      date: "3 weeks ago",
      product: "UI Components"
    }
  ];

  const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
  const totalReviews = reviews.length;

  const ratingDistribution = [5, 4, 3, 2, 1].map(rating => {
    const count = reviews.filter(r => r.rating === rating).length;
    const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
    return { rating, count, percentage };
  });

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold">{averageRating.toFixed(1)}</span>
              <div className="flex">
                {Array(5).fill(0).map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      "h-4 w-4",
                      i < Math.floor(averageRating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "fill-gray-200 text-gray-200"
                    )}
                  />
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Reviews</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalReviews}</div>
            <p className="text-xs text-muted-foreground">across all products</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Response Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">98%</div>
            <p className="text-xs text-muted-foreground">within 24 hours</p>
          </CardContent>
        </Card>
      </div>

      {/* Rating Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Rating Distribution</CardTitle>
          <CardDescription>Breakdown of ratings across all reviews</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {ratingDistribution.map(({ rating, count, percentage }) => (
              <div key={rating} className="flex items-center space-x-3">
                <div className="flex items-center space-x-1 w-12">
                  <span className="text-sm">{rating}</span>
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                </div>
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-yellow-400 h-2 rounded-full"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="text-sm text-muted-foreground w-8">{count}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Reviews */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Reviews</CardTitle>
          <CardDescription>Latest feedback from your customers</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {reviews.map((review) => (
              <div key={review.id} className="space-y-3">
                <div className="flex items-start space-x-4">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={review.avatar} alt={review.author} />
                    <AvatarFallback>
                      {review.author.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">{review.author}</h4>
                        <div className="flex items-center space-x-2">
                          <div className="flex">
                            {Array(5).fill(0).map((_, i) => (
                              <Star
                                key={i}
                                className={cn(
                                  "h-3 w-3",
                                  i < review.rating
                                    ? "fill-yellow-400 text-yellow-400"
                                    : "fill-gray-200 text-gray-200"
                                )}
                              />
                            ))}
                          </div>
                          <span className="text-xs text-muted-foreground">{review.date}</span>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {review.product}
                      </Badge>
                    </div>
                    <div>
                      <h5 className="font-medium text-sm">{review.content}</h5>
                      <p className="text-sm text-muted-foreground mt-1">
                        {review.description}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
