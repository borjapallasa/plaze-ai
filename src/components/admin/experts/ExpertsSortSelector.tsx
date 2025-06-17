
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowUpDown } from "lucide-react";

interface ExpertsSortSelectorProps {
  sortValue: string;
  onSortChange: (value: string) => void;
}

export function ExpertsSortSelector({ sortValue, onSortChange }: ExpertsSortSelectorProps) {
  return (
    <Select value={sortValue} onValueChange={onSortChange}>
      <SelectTrigger className="w-[180px] border-[#E5E7EB]">
        <ArrowUpDown className="h-4 w-4 text-[#8E9196] mr-2" />
        <SelectValue placeholder="Sort by" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="created_at_desc">Newest First</SelectItem>
        <SelectItem value="created_at_asc">Oldest First</SelectItem>
        <SelectItem value="name_asc">Name A-Z</SelectItem>
        <SelectItem value="name_desc">Name Z-A</SelectItem>
        <SelectItem value="email_asc">Email A-Z</SelectItem>
        <SelectItem value="email_desc">Email Z-A</SelectItem>
        <SelectItem value="status_asc">Status A-Z</SelectItem>
        <SelectItem value="status_desc">Status Z-A</SelectItem>
      </SelectContent>
    </Select>
  );
}
