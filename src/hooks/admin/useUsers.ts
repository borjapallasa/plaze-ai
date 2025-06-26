
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";

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
  commissions_generated?: number;
}

export function useUsers() {
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [sortField, setSortField] = useState("created_at");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  const query = useQuery({
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

  const handleSort = (field: string) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Filter and sort users
  let filteredUsers = query.data || [];
  
  if (searchQuery) {
    filteredUsers = filteredUsers.filter(user => 
      user.first_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.last_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  if (roleFilter !== "all") {
    filteredUsers = filteredUsers.filter(user => {
      switch (roleFilter) {
        case "expert": return user.is_expert;
        case "affiliate": return user.is_affiliate;
        case "admin": return user.is_admin;
        default: return true;
      }
    });
  }

  // Sort users
  filteredUsers.sort((a, b) => {
    const aValue = a[sortField as keyof UserData];
    const bValue = b[sortField as keyof UserData];
    
    if (sortDirection === "asc") {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  return {
    ...query,
    users: filteredUsers,
    searchQuery,
    setSearchQuery,
    roleFilter,
    setRoleFilter,
    sortField,
    sortDirection,
    handleSort
  };
}
