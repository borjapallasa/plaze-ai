
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useExpertReviews(expert_uuid: string | undefined) {
  return useQuery({
    queryKey: ['expert-reviews', expert_uuid],
    queryFn: async () => {
      if (!expert_uuid) return [];

      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('expert_uuid', expert_uuid);

      if (error) throw error;
      
      return data.map(review => ({
        id: review.review_uuid,
        author: review.buyer_name || 'Anonymous',
        rating: review.rating || 0,
        content: review.title || '',
        description: review.comments || '',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
        date: new Date(review.created_at).toLocaleDateString(),
        type: review.type
      }));
    },
    enabled: !!expert_uuid
  });
}
