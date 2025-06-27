
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface UserData {
  user_uuid: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  created_at: string;
  is_affiliate: boolean | null;
  is_admin: boolean | null;
  is_expert: boolean | null;
  total_spent: number | null;
  total_sales_amount: number | null;
  transaction_count: number | null;
  product_count: number | null;
  active_product_count: number | null;
  source: string | null;
  via: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_id: string | null;
  utm_term: string | null;
  utm_content: string | null;
  referral_affiliate_code: string | null;
  affiliate_since: string | null;
  affiliate_multiplier: number | null;
  average_review: number | null;
  payout_amount: number | null;
  requested_amount: number | null;
  affiliate_fees_amount: number | null;
  available_amount: number | null;
  net_sales_amount: number | null;
  fees_amount: number | null;
  service_sales_amount: number | null;
  job_sales_amount: number | null;
  subscription_sales_amount: number | null;
  product_sales_amount: number | null;
  service_transaction_amount_spent: number | null;
  job_amount_spent: number | null;
  product_amount_spent: number | null;
  subscription_amount_spent: number | null;
  stripe_client_id: string | null;
  affiliate_id: string | null;
  affiliate_link: string | null;
  member_profile_link: string | null;
  user_thumbnail: string | null;
  communities_joined: any;
}

export interface UseUsersParams {
  page?: number;
  limit?: number;
  searchTerm?: string;
  sortBy?: keyof UserData;
  sortOrder?: 'asc' | 'desc';
}

export function useUsers({
  page = 1,
  limit = 10,
  searchTerm = '',
  sortBy = 'created_at',
  sortOrder = 'desc'
}: UseUsersParams = {}) {
  return useQuery({
    queryKey: ['users', page, limit, searchTerm, sortBy, sortOrder],
    queryFn: async () => {
      let query = supabase
        .from('users')
        .select('*', { count: 'exact' });

      if (searchTerm) {
        query = query.or(`email.ilike.%${searchTerm}%,first_name.ilike.%${searchTerm}%,last_name.ilike.%${searchTerm}%`);
      }

      const validSortColumn = sortBy as string;
      query = query.order(validSortColumn, { ascending: sortOrder === 'asc' });

      const from = (page - 1) * limit;
      const to = from + limit - 1;
      query = query.range(from, to);

      const { data, error, count } = await query;

      if (error) {
        console.error('Error fetching users:', error);
        throw error;
      }

      return {
        users: data as UserData[],
        count: count || 0,
        totalPages: Math.ceil((count || 0) / limit)
      };
    },
    staleTime: 30000,
    retry: 3
  });
}
