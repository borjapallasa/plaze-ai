
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";

export function useAdminCheck() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['admin-check', user?.id],
    queryFn: async () => {
      if (!user?.id) {
        console.log('No user ID found');
        return { isAdmin: false };
      }

      console.log('Checking admin status for user:', user.id);
      
      // Let's first check what's in the users table
      const { data: allData, error: debugError } = await supabase
        .from('users')
        .select('*')
        .eq('user_uuid', user.id);
        
      console.log('All user data:', allData);
      console.log('Debug error:', debugError);
      
      const { data, error } = await supabase
        .from('users')
        .select('is_admin')
        .eq('user_uuid', user.id)
        .single();

      if (error) {
        console.error('Error checking admin status:', error);
        return { isAdmin: false };
      }

      console.log('Admin check result:', data);
      const isAdmin = data?.is_admin === true;
      console.log('Final isAdmin value:', isAdmin);
      return { isAdmin };
    },
    enabled: !!user?.id,
  });
}
