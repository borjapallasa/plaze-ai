
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface CommunitySubscription {
  community_subscription_uuid: string;
  status: string;
  created_at: string;
  community_name?: string;
  community_thumbnail?: string;
}

interface CommunitySubscriptionCardProps {
  subscription: CommunitySubscription;
}

export function CommunitySubscriptionCard({ subscription }: CommunitySubscriptionCardProps) {
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

  return (
    <Card className="p-6 space-y-4 hover:shadow-md transition-shadow duration-200">
      <div>
        {subscription.community_thumbnail && (
          <div className="mb-4">
            <img 
              src={subscription.community_thumbnail} 
              alt={subscription.community_name || "Community"} 
              className="w-full h-32 object-cover rounded-lg"
            />
          </div>
        )}
        <h3 className="font-semibold text-lg leading-tight mb-2">
          {subscription.community_name || "Community Subscription"}
        </h3>
        <p className="text-sm text-muted-foreground break-all">
          UUID: {subscription.community_subscription_uuid}
        </p>
        <div className="flex items-center justify-between mt-4">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">
              Joined: {new Date(subscription.created_at).toLocaleDateString()}
            </p>
          </div>
          <Badge 
            variant="secondary" 
            className={`${getStatusColor(subscription.status)} capitalize`}
          >
            {subscription.status}
          </Badge>
        </div>
      </div>
    </Card>
  );
}
