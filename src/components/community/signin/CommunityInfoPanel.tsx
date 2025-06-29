
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Users, Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface Community {
  community_uuid: string;
  name: string;
  description: string | null;
  expert_name: string | null;
  expert_thumbnail: string | null;
  community_thumbnail: string | null;
}

interface CommunityInfoPanelProps {
  community: Community;
  className?: string;
}

export function CommunityInfoPanel({ community, className }: CommunityInfoPanelProps) {
  return (
    <Card className={cn("p-6 space-y-6", className)}>
      {/* Community Header */}
      <div className="flex items-start space-x-4">
        <Avatar className="h-16 w-16 border-2 border-primary/20">
          <AvatarImage src={community.community_thumbnail || undefined} />
          <AvatarFallback className="text-lg font-semibold bg-primary/10 text-primary">
            {community.name.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        
        <div className="flex-1 space-y-2">
          <h2 className="text-2xl font-bold text-gray-900">{community.name}</h2>
          {community.expert_name && (
            <p className="text-sm text-gray-600">
              This community is hosted by an expert host.
            </p>
          )}
        </div>
      </div>

      {/* Community Stats */}
      <div className="flex items-center space-x-6 text-sm text-gray-600">
        <div className="flex items-center space-x-2">
          <Users className="h-4 w-4" />
          <span>Active Community</span>
        </div>
        <div className="flex items-center space-x-2">
          <Star className="h-4 w-4 text-yellow-500" />
          <span>Expert Hosted</span>
        </div>
      </div>

      {/* Expert Info */}
      {community.expert_name && (
        <div className="border-t pt-4">
          <div className="flex items-center space-x-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={community.expert_thumbnail || undefined} />
              <AvatarFallback className="text-sm bg-primary/10 text-primary">
                {community.expert_name.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium text-gray-900">{community.expert_name}</p>
              <Badge variant="secondary" className="text-xs">
                Community Host
              </Badge>
            </div>
          </div>
        </div>
      )}

      {/* Value Proposition */}
      <div className="bg-primary/5 rounded-lg p-4 border border-primary/10">
        <h3 className="font-semibold text-gray-900 mb-2">What you'll get:</h3>
        <ul className="text-sm text-gray-700 space-y-1">
          <li>• Access to exclusive content and resources</li>
          <li>• Connect with like-minded community members</li>
          <li>• Learn from expert-led discussions and insights</li>
          <li>• Participate in community events and activities</li>
        </ul>
      </div>
    </Card>
  );
}
