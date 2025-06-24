
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowDown, ArrowUp, DollarSign } from "lucide-react";

interface SortOption {
  value: string;
  label: string;
  icon: React.ReactNode;
}

interface CommunitySubscriptionSortSelectorProps {
  sortBy: string;
  onSortChange: (value: string) => void;
}

export function CommunitySubscriptionSortSelector({ sortBy, onSortChange }: CommunitySubscriptionSortSelectorProps) {
  const sortOptions: SortOption[] = [
    {
      value: "name-asc",
      label: "Name (A-Z)",
      icon: <ArrowUp className="h-3 w-3" />
    },
    {
      value: "name-desc", 
      label: "Name (Z-A)",
      icon: <ArrowDown className="h-3 w-3" />
    },
    {
      value: "date-asc",
      label: "Date (Oldest)",
      icon: <ArrowUp className="h-3 w-3" />
    },
    {
      value: "date-desc",
      label: "Date (Newest)", 
      icon: <ArrowDown className="h-3 w-3" />
    },
    {
      value: "amount-asc",
      label: "Amount (Low to High)",
      icon: <ArrowUp className="h-3 w-3" />
    },
    {
      value: "amount-desc",
      label: "Amount (High to Low)",
      icon: <ArrowDown className="h-3 w-3" />
    }
  ];

  const selectedOption = sortOptions.find(option => option.value === sortBy);

  return (
    <Select value={sortBy} onValueChange={onSortChange}>
      <SelectTrigger className="w-[180px]">
        <div className="flex items-center gap-2">
          {selectedOption?.icon}
          <SelectValue placeholder="Sort by" />
        </div>
      </SelectTrigger>
      <SelectContent>
        {sortOptions.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            <div className="flex items-center gap-2">
              {option.icon}
              {option.label}
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
