
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Expert } from "@/types/expert";

export function useExperts() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortField, setSortField] = useState<keyof Expert>("created_at");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  // Fetch experts from Supabase
  const { data: experts, isLoading, error } = useQuery({
    queryKey: ['admin-experts'],
    queryFn: async () => {
      console.log('Fetching experts for admin panel...');
      const { data, error } = await supabase
        .from('experts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching experts:', error);
        throw error;
      }
      
      console.log('Raw expert data:', data);
      
      // Transform the data to ensure areas is always a string array
      // and add default status if not present
      const transformedData = (data || []).map(expert => ({
        ...expert,
        areas: expert.areas ? (
          typeof expert.areas === 'string' 
            ? JSON.parse(expert.areas)
            : Array.isArray(expert.areas)
              ? expert.areas
              : []
        ) : [],
        status: expert.status || "active", // Default status
        activeTemplates: Math.floor(Math.random() * 5), // Placeholder for now
        totalTemplates: Math.floor(Math.random() * 10) + 5, // Placeholder for now
        email: `${expert.slug || 'user'}@example.com` // Placeholder email
      })) as Expert[];
      
      console.log('Transformed experts:', transformedData);
      return transformedData;
    }
  });

  const handleSort = (field: keyof Expert) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const filteredExperts = experts
    ? experts
        .filter(expert => {
          const matchesSearch = 
            (expert.email?.toLowerCase().includes(searchQuery.toLowerCase()) || false) ||
            (expert.name?.toLowerCase().includes(searchQuery.toLowerCase()) || false);
          const matchesStatus = statusFilter === "all" || expert.status === statusFilter;
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
    experts: filteredExperts,
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
