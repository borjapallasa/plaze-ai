
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
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

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

  const handleTabChange = (value: string) => {
    setStatusFilter(value);
  };

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

        <Tabs value={statusFilter} onValueChange={handleTabChange} className="w-full">
          <div className="mb-6">
            <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:flex">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="pending">In review</TabsTrigger>
              <TabsTrigger value="inactive">Inactive</TabsTrigger>
            </TabsList>
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

          <TabsContent value="all" className="mt-0">
            {renderExpertsContent()}
          </TabsContent>

          <TabsContent value="active" className="mt-0">
            {renderExpertsContent()}
          </TabsContent>

          <TabsContent value="pending" className="mt-0">
            {renderExpertsContent()}
          </TabsContent>

          <TabsContent value="inactive" className="mt-0">
            {renderExpertsContent()}
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
