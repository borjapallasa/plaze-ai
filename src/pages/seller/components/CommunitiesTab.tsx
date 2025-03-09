
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Clock, MessageSquare, GraduationCap, Package2, Globe } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

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
  if (isLoading) {
    return (
      <div className="space-y-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i} className="w-full border border-border/40">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row gap-6">
                <div className="w-full lg:w-1/3">
                  <Skeleton className="h-56 w-full rounded-lg" />
                </div>
                <div className="w-full lg:w-2/3 space-y-4">
                  <Skeleton className="h-8 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2">
                    <Skeleton className="h-20 w-full" />
                    <Skeleton className="h-20 w-full" />
                    <Skeleton className="h-20 w-full" />
                    <Skeleton className="h-20 w-full" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!communities.length) {
    return (
      <Card className="border-dashed border-2 border-muted-foreground/20 bg-muted/5">
        <CardContent className="flex flex-col items-center justify-center py-10">
          <Users className="h-10 w-10 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-1">No Communities</h3>
          <p className="text-muted-foreground text-center max-w-md">
            This seller hasn't created any communities yet.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {communities.map((community) => (
        <Card 
          key={community.community_uuid} 
          className="w-full border border-border/40 hover:border-border/80 transition-colors"
        >
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Left Column - Thumbnail */}
              <div className="w-full lg:w-1/3 h-56 bg-muted/50 relative overflow-hidden rounded-lg">
                {community.thumbnail ? (
                  <img 
                    src={community.thumbnail} 
                    alt={community.name} 
                    className="w-full h-full object-cover transition-all hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/5 to-primary/20">
                    <Users className="h-12 w-12 text-primary/40" />
                  </div>
                )}
                <div className="absolute top-2 right-2">
                  <Badge variant={community.status === 'active' ? 'default' : 'secondary'}>
                    {community.status === 'active' ? 'Active' : 'Draft'}
                  </Badge>
                </div>
              </div>
              
              {/* Right Column - Content */}
              <div className="w-full lg:w-2/3 space-y-4">
                {/* Title and badges */}
                <div className="space-y-3">
                  <h3 className="text-xl font-semibold">{community.name}</h3>
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
                
                {/* Description */}
                <p className="text-sm leading-relaxed text-muted-foreground line-clamp-2">
                  {community.description || "A community for sharing knowledge and connecting with others."}
                </p>
                
                <Separator className="my-2" />
                
                {/* Stats Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
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
                
                {/* Last Activity */}
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>Last activity: {community.last_activity ? new Date(community.last_activity).toLocaleDateString() : 'No activity'}</span>
                </div>
                
                {/* Buttons */}
                <div className="pt-2 flex space-x-3">
                  <Button size="sm">View Community</Button>
                  <Button variant="outline" size="sm">Edit</Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
