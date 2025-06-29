
import React, { useState } from "react";
import { useUsers } from "@/hooks/admin/useUsers";
import { UsersHeader } from "@/components/admin/users/UsersHeader";
import { UsersTable } from "@/components/admin/users/UsersTable";
import { UsersGallery } from "@/components/admin/users/UsersGallery";
import { UserDetailsDialog } from "@/components/admin/users/UserDetailsDialog";
import { UsersLoadingState } from "@/components/admin/users/UsersLoadingState";
import { UsersErrorState } from "@/components/admin/users/UsersErrorState";
import { UsersLayoutSwitcher } from "@/components/admin/users/UsersLayoutSwitcher";
import { UsersSortSelector } from "@/components/admin/users/UsersSortSelector";

interface UserData {
  user_uuid: string;
  first_name: string;
  last_name: string;
  email: string;
  is_admin: boolean;
  is_affiliate: boolean;
  is_expert: boolean;
  created_at: string;
  transaction_count: number;
  product_count: number;
  total_spent: number;
  total_sales_amount: number;
  user_thumbnail: string;
}

export default function AdminUsers() {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<keyof UserData>("created_at");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [layout, setLayout] = useState<"table" | "gallery">("table");
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [showUserDialog, setShowUserDialog] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const { 
    data: users = [], 
    isLoading, 
    error, 
    refetch
  } = useUsers();

  const handleSort = (field: string) => {
    const typedField = field as keyof UserData;
    if (sortBy === typedField) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(typedField);
      setSortOrder("asc");
    }
  };

  const handleUserClick = (user: UserData) => {
    setSelectedUser(user);
    setShowUserDialog(true);
  };

  const handleLoadMore = () => {
    // Load more functionality can be implemented here if needed
  };

  if (isLoading) {
    return <UsersLoadingState />;
  }

  if (error) {
    return <UsersErrorState onRetry={refetch} />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <UsersHeader 
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
      />
      
      <div className="flex justify-between items-center mb-6">
        <UsersSortSelector 
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSortChange={(field: keyof UserData) => handleSort(field)}
        />
        <UsersLayoutSwitcher layout={layout} onLayoutChange={setLayout} />
      </div>

      {layout === "table" ? (
        <UsersTable 
          users={users}
          onSort={handleSort}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onUserClick={handleUserClick}
          onLoadMore={handleLoadMore}
          hasNextPage={false}
          isFetchingNextPage={false}
        />
      ) : (
        <UsersGallery 
          users={users}
          onUserClick={handleUserClick}
          onLoadMore={handleLoadMore}
          hasNextPage={false}
          isFetchingNextPage={false}
        />
      )}

      <UserDetailsDialog
        user={selectedUser}
        open={showUserDialog}
        onOpenChange={setShowUserDialog}
      />
    </div>
  );
}
