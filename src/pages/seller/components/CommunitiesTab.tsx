
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Clock } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface Community {
  community_uuid: string;
  name: string;
  description: string;
  member_count: number;
  thumbnail: string;
  last_activity: string;
  status: string;
}

interface CommunitiesTabProps {
  communities: Community[];
  isLoading: boolean;
}

export function CommunitiesTab({ communities, isLoading }: CommunitiesTabProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="overflow-hidden border border-border/40">
            <div className="aspect-video bg-muted/50">
              <Skeleton className="h-full w-full" />
            </div>
            <CardHeader className="pb-2">
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-full" />
            </CardHeader>
            <CardContent>
              <div className="flex justify-between">
                <Skeleton className="h-5 w-1/4" />
                <Skeleton className="h-5 w-1/4" />
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {communities.map((community) => (
        <Card 
          key={community.community_uuid} 
          className="overflow-hidden border border-border/40 hover:border-border/80 transition-colors"
        >
          <div className="aspect-video bg-muted/50 relative overflow-hidden">
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
          
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold line-clamp-1">
              {community.name}
            </CardTitle>
            <p className="text-muted-foreground text-sm line-clamp-2">
              {community.description || "A community for sharing knowledge and connecting with others."}
            </p>
          </CardHeader>
          
          <CardContent>
            <div className="flex justify-between text-sm">
              <div className="flex items-center gap-1 text-muted-foreground">
                <Users className="h-4 w-4" />
                <span>{community.member_count || 0} members</span>
              </div>
              <div className="flex items-center gap-1 text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>{community.last_activity ? new Date(community.last_activity).toLocaleDateString() : 'No activity'}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
