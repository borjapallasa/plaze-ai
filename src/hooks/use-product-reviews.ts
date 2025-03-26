
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ProductReview } from "@/types/Product";

const getPlaceholderImage = () => "https://images.unsplash.com/photo-1649972904349-6e44c42644a7";

export function useProductReviews(productUuid?: string) {
  return useQuery({
    queryKey: ['reviews', productUuid],
    queryFn: async (): Promise<ProductReview[]> => {
      console.log("Fetching reviews for product:", productUuid);

      if (!productUuid) {
        return [];
      }

      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('product_uuid', productUuid)
        .eq('status', 'published')
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Error fetching reviews:", error);
        throw error;
      }

      console.log("Reviews found:", data.length);

      return data.map(review => ({
        id: review.review_uuid,
        author: review.buyer_name || 'Anonymous',
        rating: review.rating || 5,
        content: review.title || 'No title provided',
        description: review.comments || 'No comments provided',
        avatar: getPlaceholderImage(),
        date: new Date(review.created_at).toLocaleDateString(),
        itemQuality: review.rating || 5,
        shipping: review.rating || 5,
        customerService: review.rating || 5,
        type: review.transaction_type?.toLowerCase() || 'product'
      }));
    },
    enabled: !!productUuid
  });
}

// Helper to calculate average rating
export function calculateAverageRating(reviews: ProductReview[]): number {
  if (!reviews || reviews.length === 0) return 0;
  
  return Number(
    (reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length).toFixed(1)
  );
}
