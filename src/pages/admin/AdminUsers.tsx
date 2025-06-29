
import React, { useState } from "react";
import { useUsers } from "@/hooks/admin/useUsers";
import { MainHeader } from "@/components/MainHeader";
import { UsersLoadingState } from "@/components/admin/users/UsersLoadingState";
import { UsersErrorState } from "@/components/admin/users/UsersErrorState";
import { UsersTable } from "@/components/admin/users/UsersTable";
import { UsersGallery } from "@/components/admin/users/UsersGallery";
import { UserDetailsDialog } from "@/components/admin/users/UserDetailsDialog";

export default function AdminUsers() {
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [layoutType, setLayoutType] = useState<"table" | "gallery">("table");
  const [sortField, setSortField] = useState("created_at");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const {
    data,
    isLoading,
    error,
    refetch
  } = useUsers(1);

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
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Users</h1>
          <p className="text-muted-foreground">Manage and view all users</p>
        </div>

        {isLoading ? (
          <UsersLoadingState />
        ) : error ? (
          <UsersErrorState />
        ) : data && data.users && data.users.length > 0 ? (
          layoutType === "table" ? (
            <UsersTable
              users={data.users}
              sortField={sortField}
              sortDirection={sortDirection}
              onSort={handleSortChange}
            />
          ) : (
            <UsersGallery
              users={data.users}
              sortField={sortField}
              sortDirection={sortDirection}
              onSort={handleSortChange}
            />
          )
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
