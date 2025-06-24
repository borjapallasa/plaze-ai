
import { Card, CardContent } from "@/components/ui/card";
import { Users } from "lucide-react";

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
        
        {/* Joined Date */}
        <p className="text-sm text-muted-foreground line-clamp-2 flex-1">
          Joined on {new Date(subscription.created_at).toLocaleDateString()}
        </p>
        
        {/* Community Stats */}
        <div className="flex items-center justify-between text-sm mt-auto">
          <div className="flex items-center gap-1 text-muted-foreground">
            <Users className="h-4 w-4" />
            <span>Member</span>
          </div>
          
          <div className={`font-medium ${getStatusColor(subscription.status)}`}>
            <span>{getStatusText(subscription.status)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
