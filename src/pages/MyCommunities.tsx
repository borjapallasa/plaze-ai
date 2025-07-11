
import React, { useState, useEffect } from "react";
import { MainHeader } from "@/components/MainHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Search, Loader2
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { LayoutSelector } from "@/components/transactions/LayoutSelector";
import { CommunitySubscriptionCard } from "@/components/communities/CommunitySubscriptionCard";
import { CommunitySubscriptionListView } from "@/components/communities/CommunitySubscriptionListView";
import { CommunitySubscriptionSortSelector } from "@/components/communities/CommunitySubscriptionSortSelector";
import { useQuery } from "@tanstack/react-query";

interface CommunitySubscription {
  community_subscription_uuid: string;
  status: string;
  created_at: string;
  amount?: number;
  community_name?: string;
  community_thumbnail?: string;
  community_description?: string;
  community_uuid?: string;
}

export default function MyCommunities() {
  const [searchQuery, setSearchQuery] = useState("");
  const [layout, setLayout] = useState<"table" | "list">("table");
  const [sortBy, setSortBy] = useState("date-desc");
  const navigate = useNavigate();

  // Use React Query for better data management and automatic refetching
  const { data: subscriptions = [], isLoading: loading, error } = useQuery({
    queryKey: ['user-community-subscriptions'],
    queryFn: async () => {
      // Get the current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError) {
        console.error("Error getting user:", userError);
        throw new Error("Authentication error");
      }
      
      if (!user) {
        console.log("No authenticated user found");
        throw new Error("Please log in to view your communities");
      }
      
      console.log("Authenticated user:", user.id);
      
      // Fetch community subscriptions with community details - both active and pending
      const { data: subscriptionsData, error: subscriptionsError } = await supabase
        .from('community_subscriptions')
        .select(`
          community_subscription_uuid, 
          status, 
          created_at,
          amount,
          community_uuid,
          communities (
            name,
            thumbnail,
            description
          )
        `)
        .eq('user_uuid', user.id)
        .in('status', ['active', 'pending']);
        
      if (subscriptionsError) {
        console.error("Error fetching community subscriptions:", subscriptionsError);
        throw new Error("Failed to load your subscriptions");
      }
      
      console.log("Community subscriptions data:", subscriptionsData);
      
      // Transform the data to include community details
      const transformedData = (subscriptionsData || []).map(sub => ({
        community_subscription_uuid: sub.community_subscription_uuid,
        status: sub.status,
        created_at: sub.created_at,
        amount: sub.amount,
        community_uuid: sub.community_uuid,
        community_name: sub.communities?.name,
        community_thumbnail: sub.communities?.thumbnail,
        community_description: sub.communities?.description
      }));
      
      return transformedData;
    },
    retry: 1,
    staleTime: 0, // Always refetch to ensure fresh data
  });

  // Handle query errors
  useEffect(() => {
    if (error) {
      console.error("Error in fetchUserSubscriptions:", error);
      toast.error(error.message || "An unexpected error occurred");
    }
  }, [error]);

  // Use case-insensitive filtering
  const filteredSubscriptions = subscriptions.filter(subscription =>
    subscription.community_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedSubscriptions = [...filteredSubscriptions].sort((a, b) => {
    switch (sortBy) {
      case "name-asc":
        return (a.community_name || "").localeCompare(b.community_name || "");
      case "name-desc":
        return (b.community_name || "").localeCompare(a.community_name || "");
      case "date-asc":
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      case "date-desc":
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      case "amount-asc":
        return (a.amount || 0) - (b.amount || 0);
      case "amount-desc":
        return (b.amount || 0) - (a.amount || 0);
      default:
        return 0;
    }
  });

  return (
    <div className="bg-background min-h-screen">
      <MainHeader />
      <main className="container mx-auto px-4 py-4 pt-24 max-w-[1400px]">
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-semibold">My Communities</h1>
            <Button variant="outline" size="sm" onClick={() => navigate("/communities")}>
              Browse Communities
            </Button>
          </div>

          {/* Search Bar, Sort Selector and Layout Selector */}
          <div className="space-y-4">
            {/* Mobile layout - search input and sort full width */}
            <div className="md:hidden space-y-3">
              {/* Search input - full width on mobile */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search by community name"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              
              {/* Sort selector on mobile - full width */}
              <CommunitySubscriptionSortSelector sortBy={sortBy} onSortChange={setSortBy} />
            </div>

            {/* Desktop/Tablet layout - search input, sort selector and layout selector */}
            <div className="hidden md:flex md:items-center gap-3">
              {/* Search input */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search by community name"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              
              {/* Sort selector */}
              <CommunitySubscriptionSortSelector sortBy={sortBy} onSortChange={setSortBy} />
              
              {/* Layout selector - only on desktop */}
              <LayoutSelector layout={layout} onLayoutChange={setLayout} />
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2 text-muted-foreground">Loading your subscriptions...</span>
            </div>
          )}

          {/* Empty State */}
          {!loading && subscriptions.length === 0 && (
            <div className="text-center py-12 border rounded-lg bg-muted/20">
              <h3 className="text-lg font-medium mb-2">You haven't subscribed to any communities yet</h3>
              <p className="text-muted-foreground mb-6">Browse communities to find the perfect ones for you.</p>
              <Button onClick={() => navigate("/communities")}>Browse Communities</Button>
            </div>
          )}

          {/* Subscriptions Display */}
          {!loading && subscriptions.length > 0 && (
            <>
              {/* Mobile: Always show gallery layout */}
              <div className="md:hidden">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {sortedSubscriptions.map((subscription) => (
                    <CommunitySubscriptionCard
                      key={subscription.community_subscription_uuid}
                      subscription={subscription}
                    />
                  ))}
                </div>
              </div>

              {/* Desktop: Show selected layout */}
              <div className="hidden md:block">
                {layout === "list" ? (
                  <CommunitySubscriptionListView
                    subscriptions={sortedSubscriptions}
                    loading={loading}
                  />
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {sortedSubscriptions.map((subscription) => (
                      <CommunitySubscriptionCard
                        key={subscription.community_subscription_uuid}
                        subscription={subscription}
                      />
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
