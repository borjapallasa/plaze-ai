
import { useState } from "react";
import { DefaultHeader } from "@/components/DefaultHeader";
import { UsersHeader } from "@/components/admin/users/UsersHeader";
import { UsersTable } from "@/components/admin/users/UsersTable";
import { UsersList } from "@/components/admin/users/UsersList";
import { UsersGallery } from "@/components/admin/users/UsersGallery";
import { UsersLoadingState } from "@/components/admin/users/UsersLoadingState";
import { UsersErrorState } from "@/components/admin/users/UsersErrorState";
import { useUsers } from "@/hooks/admin/useUsers";

type LayoutType = "table" | "list" | "gallery";

export default function AdminUsersPage() {
  const [layout, setLayout] = useState<LayoutType>("table");
  const [page, setPage] = useState(1);
  const limit = 10;

  const {
    users,
    totalCount,
    totalPages,
    searchQuery,
    setSearchQuery,
    roleFilter,
    setRoleFilter,
    sortField,
    sortDirection,
    handleSort,
    isLoading,
    error,
    refetch
  } = useUsers(page, limit);

  const handleUserClick = (user: any) => {
    console.log('User clicked:', user);
  };

  const handleLayoutChange = (newLayout: LayoutType) => {
    setLayout(newLayout);
  };

  const handleLoadMore = () => {
    if (page < totalPages) {
      setPage(prev => prev + 1);
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <DefaultHeader title="Users" backLink="/admin" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <UsersErrorState onRetry={refetch} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DefaultHeader title="Users" backLink="/admin" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <UsersHeader
          searchTerm={searchQuery}
          setSearchTerm={setSearchQuery}
          statusFilter={roleFilter}
          setStatusFilter={setRoleFilter}
          sortBy={sortField}
          sortOrder={sortDirection}
          onSortChange={handleSort}
          layout={layout}
          onLayoutChange={handleLayoutChange}
        />

        {isLoading ? (
          <UsersLoadingState />
        ) : (
          <>
            {layout === "table" && (
              <UsersTable
                users={users}
                onSort={handleSort}
                sortBy={sortField}
                sortOrder={sortDirection}
                onUserClick={handleUserClick}
                onLoadMore={handleLoadMore}
                hasNextPage={page < totalPages}
                isFetchingNextPage={false}
              />
            )}

            {layout === "list" && (
              <UsersList
                users={users}
                sortField={sortField}
                sortDirection={sortDirection}
                onSort={handleSort}
              />
            )}

            {layout === "gallery" && (
              <UsersGallery
                users={users}
                onUserClick={handleUserClick}
                onLoadMore={handleLoadMore}
                hasNextPage={page < totalPages}
                isFetchingNextPage={false}
              />
            )}

            {totalCount > 0 && (
              <div className="mt-6 flex justify-between items-center">
                <p className="text-sm text-gray-700">
                  Showing {users.length} of {totalCount} users
                </p>
                {page < totalPages && (
                  <button
                    onClick={handleLoadMore}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Load More
                  </button>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
