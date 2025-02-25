
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useExpertCommunity(expert_uuid: string | undefined) {
  return useQuery({
    queryKey: ['expert-community', expert_uuid],
    queryFn: async () => {
      if (!expert_uuid) return null;

      const { data, error } = await supabase
        .from('communities')
        .select('*')
        .eq('expert_uuid', expert_uuid);

      if (error) throw error;
      
      if (!data || data.length === 0) return null;
      
      const randomIndex = Math.floor(Math.random() * data.length);
      return data[randomIndex];
    },
    enabled: !!expert_uuid
  });
}
