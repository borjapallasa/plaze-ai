
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Settings, ExternalLink } from "lucide-react";

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

  const getCommunityInitials = (name?: string) => {
    if (!name) return "C";
    return name
      .split(" ")
      .map(word => word.charAt(0))
      .join("")
      .substring(0, 2)
      .toUpperCase();
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
          className="p-0 hover:shadow-md hover:bg-gray-50/50 transition-all duration-200 overflow-hidden border border-gray-200"
        >
          {/* Mobile Layout */}
          <div className="md:hidden p-4 space-y-4">
            {/* Logo and Title Row */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 flex-shrink-0 rounded-lg bg-gray-50 border flex items-center justify-center overflow-hidden">
                {subscription.community_thumbnail ? (
                  <img 
                    src={subscription.community_thumbnail} 
                    alt={subscription.community_name || "Community"} 
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-xs font-medium">
                    {getCommunityInitials(subscription.community_name)}
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-base text-foreground truncate">
                  {subscription.community_name || "Community Subscription"}
                </h3>
              </div>
            </div>

            {/* Metadata Row */}
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <Badge 
                variant="secondary" 
                className={`${getStatusColor(subscription.status)} text-xs px-2 py-1 font-medium capitalize`}
              >
                {getStatusText(subscription.status)}
              </Badge>
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>Joined {new Date(subscription.created_at).toLocaleDateString()}</span>
              </div>
            </div>

            {/* Description */}
            {subscription.community_description && (
              <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
                {subscription.community_description}
              </p>
            )}

            {/* Action Buttons - Vertical Stack on Mobile */}
            <div className="flex flex-col gap-2">
              <Button 
                size="sm" 
                className="text-xs h-8 w-full font-medium"
                onClick={() => {
                  console.log('Open community for:', subscription.community_subscription_uuid);
                }}
              >
                <ExternalLink className="h-3 w-3 mr-2" />
                Open Community
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="text-xs h-8 w-full"
                onClick={() => {
                  console.log('Manage membership for:', subscription.community_subscription_uuid);
                }}
              >
                <Settings className="h-3 w-3 mr-2" />
                Manage
              </Button>
            </div>
          </div>

          {/* Desktop Layout */}
          <div className="hidden md:flex items-center p-4 gap-4">
            {/* Left: Logo - Fixed Width */}
            <div className="w-16 h-16 flex-shrink-0 rounded-lg bg-gray-50 border flex items-center justify-center overflow-hidden">
              {subscription.community_thumbnail ? (
                <img 
                  src={subscription.community_thumbnail} 
                  alt={subscription.community_name || "Community"} 
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-sm font-medium">
                  {getCommunityInitials(subscription.community_name)}
                </div>
              )}
            </div>
            
            {/* Middle: Content Section - Flex Grow */}
            <div className="flex-1 min-w-0 space-y-2">
              {/* Community Name */}
              <h3 className="font-semibold text-lg text-foreground truncate">
                {subscription.community_name || "Community Subscription"}
              </h3>
              
              {/* Metadata Row */}
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <Badge 
                  variant="secondary" 
                  className={`${getStatusColor(subscription.status)} text-xs px-2 py-1 font-medium capitalize`}
                >
                  {getStatusText(subscription.status)}
                </Badge>
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  <span>Joined {new Date(subscription.created_at).toLocaleDateString()}</span>
                </div>
              </div>
              
              {/* Community Description */}
              {subscription.community_description && (
                <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
                  {subscription.community_description}
                </p>
              )}
            </div>
            
            {/* Subtle Divider */}
            <div className="w-px h-12 bg-gray-200 mx-2"></div>
            
            {/* Right: Action Buttons - Fixed Width */}
            <div className="flex gap-2 min-w-[320px]">
              {/* Open Community Button - Primary */}
              <Button 
                size="sm" 
                className="text-xs h-8 flex-1 font-medium"
                onClick={() => {
                  console.log('Open community for:', subscription.community_subscription_uuid);
                }}
              >
                <ExternalLink className="h-3 w-3 mr-2" />
                Open Community
              </Button>

              {/* Manage Membership Button - Secondary */}
              <Button 
                variant="outline" 
                size="sm" 
                className="text-xs h-8 flex-1"
                onClick={() => {
                  console.log('Manage membership for:', subscription.community_subscription_uuid);
                }}
              >
                <Settings className="h-3 w-3 mr-2" />
                Manage
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
