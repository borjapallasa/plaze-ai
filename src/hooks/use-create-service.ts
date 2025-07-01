
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface ServiceData {
  name: string;
  description: string;
  price: number;
  type: "monthly" | "one time";
  features: string[];
  category: string;
  tags: string[];
  status: "draft" | "active" | "inactive";
}

export function useCreateService() {
  const [isLoading, setIsLoading] = useState(false);

  const createService = async (serviceData: ServiceData) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('services')
        .insert([serviceData])
        .select()
        .single();

      if (error) {
        console.error('Error creating service:', error);
        toast.error("Failed to create service");
        throw error;
      }

      toast.success("Service created successfully");
      return data;
    } catch (error) {
      console.error('Error in createService:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    createService,
    isLoading
  };
}
