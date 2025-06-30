
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { ArrowDown, ArrowUp } from "lucide-react";
import { UserDetailsDialog } from "./UserDetailsDialog";
import { useState } from "react";

interface UserData {
  user_uuid: string;
  email: string;
  first_name: string;
  last_name: string;
  created_at: string;
  total_spent: number;
  commissions_generated: number;
  is_admin: boolean;
  is_affiliate: boolean;
  is_expert: boolean;
  transaction_count: number;
  product_count: number;
  total_sales_amount: number;
  user_thumbnail: string;
}

interface UsersTableProps {
  users: UserData[];
  onSort: (field: keyof UserData) => void;
  sortBy: keyof UserData;
  sortOrder: "asc" | "desc";
  onUserClick: (user: UserData) => void;
  onLoadMore: () => void;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
}

export function UsersTable({ users, sortBy, sortOrder, onSort, onUserClick }: UsersTableProps) {
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const getSortIcon = (field: keyof UserData) => {
    if (sortBy !== field) return null;
    return sortOrder === "asc" ? 
      <ArrowUp className="h-4 w-4" /> : 
      <ArrowDown className="h-4 w-4" />;
  };

  const handleUserClick = (user: UserData) => {
    setSelectedUser(user);
    setDialogOpen(true);
    onUserClick(user);
  };

  return (
    <>
      <div className="rounded-lg border border-[#E5E7EB] bg-white">
        <ScrollArea className="h-[600px] w-full" type="always">
          <div className="min-w-[800px]">
            <div className="grid grid-cols-[2fr,2fr,1.5fr,1.5fr] px-6 py-4 bg-[#F8F9FC] border-b border-[#E5E7EB]">
              <button onClick={() => onSort("first_name")} className="flex items-center gap-2 font-medium text-sm text-[#8E9196] hover:text-[#1A1F2C] truncate pr-4">
                <span className="truncate">User</span> {getSortIcon("first_name")}
              </button>
              <button onClick={() => onSort("created_at")} className="flex items-center gap-2 font-medium text-sm text-[#8E9196] hover:text-[#1A1F2C] truncate pr-4">
                <span className="truncate">Created @</span> {getSortIcon("created_at")}
              </button>
              <button onClick={() => onSort("total_spent")} className="flex items-center gap-2 font-medium text-sm text-[#8E9196] hover:text-[#1A1F2C] truncate pr-4">
                <span className="truncate">Amount Spent</span> {getSortIcon("total_spent")}
              </button>
              <button onClick={() => onSort("commissions_generated")} className="flex items-center gap-2 font-medium text-sm text-[#8E9196] hover:text-[#1A1F2C] truncate pr-4">
                <span className="truncate">Commissions</span> {getSortIcon("commissions_generated")}
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
                    className="grid grid-cols-[2fr,2fr,1.5fr,1.5fr] px-6 py-4 hover:bg-[#F8F9FC] transition-colors duration-200 cursor-pointer"
                    onClick={() => handleUserClick(user)}
                  >
                    <div className="text-sm text-[#1A1F2C] truncate pr-4">
                      <div className="font-medium">{`${user.first_name} ${user.last_name}` || 'Unnamed User'}</div>
                      <div className="text-[#8E9196] text-xs">{user.email || 'No email'}</div>
                    </div>
                    <div className="text-sm text-[#8E9196] truncate pr-4">
                      {new Date(user.created_at).toLocaleString()}
                    </div>
                    <div className="text-sm text-[#1A1F2C] font-medium truncate pr-4">
                      ${(user.total_spent || 0).toFixed(2)}
                    </div>
                    <div className="text-sm text-[#1A1F2C] font-medium truncate pr-4">
                      ${(user.commissions_generated || 0).toFixed(2)}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>

      <UserDetailsDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        user={selectedUser}
      />
    </>
  );
}
