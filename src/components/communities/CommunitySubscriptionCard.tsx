
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

  const isPending = subscription.status.toLowerCase() === 'pending';

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
      
      <CardContent className="p-6 space-y-4 flex-1 flex flex-col">
        {/* Community Name */}
        <h3 className="font-semibold text-xl line-clamp-2 leading-tight">{subscription.community_name}</h3>
        
        {/* Community Description */}
        {subscription.community_description && (
          <p className="text-sm text-muted-foreground line-clamp-3 flex-1 leading-relaxed">
            {subscription.community_description}
          </p>
        )}
        
        {/* Separator */}
        <Separator className="my-4" />
        
        {/* Bottom section with status and price */}
        <div className="flex items-center justify-between text-sm mt-auto">
          <div className="flex items-center gap-2 text-muted-foreground">
            {isPending ? (
              <span className="text-yellow-600 font-medium">
                Pending
              </span>
            ) : (
              <>
                <Calendar className="h-4 w-4" />
                <span>Joined {new Date(subscription.created_at).toLocaleDateString()}</span>
              </>
            )}
          </div>
          
          <div className="font-semibold text-lg text-green-600">
            Free
          </div>
        </div>

        {/* Action Buttons - Stacked Vertically */}
        <div className="flex flex-col gap-3 mt-6">
          {/* Open Community Button - Primary */}
          <Button 
            className="w-full h-10 font-medium"
            onClick={handleOpenCommunity}
          >
            <ExternalLink className="h-4 w-4 mr-2" />
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
