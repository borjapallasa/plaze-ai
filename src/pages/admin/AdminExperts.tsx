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
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

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

  // Get counts for each status from the unfiltered experts data
  const getStatusCounts = () => {
    if (!experts) return { all: 0, active: 0, inactive: 0, pending: 0 };
    
    const counts = {
      all: experts.length,
      active: experts.filter(expert => expert.status === 'active').length,
      inactive: experts.filter(expert => expert.status === 'inactive').length,
      pending: experts.filter(expert => expert.status === 'in review').length
    };
    
    return counts;
  };

  const statusCounts = getStatusCounts();

  const tabs = [
    { id: "all", label: "All" },
    { id: "active", label: "Active" },
    { id: "inactive", label: "Inactive" },
    { id: "pending", label: "In review" }
  ];

  const renderExpertsContent = () => {
    if (isLoading) {
      return <ExpertsLoadingState />;
    }

    if (error) {
      return <ExpertsErrorState />;
    }

    return (
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
    );
  };

  return (
    <>
      <MainHeader />
      <div className="container mx-auto px-4 py-8 max-w-[1400px] mt-16">
        <ExpertsHeader 
          title="All Experts" 
          subtitle="Manage and review all expert profiles" 
        />

        {/* Custom styled tabs */}
        <div className="mb-6">
          <div className="flex items-center gap-8 border-b border-[#E5E7EB] overflow-x-auto scrollbar-hide">
            {tabs.map((tab) => {
              const isActive = statusFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setStatusFilter(tab.id)}
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

        {renderExpertsContent()}
      </div>
    </>
  );
}
