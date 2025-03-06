
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge as UIBadge } from "@/components/ui/badge";
import { 
  Plus, 
  Search, 
  Building2, 
  DollarSign, 
  CalendarDays, 
  MessageCircle 
} from "lucide-react";

interface Community {
  community_uuid: string;
  name: string;
  intro?: string;
  description?: string;
  type?: string;
  price: number;
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
}

export function CommunitiesTab({ communities }: CommunitiesTabProps) {
  const navigate = useNavigate();

  const handleOpenCommunity = (communityId: string) => {
    navigate(`/community/${communityId}/edit`);
  };

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

      <div className="grid grid-cols-1 gap-6">
        {communities?.map((community) => (
          <Card 
            key={community.community_uuid}
            className="overflow-hidden border bg-card hover:bg-muted/5 shadow-sm hover:shadow-md transition-all duration-200"
            onClick={() => handleOpenCommunity(community.community_uuid)}
          >
            <div className="grid lg:grid-cols-[2fr,1fr,1fr] divide-y lg:divide-y-0 lg:divide-x divide-border">
              <div className="p-6 space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-4">
                    <Avatar className="h-12 w-12 rounded-full shrink-0 ring-1 ring-border">
                      <AvatarImage 
                        src={community.thumbnail} 
                        alt={community.name}
                        className="object-cover"
                      />
                      <AvatarFallback>{community.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="text-2xl font-semibold tracking-tight text-foreground truncate">
                          {community.name}
                        </h3>
                        <UIBadge 
                          variant={community.price > 0 ? "default" : "secondary"}
                          className="capitalize whitespace-nowrap shrink-0"
                        >
                          {community.price > 0 ? `$${community.price}/mo` : 'Free'}
                        </UIBadge>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {community.description || community.intro}
                  </p>
                </div>
              </div>

              <div className="p-6 bg-muted/5">
                <div className="h-full space-y-4">
                  <h4 className="text-sm font-medium flex items-center gap-1.5 text-foreground">
                    <Building2 className="h-4 w-4 text-blue-500" />
                    Community Stats
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <span className="text-xs font-medium text-muted-foreground">Total Members</span>
                      <p className="font-medium">{community.member_count?.toLocaleString() || 0}</p>
                    </div>
                    <div className="space-y-1">
                      <span className="text-xs font-medium text-muted-foreground">Paid Members</span>
                      <p className="font-medium">{community.paid_member_count?.toLocaleString() || 0}</p>
                    </div>
                    <div className="space-y-1">
                      <span className="text-xs font-medium text-muted-foreground">Products</span>
                      <p className="font-medium">{community.product_count?.toLocaleString() || 0}</p>
                    </div>
                    <div className="space-y-1">
                      <span className="text-xs font-medium text-muted-foreground">Classrooms</span>
                      <p className="font-medium">{community.classroom_count?.toLocaleString() || 0}</p>
                    </div>
                    <div className="space-y-1">
                      <span className="text-xs font-medium text-muted-foreground">Posts</span>
                      <p className="font-medium">{community.post_count?.toLocaleString() || 0}</p>
                    </div>
                    <div className="space-y-1">
                      <span className="text-xs font-medium text-muted-foreground">Payment Rate</span>
                      <p className="font-medium">
                        {community.member_count 
                          ? Math.round((community.paid_member_count / community.member_count) * 100)
                          : 0}%
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-muted/5">
                <div className="h-full flex flex-col">
                  <div className="space-y-4 flex-grow">
                    <div className="space-y-2">
                      <div className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                        <DollarSign className="w-3 h-3" />
                        Monthly Recurring Revenue
                      </div>
                      <div className="font-medium text-xl text-green-600">
                        ${community.monthly_recurring_revenue?.toLocaleString() || '0'}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                        <CalendarDays className="w-3 h-3" />
                        Last Activity
                      </div>
                      <div className="font-medium">
                        {community.last_activity 
                          ? format(new Date(community.last_activity), 'MMM d, yyyy')
                          : 'No activity yet'}
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 flex flex-col gap-2">
                    <Button 
                      className="w-full bg-black hover:bg-black/90 text-white"
                      onClick={() => handleOpenCommunity(community.community_uuid)}
                    >
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Open Community
                    </Button>
                    <Button variant="outline" className="w-full">
                      Manage Community
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}

        {!communities || communities.length === 0 && (
          <Card className="p-8 text-center text-muted-foreground">
            No communities found
          </Card>
        )}
      </div>
    </div>
  );
}
