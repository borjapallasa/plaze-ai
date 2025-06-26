
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { useAffiliateData } from "@/hooks/use-affiliate-data";

interface UserData {
  user_uuid: string;
  email: string;
  first_name: string;
  last_name: string;
  created_at: string;
  total_spent: number;
}

export function useUsers() {
  const { user } = useAuth();
  const { data: affiliateData } = useAffiliateData();
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [sortField, setSortField] = useState<keyof UserData>("created_at");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  // Fetch users from Supabase
  const { data: users, isLoading, error, refetch } = useQuery({
    queryKey: ['admin-users', affiliateData?.affiliate_code],
    queryFn: async () => {
      console.log('Fetching users for affiliate dashboard...', affiliateData?.affiliate_code);
      
      if (!affiliateData?.affiliate_code) {
        console.log('No affiliate code available, returning empty array');
        return [];
      }

      const { data, error } = await supabase
        .from('users')
        .select('user_uuid, email, first_name, last_name, created_at, total_spent')
        .eq('referral_affiliate_code', affiliateData.affiliate_code)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching users:', error);
        throw error;
      }
      
      console.log('Raw user data for affiliate:', data);
      
      // Transform the data to match our interface
      const transformedData = (data || []).map(user => ({
        user_uuid: user.user_uuid,
        email: user.email || '',
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        created_at: user.created_at,
        total_spent: user.total_spent || 0
      })) as UserData[];
      
      console.log('Transformed users for affiliate:', transformedData);
      return transformedData;
    },
    enabled: !!user?.id && !!affiliateData?.affiliate_code,
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
          
          return matchesSearch;
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
