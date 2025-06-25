
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useExpertName(expertUuid: string | undefined) {
  return useQuery({
    queryKey: ['expert-name', expertUuid],
    queryFn: async () => {
      if (!expertUuid) {
        return null;
      }

      const { data, error } = await supabase
        .from('experts')
        .select('name')
        .eq('expert_uuid', expertUuid)
        .maybeSingle();

      if (error) {
        console.error('Error fetching expert name:', error);
        throw error;
      }

      return data?.name || null;
    },
    enabled: !!expertUuid,
  });
}
