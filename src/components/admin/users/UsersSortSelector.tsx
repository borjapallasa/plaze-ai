
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowUpDown } from "lucide-react";

interface UsersSortSelectorProps {
  sortValue: string;
  onSortChange: (value: string) => void;
}

export function UsersSortSelector({ sortValue, onSortChange }: UsersSortSelectorProps) {
  return (
    <Select value={sortValue} onValueChange={onSortChange}>
      <SelectTrigger className="w-full lg:w-[180px] border-[#E5E7EB]">
        <ArrowUpDown className="h-4 w-4 text-[#8E9196] mr-2" />
        <SelectValue placeholder="Sort by" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="created_at_desc">Newest First</SelectItem>
        <SelectItem value="created_at_asc">Oldest First</SelectItem>
        <SelectItem value="first_name_asc">First Name A-Z</SelectItem>
        <SelectItem value="first_name_desc">First Name Z-A</SelectItem>
        <SelectItem value="email_asc">Email A-Z</SelectItem>
        <SelectItem value="email_desc">Email Z-A</SelectItem>
        <SelectItem value="total_spent_desc">Highest Spent</SelectItem>
        <SelectItem value="total_spent_asc">Lowest Spent</SelectItem>
      </SelectContent>
    </Select>
  );
}
