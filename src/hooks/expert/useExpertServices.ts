
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Service } from "@/components/expert/types";

export function useExpertServices(expert_uuid: string | undefined) {
  return useQuery({
    queryKey: ['expert-services', expert_uuid],
    queryFn: async () => {
      if (!expert_uuid || expert_uuid === ':id') return [];

      const { data, error } = await supabase
        .from('services')
        .select(`
          service_uuid,
          name,
          description,
          price,
          features,
          type,
          monthly_recurring_revenue,
          revenue_amount,
          active_subscriptions_count,
          created_at
        `)
        .eq('expert_uuid', expert_uuid);

      if (error) {
        console.error('Error fetching services:', error);
        throw error;
      }
      
      return (data || []).map(service => ({
        ...service,
        features: service.features ? 
          (Array.isArray(service.features) ? service.features : JSON.parse(service.features as string)) 
          : []
      })) as Service[];
    },
    enabled: !!expert_uuid && expert_uuid !== ':id'
  });
}
