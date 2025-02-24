
import type { Json } from "@/integrations/supabase/types";

export interface Expert {
  id: number;
  expert_uuid: string;
  name?: string;
  slug?: string;
  title?: string;
  location?: string;
  description?: string;
  completed_projects?: number;
  client_satisfaction?: number;
  response_rate?: number;
  areas?: string[];
  info?: string;
  created_at?: string;
}

export interface ExpertComponentProps {
  expert: Expert;
}

export interface Service {
  id: number;
  service_uuid: string;
  name?: string;
  description?: string;
  price?: number;
  features?: string[];
  type?: string;
}

export interface ExpertServicesProps {
  services: Service[];
}
