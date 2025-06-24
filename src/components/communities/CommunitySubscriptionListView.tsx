import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Calendar, ExternalLink } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { LeaveCommunityDialog } from "./LeaveCommunityDialog";

interface CommunitySubscription {
  community_subscription_uuid: string;
  status: string;
  created_at: string;
  community_name?: string;
  community_thumbnail?: string;
  community_description?: string;
  community_uuid?: string;
}

interface CommunitySubscriptionListViewProps {
  subscriptions: CommunitySubscription[];
  loading: boolean;
}

export function CommunitySubscriptionListView({ subscriptions, loading }: CommunitySubscriptionListViewProps) {
  const navigate = useNavigate();

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

  const handleOpenCommunity = (subscription: CommunitySubscription) => {
    if (subscription.community_uuid) {
      navigate(`/community/${subscription.community_uuid}`);
    } else {
      console.error('No community UUID available for navigation');
    }
  };

  const handleLeaveCommunity = (subscriptionUuid: string) => {
    console.log('Leave community for:', subscriptionUuid);
    // TODO: Implement actual leave community functionality
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, index) => (
          <Card key={index} className="p-4 animate-pulse">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 bg-gray-200 rounded-lg flex-shrink-0"></div>
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
          className="p-0 hover:shadow-md transition-shadow duration-200 overflow-hidden border border-gray-200"
        >
          {/* Mobile Layout */}
          <div className="md:hidden p-4 space-y-4">
            {/* Logo and Title Row */}
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 flex-shrink-0 rounded-lg bg-gray-50 border flex items-center justify-center overflow-hidden">
                {subscription.community_thumbnail ? (
                  <img 
                    src={subscription.community_thumbnail} 
                    alt={subscription.community_name || "Community"} 
                    className="w-full h-full object-cover"
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

            {/* Action Buttons */}
            <div className="flex gap-2">
              <Button 
                size="sm" 
                className="flex-1 text-xs h-8 font-medium"
                onClick={() => handleOpenCommunity(subscription)}
              >
                <ExternalLink className="h-3 w-3 mr-2" />
                Open Community
              </Button>
              <LeaveCommunityDialog 
                communityName={subscription.community_name}
                onConfirmLeave={() => handleLeaveCommunity(subscription.community_subscription_uuid)}
              />
            </div>
          </div>

          {/* Desktop Layout */}
          <div className="hidden md:flex items-center p-4">
            {/* Left: Logo */}
            <div className="w-20 h-20 flex-shrink-0 rounded-lg bg-gray-50/50 border flex items-center justify-center overflow-hidden">
              {subscription.community_thumbnail ? (
                <img 
                  src={subscription.community_thumbnail} 
                  alt={subscription.community_name || "Community"} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-sm font-medium">
                  {getCommunityInitials(subscription.community_name)}
                </div>
              )}
            </div>
            
            {/* Middle: Content Section */}
            <div className="flex-1 min-w-0 space-y-1 ml-4">
              {/* Community Name */}
              <h3 className="font-semibold text-lg text-foreground truncate">
                {subscription.community_name || "Community Subscription"}
              </h3>
              
              {/* Metadata Row */}
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <Badge 
                  variant="secondary" 
                  className={`${getStatusColor(subscription.status)} text-xs px-2 py-0.5 font-medium capitalize`}
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
                <p className="text-sm text-gray-600 line-clamp-1 leading-relaxed pt-1">
                  {subscription.community_description}
                </p>
              )}
            </div>
            
            {/* Vertical Divider */}
            <Separator orientation="vertical" className="h-16 mx-4" />
            
            {/* Right: Action Buttons - Stacked Vertically */}
            <div className="flex flex-col gap-2">
              <Button 
                size="sm" 
                className="text-xs h-8 px-4 font-medium"
                onClick={() => handleOpenCommunity(subscription)}
              >
                <ExternalLink className="h-3 w-3 mr-2" />
                Open Community
              </Button>

              <LeaveCommunityDialog 
                communityName={subscription.community_name}
                onConfirmLeave={() => handleLeaveCommunity(subscription.community_subscription_uuid)}
              />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
