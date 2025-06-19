
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface UserDetailsData {
  user_uuid: string;
  email: string;
  first_name: string;
  last_name: string;
  created_at: string;
  is_expert: boolean;
  is_affiliate: boolean;
  is_admin: boolean;
  total_spent?: number;
  total_sales_amount?: number;
  affiliate_fees_amount?: number;
  product_count?: number;
  active_product_count?: number;
  transaction_count?: number;
  referral_source?: string;
  stripe_client_id?: string;
}

export function useUserDetails(userUuid: string) {
  const { data: user, isLoading, error, refetch } = useQuery({
    queryKey: ['admin-user-details', userUuid],
    queryFn: async () => {
      console.log('Fetching user details for UUID:', userUuid);
      const { data, error } = await supabase
        .from('users')
        .select(`
          user_uuid,
          email,
          first_name,
          last_name,
          created_at,
          is_expert,
          is_affiliate,
          is_admin,
          total_spent,
          total_sales_amount,
          affiliate_fees_amount,
          product_count,
          active_product_count,
          transaction_count,
          referral_source,
          stripe_client_id
        `)
        .eq('user_uuid', userUuid)
        .maybeSingle();

      if (error) {
        console.error('Error fetching user details:', error);
        throw error;
      }
      
      console.log('User details data:', data);
      
      if (!data) {
        throw new Error('User not found');
      }

      return data as UserDetailsData;
    },
    enabled: !!userUuid
  });

  return {
    user,
    isLoading,
    error,
    refetch
  };
}
