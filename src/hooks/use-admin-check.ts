
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
        // If user doesn't exist in users table, check if they should be admin based on email
        if (error.code === 'PGRST116' && user.email === 'admin@mrktgxxi.com') {
          console.log('User not found in users table, but email matches admin - creating admin user');
          
          // Try to insert the user as admin
          const { data: insertData, error: insertError } = await supabase
            .from('users')
            .insert({
              user_uuid: user.id,
              email: user.email,
              first_name: user.user_metadata?.first_name || '',
              last_name: user.user_metadata?.last_name || '',
              is_admin: true,
              is_affiliate: false,
              is_expert: false
            })
            .select('is_admin')
            .single();

          if (insertError) {
            console.error('Error creating admin user:', insertError);
            return { isAdmin: false };
          }

          console.log('Admin user created successfully:', insertData);
          return { isAdmin: insertData?.is_admin || false };
        }
        
        return { isAdmin: false };
      }

      console.log('Admin check result:', data);
      console.log('Is admin:', data?.is_admin);
      
      return { isAdmin: data?.is_admin || false };
    },
    enabled: !!user?.id,
  });
}
