
import React, { useState, useMemo } from "react";
import { Navigate } from "react-router-dom";
import { useUsers } from "@/hooks/admin/useUsers";
import { useAdminCheck } from "@/hooks/use-admin-check";
import { UsersHeader } from "@/components/admin/users/UsersHeader";
import { UsersTable } from "@/components/admin/users/UsersTable";
import { UsersGallery } from "@/components/admin/users/UsersGallery";
import { UserDetailsDialog } from "@/components/admin/users/UserDetailsDialog";
import { UsersLoadingState } from "@/components/admin/users/UsersLoadingState";
import { UsersErrorState } from "@/components/admin/users/UsersErrorState";

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
  user_thumbnail: string;
  commissions_generated: number;
}

export default function AdminUsers() {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<keyof UserData>("created_at");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [layout, setLayout] = useState<"table" | "gallery">("table");
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [showUserDialog, setShowUserDialog] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Check admin status and fetch users data - MUST be at the top
  const { data: adminCheck, isLoading: adminLoading } = useAdminCheck();
  const { 
    data: usersData, 
    isLoading, 
    error, 
    refetch
  } = useUsers();

  // Extract users array from the data structure and ensure proper typing
  const users: UserData[] = Array.isArray(usersData) ? usersData.map(user => ({
    ...user,
    commissions_generated: user.commissions_generated || 0
  })) : (usersData?.users || []).map(user => ({
    ...user,
    commissions_generated: user.commissions_generated || 0
  }));

  // Filter users based on search term
  const filteredUsers = useMemo(() => {
    if (!searchTerm.trim()) return users;
    
    const searchLower = searchTerm.toLowerCase();
    return users.filter(user => 
      user.first_name?.toLowerCase().includes(searchLower) ||
      user.last_name?.toLowerCase().includes(searchLower) ||
      user.email?.toLowerCase().includes(searchLower) ||
      user.user_uuid?.toLowerCase().includes(searchLower) ||
      `${user.first_name} ${user.last_name}`.toLowerCase().includes(searchLower)
    );
  }, [users, searchTerm]);

  // If still checking admin status, show loading
  if (adminLoading) {
    return <UsersLoadingState />;
  }

  // If not admin, redirect to home page
  if (!adminCheck?.isAdmin) {
    return <Navigate to="/" replace />;
  }

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
    <div className="w-full min-h-screen">
      <div className="w-full max-w-none px-4 py-8">
        <UsersHeader 
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSortChange={handleSort}
          layout={layout}
          onLayoutChange={setLayout}
        />

        {layout === "table" ? (
          <UsersTable 
            users={filteredUsers}
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
            users={filteredUsers}
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
    </div>
  );
}
