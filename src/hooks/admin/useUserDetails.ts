
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useUserDetails(userUuid: string) {
  return useQuery({
    queryKey: ['user-details', userUuid],
    queryFn: async () => {
      if (!userUuid) {
        throw new Error('User UUID is required');
      }

      console.log('Fetching user details for:', userUuid);
      
      const { data: userData, error } = await supabase
        .from('users')
        .select('user_uuid, email, first_name, last_name, created_at, is_expert, is_affiliate, is_admin, total_spent')
        .eq('user_uuid', userUuid)
        .maybeSingle();

      if (error) {
        console.error('Error fetching user details:', error);
        throw error;
      }

      if (!userData) {
        throw new Error('User not found');
      }

      console.log('User details:', userData);
      return userData;
    },
    enabled: !!userUuid,
  });
}
