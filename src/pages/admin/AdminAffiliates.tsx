import { MainHeader } from "@/components/MainHeader";
import { useAffiliates } from "@/hooks/admin/useAffiliates";
import { AffiliatesHeader } from "@/components/admin/affiliates/AffiliatesHeader";
import { AffiliatesTable } from "@/components/admin/affiliates/AffiliatesTable";
import { AffiliatesGallery } from "@/components/admin/affiliates/AffiliatesGallery";
import { AffiliatesList } from "@/components/admin/affiliates/AffiliatesList";
import { AffiliatesLayoutSwitcher, LayoutType } from "@/components/admin/affiliates/AffiliatesLayoutSwitcher";
import { AffiliatesSortSelector } from "@/components/admin/affiliates/AffiliatesSortSelector";
import { AffiliatesLoadingState } from "@/components/admin/affiliates/AffiliatesLoadingState";
import { AffiliatesErrorState } from "@/components/admin/affiliates/AffiliatesErrorState";
import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useAdminCheck } from "@/hooks/use-admin-check";
import { useAuth } from "@/lib/auth";
import { useNavigate } from "react-router-dom";
import { useIsMobile, useIsTablet } from "@/hooks/use-mobile";

export default function AdminAffiliates() {
  const { user, loading: authLoading } = useAuth();
  const { data: adminData, isLoading: adminLoading } = useAdminCheck();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();

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
    affiliates,
    allAffiliates,
    isLoading,
    error,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    sortField,
    sortDirection,
    handleSort
  } = useAffiliates();

  const [layout, setLayout] = useState<LayoutType>('gallery');
  const [sortValue, setSortValue] = useState("created_at_desc");

  // Set default status filter to "new" on initial load
  useEffect(() => {
    setStatusFilter("new");
  }, [setStatusFilter]);

  // Switch to gallery view if currently on list view and on mobile
  useEffect(() => {
    if (isMobile && layout === 'list') {
      setLayout('gallery');
    }
  }, [isMobile, layout]);

  // Set default layout to gallery for mobile devices
  useEffect(() => {
    if (isMobile && layout !== 'gallery') {
      setLayout('gallery');
    }
  }, [isMobile, layout]);

  const handleSortChange = (value: string) => {
    setSortValue(value);
    const [field, direction] = value.split('_');
    const sortDir = direction === 'desc' ? 'desc' : 'asc';
    handleSort(field as keyof typeof affiliates[0]);
    console.log(`Sorting by ${field} in ${sortDir} order`);
  };

  // Get counts for each status from the unfiltered affiliates data
  const getStatusCounts = () => {
    if (!allAffiliates) return { all: 0, active: 0, inactive: 0, new: 0 };
    
    const counts = {
      all: allAffiliates.length,
      active: allAffiliates.filter(affiliate => affiliate.status === 'active').length,
      inactive: allAffiliates.filter(affiliate => affiliate.status === 'inactive').length,
      new: allAffiliates.filter(affiliate => affiliate.status === 'new').length
    };
    
    return counts;
  };

  const statusCounts = getStatusCounts();

  const tabs = [
    { id: "all", label: "All", count: statusCounts.all },
    { id: "new", label: "New", count: statusCounts.new },
    { id: "active", label: "Active", count: statusCounts.active },
    { id: "inactive", label: "Inactive", count: statusCounts.inactive }
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

  const renderAffiliatesContent = () => {
    if (isLoading) {
      return <AffiliatesLoadingState />;
    }

    if (error) {
      return <AffiliatesErrorState />;
    }

    return (
      <>
        {layout === 'gallery' && (
          <AffiliatesGallery
            affiliates={affiliates}
            sortField={sortField}
            sortDirection={sortDirection}
            onSort={handleSort}
          />
        )}
        
        {layout === 'grid' && (
          <AffiliatesTable
            affiliates={affiliates}
            sortField={sortField}
            sortDirection={sortDirection}
            onSort={handleSort}
          />
        )}
        
        {layout === 'list' && !isMobile && (
          <AffiliatesList
            affiliates={affiliates}
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
        <AffiliatesHeader 
          title="All Affiliates" 
          subtitle="Manage and review all affiliate accounts" 
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
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8E9196] h-4 w-4" />
            <Input
              placeholder="Search by email or affiliate code"
              className="pl-10 border-[#E5E7EB] focus-visible:ring-[#1A1F2C] w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex items-center gap-3 flex-shrink-0">
            <AffiliatesSortSelector 
              sortValue={sortValue}
              onSortChange={handleSortChange}
            />
            
            <AffiliatesLayoutSwitcher 
              layout={layout}
              onLayoutChange={setLayout}
              isMobile={isMobile}
            />
          </div>
        </div>

        {/* Tablet and Mobile layout - search bar above, then sort and layout on same line */}
        <div className="lg:hidden mb-6 space-y-4">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8E9196] h-4 w-4" />
            <Input
              placeholder="Search by email or affiliate code"
              className="pl-10 border-[#E5E7EB] focus-visible:ring-[#1A1F2C] w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <AffiliatesSortSelector 
                sortValue={sortValue}
                onSortChange={handleSortChange}
              />
            </div>
            <AffiliatesLayoutSwitcher 
              layout={layout}
              onLayoutChange={setLayout}
              isMobile={isMobile}
            />
          </div>
        </div>

        {renderAffiliatesContent()}
      </div>
    </>
  );
}
