
import { Card, CardContent } from "@/components/ui/card";

interface CommunitySubscription {
  community_subscription_uuid: string;
  status: string;
  created_at: string;
  community_name?: string;
  community_thumbnail?: string;
  community_description?: string;
}

interface CommunitySubscriptionCardProps {
  subscription: CommunitySubscription;
}

export function CommunitySubscriptionCard({ subscription }: CommunitySubscriptionCardProps) {
  const getStatusText = (status: string) => {
    return status.toLowerCase() === "active" ? "Free" : status;
  };

  const getStatusColor = (status: string) => {
    return status.toLowerCase() === "active" ? "text-green-600" : "text-gray-600";
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer h-full flex flex-col">
      {/* Community Image */}
      <div className="aspect-video relative overflow-hidden flex-shrink-0">
        <img
          src={subscription.community_thumbnail || "https://images.unsplash.com/photo-1522202176988-66273c2fd55f"}
          alt={subscription.community_name || 'Community'}
          className="object-cover w-full h-full"
        />
      </div>
      
      <CardContent className="p-4 space-y-3 flex-1 flex flex-col">
        {/* Community Name */}
        <h3 className="font-semibold text-lg line-clamp-2">{subscription.community_name}</h3>
        
        {/* Community Description */}
        {subscription.community_description && (
          <p className="text-sm text-muted-foreground line-clamp-3 flex-1">
            {subscription.community_description}
          </p>
        )}
        
        {/* Bottom section with joined date and price */}
        <div className="flex items-center justify-between text-sm mt-auto">
          <div className="text-muted-foreground">
            <span>Joined {new Date(subscription.created_at).toLocaleDateString()}</span>
          </div>
          
          <div className={`font-medium ${getStatusColor(subscription.status)}`}>
            <span>{getStatusText(subscription.status)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
