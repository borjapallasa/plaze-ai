
import React, { useState, useEffect } from "react";
import { MainHeader } from "@/components/MainHeader";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  Search, Users, ArrowRight, Loader2
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function MyCommunities() {
  const [searchQuery, setSearchQuery] = useState("");
  const [communities, setCommunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserCommunities = async () => {
      try {
        setLoading(true);
        
        // Get the current user
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          toast.error("Please log in to view your communities");
          return;
        }
        
        // Get user record with communities_joined array
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('communities_joined')
          .eq('user_uuid', user.id)
          .single();
          
        if (userError) {
          console.error("Error fetching user data:", userError);
          toast.error("Failed to load user data");
          return;
        }
        
        // Ensure communities_joined is always a valid string array with complete UUIDs
        let communitiesJoined: string[] = [];
        
        if (userData?.communities_joined) {
          if (Array.isArray(userData.communities_joined)) {
            // Standard UUID regex for validation
            const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
            
            // Filter out any non-UUID values
            communitiesJoined = userData.communities_joined
              .filter(id => id && typeof id === 'string')
              .filter(id => uuidRegex.test(id.trim()));
          }
          
          console.log("Validated community UUIDs:", communitiesJoined);
        }
        
        // If user has no communities, show empty state
        if (communitiesJoined.length === 0) {
          setCommunities([]);
          setLoading(false);
          return;
        }
        
        // Fetch communities that match the community_uuids in the communities_joined array
        const { data: communitiesData, error: communitiesError } = await supabase
          .from('communities')
          .select('*')
          .in('community_uuid', communitiesJoined);
          
        if (communitiesError) {
          console.error("Error fetching communities:", communitiesError);
          toast.error("Failed to load communities");
          return;
        }
        
        setCommunities(communitiesData || []);
      } catch (error) {
        console.error("Error in fetchUserCommunities:", error);
        toast.error("An unexpected error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchUserCommunities();
  }, []);

  const filteredCommunities = communities.filter(community =>
    community.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    community.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenCommunity = (community) => {
    navigate(`/community/${community.slug || community.community_uuid}`);
  };

  return (
    <div className="bg-background min-h-screen">
      <MainHeader />
      <main className="container mx-auto px-4 py-4 pt-24">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-semibold">My Communities</h1>
            <Button variant="outline" size="sm" onClick={() => navigate("/communities")}>
              Browse Communities
            </Button>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Type here to search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2 text-muted-foreground">Loading your communities...</span>
            </div>
          )}

          {/* Empty State */}
          {!loading && communities.length === 0 && (
            <div className="text-center py-12 border rounded-lg bg-muted/20">
              <h3 className="text-lg font-medium mb-2">You haven't joined any communities yet</h3>
              <p className="text-muted-foreground mb-6">Browse communities to find the perfect ones for you.</p>
              <Button onClick={() => navigate("/communities")}>Browse Communities</Button>
            </div>
          )}

          {/* Communities Grid */}
          {!loading && communities.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCommunities.map((community) => (
                <Card
                  key={community.community_uuid}
                  className="group hover:shadow-md hover:bg-[#FAFAFA] transition-all duration-500 will-change-transform cursor-pointer"
                  onClick={() => handleOpenCommunity(community)}
                >
                  <div className="relative aspect-video overflow-hidden rounded-t-lg">
                    <img
                      src={community.thumbnail || "https://images.unsplash.com/photo-1519389950473-47ba0277781c"}
                      alt={community.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4 space-y-4">
                    <div>
                      <h3 className="font-semibold text-lg leading-tight mb-2">
                        {community.name}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {community.description}
                      </p>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                        <Users className="h-4 w-4" />
                        <span>{community.member_count || 0} Members</span>
                      </div>
                      <div className="overflow-hidden">
                        <div 
                          className="flex items-center text-transparent group-hover:text-primary transform translate-x-8 group-hover:translate-x-0 transition-all duration-500 ease-out will-change-transform"
                        >
                          <span className="text-sm whitespace-nowrap">Open</span>
                          <ArrowRight className="h-4 w-4 ml-1 flex-shrink-0" />
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {/* See More Button - Only show if we have communities */}
          {!loading && filteredCommunities.length > 0 && (
            <div className="flex justify-center">
              <Button 
                variant="outline" 
                size="lg" 
                className="rounded-full"
                onClick={() => navigate("/communities")}
              >
                See more communities
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
