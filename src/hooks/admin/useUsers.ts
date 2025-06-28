import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";

export interface UserData {
  id: number;
  user_uuid: string;
  email: string;
  first_name?: string;
  last_name?: string;
  created_at: string;
  total_spent?: number;
  transaction_count?: number;
  product_count?: number;
  is_admin?: boolean;
  is_affiliate?: boolean;
  affiliate_since?: string;
  user_thumbnail?: string;
}

export const useUsers = (page = 1, limit = 10, sortBy: keyof UserData = 'created_at', sortOrder: 'asc' | 'desc' = 'desc') => {
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [sortField, setSortField] = useState<keyof UserData>('created_at');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const handleSort = (field: keyof UserData) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const query = useQuery({
    queryKey: ['admin-users', page, limit, sortBy, sortOrder, searchQuery, roleFilter],
    queryFn: async () => {
      const offset = (page - 1) * limit;
      
      let query = supabase
        .from('users')
        .select(`
          id,
          user_uuid,
          email,
          first_name,
          last_name,
          created_at,
          total_spent,
          transaction_count,
          product_count,
          is_admin,
          is_affiliate,
          affiliate_since,
          user_thumbnail
        `, { count: 'exact' });

      // Apply search filter
      if (searchQuery) {
        query = query.or(`email.ilike.%${searchQuery}%,first_name.ilike.%${searchQuery}%,last_name.ilike.%${searchQuery}%`);
      }

      // Apply role filter
      if (roleFilter === 'experts') {
        query = query.eq('is_expert', true);
      } else if (roleFilter === 'affiliates') {
        query = query.eq('is_affiliate', true);
      } else if (roleFilter === 'admins') {
        query = query.eq('is_admin', true);
      }

      const { data, error, count } = await query
        .order(sortField, { ascending: sortDirection === 'asc' })
        .range(offset, offset + limit - 1);

      if (error) throw error;

      // Transform data to match UserData interface with required properties
      const transformedData = (data || []).map(user => ({
        id: user.id,
        user_uuid: user.user_uuid,
        email: user.email,
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        created_at: user.created_at,
        total_spent: user.total_spent || 0,
        transaction_count: user.transaction_count || 0,
        product_count: user.product_count || 0,
        is_admin: user.is_admin || false,
        is_affiliate: user.is_affiliate || false,
        affiliate_since: user.affiliate_since || '',
        user_thumbnail: user.user_thumbnail || ''
      }));

      return {
        users: transformedData as UserData[],
        totalCount: count || 0,
        totalPages: Math.ceil((count || 0) / limit)
      };
    }
  });

  return {
    ...query,
    users: query.data?.users || [],
    totalCount: query.data?.totalCount || 0,
    totalPages: query.data?.totalPages || 0,
    searchQuery,
    setSearchQuery,
    roleFilter,
    setRoleFilter,
    sortField,
    sortDirection,
    handleSort,
    refetch: query.refetch
  };
};
