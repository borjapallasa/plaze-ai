
import type { Expert } from "@/types/expert";

export interface ExpertFormData {
  name: string;
  title: string;
  description: string;
  location: string;
  info: string;
  areas: string[];
  thumbnail: string;
}

export interface EditExpertDetailsDialogProps {
  expert: Expert;
  onUpdate: (updatedExpert: Expert) => void;
}

export interface ExpertiseAreaInfo {
  value: string;
  label: string;
  group: string;
}
