
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
  source?: string;
  expert_uuid?: string;
  expert_slug?: string;
  affiliate_uuid?: string;
  admin_uuid?: string;
}

export function useUserDetails(userUuid: string) {
  const { data: user, isLoading, error, refetch } = useQuery({
    queryKey: ['admin-user-details', userUuid],
    queryFn: async () => {
      console.log('Fetching user details for UUID:', userUuid);
      
      // First get basic user info
      const { data: userData, error: userError } = await supabase
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
          stripe_client_id,
          source
        `)
        .eq('user_uuid', userUuid)
        .maybeSingle();

      if (userError) {
        console.error('Error fetching user details:', userError);
        throw userError;
      }
      
      if (!userData) {
        throw new Error('User not found');
      }

      console.log('User data:', userData);

      // Initialize result with user data
      const result: UserDetailsData = { ...userData };

      // Only fetch expert data if user is an expert
      if (userData.is_expert) {
        const { data: expertData, error: expertError } = await supabase
          .from('experts')
          .select('expert_uuid, slug')
          .eq('user_uuid', userUuid)
          .maybeSingle();

        if (expertError) {
          console.error('Error fetching expert data:', expertError);
        } else if (expertData) {
          result.expert_uuid = expertData.expert_uuid;
          result.expert_slug = expertData.slug;
          console.log('Expert data found:', expertData);
        }
      }

      // Only fetch affiliate data if user is an affiliate
      if (userData.is_affiliate) {
        const { data: affiliateData, error: affiliateError } = await supabase
          .from('affiliates')
          .select('affiliate_uuid')
          .eq('email', userData.email)
          .maybeSingle();

        if (affiliateError) {
          console.error('Error fetching affiliate data:', affiliateError);
        } else if (affiliateData) {
          result.affiliate_uuid = affiliateData.affiliate_uuid;
          console.log('Affiliate data found:', affiliateData);
        }
      }

      // Only fetch admin data if user is an admin
      if (userData.is_admin) {
        const { data: adminData, error: adminError } = await supabase
          .from('admins')
          .select('admin_uuid')
          .eq('user_uuid', userUuid)
          .maybeSingle();

        if (adminError) {
          console.error('Error fetching admin data:', adminError);
        } else if (adminData) {
          result.admin_uuid = adminData.admin_uuid;
          console.log('Admin data found:', adminData);
        }
      }

      console.log('Final user details with roles:', result);
      return result;
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
