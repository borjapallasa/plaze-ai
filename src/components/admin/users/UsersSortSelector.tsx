
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface UserData {
  user_uuid: string;
  first_name: string;
  last_name: string;
  email: string;
  created_at: string;
  total_spent: number;
  is_admin: boolean;
  is_expert: boolean;
  is_affiliate: boolean;
}

interface UsersSortSelectorProps {
  sortBy: keyof UserData;
  sortOrder: "asc" | "desc";
  onSortChange: (field: keyof UserData) => void;
}

export function UsersSortSelector({ sortBy, sortOrder, onSortChange }: UsersSortSelectorProps) {
  const sortOptions = [
    { value: 'created_at', label: 'Join Date' },
    { value: 'first_name', label: 'First Name' },
    { value: 'last_name', label: 'Last Name' },
    { value: 'email', label: 'Email' },
    { value: 'total_spent', label: 'Total Spent' },
  ];

  return (
    <div className="flex items-center gap-2">
      <Select value={sortBy} onValueChange={(value) => onSortChange(value as keyof UserData)}>
        <SelectTrigger className="w-[180px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {sortOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      <Button
        variant="outline"
        size="sm"
        onClick={() => onSortChange(sortBy)}
        className="px-3"
      >
        {sortOrder === "asc" ? (
          <ChevronUp className="h-4 w-4" />
        ) : (
          <ChevronDown className="h-4 w-4" />
        )}
      </Button>
    </div>
  );
}
