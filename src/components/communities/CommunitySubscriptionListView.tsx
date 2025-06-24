import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Calendar, Settings } from "lucide-react";

interface CommunitySubscription {
  community_subscription_uuid: string;
  status: string;
  created_at: string;
  community_name?: string;
  community_thumbnail?: string;
  community_description?: string;
}

interface CommunitySubscriptionListViewProps {
  subscriptions: CommunitySubscription[];
  loading: boolean;
}

export function CommunitySubscriptionListView({ subscriptions, loading }: CommunitySubscriptionListViewProps) {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-800 hover:bg-green-100";
      case "pending":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100";
      case "cancelled":
        return "bg-red-100 text-red-800 hover:bg-red-100";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100";
    }
  };

  const getStatusText = (status: string) => {
    return status.toLowerCase() === "active" ? "Free" : status;
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, index) => (
          <Card key={index} className="p-4 animate-pulse">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gray-200 rounded-lg flex-shrink-0"></div>
              <div className="flex-1 space-y-2">
                <div className="h-5 bg-gray-200 rounded w-1/3"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <div className="h-3 bg-gray-200 rounded w-20"></div>
                <div className="h-6 bg-gray-200 rounded w-12"></div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (subscriptions.length === 0) {
    return (
      <Card className="p-8 text-center">
        <p className="text-muted-foreground">No subscriptions found matching your criteria</p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {subscriptions.map((subscription) => (
        <Card 
          key={subscription.community_subscription_uuid}
          className="p-4 hover:shadow-md transition-shadow duration-200"
        >
          <div className="flex items-center gap-4">
            {/* Community Thumbnail - Fixed square size */}
            <div className="w-16 h-16 flex-shrink-0">
              <img 
                src={subscription.community_thumbnail || "https://images.unsplash.com/photo-1522202176988-66273c2fd55f"} 
                alt={subscription.community_name || "Community"} 
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
            
            {/* Main Content - Flex grow to take remaining space */}
            <div className="flex-1 min-w-0">
              {/* Community Name - Bold, larger */}
              <h3 className="font-semibold text-lg text-foreground mb-1 truncate">
                {subscription.community_name || "Community Subscription"}
              </h3>
              
              {/* Community Description - Limited to 2 lines with ellipsis */}
              {subscription.community_description && (
                <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                  {subscription.community_description}
                </p>
              )}
            </div>
            
            {/* Vertical Separator */}
            <Separator orientation="vertical" className="h-12 mx-2" />
            
            {/* Right Section - Date, Status, and Actions */}
            <div className="flex flex-col items-end justify-start gap-2 min-w-[140px]">
              {/* Joined Date - Small gray text */}
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Calendar className="h-3 w-3" />
                <span>Joined {new Date(subscription.created_at).toLocaleDateString()}</span>
              </div>
              
              {/* Status Badge - Enhanced styling */}
              <Badge 
                variant="secondary" 
                className={`${getStatusColor(subscription.status)} text-xs px-2 py-1 font-medium capitalize`}
              >
                {getStatusText(subscription.status)}
              </Badge>

              {/* Manage Membership Button */}
              <Button 
                variant="outline" 
                size="sm" 
                className="text-xs h-7 px-2 gap-1"
                onClick={() => {
                  // TODO: Navigate to community membership management page
                  console.log('Manage membership for:', subscription.community_subscription_uuid);
                }}
              >
                <Settings className="h-3 w-3" />
                Manage Membership
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
