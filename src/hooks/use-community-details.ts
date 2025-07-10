
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useParams } from "react-router-dom";

export function useCommunityDetails() {
  const { id: communityId } = useParams();
  
  return useQuery({
    queryKey: ['community', communityId],
    queryFn: async () => {
      if (!communityId || communityId === ':id') {
        console.error('Invalid community ID:', communityId);
        return null;
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
    enabled: !!communityId && communityId !== ':id'
  });
}
