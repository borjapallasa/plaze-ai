
import { MainHeader } from "@/components/MainHeader";
import { useUsers } from "@/hooks/admin/useUsers";
import { UsersHeader } from "@/components/admin/users/UsersHeader";
import { UsersTable } from "@/components/admin/users/UsersTable";
import { UsersGallery } from "@/components/admin/users/UsersGallery";
import { UsersList } from "@/components/admin/users/UsersList";
import { UsersLoadingState } from "@/components/admin/users/UsersLoadingState";
import { UsersErrorState } from "@/components/admin/users/UsersErrorState";
import { UsersLayoutSwitcher } from "@/components/admin/users/UsersLayoutSwitcher";
import { UsersSortSelector } from "@/components/admin/users/UsersSortSelector";
import { useState, useEffect } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

type LayoutType = 'gallery' | 'grid' | 'list';

export default function AdminUsers() {
  const {
    users,
    isLoading,
    error,
    searchQuery,
    setSearchQuery,
    roleFilter,
    setRoleFilter,
    sortField,
    sortDirection,
    handleSort,
    refetch
  } = useUsers();

  const [layout, setLayout] = useState<LayoutType>('grid');
  const [sortValue, setSortValue] = useState("created_at_desc");
  const isMobile = useIsMobile();

  // Switch to gallery view if currently on list view and on mobile
  useEffect(() => {
    if (isMobile && layout === 'list') {
      setLayout('gallery');
    }
  }, [isMobile, layout]);

  const handleSortChange = (value: string) => {
    setSortValue(value);
    const [field, direction] = value.split('_');
    const sortDir = direction === 'desc' ? 'desc' : 'asc';
    handleSort(field as keyof typeof users[0]);
    console.log(`Sorting by ${field} in ${sortDir} order`);
  };

  const tabs = [
    { id: "all", label: "All" },
    { id: "experts", label: "Experts" },
    { id: "affiliates", label: "Affiliates" },
    { id: "admins", label: "Admins" }
  ];

  const renderUsersContent = () => {
    if (isLoading) {
      return <UsersLoadingState />;
    }

    if (error) {
      return <UsersErrorState onRetry={refetch} />;
    }

    return (
      <>
        {layout === 'gallery' && (
          <UsersGallery
            users={users}
            sortField={sortField}
            sortDirection={sortDirection}
            onSort={handleSort}
          />
        )}
        
        {layout === 'grid' && (
          <UsersTable
            users={users}
            sortField={sortField}
            sortDirection={sortDirection}
            onSort={handleSort}
          />
        )}
        
        {layout === 'list' && (
          <UsersList
            users={users}
            sortField={sortField}
            sortDirection={sortDirection}
            onSort={handleSort}
          />
        )}
      </>
    );
  };

  return (
    <>
      <MainHeader />
      <div className="container mx-auto px-4 py-8 max-w-[1400px] mt-16">
        <UsersHeader 
          title="All Users" 
          subtitle="Manage and review all user accounts" 
        />

        {/* Custom styled tabs */}
        <div className="mb-6">
          <div className="flex items-center gap-8 border-b border-[#E5E7EB] overflow-x-auto scrollbar-hide">
            {tabs.map((tab) => {
              const isActive = roleFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setRoleFilter(tab.id)}
                  className={`px-1 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                    isActive
                      ? 'text-[#1A1F2C] border-[#1A1F2C]'
                      : 'text-[#8E9196] border-transparent hover:text-[#1A1F2C] hover:border-[#8E9196]'
                  }`}
                >
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Desktop layout - search and controls */}
        <div className="hidden lg:flex items-center justify-between gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8E9196] h-4 w-4" />
            <Input
              placeholder="Search by email or name"
              className="pl-10 border-[#E5E7EB] focus-visible:ring-[#1A1F2C]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex items-center gap-3 flex-shrink-0">
            <UsersSortSelector 
              sortValue={sortValue}
              onSortChange={handleSortChange}
            />
            
            <UsersLayoutSwitcher 
              layout={layout}
              setLayout={setLayout}
            />
          </div>
        </div>

        {/* Tablet layout - search bar above, then sort and layout on same line */}
        <div className="hidden sm:flex lg:hidden flex-col gap-4 mb-6">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8E9196] h-4 w-4" />
            <Input
              placeholder="Search by email or name"
              className="pl-10 border-[#E5E7EB] focus-visible:ring-[#1A1F2C] w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex items-center gap-3 w-full">
            <div className="flex items-center gap-3 flex-1">
              <UsersSortSelector 
                sortValue={sortValue}
                onSortChange={handleSortChange}
              />
              
              <UsersLayoutSwitcher 
                layout={layout}
                setLayout={setLayout}
              />
            </div>
          </div>
        </div>

        {/* Mobile layout - search first, then sort and layout on same line */}
        <div className="sm:hidden mb-6 space-y-4">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8E9196] h-4 w-4" />
            <Input
              placeholder="Search by email or name"
              className="pl-10 border-[#E5E7EB] focus-visible:ring-[#1A1F2C] w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <UsersSortSelector 
                sortValue={sortValue}
                onSortChange={handleSortChange}
              />
            </div>
            <UsersLayoutSwitcher 
              layout={layout}
              setLayout={setLayout}
            />
          </div>
        </div>

        {renderUsersContent()}
      </div>
    </>
  );
}
