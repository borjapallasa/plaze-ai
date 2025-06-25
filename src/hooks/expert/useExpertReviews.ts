
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useExpertReviews(expert_uuid: string | undefined) {
  return useQuery({
    queryKey: ['expert-reviews', expert_uuid],
    queryFn: async () => {
      if (!expert_uuid) return [];

      const { data, error } = await supabase
        .from('reviews')
        .select(`
          *,
          products (
            name
          )
        `)
        .eq('expert_uuid', expert_uuid);

      if (error) throw error;
      
      return data.map(review => ({
        id: review.review_uuid,
        author: review.buyer_name || 'Anonymous',
        rating: review.rating || 0,
        content: review.title || '',
        description: review.comments || '',
        avatar: null,
        date: new Date(review.created_at).toLocaleDateString(),
        type: review.type,
        productName: review.products?.name || 'Unknown Product',
        verified: Boolean(review.verified)
      }));
    },
    enabled: !!expert_uuid
  });
}
