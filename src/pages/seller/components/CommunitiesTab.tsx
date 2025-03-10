
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Clock, MessageSquare, GraduationCap, Package2, Globe, Plus, Search } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";

interface Community {
  community_uuid: string;
  name: string;
  description: string;
  member_count: number;
  thumbnail: string;
  last_activity: string;
  status: string;
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
  const [searchQuery, setSearchQuery] = useState("");

  // Function to handle clicking on the card
  const handleCardClick = (communityId: string) => {
    navigate(`/community/${communityId}/edit`);
  };

  // Function to handle clicking on the View Community button
  const handleViewCommunity = (e: React.MouseEvent, communityId: string) => {
    e.stopPropagation(); // Prevent the card click from triggering
    navigate(`/community/${communityId}`);
  };

  // Function to handle clicking on the Add Community button
  const handleAddCommunity = () => {
    navigate("/seller/communities/new");
  };

  // Filter communities based on search query
  const filteredCommunities = communities.filter(community => 
    community.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (community.description && community.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (isLoading) {
    return (
      <div className="space-y-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i} className="w-full border border-border/40">
            <CardContent className="p-6">
              <div className="flex flex-col gap-4">
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <Skeleton className="h-8 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                  <Skeleton className="h-10 w-32" />
                </div>
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2">
                  <Skeleton className="h-20 w-full" />
                  <Skeleton className="h-20 w-full" />
                  <Skeleton className="h-20 w-full" />
                  <Skeleton className="h-20 w-full" />
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
      {/* Search and Add Community Section */}
      <div className="flex gap-4 items-center mb-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search communities"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 w-full"
          />
        </div>
        <Button onClick={handleAddCommunity} className="gap-2 whitespace-nowrap">
          <Plus className="h-4 w-4" />
          Add Community
        </Button>
      </div>
      
      {!filteredCommunities.length ? (
        <Card className="border-dashed border-2 border-muted-foreground/20 bg-muted/5">
          <CardContent className="flex flex-col items-center justify-center py-10">
            <Users className="h-10 w-10 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-1">
              {searchQuery ? "No Communities Found" : "No Communities"}
            </h3>
            <p className="text-muted-foreground text-center max-w-md">
              {searchQuery 
                ? "Try a different search term or clear the search."
                : "This seller hasn't created any communities yet."}
            </p>
            {!searchQuery && (
              <Button onClick={handleAddCommunity} className="mt-4 gap-2">
                <Plus className="h-4 w-4" />
                Create First Community
              </Button>
            )}
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
        filteredCommunities.map((community) => (
          <Card 
            key={community.community_uuid} 
            className="w-full border border-border/40 hover:border-border/80 transition-colors cursor-pointer"
            onClick={() => handleCardClick(community.community_uuid)}
          >
            <CardContent className="p-6">
              <div className="space-y-4">
                {/* Header with Title, Last Activity, and View Button */}
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <h3 className="text-xl font-semibold">{community.name}</h3>
                      <Badge variant={community.status === 'active' ? 'default' : 'secondary'}>
                        {community.status === 'active' ? 'Active' : 'Draft'}
                      </Badge>
                      <div className="flex items-center gap-1.5 ml-2">
                        <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          Last activity: {community.last_activity ? new Date(community.last_activity).toLocaleDateString() : 'No activity'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 flex-wrap">
                      <div className="flex items-center gap-1.5">
                        <Globe className="w-3.5 h-3.5 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Public Community</span>
                      </div>
                      <Badge variant="secondary" className="text-xs px-2 py-0.5">
                        {community.type === 'paid' ? `$${community.price}/month` : 'Free Access'}
                      </Badge>
                    </div>
                  </div>
                  
                  <Button 
                    size="sm" 
                    onClick={(e) => handleViewCommunity(e, community.community_uuid)}
                  >
                    View Community
                  </Button>
                </div>
                
                {/* Description */}
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {community.description || "A community for sharing knowledge and connecting with others."}
                </p>
                
                {/* Stats Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
                  <Card className="p-3 space-y-1">
                    <div className="flex items-center gap-2 text-muted-foreground mb-1">
                      <Users className="w-4 h-4" />
                      <span className="text-xs font-medium uppercase">Members</span>
                    </div>
                    <p className="text-2xl font-bold">{formatNumber(community.member_count)}</p>
                  </Card>
                  <Card className="p-3 space-y-1">
                    <div className="flex items-center gap-2 text-muted-foreground mb-1">
                      <GraduationCap className="w-4 h-4" />
                      <span className="text-xs font-medium uppercase">Classrooms</span>
                    </div>
                    <p className="text-2xl font-bold">{formatNumber(community.classroom_count)}</p>
                  </Card>
                  <Card className="p-3 space-y-1">
                    <div className="flex items-center gap-2 text-muted-foreground mb-1">
                      <MessageSquare className="w-4 h-4" />
                      <span className="text-xs font-medium uppercase">Posts</span>
                    </div>
                    <p className="text-2xl font-bold">{formatNumber(community.post_count)}</p>
                  </Card>
                  <Card className="p-3 space-y-1">
                    <div className="flex items-center gap-2 text-muted-foreground mb-1">
                      <Package2 className="w-4 h-4" />
                      <span className="text-xs font-medium uppercase">Products</span>
                    </div>
                    <p className="text-2xl font-bold">{formatNumber(community.product_count)}</p>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}
