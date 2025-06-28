
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface UserData {
  user_uuid: string;
  first_name: string | null;
  last_name: string | null;
  email: string;
  created_at: string;
  is_admin: boolean | null;
  is_affiliate: boolean | null;
  is_expert: boolean | null;
  total_spent: number | null;
  product_count: number | null;
  transaction_count: number | null;
}

export function useUsers() {
  return useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('users')
        .select(`
          user_uuid,
          first_name,
          last_name,
          email,
          created_at,
          is_admin,
          is_affiliate,
          is_expert,
          total_spent,
          product_count,
          transaction_count
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching users:', error);
        throw error;
      }

      return data as UserData[];
    }
  });
}
