
import { Star } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useProductReviews, calculateAverageRating } from "@/hooks/use-product-reviews";

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
  productUuid: string;
}

export function TemplateReviews({ productUuid }: TemplateReviewsProps) {
  const { data: reviews = [], isLoading } = useProductReviews(productUuid);
  const averageRating = calculateAverageRating(reviews);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Loading Reviews...</CardTitle>
        </CardHeader>
      </Card>
    );
  }

  if (reviews.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Customer Reviews (0)</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-[#8E9196]">No reviews yet for this product.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">
          Customer Reviews ({reviews.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall Rating */}
        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
          <div className="flex flex-col items-center px-6 border-r border-gray-200">
            <p className="text-3xl font-bold text-[#1A1F2C]">
              {averageRating}
            </p>
            <StarRating rating={averageRating} />
            <p className="text-sm text-[#8E9196] mt-1">
              {reviews.length} reviews
            </p>
          </div>
        </div>

        {/* Individual Reviews */}
        <div className="space-y-6">
          {reviews.map((review, index) => (
            <div key={review.id} className="space-y-3">
              <div className="flex items-center gap-3">
                <StarRating rating={review.rating} />
                <span className="text-sm text-[#8E9196]">({review.rating}/5)</span>
              </div>
              <p className="text-[#1A1F2C] font-medium">{review.content}</p>
              <p className="text-[#1A1F2C] italic">{review.description}</p>
              <div className="flex items-center gap-2 text-sm text-[#8E9196]">
                <span>{review.author}</span>
                <span>•</span>
                <span>{review.date}</span>
                {review.type && (
                  <>
                    <span>•</span>
                    <span className="capitalize">{review.type}</span>
                  </>
                )}
              </div>
              {index !== reviews.length - 1 && (
                <Separator className="mt-6" />
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
