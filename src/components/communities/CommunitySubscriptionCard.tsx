
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "text-green-600";
      case "pending":
        return "text-yellow-600";
      case "cancelled":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const getStatusText = (status: string) => {
    return status.toLowerCase() === "active" ? "Free" : status;
  };

  return (
    <Card className="p-6 hover:shadow-md transition-shadow duration-200 h-full flex flex-col">
      {/* Community Image */}
      {subscription.community_thumbnail ? (
        <div className="mb-4">
          <img 
            src={subscription.community_thumbnail} 
            alt={subscription.community_name || "Community"} 
            className="w-full h-48 object-cover rounded-lg"
          />
        </div>
      ) : (
        <div className="w-full h-48 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg mb-4 flex items-center justify-center">
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-600 mb-2">
              {subscription.community_name?.charAt(0) || "C"}
            </div>
          </div>
        </div>
      )}

      {/* Community Name */}
      <h3 className="font-semibold text-xl text-gray-900 mb-3 line-clamp-2 flex-grow">
        {subscription.community_name || "Community Subscription"}
      </h3>

      {/* Description placeholder */}
      <p className="text-gray-600 mb-6 text-sm leading-relaxed">
        Joined on {new Date(subscription.created_at).toLocaleDateString()}
      </p>

      {/* Bottom section */}
      <div className="mt-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-gray-500">
            <Users className="h-4 w-4" />
            <span className="text-sm">Member</span>
          </div>
          <span className={`text-sm font-medium ${getStatusColor(subscription.status)}`}>
            {getStatusText(subscription.status)}
          </span>
        </div>
      </div>
    </Card>
  );
}
