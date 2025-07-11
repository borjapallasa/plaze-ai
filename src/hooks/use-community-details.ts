
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useParams } from "react-router-dom";

export function useCommunityDetails() {
  const params = useParams();
  const communityId = params.id;
  
  console.log('useCommunityDetails called with params:', params);
  console.log('Extracted communityId:', communityId);
  console.log('URL pathname:', window.location.pathname);
  
  // Validate community ID - check if it's a valid UUID format and not a placeholder
  const isValidUUID = (id: string | undefined): boolean => {
    if (!id) return false;
    if (id === ':id' || id.includes(':')) return false;
    // UUID regex pattern
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return uuidRegex.test(id);
  };
  
  const isValidCommunityId = isValidUUID(communityId);
  
  console.log('Community ID validation:', {
    communityId,
    isValidCommunityId,
    isPlaceholder: communityId === ':id' || (communityId && communityId.includes(':'))
  });
  
  return useQuery({
    queryKey: ['community', communityId],
    queryFn: async () => {
      if (!isValidCommunityId) {
        console.error('Invalid community ID format:', communityId);
        throw new Error(`Invalid community ID format: ${communityId}`);
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
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    retry: (failureCount, error) => {
      // Only retry on network errors, not on validation errors
      if (error.message.includes('Invalid community ID')) {
        return false;
      }
      return failureCount < 2;
    },
    retryDelay: 1000,
  });
}
