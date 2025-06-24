
import { Card, CardContent } from "@/components/ui/card";
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

interface CommunitySubscriptionCardProps {
  subscription: CommunitySubscription;
}

export function CommunitySubscriptionCard({ subscription }: CommunitySubscriptionCardProps) {
  const navigate = useNavigate();

  const getStatusText = (status: string) => {
    return status.toLowerCase() === "active" ? "Free" : status;
  };

  const getStatusColor = (status: string) => {
    return status.toLowerCase() === "active" ? "text-green-600" : "text-gray-600";
  };

  const handleOpenCommunity = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (subscription.community_uuid) {
      navigate(`/community/${subscription.community_uuid}`);
    } else {
      console.error('No community UUID available for navigation');
    }
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
        
        {/* Separator */}
        <Separator className="my-2" />
        
        {/* Bottom section with joined date and price */}
        <div className="flex items-center justify-between text-sm mt-auto">
          <div className="flex items-center gap-1 text-muted-foreground">
            <Calendar className="h-3 w-3" />
            <span>Joined {new Date(subscription.created_at).toLocaleDateString()}</span>
          </div>
          
          <div className={`font-medium ${getStatusColor(subscription.status)}`}>
            <span>{getStatusText(subscription.status)}</span>
          </div>
        </div>

        {/* Action Buttons - Stacked Vertically */}
        <div className="flex flex-col gap-2 mt-3">
          {/* Open Community Button - Primary */}
          <Button 
            className="w-full text-xs h-8"
            onClick={handleOpenCommunity}
          >
            <ExternalLink className="h-3 w-3 mr-1" />
            Open Community
          </Button>
          
          {/* Leave Community Dialog */}
          <LeaveCommunityDialog 
            communityName={subscription.community_name}
            subscriptionUuid={subscription.community_subscription_uuid}
          />
        </div>
      </CardContent>
    </Card>
  );
}
