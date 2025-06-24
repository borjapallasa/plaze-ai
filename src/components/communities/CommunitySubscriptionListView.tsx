
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
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
            <div className="flex items-stretch gap-6 min-h-[120px]">
              <div className="w-32 bg-gray-200 rounded flex-shrink-0"></div>
              <div className="flex-1 space-y-3 py-2">
                <div className="h-5 bg-gray-200 rounded w-1/3"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
              <div className="h-6 bg-gray-200 rounded w-16 mt-2"></div>
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
          className="p-0 hover:shadow-md transition-shadow duration-200 overflow-hidden"
        >
          <div className="flex items-stretch min-h-[120px]">
            {/* Full Height Community Thumbnail */}
            <div className="w-32 flex-shrink-0">
              <img 
                src={subscription.community_thumbnail || "https://images.unsplash.com/photo-1522202176988-66273c2fd55f"} 
                alt={subscription.community_name || "Community"} 
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Main Content */}
            <div className="flex-1 p-6 flex flex-col justify-center">
              <h3 className="font-semibold text-lg text-foreground mb-2">
                {subscription.community_name || "Community Subscription"}
              </h3>
              
              {/* Community Description */}
              {subscription.community_description && (
                <p className="text-sm text-muted-foreground">
                  {subscription.community_description}
                </p>
              )}
            </div>
            
            {/* Vertical Separator */}
            <Separator orientation="vertical" className="h-full" />
            
            {/* Right Section with Joined Date and Status */}
            <div className="p-6 flex flex-col justify-center items-center min-w-[160px] space-y-3">
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Calendar className="h-3 w-3" />
                <span>Joined {new Date(subscription.created_at).toLocaleDateString()}</span>
              </div>
              
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
