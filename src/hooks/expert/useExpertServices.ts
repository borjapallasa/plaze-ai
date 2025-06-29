
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Service } from "@/components/expert/types";

export function useExpertServices(expertUuid?: string) {
  const { data: services = [], isLoading } = useQuery({
    queryKey: ['expert-services', expertUuid],
    queryFn: async () => {
      if (!expertUuid) return [];
      
      // For now, return empty array since services table doesn't exist
      // This can be updated when the services functionality is properly implemented
      return [];
    },
    enabled: !!expertUuid,
  });

  const processedServices: Service[] = services.map((service: any) => ({
    ...service,
    parsedFeatures: [],
    status: service.status || 'draft',
    type: service.type || 'service'
  }));

  return {
    services: processedServices,
    isLoading
  };
}
