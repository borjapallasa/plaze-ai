
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Calendar, ExternalLink, Clock } from "lucide-react";
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
  const isActive = subscription.status.toLowerCase() === 'active';

  return (
    <Card className={`overflow-hidden hover:shadow-lg transition-shadow cursor-pointer h-full flex flex-col ${isPending ? 'opacity-75' : ''}`}>
      {/* Community Image */}
      <div className="aspect-video relative overflow-hidden flex-shrink-0">
        <img
          src={subscription.community_thumbnail || "https://images.unsplash.com/photo-1522202176988-66273c2fd55f"}
          alt={subscription.community_name || 'Community'}
          className={`object-cover w-full h-full ${isPending ? 'grayscale' : ''}`}
        />
        {isPending && (
          <div className="absolute inset-0 bg-black bg-opacity-10 flex items-center justify-center">
            <div className="bg-white bg-opacity-90 px-3 py-1 rounded-md">
              <span className="text-sm font-medium text-gray-700">Access Pending</span>
            </div>
          </div>
        )}
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
              <span className="inline-flex items-center px-2.5 py-0.5 text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-200 rounded-md">
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
          {/* Conditional Button Based on Status */}
          {isActive ? (
            <Button 
              className="w-full h-10 font-medium"
              onClick={handleOpenCommunity}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Open Community
            </Button>
          ) : (
            <Button 
              className="w-full h-10 font-medium"
              variant="outline"
              disabled
            >
              <Clock className="h-4 w-4 mr-2" />
              Awaiting Approval
            </Button>
          )}
          
          {/* Leave Community Dialog - Only show for active subscriptions */}
          {isActive && (
            <LeaveCommunityDialog 
              communityName={subscription.community_name}
              subscriptionUuid={subscription.community_subscription_uuid}
            />
          )}

          {/* Pending Status Info */}
          {isPending && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
              <div className="flex items-start gap-2">
                <Clock className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-yellow-800">Request Pending</p>
                  <p className="text-xs text-yellow-700 mt-1">
                    Your join request is being reviewed. You'll be notified when approved.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
