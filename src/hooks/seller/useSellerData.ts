
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

        // If still not found, try as email with case insensitive comparison
        if (!data && !error) {
          console.log('No expert found with UUIDs, trying as email:', id);
          ({ data, error } = await supabase
            .from('experts')
            .select('*')
            .ilike('email', id) // Use ilike for case insensitive email comparison
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
        
        // Ensure areas is properly parsed as an array of strings
        let parsedAreas: string[] = [];
        if (data.areas) {
          try {
            // If areas is a string, try to parse it as JSON
            if (typeof data.areas === 'string') {
              parsedAreas = JSON.parse(data.areas);
            }
            // If it's already an array, convert all elements to strings
            else if (Array.isArray(data.areas)) {
              parsedAreas = data.areas.map(area => String(area));
            }
            // If it's an object from JSON, convert to array of strings
            else if (typeof data.areas === 'object') {
              parsedAreas = Object.values(data.areas).map(val => String(val));
            }
          } catch (e) {
            console.error('Error parsing areas:', e);
          }
        }
        
        // Create a properly typed expert object
        const expertData: Expert = {
          ...data,
          areas: parsedAreas,
        };
        
        return expertData;
      } catch (error) {
        console.error('Error in useSellerData:', error);
        toast.error("Error loading expert data");
        return null;
      }
    },
    enabled: !!id && id !== ':id',
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    refetchOnWindowFocus: true, // Refetch when the window is focused
    refetchOnMount: true // Refetch when the component mounts
  });
}
