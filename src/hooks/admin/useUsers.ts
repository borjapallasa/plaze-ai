
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface UserData {
  user_uuid: string;
  email: string;
  first_name: string;
  last_name: string;
  created_at: string;
  is_expert: boolean;
  is_affiliate: boolean;
  is_admin: boolean;
  total_spent: number;
}

export function useUsers() {
  return useQuery({
    queryKey: ['admin-users'],
    queryFn: async (): Promise<UserData[]> => {
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
          total_spent
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    }
  });
}
