
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AffiliatesSortSelectorProps {
  sortValue: string;
  onSortChange: (value: string) => void;
}

export function AffiliatesSortSelector({ sortValue, onSortChange }: AffiliatesSortSelectorProps) {
  return (
    <Select value={sortValue} onValueChange={onSortChange}>
      <SelectTrigger className="w-48">
        <SelectValue placeholder="Sort by..." />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="created_at_desc">Newest First</SelectItem>
        <SelectItem value="created_at_asc">Oldest First</SelectItem>
        <SelectItem value="email_asc">Email A-Z</SelectItem>
        <SelectItem value="email_desc">Email Z-A</SelectItem>
        <SelectItem value="status_asc">Status A-Z</SelectItem>
        <SelectItem value="status_desc">Status Z-A</SelectItem>
        <SelectItem value="commissions_made_desc">Highest Commissions</SelectItem>
        <SelectItem value="commissions_made_asc">Lowest Commissions</SelectItem>
      </SelectContent>
    </Select>
  );
}
