
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface UserData {
  user_uuid: string;
  email: string;
  first_name?: string;
  last_name?: string;
  created_at: string;
  total_spent?: number;
  transaction_count?: number;
  is_admin?: boolean;
  is_affiliate?: boolean;
  is_expert?: boolean;
  total_sales_amount?: number;
  product_count?: number;
  active_product_count?: number;
}

export const useUsers = (page = 1, limit = 10, sortBy: keyof UserData = 'created_at', sortOrder: 'asc' | 'desc' = 'desc') => {
  return useQuery({
    queryKey: ['admin-users', page, limit, sortBy, sortOrder],
    queryFn: async () => {
      const offset = (page - 1) * limit;
      
      const { data, error, count } = await supabase
        .from('users')
        .select(`
          user_uuid,
          email,
          first_name,
          last_name,
          created_at,
          total_spent,
          transaction_count,
          is_admin,
          is_affiliate,
          is_expert,
          total_sales_amount,
          product_count,
          active_product_count
        `, { count: 'exact' })
        .order(sortBy, { ascending: sortOrder === 'asc' })
        .range(offset, offset + limit - 1);

      if (error) throw error;

      return {
        users: data as UserData[],
        totalCount: count || 0,
        totalPages: Math.ceil((count || 0) / limit)
      };
    }
  });
};
