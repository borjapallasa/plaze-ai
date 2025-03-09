
import React from "react";
import { Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Plus, 
  Search, 
  DollarSign, 
  Users, 
  Package, 
  GraduationCap,
  MessageSquare,
  Clock,
  Loader2
} from "lucide-react";

interface Community {
  community_uuid: string;
  name: string;
  intro?: string;
  description?: string;
  type?: string;
  price?: number;
  member_count?: number;
  paid_member_count?: number;
  monthly_recurring_revenue?: number;
  thumbnail?: string;
  created_at: string;
  product_count?: number;
  classroom_count?: number;
  post_count?: number;
  last_activity?: string;
}

interface CommunitiesTabProps {
  communities: Community[];
  isLoading?: boolean;
}

export function CommunitiesTab({ communities, isLoading = false }: CommunitiesTabProps) {
  if (isLoading) {
    return (
      <div className="space-y-6 mt-6">
        <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4 sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search communities..." 
              className="pl-9"
              disabled
            />
          </div>
          <Button asChild className="sm:w-auto">
            <Link to="/seller/communities/new">
              <Plus className="h-4 w-4 mr-2" />
              Create community
            </Link>
          </Button>
        </div>
        
        <Card className="p-8 flex flex-col items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary/70 mb-2" />
          <p className="text-muted-foreground">Loading communities...</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 mt-6">
      <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4 sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search communities..." 
            className="pl-9"
          />
        </div>
        <Button asChild className="sm:w-auto">
          <Link to="/seller/communities/new">
            <Plus className="h-4 w-4 mr-2" />
            Create community
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {communities.length > 0 ? (
          communities.map((community) => (
            <Card key={community.community_uuid} className="overflow-hidden flex flex-col h-full">
              <div className="relative h-40 bg-muted">
                {community.thumbnail ? (
                  <img 
                    src={community.thumbnail} 
                    alt={community.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full bg-muted">
                    <Users className="h-12 w-12 text-muted-foreground/50" />
                  </div>
                )}
                
                {community.type && (
                  <Badge className="absolute top-3 right-3 capitalize">
                    {community.type}
                  </Badge>
                )}
              </div>
              
              <div className="p-5 flex-grow flex flex-col">
                <h3 className="text-xl font-semibold mb-2 line-clamp-1">{community.name}</h3>
                {community.intro && (
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                    {community.intro}
                  </p>
                )}

                <div className="grid grid-cols-2 gap-3 my-4">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{community.member_count || 0} members</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">${community.monthly_recurring_revenue || 0}/mo</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{community.product_count || 0} products</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <GraduationCap className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{community.classroom_count || 0} classes</span>
                  </div>
                </div>

                <div className="mt-auto">
                  <Separator className="my-3" />
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <MessageSquare className="h-3.5 w-3.5" />
                      <span>{community.post_count || 0} posts</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5" />
                      <span>
                        {community.last_activity 
                          ? `Active ${formatDistanceToNow(new Date(community.last_activity), { addSuffix: true })}` 
                          : 'No recent activity'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-muted/30 border-t">
                <Link 
                  to={`/community/${community.community_uuid}/edit`}
                  className="w-full inline-flex items-center justify-center"
                >
                  <Button variant="default" className="w-full">
                    Manage Community
                  </Button>
                </Link>
              </div>
            </Card>
          ))
        ) : (
          <div className="col-span-full">
            <Card className="p-8 text-center text-muted-foreground">
              No communities found
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
