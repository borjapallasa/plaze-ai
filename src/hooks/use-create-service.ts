
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import type { ServiceType } from "@/components/expert/types";

interface CreateServiceData {
  name: string;
  description: string;
  features: string[];
  price: number;
  type: ServiceType;
  main_category: { value: string } | null;
  subcategory: { value: string }[];
  status: 'draft' | 'active' | 'archived';
}

export function useCreateService() {
  const [isSaving, setIsSaving] = useState(false);
  const navigate = useNavigate();

  const handleSave = async (data: CreateServiceData) => {
    setIsSaving(true);
    try {
      const { data: service, error } = await supabase
        .from('services')
        .insert([{
          name: data.name,
          description: data.description,
          features: data.features,
          price: data.price,
          type: data.type,
          main_category: data.main_category,
          subcategory: data.subcategory,
          status: data.status
        }])
        .select()
        .single();

      if (error) throw error;

      navigate(`/service/${service.service_uuid}/edit`);
    } catch (error) {
      console.error('Error creating service:', error);
      throw error;
    } finally {
      setIsSaving(false);
    }
  };

  return { handleSave, isSaving };
}
