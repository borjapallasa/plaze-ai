
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { MainHeader } from "@/components/MainHeader";
import { DefaultHeader } from "@/components/DefaultHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Mail, MapPin, User, Star, TrendingUp, CheckCircle, Globe } from "lucide-react";
import { Expert } from "@/types/expert";
import { SellerHeader } from "@/pages/seller/components/SellerHeader";
import { SellerTabs } from "@/pages/seller/components/SellerTabs";
import { useSellerProducts } from "@/hooks/seller/useSellerProducts";
import { useSellerServices } from "@/hooks/seller/useSellerServices";
import { useExpertCommunities } from "@/hooks/expert/useExpertCommunities";
import { useState, useEffect } from "react";
import { toast } from "sonner";

export default function AdminExpertDetails() {
  const { id } = useParams();
  const [expertData, setExpertData] = useState<Expert | null>(null);

  const { data: expert, isLoading, error, refetch } = useQuery({
    queryKey: ['admin-expert-details', id],
    queryFn: async () => {
      console.log('Fetching expert details for ID:', id);
      const { data, error } = await supabase
        .from('experts')
        .select('*')
        .eq('expert_uuid', id)
        .single();

      if (error) {
        console.error('Error fetching expert:', error);
        throw error;
      }

      // Transform the data to ensure areas is properly parsed
      if (data.areas) {
        try {
          data.areas = typeof data.areas === 'string' 
            ? JSON.parse(data.areas) 
            : Array.isArray(data.areas) 
              ? data.areas 
              : [];
        } catch (e) {
          console.error('Error parsing areas:', e);
          data.areas = [];
        }
      } else {
        data.areas = [];
      }

      return data as Expert;
    },
    enabled: !!id
  });

  // Update the local state when expert data changes
  useEffect(() => {
    if (expert) {
      setExpertData(expert);
    }
  }, [expert]);

  // Use the local state if available, otherwise use the fetched data
  const currentExpert = expertData || expert;

  // Fetch products data
  const { 
    data: products = [], 
    isLoading: productsLoading 
  } = useSellerProducts(currentExpert?.expert_uuid);

  // Fetch services data
  const { 
    services = [], 
    isLoading: servicesLoading 
  } = useSellerServices(currentExpert?.expert_uuid);

  // Fetch communities data
  const { 
    data: communities = [], 
    isLoading: communitiesLoading 
  } = useExpertCommunities(currentExpert?.expert_uuid);

  // Handle expert update
  const handleExpertUpdate = (updatedExpert: Expert) => {
    console.log("Updating expert in AdminExpertDetails:", updatedExpert);
    setExpertData(updatedExpert);
    // Also refetch to ensure data consistency with the database
    refetch();
    toast.success("Expert profile updated successfully");
  };

  // Calculate total earnings from services
  const totalEarnings = services.reduce((total, service) => {
    return total + (service.revenue_amount || 0);
  }, 0);

  if (isLoading) {
    return (
      <>
        <MainHeader />
        <div className="container mx-auto px-4 py-8 max-w-[1400px] mt-16">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-48 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </>
    );
  }

  if (error || !currentExpert) {
    return (
      <>
        <MainHeader />
        <div className="container mx-auto px-4 py-8 max-w-[1400px] mt-16">
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Expert Not Found</h2>
            <p className="text-gray-600">The expert you're looking for doesn't exist or has been removed.</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="fixed top-0 left-0 right-0 z-50 bg-background">
        <MainHeader />
      </div>

      <main className="container mx-auto px-4 pt-24 pb-8">
        <DefaultHeader 
          title={currentExpert.name || 'Unnamed Expert'}
          subtitle={currentExpert.title || 'No title provided'}
          backLink="/admin/experts"
        />

        <SellerHeader 
          seller={currentExpert} 
          productsCount={products?.length || 0}
          communitiesCount={communities?.length || 0}
          totalEarnings={totalEarnings}
          onSellerUpdate={handleExpertUpdate}
        />

        <SellerTabs
          products={products}
          services={services}
          communities={communities}
          productsLoading={productsLoading}
          servicesLoading={servicesLoading}
          communitiesLoading={communitiesLoading}
          expertUuid={currentExpert.expert_uuid}
        />
      </main>
    </div>
  );
}
