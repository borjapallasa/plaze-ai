
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { Expert } from "@/types/expert";

export function useSellerData(id: string | undefined) {
  return useQuery({
    queryKey: ['expert', id],
    queryFn: async () => {
      if (!id) throw new Error("No expert ID provided");
      
      console.log('Fetching expert with ID:', id);
      
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
        toast.error("Expert profile not found");
        console.log("No expert found with ID:", id);
        return null;
      }
      
      console.log('Expert data found:', data);
      return data as Expert;
    },
    enabled: !!id
  });
}
