
import { Star } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface TransactionReviewProps {
  rating: number;
  review: string;
}

export function TransactionReview({ rating, review }: TransactionReviewProps) {
  const renderStars = (rating: number) => {
    return Array(5).fill(0).map((_, index) => (
      <Star 
        key={index}
        className={`h-5 w-5 ${index < rating ? 'fill-yellow-400 text-yellow-400' : 'fill-gray-200 text-gray-200'}`}
      />
    ));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Customer Review</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex gap-1">
              {renderStars(rating)}
            </div>
            <span className="text-[#8E9196]">({rating}/5)</span>
          </div>
          <blockquote className="text-[#1A1F2C] italic border-l-4 border-[#9b87f5] pl-4 py-2 break-words">
            "{review}"
          </blockquote>
        </div>
      </CardContent>
    </Card>
  );
}
