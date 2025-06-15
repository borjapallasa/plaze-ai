
import { Star } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const StarRating = ({ rating }: { rating: number }) => {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`h-4 w-4 ${
            star <= rating
              ? "fill-yellow-400 text-yellow-400"
              : "fill-gray-200 text-gray-200"
          }`}
        />
      ))}
    </div>
  );
};

interface TemplateReviewsProps {
  reviewCount?: number;
}

export function TemplateReviews({ reviewCount }: TemplateReviewsProps) {
  const mockReviews = {
    averageRating: 4.5,
    totalReviews: reviewCount || 12,
    items: [
      {
        id: "1",
        author: "John D.",
        rating: 5,
        date: "March 20, 2024",
        content: "Template is amazing! Everything works as it should. The support team is very friendly and helped me set everything up. Highly recommend!"
      },
      {
        id: "2",
        author: "Sarah M.",
        rating: 4,
        date: "March 18, 2024",
        content: "Great automation template, saved me hours of work. Would be perfect with a few more customization options."
      }
    ]
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">
          Customer Reviews ({mockReviews.totalReviews})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall Rating */}
        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
          <div className="flex flex-col items-center px-6 border-r border-gray-200">
            <p className="text-3xl font-bold text-[#1A1F2C]">
              {mockReviews.averageRating}
            </p>
            <StarRating rating={mockReviews.averageRating} />
            <p className="text-sm text-[#8E9196] mt-1">
              {mockReviews.totalReviews} reviews
            </p>
          </div>
          <div className="flex-1">
            {/* Add rating distribution here if needed */}
          </div>
        </div>

        {/* Individual Reviews */}
        <div className="space-y-6">
          {mockReviews.items.map((review) => (
            <div key={review.id} className="space-y-3">
              <div className="flex items-center gap-3">
                <StarRating rating={review.rating} />
                <span className="text-sm text-[#8E9196]">({review.rating}/5)</span>
              </div>
              <p className="text-[#1A1F2C] italic">{review.content}</p>
              <div className="flex items-center gap-2 text-sm text-[#8E9196]">
                <span>{review.author}</span>
                <span>•</span>
                <span>{review.date}</span>
              </div>
              {review.id !== mockReviews.items[mockReviews.items.length - 1].id && (
                <Separator className="mt-6" />
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
