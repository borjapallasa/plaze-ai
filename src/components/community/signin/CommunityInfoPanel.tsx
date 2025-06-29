
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface CommunityInfoPanelProps {
  community: {
    name: string;
    expert_name?: string;
    thumbnail?: string;
    description?: string;
    member_count?: number;
    product_count?: number;
    post_count?: number;
    classroom_count?: number;
    type?: string;
    last_activity?: string;
  };
}

export function CommunityInfoPanel({ community }: CommunityInfoPanelProps) {
  const formatMemberCount = (count?: number) => {
    if (!count) return "New community";
    if (count > 1000) return `${(count / 1000).toFixed(1)}k+ members`;
    return `${count} members`;
  };

  const formatLastActivity = (lastActivity?: string) => {
    if (!lastActivity) return null;
    const date = new Date(lastActivity);
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return "Active today";
    if (diffInDays === 1) return "Active yesterday";
    if (diffInDays < 7) return `Active ${diffInDays} days ago`;
    return "Recently active";
  };

  const formatCount = (count?: number) => {
    if (!count || count === 0) return "0";
    if (count > 1000) return `${(count / 1000).toFixed(1)}k`;
    return count.toString();
  };

  return (
    <div className="space-y-16">
      {/* Main heading */}
      <div className="space-y-8">
        <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
          Welcome to{" "}
          <span className="text-primary">
            {community.name || "our community"}
          </span>
        </h1>
        
        <p className="text-xl text-gray-600 leading-relaxed max-w-md">
          Join our community to connect with like-minded individuals and grow together.
        </p>
      </div>

      {/* Community visual and info */}
      <div className="flex items-start gap-8">
        <Avatar className="h-24 w-24 rounded-2xl border-2 border-gray-100 flex-shrink-0">
          <AvatarImage 
            src={community.thumbnail} 
            alt={`${community.name} thumbnail`} 
            className="object-cover"
          />
          <AvatarFallback className="text-2xl font-semibold bg-primary/10 text-primary rounded-2xl">
            {community.name?.substring(0, 2)?.toUpperCase() || "CO"}
          </AvatarFallback>
        </Avatar>
        
        <div className="flex-1 min-w-0">
          <h3 className="text-2xl font-semibold text-gray-900 mb-3">
            {community.name}
          </h3>
          <p className="text-lg text-gray-600 mb-6">
            {community.expert_name ? 
              `Hosted by ${community.expert_name}` : 
              "Expert-led community"
            }
          </p>
          
          {/* Community stats */}
          <div className="flex flex-wrap gap-4">
            <span className="inline-flex items-center px-5 py-3 rounded-full text-base font-medium bg-primary/10 text-primary">
              {formatMemberCount(community.member_count)}
            </span>
            
            {community.type && (
              <span className="inline-flex items-center px-5 py-3 rounded-full text-base font-medium bg-gray-100 text-gray-700 capitalize">
                {community.type}
              </span>
            )}
            
            {formatLastActivity(community.last_activity) && (
              <span className="inline-flex items-center px-5 py-3 rounded-full text-base font-medium bg-green-100 text-green-700">
                {formatLastActivity(community.last_activity)}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Description */}
      {community.description && (
        <div className="space-y-4">
          <h4 className="text-xl font-semibold text-gray-900">About this community</h4>
          <p className="text-lg text-gray-600 leading-relaxed line-clamp-4">
            {community.description}
          </p>
        </div>
      )}

      {/* Community Metrics */}
      <div className="grid grid-cols-4 gap-6 pt-8 border-t border-gray-200">
        <div className="text-center">
          <div className="text-3xl font-bold text-primary mb-2">{formatCount(community.member_count)}</div>
          <div className="text-sm font-medium text-gray-600">Members</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-primary mb-2">{formatCount(community.product_count)}</div>
          <div className="text-sm font-medium text-gray-600">Products</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-primary mb-2">{formatCount(community.post_count)}</div>
          <div className="text-sm font-medium text-gray-600">Posts</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-primary mb-2">{formatCount(community.classroom_count)}</div>
          <div className="text-sm font-medium text-gray-600">Classrooms</div>
        </div>
      </div>
    </div>
  );
}
