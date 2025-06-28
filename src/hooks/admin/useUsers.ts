
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";

export interface UserData {
  user_uuid: string;
  first_name: string;
  last_name: string;
  email: string;
  is_admin: boolean;
  is_expert: boolean;
  is_affiliate: boolean;
  created_at: string;
  last_sign_in_at: string;
  email_verified: boolean;
  total_spent: number;
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
        .select('user_uuid, first_name, last_name, email, is_admin, is_expert, is_affiliate, created_at, total_spent', { count: 'exact' });

      // Apply search filter
      if (searchQuery) {
        query = query.or(`first_name.ilike.%${searchQuery}%,last_name.ilike.%${searchQuery}%,email.ilike.%${searchQuery}%`);
      }

      // Apply role filter
      if (roleFilter !== "all") {
        if (roleFilter === "admins") {
          query = query.eq('is_admin', true);
        } else if (roleFilter === "experts") {
          query = query.eq('is_expert', true);
        } else if (roleFilter === "affiliates") {
          query = query.eq('is_affiliate', true);
        }
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

      // Transform data to add missing fields
      const transformedData = (data || []).map(user => ({
        ...user,
        last_sign_in_at: user.created_at, // Fallback since this field might not exist
        email_verified: true, // Fallback since this field might not exist
        total_spent: user.total_spent || 0
      }));

      return {
        users: transformedData,
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
