
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "lucide-react";

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
          <Card key={index} className="p-6 animate-pulse">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-4 flex-1">
                <div className="h-12 w-12 bg-gray-200 rounded"></div>
                <div className="space-y-2 flex-1">
                  <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                </div>
              </div>
              <div className="h-6 bg-gray-200 rounded w-16"></div>
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
          className="p-6 hover:shadow-md transition-shadow duration-200"
        >
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-4 flex-1">
              {subscription.community_thumbnail && (
                <img 
                  src={subscription.community_thumbnail} 
                  alt={subscription.community_name || "Community"} 
                  className="h-12 w-12 object-cover rounded"
                />
              )}
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-3">
                  <h3 className="font-medium text-foreground">
                    {subscription.community_name || "Community Subscription"}
                  </h3>
                </div>
                
                {/* Community Description */}
                {subscription.community_description && (
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {subscription.community_description}
                  </p>
                )}
                
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    <span>Joined {new Date(subscription.created_at).toLocaleDateString()}</span>
                  </div>
                  <span>•</span>
                  <span className="break-all">
                    UUID: {subscription.community_subscription_uuid}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Badge 
                variant="secondary" 
                className={`${getStatusColor(subscription.status)} capitalize`}
              >
                {getStatusText(subscription.status)}
              </Badge>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
