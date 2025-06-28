
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";

export interface UserData {
  user_uuid: string;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
  created_at: string;
  last_sign_in_at: string;
  email_verified: boolean;
}

export const useUsers = (page: number = 1, limit: number = 20) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [sortField, setSortField] = useState<keyof UserData>("created_at");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  const handleSort = (field: keyof UserData) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const queryResult = useQuery({
    queryKey: ['users', page, limit, searchQuery, roleFilter, sortField, sortDirection],
    queryFn: async () => {
      let query = supabase
        .from('users')
        .select('user_uuid, first_name, last_name, email, role, created_at, last_sign_in_at, email_verified', { count: 'exact' });

      // Apply search filter
      if (searchQuery) {
        query = query.or(`first_name.ilike.%${searchQuery}%,last_name.ilike.%${searchQuery}%,email.ilike.%${searchQuery}%`);
      }

      // Apply role filter
      if (roleFilter !== "all") {
        query = query.eq('role', roleFilter);
      }

      // Apply sorting
      query = query.order(sortField, { ascending: sortDirection === "asc" });

      // Apply pagination
      const from = (page - 1) * limit;
      const to = from + limit - 1;
      query = query.range(from, to);

      const { data, error, count } = await query;

      if (error) {
        throw error;
      }

      const totalPages = Math.ceil((count || 0) / limit);

      return {
        users: data || [],
        count: count || 0,
        totalPages
      };
    }
  });

  return {
    ...queryResult,
    users: queryResult.data?.users || [],
    searchQuery,
    setSearchQuery,
    roleFilter,
    setRoleFilter,
    sortField,
    sortDirection,
    handleSort
  };
};
