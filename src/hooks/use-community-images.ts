
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { CommunityImage } from "@/types/product-images";

export function useCommunityImages(communityUuid: string | undefined) {
  const { data: images = [], isLoading } = useQuery({
    queryKey: ['communityImages', communityUuid],
    queryFn: async () => {
      if (!communityUuid) return [];
      
      const { data, error } = await supabase
        .from('community_images')
        .select('*')
        .eq('community_uuid', communityUuid)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as CommunityImage[];
    },
    enabled: !!communityUuid,
    // Add staleTime to prevent unnecessary refetches
    staleTime: 1000 * 60 * 5, // 5 minutes
    // Add cacheTime
    gcTime: 1000 * 60 * 10, // 10 minutes
    // Disable automatic refetching
    refetchOnWindowFocus: false,
    refetchOnReconnect: false
  });

  return { images, isLoading };
}
