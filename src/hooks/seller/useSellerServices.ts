
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import React from "react";
import type { Service } from "@/components/expert/types";

export function useSellerServices(expertUuid: string | undefined) {
  const { data: servicesRaw = [], isLoading, error } = useQuery({
    queryKey: ['sellerServices', expertUuid],
    queryFn: async () => {
      if (!expertUuid) return [];
      
      console.log('Fetching services for expert_uuid:', expertUuid);
      const { data, error } = await supabase
        .from('services')
        .select(`
          name,
          description,
          price,
          features,
          type,
          status,
          service_uuid,
          monthly_recurring_revenue,
          revenue_amount,
          active_subscriptions_count,
          created_at
        `)
        .eq('expert_uuid', expertUuid);

      if (error) {
        console.error('Error fetching seller services:', error);
        throw error;
      }

      console.log('Fetched services:', data);
      return data || [];
    },
    enabled: !!expertUuid
  });

  // Transform the services data to ensure features is a string array
  const services: Service[] = React.useMemo(() => {
    return servicesRaw.map(service => ({
      ...service,
      features: Array.isArray(service.features) 
        ? service.features.map(feature => 
            typeof feature === 'string' ? feature : String(feature)
          ) 
        : []
    }));
  }, [servicesRaw]);

  return { services, isLoading, error };
}
