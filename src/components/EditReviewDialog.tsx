
import { useState } from "react";
import { Star, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface EditReviewDialogProps {
  review: {
    review_uuid: string;
    rating: number;
    title: string;
    comments: string;
  };
  onReviewUpdated?: () => void;
}

export function EditReviewDialog({ review, onReviewUpdated }: EditReviewDialogProps) {
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(review.rating);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [title, setTitle] = useState(review.title || "");
  const [comments, setComments] = useState(review.comments || "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
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
      const { error } = await supabase
        .from('reviews')
        .update({
          rating,
          title: title.trim() || null,
          comments: comments.trim(),
        })
        .eq('review_uuid', review.review_uuid);

      if (error) {
        console.error('Error updating review:', error);
        toast.error("Failed to update review. Please try again.");
        return;
      }

      toast.success("Review updated successfully!");
      setOpen(false);
      
      if (onReviewUpdated) {
        onReviewUpdated();
      }
    } catch (error) {
      console.error('Error updating review:', error);
      toast.error("Failed to update review. Please try again.");
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
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="text-[#8E9196] hover:text-[#1A1F2C]">
          <Pencil className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Review</DialogTitle>
        </DialogHeader>
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
            <label htmlFor="edit-title" className="block text-sm font-medium text-[#1A1F2C] mb-2">
              Title (Optional)
            </label>
            <Input
              id="edit-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Give your review a title"
              maxLength={100}
            />
          </div>

          <div>
            <label htmlFor="edit-comments" className="block text-sm font-medium text-[#1A1F2C] mb-2">
              Comments *
            </label>
            <Textarea
              id="edit-comments"
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

          <div className="flex gap-2">
            <Button 
              type="submit" 
              disabled={isSubmitting || rating === 0}
              className="flex-1"
            >
              {isSubmitting ? "Updating..." : "Update Review"}
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
