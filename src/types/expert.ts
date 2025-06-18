
export interface Expert {
  id: number;
  expert_uuid: string;
  name?: string;
  email?: string;
  slug?: string;
  title?: string;
  location?: string;
  description?: string;
  completed_projects?: number;
  client_satisfaction?: number;
  response_rate?: number;
  created_at: string;
  areas: string[];
  status?: "active" | "inactive" | "in review" | "suspended";
  user_uuid?: string;
  activeTemplates?: number;
  totalTemplates?: number;
  thumbnail?: string;
  info?: string;
}
