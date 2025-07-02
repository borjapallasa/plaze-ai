
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";

export function useAdminCheck() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['admin-check', user?.id],
    queryFn: async () => {
      if (!user?.id) {
        return { isAdmin: false };
      }

      const { data, error } = await supabase
        .from('users')
        .select('is_admin, email')
        .eq('user_uuid', user.id)
        .single();

      if (error) {
        console.error('Error checking admin status:', error);
        return { isAdmin: false };
      }
      
      return { isAdmin: data?.is_admin || false };
    },
    enabled: !!user?.id,
  });
}
