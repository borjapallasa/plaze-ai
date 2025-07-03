import { Star, MessageCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTransactionItemReview } from "@/hooks/use-transaction-item-review";
import { Skeleton } from "@/components/ui/skeleton";
import { AddReviewForm } from "@/components/AddReviewForm";
import { EditReviewDialog } from "@/components/EditReviewDialog";
import { DeleteReviewDialog } from "@/components/DeleteReviewDialog";
import { useAuth } from "@/lib/auth";

interface TransactionReviewProps {
  transactionUuid: string;
  productUuid?: string;
  expertUuid?: string;
  isAdminView?: boolean;
}

export function TransactionReview({ transactionUuid, productUuid, expertUuid, isAdminView = false }: TransactionReviewProps) {
  const { user } = useAuth();
  console.log('TransactionReview - transactionUuid:', transactionUuid);
  console.log('TransactionReview - productUuid:', productUuid);
  console.log('TransactionReview - expertUuid:', expertUuid);
  
  const {
    data: reviews,
    isLoading,
    error,
    refetch
  } = useTransactionItemReview(transactionUuid);

  const renderStars = (rating: number) => {
    return Array(5).fill(0).map((_, index) => (
      <Star 
        key={index}
        className={`h-5 w-5 ${index < rating ? 'fill-yellow-400 text-yellow-400' : 'fill-gray-200 text-gray-200'}`}
      />
    ));
  };

  const handleReviewUpdated = () => {
    refetch();
  };

  // Check if current user has already reviewed this item
  const userReview = reviews?.find(review => 
    user && (review.buyer_email === user.email || 
    review.buyer_name === `${user.user_metadata?.first_name || ''} ${user.user_metadata?.last_name || ''}`.trim())
  );

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Review</CardTitle>
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

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Review</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-[#8E9196]">Error loading reviews</p>
            <p className="text-sm text-[#8E9196] mt-1">Please try again later</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // If admin view and no reviews, show empty state without action buttons
  if (isAdminView && (!reviews || reviews.length === 0)) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Review</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-12 text-center">
            <div className="flex flex-col items-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
                <MessageCircle className="w-8 h-8 text-gray-400" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-medium text-gray-900">
                  No review yet
                </h3>
                <p className="text-gray-600 max-w-md">
                  This transaction doesn't have a review from the customer.
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
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (reviews && reviews.length > 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            Review ({reviews.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {reviews.map((review, index) => {
              const isUserReview = !isAdminView && user && (
                review.buyer_email === user.email || 
                review.buyer_name === `${user.user_metadata?.first_name || ''} ${user.user_metadata?.last_name || ''}`.trim()
              );

              return (
                <div key={review.review_uuid} className={index > 0 ? "border-t pt-6" : ""}>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex gap-1">
                          {renderStars(review.rating)}
                        </div>
                        <span className="text-[#8E9196]">({review.rating}/5)</span>
                      </div>
                      
                      {isUserReview && (
                        <div className="flex gap-1">
                          <EditReviewDialog 
                            review={review} 
                            onReviewUpdated={handleReviewUpdated} 
                          />
                          <DeleteReviewDialog 
                            reviewUuid={review.review_uuid} 
                            onReviewDeleted={handleReviewUpdated} 
                          />
                        </div>
                      )}
                    </div>
                    
                    {review.title && (
                      <h3 className="font-medium text-[#1A1F2C]">{review.title}</h3>
                    )}
                    
                    <blockquote className="text-[#1A1F2C] italic border-l-4 border-gray-300 pl-4 py-2 break-words">
                      "{review.comments || 'No additional comments provided'}"
                    </blockquote>
                    
                    <div className="flex items-center justify-between text-sm text-[#8E9196]">
                      <span>By {review.buyer_name}</span>
                      <span>{new Date(review.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    );
  }

  // For non-admin views, show the add review form
  if (!isAdminView) {
    return (
      <AddReviewForm 
        transactionUuid={transactionUuid} 
        productUuid={productUuid}
        expertUuid={expertUuid}
        onReviewAdded={handleReviewUpdated} 
      />
    );
  }

  // Admin view with no reviews - this should be handled above, but keeping as fallback
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Review</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8 text-[#8E9196]">
          No review available
        </div>
      </CardContent>
    </Card>
  );
}
