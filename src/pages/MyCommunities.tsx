
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

interface CommunitySubscription {
  community_subscription_uuid: string;
  status: string;
  created_at: string;
}

export default function MyCommunities() {
  const [searchQuery, setSearchQuery] = useState("");
  const [subscriptions, setSubscriptions] = useState<CommunitySubscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [layout, setLayout] = useState<"table" | "list">("table");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserSubscriptions = async () => {
      try {
        setLoading(true);
        
        // Get the current user
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (userError) {
          console.error("Error getting user:", userError);
          toast.error("Authentication error");
          return;
        }
        
        if (!user) {
          console.log("No authenticated user found");
          toast.error("Please log in to view your communities");
          return;
        }
        
        console.log("Authenticated user:", user.id);
        
        // Fetch community subscriptions for the authenticated user
        const { data: subscriptionsData, error: subscriptionsError } = await supabase
          .from('community_subscriptions')
          .select('community_subscription_uuid, status, created_at')
          .eq('user_uuid', user.id);
          
        if (subscriptionsError) {
          console.error("Error fetching community subscriptions:", subscriptionsError);
          toast.error("Failed to load your subscriptions");
          return;
        }
        
        console.log("Community subscriptions data:", subscriptionsData);
        setSubscriptions(subscriptionsData || []);
      } catch (error) {
        console.error("Error in fetchUserSubscriptions:", error);
        toast.error("An unexpected error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchUserSubscriptions();
  }, []);

  const filteredSubscriptions = subscriptions.filter(subscription =>
    subscription.community_subscription_uuid?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-background min-h-screen">
      <MainHeader />
      <main className="container mx-auto px-4 py-4 pt-24 max-w-[1400px]">
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-semibold">My Community Subscriptions</h1>
            <Button variant="outline" size="sm" onClick={() => navigate("/communities")}>
              Browse Communities
            </Button>
          </div>

          {/* Search Bar and Layout Selector */}
          <div className="space-y-4">
            {/* Mobile layout - three lines */}
            <div className="md:hidden space-y-3">
              {/* Search input - full width on mobile */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Type here to search by subscription UUID"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              
              {/* Layout selector - separate line on mobile */}
              <div className="flex justify-end">
                <LayoutSelector layout={layout} onLayoutChange={setLayout} />
              </div>
            </div>

            {/* Desktop/Tablet layout - all in one line */}
            <div className="hidden md:flex md:items-center gap-3">
              {/* Search input */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Type here to search by subscription UUID"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              
              {/* Layout selector */}
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
              {layout === "list" ? (
                <CommunitySubscriptionListView
                  subscriptions={filteredSubscriptions}
                  loading={loading}
                />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredSubscriptions.map((subscription) => (
                    <CommunitySubscriptionCard
                      key={subscription.community_subscription_uuid}
                      subscription={subscription}
                    />
                  ))}
                </div>
              )}
            </>
          )}

          {/* See More Button - Only show if we have subscriptions */}
          {!loading && filteredSubscriptions.length > 0 && (
            <div className="flex justify-center">
              <Button 
                variant="outline" 
                size="lg" 
                className="rounded-full"
                onClick={() => navigate("/communities")}
              >
                Browse more communities
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
