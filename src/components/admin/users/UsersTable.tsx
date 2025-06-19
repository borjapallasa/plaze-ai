
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { ArrowDown, ArrowUp } from "lucide-react";

interface UserData {
  user_uuid: string;
  email: string;
  first_name: string;
  last_name: string;
  created_at: string;
  is_expert: boolean;
  is_affiliate: boolean;
  is_admin: boolean;
}

interface UsersTableProps {
  users: UserData[];
  sortField: keyof UserData;
  sortDirection: "asc" | "desc";
  onSort: (field: keyof UserData) => void;
}

export function UsersTable({ users, sortField, sortDirection, onSort }: UsersTableProps) {
  const navigate = useNavigate();

  const getSortIcon = (field: keyof UserData) => {
    if (sortField !== field) return null;
    return sortDirection === "asc" ? 
      <ArrowUp className="h-4 w-4" /> : 
      <ArrowDown className="h-4 w-4" />;
  };

  const handleUserClick = (userUuid: string) => {
    navigate(`/admin/users/user/${userUuid}`);
  };

  return (
    <div className="rounded-lg border border-[#E5E7EB] bg-white">
      <ScrollArea className="h-[600px] w-full" type="always">
        <div className="min-w-[1000px]">
          <div className="grid grid-cols-[2fr,2fr,1.5fr,1fr,1fr,1fr] px-6 py-4 bg-[#F8F9FC] border-b border-[#E5E7EB]">
            <button onClick={() => onSort("first_name")} className="flex items-center gap-2 font-medium text-sm text-[#8E9196] hover:text-[#1A1F2C] truncate pr-4">
              <span className="truncate">Name</span> {getSortIcon("first_name")}
            </button>
            <button onClick={() => onSort("email")} className="flex items-center gap-2 font-medium text-sm text-[#8E9196] hover:text-[#1A1F2C] truncate pr-4">
              <span className="truncate">Email</span> {getSortIcon("email")}
            </button>
            <button onClick={() => onSort("created_at")} className="flex items-center gap-2 font-medium text-sm text-[#8E9196] hover:text-[#1A1F2C] truncate pr-4">
              <span className="truncate">Created @</span> {getSortIcon("created_at")}
            </button>
            <button onClick={() => onSort("is_expert")} className="flex items-center gap-2 font-medium text-sm text-[#8E9196] hover:text-[#1A1F2C] truncate pr-4">
              <span className="truncate">Expert</span> {getSortIcon("is_expert")}
            </button>
            <button onClick={() => onSort("is_affiliate")} className="flex items-center gap-2 font-medium text-sm text-[#8E9196] hover:text-[#1A1F2C] truncate pr-4">
              <span className="truncate">Affiliate</span> {getSortIcon("is_affiliate")}
            </button>
            <button onClick={() => onSort("is_admin")} className="flex items-center gap-2 font-medium text-sm text-[#8E9196] hover:text-[#1A1F2C] truncate pr-4">
              <span className="truncate">Admin</span> {getSortIcon("is_admin")}
            </button>
          </div>

          <div className="divide-y divide-[#E5E7EB]">
            {users.length === 0 ? (
              <div className="p-8 text-center text-[#8E9196]">
                No users found matching your criteria
              </div>
            ) : (
              users.map((user) => (
                <div
                  key={user.user_uuid}
                  className="grid grid-cols-[2fr,2fr,1.5fr,1fr,1fr,1fr] px-6 py-4 hover:bg-[#F8F9FC] transition-colors duration-200 cursor-pointer"
                  onClick={() => handleUserClick(user.user_uuid)}
                >
                  <div className="text-sm text-[#1A1F2C] truncate pr-4">{`${user.first_name} ${user.last_name}` || 'Unnamed User'}</div>
                  <div className="text-sm text-[#1A1F2C] truncate pr-4">{user.email || 'No email'}</div>
                  <div className="text-sm text-[#8E9196] truncate pr-4">
                    {new Date(user.created_at).toLocaleString()}
                  </div>
                  <div className="text-sm flex items-center">
                    {user.is_expert && <Badge variant="secondary" className="bg-blue-100 text-blue-800">Yes</Badge>}
                  </div>
                  <div className="text-sm flex items-center">
                    {user.is_affiliate && <Badge variant="secondary" className="bg-green-100 text-green-800">Yes</Badge>}
                  </div>
                  <div className="text-sm flex items-center">
                    {user.is_admin && <Badge variant="secondary" className="bg-purple-100 text-purple-800">Yes</Badge>}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
}
