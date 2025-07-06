
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface Affiliate {
  id: number;
  affiliate_uuid: string;
  user_uuid: string | null;
  email: string | null;
  status: string | null;
  affiliate_code: string | null;
  paypal: string | null;
  commissions_made: number | null;
  commissions_available: number | null;
  commissions_paid: number | null;
  created_at: string;
}

export function useAffiliates() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("new"); // Default to "new"
  const [sortField, setSortField] = useState<keyof Affiliate>("created_at");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  // Fetch affiliates from Supabase
  const { data: allAffiliatesData, isLoading, error } = useQuery({
    queryKey: ['admin-affiliates'],
    queryFn: async () => {
      console.log('Fetching affiliates for admin panel...');
      const { data, error } = await supabase
        .from('affiliates')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching affiliates:', error);
        throw error;
      }
      
      console.log('Raw affiliate data:', data);
      
      // Transform the data to ensure proper types
      const transformedData = (data || []).map(affiliate => ({
        ...affiliate,
        status: affiliate.status || "new",
        commissions_made: affiliate.commissions_made || 0,
        commissions_available: affiliate.commissions_available || 0,
        commissions_paid: affiliate.commissions_paid || 0,
      })) as Affiliate[];
      
      console.log('Transformed affiliates:', transformedData);
      return transformedData;
    }
  });

  const handleSort = (field: keyof Affiliate) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const filteredAffiliates = allAffiliatesData
    ? allAffiliatesData
        .filter(affiliate => {
          const matchesSearch = 
            (affiliate.email?.toLowerCase().includes(searchQuery.toLowerCase()) || false) ||
            (affiliate.affiliate_code?.toLowerCase().includes(searchQuery.toLowerCase()) || false);
          
          let matchesStatus = false;
          if (statusFilter === "all") {
            matchesStatus = true;
          } else {
            matchesStatus = affiliate.status === statusFilter;
          }
          
          return matchesSearch && matchesStatus;
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
    affiliates: filteredAffiliates,
    allAffiliates: allAffiliatesData || [], // Return all affiliates for counting
    isLoading,
    error,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    sortField,
    sortDirection,
    handleSort
  };
}
