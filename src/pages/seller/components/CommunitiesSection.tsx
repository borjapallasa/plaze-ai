
import React from "react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge as UIBadge } from "@/components/ui/badge";
import { Users, Calendar, Loader2 } from "lucide-react";

interface Community {
  community_uuid: string;
  name: string;
  description: string;
  status: string;
  created_at: string;
  thumbnail: string;
  member_count?: number;
}

interface CommunitiesSectionProps {
  communities: Community[];
  isLoading?: boolean;
}

export function CommunitiesSection({ communities, isLoading = false }: CommunitiesSectionProps) {
  if (isLoading) {
    return (
      <Card className="p-8">
        <div className="flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary/70" />
          <span className="ml-3 text-muted-foreground">Loading communities...</span>
        </div>
      </Card>
    );
  }

  if (communities.length === 0) {
    return (
      <Card className="p-12 text-center">
        <Users className="h-16 w-16 mx-auto mb-6 text-muted-foreground/50" />
        <h3 className="text-xl font-semibold mb-2">No communities yet</h3>
        <p className="text-muted-foreground mb-6">
          Create your first community to connect with your audience
        </p>
        <Button asChild className="bg-primary hover:bg-primary/90">
          <Link to="/seller/communities/new">
            Create Your First Community
          </Link>
        </Button>
      </Card>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {communities.map((community) => (
        <Card key={community.community_uuid} className="overflow-hidden hover:shadow-lg transition-shadow">
          <div className="aspect-video bg-muted overflow-hidden">
            {community.thumbnail ? (
              <img 
                src={community.thumbnail} 
                alt={community.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                <Users className="h-12 w-12 text-primary/50" />
              </div>
            )}
          </div>
          
          <div className="p-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-lg truncate">{community.name}</h3>
              <UIBadge 
                variant={community.status === 'active' ? 'default' : 'secondary'}
                className="capitalize"
              >
                {community.status}
              </UIBadge>
            </div>
            
            <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
              {community.description || "No description available"}
            </p>
            
            <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                <span>{community.member_count || 0} members</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>{new Date(community.created_at).toLocaleDateString()}</span>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button asChild variant="outline" size="sm" className="flex-1">
                <Link to={`/community/${community.community_uuid}`}>
                  View
                </Link>
              </Button>
              <Button asChild size="sm" className="flex-1 bg-primary hover:bg-primary/90">
                <Link to={`/community/${community.community_uuid}/edit`}>
                  Edit
                </Link>
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
