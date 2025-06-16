
import { Star } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTransactionReview } from "@/hooks/use-transaction-review";
import { Skeleton } from "@/components/ui/skeleton";

interface TransactionReviewProps {
  transactionUuid: string;
}

export function TransactionReview({ transactionUuid }: TransactionReviewProps) {
  const {
    data: review,
    isLoading,
    error
  } = useTransactionReview(transactionUuid);

  const renderStars = (rating: number) => {
    return Array(5).fill(0).map((_, index) => (
      <Star 
        key={index}
        className={`h-5 w-5 ${index < rating ? 'fill-yellow-400 text-yellow-400' : 'fill-gray-200 text-gray-200'}`}
      />
    ));
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Customer Review</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-20 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !review) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Customer Review</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-[#8E9196]">No review found for this transaction</p>
            <p className="text-sm text-[#8E9196] mt-1">
              {error ? 'Error loading review' : 'The customer has not left a review yet'}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Customer Review</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex gap-1">
              {renderStars(review.rating)}
            </div>
            <span className="text-[#8E9196]">({review.rating}/5)</span>
          </div>
          
          {review.title && (
            <h3 className="font-medium text-[#1A1F2C]">{review.title}</h3>
          )}
          
          <blockquote className="text-[#1A1F2C] italic border-l-4 border-[#9b87f5] pl-4 py-2 break-words">
            "{review.comments || 'No additional comments provided'}"
          </blockquote>
          
          <div className="flex items-center justify-between text-sm text-[#8E9196]">
            <span>By {review.buyer_name}</span>
            <span>{new Date(review.created_at).toLocaleDateString()}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
