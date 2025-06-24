
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";

export function useUserProfile() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['user-profile', user?.id],
    queryFn: async () => {
      if (!user?.id) {
        throw new Error('No authenticated user');
      }

      console.log('Fetching user profile for:', user.id);
      
      const { data, error } = await supabase
        .from('users')
        .select('first_name, last_name, email')
        .eq('user_uuid', user.id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching user profile:', error);
        throw error;
      }

      console.log('User profile data:', data);
      return data;
    },
    enabled: !!user?.id,
  });
}
