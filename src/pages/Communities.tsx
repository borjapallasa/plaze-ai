
import React, { useState, useEffect } from "react";
import { MainHeader } from "@/components/MainHeader";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  PenLine, Coins, Flame, Heart, Music, 
  Brain, MonitorSmartphone, Activity, Target, Users,
  ArrowRight, TrendingUp, Sparkle, Trophy, ThumbsUp, Star, Tags, Loader2
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Json } from "@/integrations/supabase/types";

const categories = [
  { id: "trending", label: "Trending", icon: TrendingUp, dark: true },
  { id: "newest", label: "Newest", icon: Sparkle },
  { id: "top-seller", label: "Top Seller", icon: Trophy },
  { id: "best-reviews", label: "Best Reviews", icon: ThumbsUp },
  { id: "our-pick", label: "Our Pick", icon: Star },
  { id: "affiliate-offers", label: "Affiliate Offers", icon: Tags, dark: true }
];

const Communities = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [communities, setCommunities] = useState([]);
  const [userCommunities, setUserCommunities] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Get current user
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);
        
        // Fetch communities
        const { data: communitiesData, error } = await supabase
          .from('communities')
          .select('*');
          
        if (error) {
          console.error("Error fetching communities:", error);
          toast.error("Failed to load communities");
          return;
        }
        
        setCommunities(communitiesData || []);
        
        // If user is logged in, get their joined communities
        if (user) {
          const { data: userData, error: userError } = await supabase
            .from('users')
            .select('communities_joined')
            .eq('user_uuid', user.id)
            .single();
            
          if (!userError && userData) {
            // Ensure communities_joined is a valid array of UUIDs
            let communitiesJoined: string[] = [];
            
            if (userData?.communities_joined) {
              if (Array.isArray(userData.communities_joined)) {
                // Standard UUID regex for validation
                const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
                
                // Filter out any non-UUID values and ensure they are strings
                communitiesJoined = (userData.communities_joined as any[])
                  .filter(id => id !== null && id !== undefined)
                  .map(id => String(id))
                  .filter(id => typeof id === 'string')
                  .filter(id => uuidRegex.test(id.trim()));
              }
              
              console.log("Validated community UUIDs:", communitiesJoined);
            }
            
            setUserCommunities(communitiesJoined);
          }
        }
      } catch (error) {
        console.error("Error in fetchData:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredCommunities = communities.filter(community => 
    selectedCategory === "all" || community.category === selectedCategory
  );

  const handleJoinCommunity = async (communityUuid) => {
    try {
      if (!user) {
        toast.error("Please log in to join communities");
        // You might want to redirect to login
        return;
      }
      
      // Validate the UUID format
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      if (!communityUuid || typeof communityUuid !== 'string' || !uuidRegex.test(communityUuid.trim())) {
        console.error("Invalid community UUID format:", communityUuid);
        toast.error("Invalid community identifier");
        return;
      }
      
      // Check if already joined
      if (userCommunities.includes(communityUuid)) {
        toast.info("You're already a member of this community");
        return;
      }
      
      // Get current communities_joined array
      const { data: userData, error: fetchError } = await supabase
        .from('users')
        .select('communities_joined')
        .eq('user_uuid', user.id)
        .single();
        
      if (fetchError) {
        console.error("Error fetching user data:", fetchError);
        toast.error("Failed to join community");
        return;
      }
      
      // Ensure communities_joined is always a valid array of UUIDs
      let currentCommunities: string[] = [];
      
      if (userData?.communities_joined) {
        if (Array.isArray(userData.communities_joined)) {
          // Filter out any invalid UUIDs
          currentCommunities = (userData.communities_joined as any[])
            .filter(id => id !== null && id !== undefined)
            .map(id => String(id))
            .filter(id => typeof id === 'string')
            .filter(id => uuidRegex.test(id.trim()));
        }
      }
      
      // Update the communities_joined array if the community UUID isn't already in it
      if (!currentCommunities.includes(communityUuid)) {
        const newCommunitiesJoined = [...currentCommunities, communityUuid];
        
        // Save back to database
        const { error: updateError } = await supabase
          .from('users')
          .update({ communities_joined: newCommunitiesJoined })
          .eq('user_uuid', user.id);
          
        if (updateError) {
          console.error("Error updating user data:", updateError);
          toast.error("Failed to join community");
          return;
        }
        
        // Update local state
        setUserCommunities(newCommunitiesJoined);
        toast.success("Successfully joined community!");
      } else {
        toast.info("You're already a member of this community");
      }
      
    } catch (error) {
      console.error("Error joining community:", error);
      toast.error("An unexpected error occurred");
    }
  };

  const handleViewCommunity = (community) => {
    navigate(`/community/${community.slug || community.community_uuid}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="pt-16">
          <MainHeader />
          <div className="container mx-auto flex justify-center items-center pt-20">
            <Loader2 className="h-10 w-10 animate-spin text-primary mr-2" />
            <span>Loading communities...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="pt-16">
        <MainHeader />
        
        <div className="container mx-auto px-4 py-8">
          {/* Categories */}
          <ScrollArea className="w-full whitespace-nowrap">
            <div className="flex space-x-3 pb-4">
              {categories.map(({ id, label, icon: Icon, dark }) => (
                <Button
                  key={id}
                  variant="outline"
                  className={cn(
                    "rounded-full px-6 py-3 h-auto font-medium transition-colors duration-200",
                    dark ? "bg-[#1A1A1A] text-white hover:bg-[#1A1A1A]/90 border-transparent" : 
                          "bg-[#F2F2F2] text-[#1A1A1A] hover:bg-[#E8E8E8] border-transparent",
                    selectedCategory === id && "ring-2 ring-primary"
                  )}
                  onClick={() => setSelectedCategory(id)}
                >
                  <Icon className="mr-2 h-4 w-4" />
                  {label}
                </Button>
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>

          {/* Communities Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {filteredCommunities.map((community) => (
              <Card 
                key={community.id} 
                className="group relative overflow-hidden flex flex-col transition-all duration-200 hover:bg-gray-100 hover:border-gray-300"
              >
                {/* Community Image */}
                <div className="relative aspect-[2/1] overflow-hidden">
                  <img
                    src={community.thumbnail || "/lovable-uploads/890bbce9-6ca6-4a0e-958a-d7ba6f61bf73.png"}
                    alt={community.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 left-2 bg-black/50 text-white px-2 py-1 rounded text-sm">
                    #{community.id}
                  </div>
                </div>

                <div className="p-6 pb-8 flex-1 flex flex-col">
                  <h3 className="font-semibold text-lg leading-none mb-4">
                    {community.name}
                  </h3>

                  {/* Description */}
                  <p className="text-muted-foreground text-sm mb-6">
                    {community.description}
                  </p>

                  {/* Footer */}
                  <div className="mt-auto flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Users className="h-4 w-4" />
                      <span>{community.members} Members</span>
                    </div>
                    <Badge variant="outline">{community.pricing}</Badge>
                  </div>

                  {/* Actions */}
                  <div className="flex justify-between items-center">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleViewCommunity(community)}
                    >
                      View details
                    </Button>
                    
                    <Button 
                      variant={userCommunities.includes(community.community_uuid) ? "outline" : "default"}
                      size="sm"
                      onClick={() => userCommunities.includes(community.community_uuid) 
                        ? handleViewCommunity(community) 
                        : handleJoinCommunity(community.community_uuid)
                      }
                      className="ml-2"
                    >
                      {userCommunities.includes(community.community_uuid) ? "Open" : "Join"}
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Communities;
