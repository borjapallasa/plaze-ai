
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Expert } from "@/components/expert/types";

export function useExpertQuery(expert_uuid: string | undefined) {
  return useQuery({
    queryKey: ['expert', expert_uuid],
    queryFn: async () => {
      console.log("Fetching expert with UUID:", expert_uuid);
      const { data, error } = await supabase
        .from('experts')
        .select('*')
        .eq('expert_uuid', expert_uuid)
        .maybeSingle();

      if (error) {
        console.error("Supabase error:", error);
        throw error;
      }
      
      console.log("Expert data:", data);
      
      if (!data) {
        return null;
      }
      
      if (data.areas) {
        try {
          data.areas = typeof data.areas === 'string' 
            ? JSON.parse(data.areas) 
            : Array.isArray(data.areas) 
              ? data.areas 
              : [];
        } catch (e) {
          console.error('Error parsing areas:', e);
          data.areas = [];
        }
      } else {
        data.areas = [];
      }
      
      return data as Expert;
    },
    enabled: !!expert_uuid
  });
}
