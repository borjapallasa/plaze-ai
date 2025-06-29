
import React, { useState } from "react";
import { useUsers } from "@/hooks/admin/useUsers";
import { MainHeader } from "@/components/MainHeader";
import { UsersHeader } from "@/components/admin/users/UsersHeader";
import { UsersLayoutSwitcher } from "@/components/admin/users/UsersLayoutSwitcher";
import { UsersSortSelector } from "@/components/admin/users/UsersSortSelector";
import { UsersLoadingState } from "@/components/admin/users/UsersLoadingState";
import { UsersErrorState } from "@/components/admin/users/UsersErrorState";
import { UsersTable } from "@/components/admin/users/UsersTable";
import { UsersGallery } from "@/components/admin/users/UsersGallery";
import { UserDetailsDialog } from "@/components/admin/users/UserDetailsDialog";

export default function AdminUsers() {
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [layoutType, setLayoutType] = useState<"table" | "gallery">("table");
  const [sortField, setSortField] = useState<string>("created_at");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const {
    data,
    isLoading,
    error,
    refetch
  } = useUsers({
    searchQuery,
    roleFilter,
    sortField,
    sortDirection,
    page: 1,
    limit: 50
  });

  const handleSortChange = (field: string) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const handleUserClick = (userId: string) => {
    setSelectedUserId(userId);
    setIsDialogOpen(true);
  };

  return (
    <>
      <MainHeader />
      <div className="container mx-auto px-4 py-8 mt-16">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-4">Users Management</h1>
        </div>

        <div className="flex items-center justify-between py-4">
          <div>Layout Controls</div>
          <div>Sort Controls</div>
        </div>

        {isLoading ? (
          <div>Loading...</div>
        ) : error ? (
          <div>Error loading users</div>
        ) : data && data.users && data.users.length > 0 ? (
          <div>Users List</div>
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No users found.</p>
          </div>
        )}

        <UserDetailsDialog
          userUuid={selectedUserId}
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
        />
      </div>
    </>
  );
}
