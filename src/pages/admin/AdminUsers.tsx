
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
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">User Management</h1>
            <p className="text-muted-foreground mt-2">
              Manage and monitor user accounts across the platform
            </p>
          </div>

          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setLayoutType("table")}
                className={`px-3 py-2 rounded ${layoutType === "table" ? "bg-primary text-white" : "bg-gray-200"}`}
              >
                Table
              </button>
              <button
                onClick={() => setLayoutType("gallery")}
                className={`px-3 py-2 rounded ${layoutType === "gallery" ? "bg-primary text-white" : "bg-gray-200"}`}
              >
                Gallery
              </button>
            </div>
            <select
              value={`${sortField}-${sortDirection}`}
              onChange={(e) => {
                const [field, direction] = e.target.value.split('-');
                setSortField(field);
                setSortDirection(direction as "asc" | "desc");
              }}
              className="px-3 py-2 border rounded"
            >
              <option value="created_at-desc">Newest First</option>
              <option value="created_at-asc">Oldest First</option>
              <option value="first_name-asc">Name A-Z</option>
              <option value="first_name-desc">Name Z-A</option>
            </select>
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
      </div>
    </>
  );
}
