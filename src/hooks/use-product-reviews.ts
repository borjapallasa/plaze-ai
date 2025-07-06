
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useProductReviews(productUuid?: string) {
  return useQuery({
    queryKey: ['productReviews', productUuid],
    queryFn: async () => {
      if (!productUuid) return [];
      
      console.log('Fetching reviews for product:', productUuid);
      
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('product_uuid', productUuid)
        .eq('status', 'published');

      if (error) {
        console.error('Error fetching reviews:', error);
        throw error;
      }

      console.log('Raw reviews data:', data);

      // Transform the data to match our Review interface
      return data?.map(review => ({
        id: review.review_uuid || review.product_transaction_item_uuid || '',
        author: review.buyer_name || 'Anonymous',
        rating: review.rating || 0,
        content: review.title || review.comments || '',
        description: review.comments || '',
        avatar: `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e`,
        date: review.created_at ? new Date(review.created_at).toLocaleDateString() : '',
        reviewType: review.type || 'purchase'
      })) || [];
    },
    enabled: !!productUuid,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function calculateAverageRating(reviews: any[]) {
  if (!reviews || reviews.length === 0) return 0;
  
  const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
  return Math.round((sum / reviews.length) * 10) / 10;
}
