
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface UserData {
  user_uuid: string;
  email: string;
  first_name: string;
  last_name: string;
  created_at: string;
  is_expert: boolean;
  is_affiliate: boolean;
  is_admin: boolean;
  total_spent: number;
  total_sales_amount: number;
  transaction_count: number;
  product_count: number;
  user_thumbnail?: string;
}

export function useUsers() {
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [sortField, setSortField] = useState<keyof UserData>("created_at");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  // Fetch users from Supabase
  const { data: users, isLoading, error, refetch } = useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      console.log('Fetching users for admin panel...');
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching users:', error);
        throw error;
      }
      
      console.log('Raw user data:', data);
      
      // Transform the data to match our interface
      const transformedData = (data || []).map(user => ({
        user_uuid: user.user_uuid,
        email: user.email || '',
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        created_at: user.created_at,
        is_expert: user.is_expert || false,
        is_affiliate: user.is_affiliate || false,
        is_admin: user.is_admin || false,
        total_spent: user.total_spent || 0,
        total_sales_amount: user.total_sales_amount || 0,
        transaction_count: user.transaction_count || 0,
        product_count: user.product_count || 0,
        user_thumbnail: user.user_thumbnail
      })) as UserData[];
      
      console.log('Transformed users:', transformedData);
      return transformedData;
    }
  });

  const handleSort = (field: keyof UserData) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const filteredUsers = users
    ? users
        .filter(user => {
          const matchesSearch = 
            (user.email?.toLowerCase().includes(searchQuery.toLowerCase()) || false) ||
            (user.first_name?.toLowerCase().includes(searchQuery.toLowerCase()) || false) ||
            (user.last_name?.toLowerCase().includes(searchQuery.toLowerCase()) || false);
          
          let matchesRole = false;
          if (roleFilter === "all") {
            matchesRole = true;
          } else if (roleFilter === "experts") {
            matchesRole = user.is_expert;
          } else if (roleFilter === "affiliates") {
            matchesRole = user.is_affiliate;
          } else if (roleFilter === "admins") {
            matchesRole = user.is_admin;
          }
          
          return matchesSearch && matchesRole;
        })
        .sort((a, b) => {
          const aValue = a[sortField];
          const bValue = b[sortField];
          const multiplier = sortDirection === "asc" ? 1 : -1;
          
          if (typeof aValue === "string" && typeof bValue === "string") {
            return aValue.localeCompare(bValue) * multiplier;
          }
          
          if (typeof aValue === "number" && typeof bValue === "number") {
            return (aValue - bValue) * multiplier;
          }
          
          if (typeof aValue === "boolean" && typeof bValue === "boolean") {
            return (aValue === bValue ? 0 : aValue ? 1 : -1) * multiplier;
          }
          
          return 0;
        })
    : [];

  return {
    users: filteredUsers,
    isLoading,
    error,
    searchQuery,
    setSearchQuery,
    roleFilter,
    setRoleFilter,
    sortField,
    sortDirection,
    handleSort,
    refetch
  };
}
