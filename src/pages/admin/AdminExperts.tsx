import { MainHeader } from "@/components/MainHeader";
import { useExperts } from "@/hooks/admin/useExperts";
import { ExpertsHeader } from "@/components/admin/experts/ExpertsHeader";
import { ExpertsFilters } from "@/components/admin/experts/ExpertsFilters";
import { ExpertsTable } from "@/components/admin/experts/ExpertsTable";
import { ExpertsGallery } from "@/components/admin/experts/ExpertsGallery";
import { ExpertsList } from "@/components/admin/experts/ExpertsList";
import { LoadMoreButton } from "@/components/admin/experts/LoadMoreButton";
import { ExpertsLoadingState } from "@/components/admin/experts/ExpertsLoadingState";
import { ExpertsErrorState } from "@/components/admin/experts/ExpertsErrorState";
import { ExpertsLayoutSwitcher } from "@/components/admin/experts/ExpertsLayoutSwitcher";
import { ExpertsSortSelector } from "@/components/admin/experts/ExpertsSortSelector";
import { useState, useEffect } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

type LayoutType = 'gallery' | 'grid' | 'list';

export default function AdminExperts() {
  const {
    experts,
    isLoading,
    error,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    sortField,
    sortDirection,
    handleSort
  } = useExperts();

  const [layout, setLayout] = useState<LayoutType>('grid');
  const [sortValue, setSortValue] = useState("created_at_desc");
  const isMobile = useIsMobile();

  // Switch to gallery view if currently on list view and on mobile
  useEffect(() => {
    if (isMobile && layout === 'list') {
      setLayout('gallery');
    }
  }, [isMobile, layout]);

  const handleLoadMore = () => {
    // This would be implemented if pagination is added
    console.log("Load more experts");
  };

  const handleSortChange = (value: string) => {
    setSortValue(value);
    const [field, direction] = value.split('_');
    const sortDir = direction === 'desc' ? 'desc' : 'asc';
    handleSort(field as keyof typeof experts[0]);
    console.log(`Sorting by ${field} in ${sortDir} order`);
  };

  return (
    <>
      <MainHeader />
      <div className="container mx-auto px-4 py-8 max-w-[1400px] mt-16">
        <ExpertsHeader 
          title="All Experts" 
          subtitle="Manage and review all expert profiles" 
        />

        {/* Desktop layout - all controls in one line */}
        <div className="hidden lg:flex items-center justify-between gap-4 mb-6">
          <div className="flex-1">
            <ExpertsFilters
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
            />
          </div>
          
          <div className="flex items-center gap-3 flex-shrink-0">
            <ExpertsSortSelector 
              sortValue={sortValue}
              onSortChange={handleSortChange}
            />
            
            <ExpertsLayoutSwitcher 
              layout={layout}
              setLayout={setLayout}
            />
          </div>
        </div>

        {/* Tablet layout - all controls in one line */}
        <div className="hidden sm:flex lg:hidden items-center gap-3 mb-6">
          <div className="flex-1">
            <ExpertsFilters
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
            />
          </div>
          
          <div className="flex items-center gap-3 flex-shrink-0">
            <ExpertsSortSelector 
              sortValue={sortValue}
              onSortChange={handleSortChange}
            />
            
            <ExpertsLayoutSwitcher 
              layout={layout}
              setLayout={setLayout}
            />
          </div>
        </div>

        {/* Mobile layout - filters first, then sort and layout on same line */}
        <div className="sm:hidden mb-6 space-y-4">
          <ExpertsFilters
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
          />
          
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <ExpertsSortSelector 
                sortValue={sortValue}
                onSortChange={handleSortChange}
              />
            </div>
            <ExpertsLayoutSwitcher 
              layout={layout}
              setLayout={setLayout}
            />
          </div>
        </div>

        {isLoading ? (
          <ExpertsLoadingState />
        ) : error ? (
          <ExpertsErrorState />
        ) : (
          <>
            {layout === 'gallery' && (
              <ExpertsGallery
                experts={experts}
                sortField={sortField}
                sortDirection={sortDirection}
                onSort={handleSort}
              />
            )}
            
            {layout === 'grid' && (
              <ExpertsTable
                experts={experts}
                sortField={sortField}
                sortDirection={sortDirection}
                onSort={handleSort}
              />
            )}
            
            {layout === 'list' && (
              <ExpertsList
                experts={experts}
                sortField={sortField}
                sortDirection={sortDirection}
                onSort={handleSort}
              />
            )}

            <LoadMoreButton 
              onClick={handleLoadMore}
              visible={experts.length > 0}
            />
          </>
        )}
      </div>
    </>
  );
}
