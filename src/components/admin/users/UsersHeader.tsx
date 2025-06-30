
interface UsersHeaderProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  statusFilter: string;
  setStatusFilter: (value: string) => void;
}

export function UsersHeader({ searchTerm, setSearchTerm, statusFilter, setStatusFilter }: UsersHeaderProps) {
  return (
    <div className="mb-4">
      <h1 className="text-2xl font-semibold text-[#1A1F2C] mb-2">Users</h1>
      <p className="text-[#8E9196]">Manage all users in the system</p>
    </div>
  );
}
