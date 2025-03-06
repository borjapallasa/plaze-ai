
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Service, ServiceStatus } from "@/components/expert/types";

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
          status,
          monthly_recurring_revenue,
          revenue_amount,
          active_subscriptions_count,
          created_at
        `)
        .eq('expert_uuid', expert_uuid)
        .eq('status', 'active'); // Only fetch active services

      if (error) {
        console.error('Error fetching services:', error);
        throw error;
      }
      
      return (data || []).map(service => ({
        ...service,
        features: service.features ? 
          (Array.isArray(service.features) ? service.features : JSON.parse(service.features as string)) 
          : [],
        // Ensure status is one of the allowed values
        status: validateServiceStatus(service.status) || 'draft',
        type: service.type || 'one time'
      })) as Service[];
    },
    enabled: !!expert_uuid && expert_uuid !== ':id'
  });
}

// Helper function to validate status
function validateServiceStatus(status: unknown): ServiceStatus | undefined {
  if (status === 'active' || status === 'draft' || status === 'archived') {
    return status;
  }
  return undefined;
}
