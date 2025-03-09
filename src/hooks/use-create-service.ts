
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import type { Json } from "@/integrations/supabase/types";
import type { ServiceStatus, ServiceType } from "@/components/expert/types";

interface ServiceData {
  name: string;
  description: string;
  price: number;
  type: ServiceType;
  features: string[];
  main_category: { value: string } | null;
  subcategory: { value: string }[] | null;
  status: ServiceStatus;
}

export const useCreateService = () => {
  const [isCreating, setIsCreating] = useState(false);
  const { user } = useAuth();

  const createService = async (serviceData: ServiceData) => {
    if (!user) {
      throw new Error("User not authenticated");
    }

    setIsCreating(true);
    
    try {
      console.log("Creating service with data:", JSON.stringify(serviceData));
      
      const { data: expertData, error: expertError } = await supabase
        .from("experts")
        .select("expert_uuid")
        .eq("user_uuid", user.id)
        .single();

      if (expertError) {
        console.error("Error fetching expert:", expertError);
        throw expertError;
      }

      const expertUuid = expertData?.expert_uuid;
      
      if (!expertUuid) {
        throw new Error("Expert profile not found");
      }
      
      // Ensure proper structure for Supabase
      const servicePayload = {
        user_uuid: user.id,
        expert_uuid: expertUuid,
        name: serviceData.name,
        description: serviceData.description,
        price: serviceData.price,
        type: serviceData.type,
        features: serviceData.features,
        main_category: serviceData.main_category,
        subcategory: serviceData.subcategory,
        status: serviceData.status
      };
      
      console.log("Service payload for Supabase:", JSON.stringify(servicePayload));

      const { data, error } = await supabase
        .from("services")
        .insert(servicePayload)
        .select()
        .single();

      if (error) {
        console.error("Error creating service:", error);
        throw error;
      }
      
      console.log("Service created successfully:", data);
      return data;
    } catch (error) {
      console.error("Service creation failed:", error);
      throw error;
    } finally {
      setIsCreating(false);
    }
  };

  return { createService, isCreating };
};
