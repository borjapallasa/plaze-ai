
import { useState } from "react";
import { Navigate } from "react-router-dom";
import { MainHeader } from "@/components/MainHeader";
import { UsersHeader } from "@/components/admin/users/UsersHeader";
import { UsersTable } from "@/components/admin/users/UsersTable";
import { UsersList } from "@/components/admin/users/UsersList";
import { UsersGallery } from "@/components/admin/users/UsersGallery";
import { UsersLoadingState } from "@/components/admin/users/UsersLoadingState";
import { UsersErrorState } from "@/components/admin/users/UsersErrorState";
import { useUsers } from "@/hooks/admin/useUsers";
import { useAdminCheck } from "@/hooks/use-admin-check";

type LayoutType = "table" | "list" | "gallery";

export default function AdminUsersPage() {
  const [layout, setLayout] = useState<LayoutType>("table");
  const [page, setPage] = useState(1);
  const limit = 10;

  // Check if user is admin
  const { data: adminCheck, isLoading: adminLoading, error: adminError } = useAdminCheck();

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

  // Show loading while checking admin status
  if (adminLoading) {
    return (
      <>
        <MainHeader />
        <div className="min-h-screen bg-white pt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <UsersLoadingState />
          </div>
        </div>
      </>
    );
  }

  // Redirect if not admin or admin check failed
  if (adminError || !adminCheck?.isAdmin) {
    return <Navigate to="/" replace />;
  }

  if (error) {
    return (
      <>
        <MainHeader />
        <div className="min-h-screen bg-white pt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <UsersErrorState onRetry={refetch} />
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <MainHeader />
      <div className="min-h-screen bg-white pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <UsersHeader
            searchTerm={searchQuery}
            setSearchTerm={setSearchQuery}
            statusFilter={roleFilter}
            setStatusFilter={setRoleFilter}
            sortBy={sortField as string}
            sortOrder={sortDirection}
            onSortChange={(field: string) => handleSort(field as any)}
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
                  onSort={(field: string) => handleSort(field as any)}
                  sortBy={sortField as string}
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
                  sortField={sortField as string}
                  sortDirection={sortDirection}
                  onSort={(field: string) => handleSort(field as any)}
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
    </>
  );
}
