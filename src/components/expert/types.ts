
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
  service_uuid: string;
  name?: string;
  description?: string;
  price?: number;
  features?: string[];
  type?: string;
  monthly_recurring_revenue?: number;
  revenue_amount?: number;
  active_subscriptions_count?: number;
  created_at?: string;
}

export interface ExpertServicesProps {
  services: Service[];
}
