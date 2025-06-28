import React, { useState } from "react";
import { MainHeader } from "@/components/MainHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { UsersHeader } from "@/components/admin/users/UsersHeader";
import { UsersTable } from "@/components/admin/users/UsersTable";
import { UsersGallery } from "@/components/admin/users/UsersGallery";
import { UsersLoadingState } from "@/components/admin/users/UsersLoadingState";
import { UsersErrorState } from "@/components/admin/users/UsersErrorState";
import { UsersLayoutSwitcher } from "@/components/admin/users/UsersLayoutSwitcher";
import { UsersSortSelector } from "@/components/admin/users/UsersSortSelector";
import { UserDetailsDialog } from "@/components/admin/users/UserDetailsDialog";
import { useUsers } from "@/hooks/admin/useUsers";
import { Search, LayoutGrid, List } from "lucide-react";

export default function AdminUsers() {
  const [layout, setLayout] = useState<'table' | 'gallery'>('table');
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const {
    users,
    isLoading,
    error,
    totalCount,
    totalPages,
    searchQuery,
    setSearchQuery,
    roleFilter,
    setRoleFilter,
    sortField,
    sortDirection,
    handleSort,
    refetch
  } = useUsers(1, 50, 'created_at', 'desc');

  const handleUserClick = (userId: string) => {
    setSelectedUser(userId);
  };

  const handleSortChange = (field: string) => {
    handleSort(field);
  };

  return (
    <>
      <MainHeader />
      <div className="container mx-auto px-4 py-8 mt-16">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-2xl font-bold">Users</CardTitle>
            <UsersHeader
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              roleFilter={roleFilter}
              setRoleFilter={setRoleFilter}
            />
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between py-2">
              <UsersLayoutSwitcher layout={layout} setLayout={setLayout} />
              <UsersSortSelector
                sortField={sortField}
                sortDirection={sortDirection}
                handleSortChange={handleSortChange}
              />
            </div>
            <Separator />

            {isLoading && <UsersLoadingState />}
            {error && <UsersErrorState error={error} />}

            {!isLoading && !error && layout === 'table' && (
              <UsersTable
                users={users}
                totalCount={totalCount}
                totalPages={totalPages}
                handleUserClick={handleUserClick}
                sortField={sortField}
                sortDirection={sortDirection}
                handleSort={handleSort}
              />
            )}
            {!isLoading && !error && layout === 'gallery' && (
              <UsersGallery users={users} handleUserClick={handleUserClick} />
            )}
          </CardContent>
        </Card>
      </div>

      <UserDetailsDialog
        open={!!selectedUser}
        onOpenChange={(open) => {
          if (!open) setSelectedUser(null);
        }}
        userId={selectedUser || ''}
        refetch={refetch}
      />
    </>
  );
}
