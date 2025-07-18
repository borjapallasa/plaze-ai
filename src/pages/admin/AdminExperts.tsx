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
import { useIsMobile, useIsTablet } from "@/hooks/use-mobile";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useAdminCheck } from "@/hooks/use-admin-check";
import { useAuth } from "@/lib/auth";
import { useNavigate } from "react-router-dom";

type LayoutType = 'gallery' | 'grid' | 'list';

export default function AdminExperts() {
  const { user, loading: authLoading } = useAuth();
  const { data: adminData, isLoading: adminLoading } = useAdminCheck();
  const navigate = useNavigate();

  // Redirect if not authenticated or not admin
  useEffect(() => {
    if (!authLoading && !adminLoading) {
      if (!user) {
        navigate('/sign-in');
        return;
      }
      
      if (adminData && !adminData.isAdmin) {
        navigate('/');
        return;
      }
    }
  }, [user, adminData, authLoading, adminLoading, navigate]);

  const {
    experts,
    allExperts,
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

  const [layout, setLayout] = useState<LayoutType>('gallery');
  const [sortValue, setSortValue] = useState("created_at_desc");
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();

  // Set default status filter to "pending" (In Review) on initial load
  useEffect(() => {
    setStatusFilter("pending");
  }, [setStatusFilter]);

  // Switch to gallery view if currently on list view and on mobile or tablet
  useEffect(() => {
    if ((isMobile || isTablet) && layout === 'list') {
      setLayout('gallery');
    }
  }, [isMobile, isTablet, layout]);

  // Set default layout to gallery for tablet devices
  useEffect(() => {
    if (isTablet && layout === 'grid') {
      setLayout('gallery');
    }
  }, [isTablet, layout]);

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
    if (!allExperts) return { all: 0, active: 0, inactive: 0, pending: 0 };
    
    const counts = {
      all: allExperts.length,
      active: allExperts.filter(expert => expert.status === 'active').length,
      inactive: allExperts.filter(expert => expert.status === 'inactive').length,
      pending: allExperts.filter(expert => expert.status === 'in review').length
    };
    
    return counts;
  };

  const statusCounts = getStatusCounts();

  const tabs = [
    { id: "all", label: "All", count: statusCounts.all },
    { id: "active", label: "Active", count: statusCounts.active },
    { id: "inactive", label: "Inactive", count: statusCounts.inactive },
    { id: "pending", label: "In review", count: statusCounts.pending }
  ];

  // Show loading while checking authentication and admin status
  if (authLoading || adminLoading) {
    return (
      <>
        <MainHeader />
        <div className="container mx-auto px-4 py-8 max-w-[1400px] mt-16">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Checking permissions...</p>
            </div>
          </div>
        </div>
      </>
    );
  }

  // Don't render anything if user is not admin (redirect will happen)
  if (!user || (adminData && !adminData.isAdmin)) {
    return null;
  }

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

        {/* Custom styled tabs with counts */}
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
                  <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
                    isActive 
                      ? 'bg-[#1A1F2C] text-white' 
                      : 'bg-[#F3F4F6] text-[#8E9196]'
                  }`}>
                    {tab.count}
                  </span>
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
