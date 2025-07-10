
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useParams } from "react-router-dom";

export function useCommunityDetails() {
  const params = useParams();
  const communityId = params.id;
  
  console.log('useCommunityDetails called with params:', params);
  console.log('Extracted communityId:', communityId);
  
  return useQuery({
    queryKey: ['community', communityId],
    queryFn: async () => {
      // Check if communityId is valid
      if (!communityId || communityId === ':id' || communityId.includes(':')) {
        console.error('Invalid community ID:', communityId);
        throw new Error('Invalid community ID');
      }
      
      console.log('Fetching community details for UUID:', communityId);
      
      const { data, error } = await supabase
        .from('communities')
        .select(`
          *,
          expert:expert_uuid(
            expert_uuid,
            name,
            thumbnail
          )
        `)
        .eq('community_uuid', communityId)
        .maybeSingle();

      if (error) {
        console.error('Error fetching community:', error);
        throw error;
      }

      console.log('Community data:', data);
      return data;
    },
    enabled: !!(communityId && communityId !== ':id' && !communityId.includes(':')),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}
