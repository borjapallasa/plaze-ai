
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Users, Star, DollarSign, Crown } from "lucide-react";
import { cn } from "@/lib/utils";

interface Community {
  community_uuid: string;
  name: string;
  description: string | null;
  expert_name: string | null;
  expert_thumbnail: string | null;
  community_thumbnail: string | null;
  member_count: number | null;
  paid_member_count: number | null;
  price: number | null;
}

interface CommunityInfoPanelProps {
  community: Community;
  className?: string;
}

export function CommunityInfoPanel({ community, className }: CommunityInfoPanelProps) {
  const formatPrice = (price: number | null) => {
    if (!price) return "Free";
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const formatMemberCount = (count: number | null) => {
    if (!count) return "0";
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}k`;
    }
    return count.toString();
  };

  return (
    <Card className={cn("p-8 space-y-8", className)}>
      {/* Community Header */}
      <div className="flex items-start space-x-6">
        <Avatar className="h-20 w-20 border-2 border-primary/20">
          <AvatarImage src={community.community_thumbnail || undefined} />
          <AvatarFallback className="text-2xl font-semibold bg-primary/10 text-primary">
            {community.name.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        
        <div className="flex-1 space-y-3">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{community.name}</h2>
            <div className="flex items-center gap-3">
              <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">
                <DollarSign className="h-3 w-3 mr-1" />
                {formatPrice(community.price)}
              </Badge>
              {community.expert_name && (
                <Badge variant="outline" className="border-amber-200 bg-amber-50 text-amber-800">
                  <Crown className="h-3 w-3 mr-1" />
                  Expert Led
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Community Stats */}
      <div className="grid grid-cols-2 gap-6">
        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-center space-x-2 text-gray-600 mb-2">
            <Users className="h-5 w-5" />
            <span className="text-sm font-medium">Total Members</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {formatMemberCount(community.member_count)}
          </p>
        </div>
        
        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-center space-x-2 text-gray-600 mb-2">
            <Star className="h-5 w-5 text-yellow-500" />
            <span className="text-sm font-medium">Active Members</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {formatMemberCount(community.paid_member_count)}
          </p>
        </div>
      </div>

      {/* Expert Info */}
      {community.expert_name && (
        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Community Host</h3>
          <div className="flex items-center space-x-4">
            <Avatar className="h-12 w-12">
              <AvatarImage src={community.expert_thumbnail || undefined} />
              <AvatarFallback className="bg-primary/10 text-primary">
                {community.expert_name.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium text-gray-900">{community.expert_name}</p>
              <p className="text-sm text-gray-600">Expert & Community Leader</p>
            </div>
          </div>
        </div>
      )}

      {/* Value Proposition */}
      <div className="bg-gradient-to-r from-primary/5 to-purple-50 rounded-lg p-6 border border-primary/10">
        <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
          <Star className="h-5 w-5 text-primary mr-2" />
          What you'll get:
        </h3>
        <ul className="text-sm text-gray-700 space-y-2">
          <li className="flex items-start">
            <span className="text-primary mr-2">✓</span>
            Access to exclusive content and resources
          </li>
          <li className="flex items-start">
            <span className="text-primary mr-2">✓</span>
            Connect with like-minded community members
          </li>
          <li className="flex items-start">
            <span className="text-primary mr-2">✓</span>
            Learn from expert-led discussions and insights
          </li>
          <li className="flex items-start">
            <span className="text-primary mr-2">✓</span>
            Participate in community events and activities
          </li>
        </ul>
      </div>
    </Card>
  );
}
