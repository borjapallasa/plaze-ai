
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface UsersHeaderProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  statusFilter: string;
  setStatusFilter: (value: string) => void;
}

export function UsersHeader({ searchTerm, setSearchTerm, statusFilter, setStatusFilter }: UsersHeaderProps) {
  return (
    <div className="mb-6">
      <div className="mb-4">
        <h1 className="text-2xl font-semibold text-[#1A1F2C] mb-2">Users</h1>
        <p className="text-[#8E9196]">Manage all users in the system</p>
      </div>
      
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#8E9196] h-4 w-4" />
        <Input
          type="text"
          placeholder="Search by name, email, or user UUID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 border-[#E5E7EB] focus:border-[#3B82F6] focus:ring-[#3B82F6]"
        />
      </div>
    </div>
  );
}
