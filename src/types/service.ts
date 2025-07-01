
export interface Service {
  service_uuid: string;
  name: string;
  description: string;
  price: number;
  type: "monthly" | "one time";
  features: string[];
  category: string;
  tags: string[];
  status: "draft" | "active" | "inactive";
  created_at: string;
  updated_at: string;
  user_uuid: string;
}

export type ServiceStatus = "draft" | "active" | "inactive";
