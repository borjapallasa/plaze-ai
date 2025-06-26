
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface UserDetailsData {
  user_uuid: string;
  email: string;
  first_name: string;
  last_name: string;
  created_at: string;
  is_expert: boolean;
  is_affiliate: boolean;
  is_admin: boolean;
  total_spent: number;
  expert_uuid?: string;
  affiliate_uuid?: string;
  admin_uuid?: string;
  source?: string;
  transaction_count?: number;
}

export function useUserDetails(userId: string | undefined) {
  const query = useQuery({
    queryKey: ['user-details', userId],
    queryFn: async (): Promise<UserDetailsData> => {
      if (!userId) throw new Error('User ID is required');

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
          source,
          transaction_count
        `)
        .eq('user_uuid', userId)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!userId
  });

  return {
    ...query,
    user: query.data
  };
}
