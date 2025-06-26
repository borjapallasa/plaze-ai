
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface SortOption {
  value: string;
  label: string;
}

interface CommunitySubscriptionSortSelectorProps {
  sortBy: string;
  onSortChange: (value: string) => void;
}

export function CommunitySubscriptionSortSelector({ sortBy, onSortChange }: CommunitySubscriptionSortSelectorProps) {
  const sortOptions: SortOption[] = [
    {
      value: "name-asc",
      label: "Name (asc)"
    },
    {
      value: "name-desc", 
      label: "Name (desc)"
    },
    {
      value: "date-asc",
      label: "Date (asc)"
    },
    {
      value: "date-desc",
      label: "Date (desc)"
    }
  ];

  return (
    <Select value={sortBy} onValueChange={onSortChange}>
      <SelectTrigger className="w-full md:w-[140px]">
        <SelectValue placeholder="Sort by" />
      </SelectTrigger>
      <SelectContent>
        {sortOptions.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
