
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useParams } from "react-router-dom";

export function useCommunityDetails() {
  const params = useParams();
  const communityId = params.id;
  
  console.log('useCommunityDetails called with params:', params);
  console.log('Extracted communityId:', communityId);
  
  // Validate community ID - check if it's a valid UUID format
  const isValidUUID = (id: string | undefined): boolean => {
    if (!id) return false;
    // UUID regex pattern - more permissive to handle edge cases
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return uuidRegex.test(id);
  };
  
  const isValidCommunityId = isValidUUID(communityId);
  
  return useQuery({
    queryKey: ['community', communityId],
    queryFn: async () => {
      if (!isValidCommunityId) {
        console.error('Invalid community ID format:', communityId);
        throw new Error('Invalid community ID format');
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
    enabled: isValidCommunityId,
    staleTime: 15 * 60 * 1000, // 15 minutes - even longer stale time
    gcTime: 60 * 60 * 1000, // 1 hour - longer cache time
    refetchOnWindowFocus: false, // Prevent refetch on window focus
    refetchOnMount: false, // Don't refetch on component mount if data exists
    refetchOnReconnect: false, // Don't refetch on reconnect
    retry: (failureCount, error) => {
      // Only retry on network errors, not on validation errors
      if (error.message.includes('Invalid community ID')) {
        return false;
      }
      return failureCount < 2;
    },
    retryDelay: 1000, // 1 second delay between retries
  });
}
