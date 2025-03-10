
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { Expert } from "@/types/expert";

export function useSellerData(id: string | undefined) {
  return useQuery({
    queryKey: ['expert', id],
    queryFn: async () => {
      if (!id || id === ':id') {
        console.log('No valid expert ID provided:', id);
        return null;
      }
      
      console.log('Fetching expert with ID:', id);
      
      try {
        // Try finding by expert_uuid first
        let { data, error } = await supabase
          .from('experts')
          .select('*')
          .eq('expert_uuid', id)
          .maybeSingle();
          
        if (!data && !error) {
          console.log('No expert found with expert_uuid, trying user_uuid:', id);
          // If not found by expert_uuid, try with user_uuid
          ({ data, error } = await supabase
            .from('experts')
            .select('*')
            .eq('user_uuid', id)
            .maybeSingle());
        }

        if (error) {
          console.error('Error fetching expert:', error);
          throw error;
        }
        
        if (!data) {
          console.log("No expert found with ID:", id);
          return null;
        }
        
        console.log('Expert data found:', data);
        
        // Ensure areas is properly parsed as an array
        if (data.areas) {
          try {
            // If areas is a string, try to parse it as JSON
            if (typeof data.areas === 'string') {
              data.areas = JSON.parse(data.areas);
            }
            // If it's not an array after parsing, make it an empty array
            if (!Array.isArray(data.areas)) {
              data.areas = [];
            }
          } catch (e) {
            console.error('Error parsing areas:', e);
            data.areas = [];
          }
        } else {
          data.areas = [];
        }
        
        return data as Expert;
      } catch (error) {
        console.error('Error in useSellerData:', error);
        toast.error("Error loading expert data");
        return null;
      }
    },
    enabled: !!id && id !== ':id'
  });
}
