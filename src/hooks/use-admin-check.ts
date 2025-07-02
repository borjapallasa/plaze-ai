
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";

export function useAdminCheck() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['admin-check', user?.id],
    queryFn: async () => {
      if (!user?.id) {
        console.log('No user ID found for admin check');
        return { isAdmin: false };
      }

      console.log('Checking admin status for user:', user.id);
      console.log('User email:', user.email);

      const { data, error } = await supabase
        .from('users')
        .select('is_admin, email')
        .eq('user_uuid', user.id)
        .single();

      if (error) {
        console.error('Error checking admin status:', error);
        return { isAdmin: false };
      }

      console.log('Admin check result:', data);
      console.log('Is admin:', data?.is_admin);
      
      return { isAdmin: data?.is_admin || false };
    },
    enabled: !!user?.id,
  });
}
