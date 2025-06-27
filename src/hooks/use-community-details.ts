
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useCommunityDetails(communityUuid?: string) {
  return useQuery({
    queryKey: ['community', communityUuid],
    queryFn: async () => {
      if (!communityUuid) return null;
      
      console.log('Fetching community details for UUID:', communityUuid);
      
      const { data, error } = await supabase
        .from('communities')
        .select('name, community_uuid')
        .eq('community_uuid', communityUuid)
        .single();

      if (error) {
        console.error('Error fetching community:', error);
        throw error;
      }

      console.log('Community data:', data);
      return data;
    },
    enabled: !!communityUuid
  });
}
