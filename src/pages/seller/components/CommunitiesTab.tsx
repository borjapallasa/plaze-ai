import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Clock, MessageSquare, GraduationCap, Package2, Globe, Search, Plus } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useNavigate, useParams } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/lib/auth";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface Community {
  community_uuid: string;
  name: string;
  description: string;
  member_count: number;
  thumbnail: string;
  last_activity: string;
  status?: string; // Make status optional since it might not always be present
  product_count?: number;
  classroom_count?: number;
  post_count?: number;
  type?: string;
  price?: number;
}

interface CommunitiesTabProps {
  communities: Community[];
  isLoading: boolean;
}

// Helper function to format numbers
const formatNumber = (num: number = 0): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k';
  }
  return num.toString();
};

export function CommunitiesTab({ communities, isLoading }: CommunitiesTabProps) {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");

  console.log("CommunitiesTab rendered with:", { communities, isLoading });

  // Get current user's expert data - using case insensitive email comparison
  const { data: currentUserExpertData } = useQuery({
    queryKey: ['current-user-expert', user?.email],
    queryFn: async () => {
      if (!user?.email) return null;
      
      const { data, error } = await supabase
        .from('experts')
        .select('expert_uuid, user_uuid')
        .ilike('email', user.email) // Case insensitive comparison
        .maybeSingle();
      
      if (error) {
        console.error('Error fetching current user expert:', error);
        return null;
      }
      
      return data;
    },
    enabled: !!user?.email,
  });

  // Check if current user is the seller - compare both expert_uuid and user_uuid
  const isCurrentUserSeller = currentUserExpertData && (
    currentUserExpertData.expert_uuid === id || 
    currentUserExpertData.user_uuid === id ||
    user?.id === id
  );

  console.log("Seller check:", { 
    currentUserExpertData, 
    id, 
    userId: user?.id, 
    isCurrentUserSeller 
  });

  // Function to handle clicking on the card
  const handleCardClick = (communityId: string) => {
    navigate(`/community/${communityId}/edit`);
  };

  // Function to handle clicking on the View Community button
  const handleViewCommunity = (e: React.MouseEvent, communityId: string) => {
    e.stopPropagation(); // Prevent the card click from triggering
    navigate(`/community/${communityId}`);
  };

  // Function to handle creating a new community
  const handleCreateCommunity = () => {
    navigate('/seller/communities/new');
  };

  // Case-insensitive filter for communities based on search query
  const filteredCommunities = React.useMemo(() => {
    if (!communities || !Array.isArray(communities)) {
      console.log("Communities is not an array:", communities);
      return [];
    }

    return communities.filter(community => {
      if (!community || typeof community !== 'object') {
        console.log("Invalid community object:", community);
        return false;
      }

      const name = community.name || '';
      const description = community.description || '';
      const query = searchQuery.toLowerCase();
      
      // Case-insensitive search
      return name.toLowerCase().includes(query) || description.toLowerCase().includes(query);
    });
  }, [communities, searchQuery]);

  console.log("Filtered communities:", filteredCommunities);

  if (isLoading) {
    return (
      <div className="space-y-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i} className="w-full border border-border/40">
            <CardContent className="p-4 sm:p-6">
              <div className="flex flex-col gap-4">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                  <div className="space-y-2">
                    <Skeleton className="h-6 sm:h-8 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                  <Skeleton className="h-8 sm:h-10 w-24 sm:w-32" />
                </div>
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 pt-2">
                  <Skeleton className="h-16 sm:h-20 w-full" />
                  <Skeleton className="h-16 sm:h-20 w-full" />
                  <Skeleton className="h-16 sm:h-20 w-full" />
                  <Skeleton className="h-16 sm:h-20 w-full" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search Section */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center mb-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search communities"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 w-full"
          />
        </div>
        {isCurrentUserSeller && (
          <Button onClick={handleCreateCommunity} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Create Community
          </Button>
        )}
      </div>
      
      {!filteredCommunities.length ? (
        <Card className="border-dashed border-2 border-muted-foreground/20 bg-muted/5">
          <CardContent className="flex flex-col items-center justify-center py-8 sm:py-10">
            <Users className="h-8 sm:h-10 w-8 sm:w-10 text-muted-foreground mb-4" />
            <h3 className="text-base sm:text-lg font-semibold mb-1">
              {searchQuery ? "No Communities Found" : "No Communities"}
            </h3>
            <p className="text-sm text-muted-foreground text-center max-w-md px-4">
              {searchQuery 
                ? "Try a different search term or clear the search."
                : "This seller hasn't created any communities yet."}
            </p>
            {searchQuery && (
              <Button 
                variant="outline" 
                onClick={() => setSearchQuery("")} 
                className="mt-4"
              >
                Clear Search
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        filteredCommunities.map((community) => {
          // Safely access community properties with fallbacks
          const communityName = community.name || 'Untitled Community';
          const communityDescription = community.description || "A community for sharing knowledge and connecting with others.";
          const communityStatus = community.status || 'active'; // Default to active if status is missing
          const memberCount = community.member_count || 0;
          const classroomCount = community.classroom_count || 0;
          const postCount = community.post_count || 0;
          const productCount = community.product_count || 0;
          const lastActivity = community.last_activity;
          
          return (
            <Card 
              key={community.community_uuid} 
              className="w-full border border-border/40 hover:border-border/80 transition-colors cursor-pointer"
              onClick={() => handleCardClick(community.community_uuid)}
            >
              <CardContent className="p-4 sm:p-6">
                <div className="space-y-4">
                  {/* Header with Title, Last Activity, and View Button */}
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                    <div className="space-y-2 flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                        <h3 className="text-lg sm:text-xl font-semibold leading-tight">{communityName}</h3>
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge variant={communityStatus === 'active' ? 'default' : 'secondary'}>
                            {communityStatus === 'active' ? 'Active' : 'Draft'}
                          </Badge>
                          <Badge variant="secondary" className="text-xs px-2 py-0.5">
                            {community.type === 'paid' ? `$${community.price}/month` : 'Free Access'}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 flex-wrap">
                        <div className="flex items-center gap-1.5">
                          <Globe className="w-3.5 h-3.5 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">Public Community</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">
                            Last activity: {lastActivity ? new Date(lastActivity).toLocaleDateString() : 'No activity'}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <Button 
                      size="sm" 
                      onClick={(e) => handleViewCommunity(e, community.community_uuid)}
                      className="w-full sm:w-auto"
                    >
                      View Community
                    </Button>
                  </div>
                  
                  {/* Description */}
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {communityDescription}
                  </p>
                  
                  {/* Stats Cards - Improved mobile layout */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 mt-4">
                    <Card className="p-2 sm:p-3 space-y-1">
                      <div className="flex items-center gap-1.5 sm:gap-2 text-muted-foreground mb-1">
                        <Users className="w-3 sm:w-4 h-3 sm:h-4 flex-shrink-0" />
                        <span className="text-xs font-medium uppercase truncate">Members</span>
                      </div>
                      <p className="text-lg sm:text-2xl font-bold">{formatNumber(memberCount)}</p>
                    </Card>
                    <Card className="p-2 sm:p-3 space-y-1">
                      <div className="flex items-center gap-1.5 sm:gap-2 text-muted-foreground mb-1">
                        <GraduationCap className="w-3 sm:w-4 h-3 sm:h-4 flex-shrink-0" />
                        <span className="text-xs font-medium uppercase truncate">Classrooms</span>
                      </div>
                      <p className="text-lg sm:text-2xl font-bold">{formatNumber(classroomCount)}</p>
                    </Card>
                    <Card className="p-2 sm:p-3 space-y-1">
                      <div className="flex items-center gap-1.5 sm:gap-2 text-muted-foreground mb-1">
                        <MessageSquare className="w-3 sm:w-4 h-3 sm:h-4 flex-shrink-0" />
                        <span className="text-xs font-medium uppercase truncate">Posts</span>
                      </div>
                      <p className="text-lg sm:text-2xl font-bold">{formatNumber(postCount)}</p>
                    </Card>
                    <Card className="p-2 sm:p-3 space-y-1">
                      <div className="flex items-center gap-1.5 sm:gap-2 text-muted-foreground mb-1">
                        <Package2 className="w-3 sm:w-4 h-3 sm:h-4 flex-shrink-0" />
                        <span className="text-xs font-medium uppercase truncate">Products</span>
                      </div>
                      <p className="text-lg sm:text-2xl font-bold">{formatNumber(productCount)}</p>
                    </Card>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })
      )}
    </div>
  );
}
