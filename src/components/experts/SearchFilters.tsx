
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, ChevronDown } from "lucide-react";

interface SearchFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const SearchFilters = ({ searchQuery, setSearchQuery }: SearchFiltersProps) => {
  return (
    <div className="mb-6 flex flex-col gap-3">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input 
          placeholder="Search for experts" 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9 h-10 text-sm"
        />
      </div>
      
      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto pb-1 hide-scrollbar">
        <Button variant="outline" size="sm" className="h-8 text-sm">
          Talent badge
          <ChevronDown className="ml-1 h-3 w-3" />
        </Button>
        <Button variant="outline" size="sm" className="h-8 text-sm">
          Hourly rate
          <ChevronDown className="ml-1 h-3 w-3" />
        </Button>
        <Button variant="outline" size="sm" className="h-8 text-sm">
          Location
          <ChevronDown className="ml-1 h-3 w-3" />
        </Button>
        <Button variant="outline" size="sm" className="h-8 text-sm">
          Skills
          <ChevronDown className="ml-1 h-3 w-3" />
        </Button>
      </div>
    </div>
  );
};
