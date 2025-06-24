
import { useState } from "react";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";

interface AddReviewFormProps {
  transactionUuid: string;
  sellerUserUuid?: string;
  productUuid?: string;
  onReviewAdded?: () => void;
}

export function AddReviewForm({ transactionUuid, sellerUserUuid, productUuid, onReviewAdded }: AddReviewFormProps) {
  const { user } = useAuth();
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [title, setTitle] = useState("");
  const [comments, setComments] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error("You must be logged in to submit a review");
      return;
    }

    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }

    if (!comments.trim()) {
      toast.error("Please add some comments");
      return;
    }

    setIsSubmitting(true);

    try {
      console.log('Attempting to insert review with rating:', rating);
      console.log('Title:', title);
      console.log('Comments:', comments);
      console.log('Product Transaction Item UUID:', transactionUuid);
      console.log('Seller User UUID (expert_uuid):', sellerUserUuid);
      console.log('Product UUID (from transaction item):', productUuid);

      // Get user's first and last name from user metadata
      const firstName = user.user_metadata?.first_name || '';
      const lastName = user.user_metadata?.last_name || '';
      const buyerName = `${firstName} ${lastName}`.trim() || user.email;

      // Insert review with all required fields, including seller_user_uuid and product_uuid
      const reviewData = {
        rating,
        title: title.trim() || null,
        comments: comments.trim(),
        product_transaction_item_uuid: transactionUuid,
        buyer_name: buyerName,
        transaction_type: 'product' as const,
        type: 'product' as const,
        status: 'published' as const,
        buyer_email: user.email,
        product_uuid: productUuid, // Use the product_uuid directly from transaction item
        seller_user_uuid: sellerUserUuid // This is the expert_uuid
      };

      console.log('Final review data being inserted:', reviewData);

      const { error } = await supabase
        .from('reviews')
        .insert(reviewData);

      if (error) {
        console.error('Error submitting review:', error);
        toast.error("Failed to submit review. Please try again.");
        return;
      }

      toast.success("Review submitted successfully!");
      
      // Reset form
      setRating(0);
      setTitle("");
      setComments("");
      
      // Call callback if provided
      if (onReviewAdded) {
        onReviewAdded();
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      toast.error("Failed to submit review. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStars = () => {
    return Array(5).fill(0).map((_, index) => {
      const starValue = index + 1;
      const isActive = starValue <= (hoveredRating || rating);
      
      return (
        <button
          key={index}
          type="button"
          className="focus:outline-none"
          onMouseEnter={() => setHoveredRating(starValue)}
          onMouseLeave={() => setHoveredRating(0)}
          onClick={() => setRating(starValue)}
        >
          <Star 
            className={`h-6 w-6 transition-colors ${
              isActive 
                ? 'fill-yellow-400 text-yellow-400' 
                : 'fill-gray-200 text-gray-200 hover:fill-yellow-200 hover:text-yellow-200'
            }`}
          />
        </button>
      );
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Leave a Review</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#1A1F2C] mb-2">
              Rating *
            </label>
            <div className="flex gap-1">
              {renderStars()}
            </div>
            {rating > 0 && (
              <p className="text-sm text-[#8E9196] mt-1">
                {rating} out of 5 stars
              </p>
            )}
          </div>

          <div>
            <label htmlFor="title" className="block text-sm font-medium text-[#1A1F2C] mb-2">
              Title (Optional)
            </label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Give your review a title"
              maxLength={100}
            />
          </div>

          <div>
            <label htmlFor="comments" className="block text-sm font-medium text-[#1A1F2C] mb-2">
              Comments *
            </label>
            <Textarea
              id="comments"
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              placeholder="Tell others about your experience..."
              rows={4}
              maxLength={1000}
              required
            />
            <p className="text-xs text-[#8E9196] mt-1">
              {comments.length}/1000 characters
            </p>
          </div>

          <Button 
            type="submit" 
            disabled={isSubmitting || rating === 0}
            className="w-full"
          >
            {isSubmitting ? "Submitting..." : "Submit Review"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
