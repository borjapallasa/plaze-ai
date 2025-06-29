import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useExpertName } from "@/hooks/use-expert-name";
import { useExpertQuery } from "@/hooks/expert/useExpertQuery";
interface CommunityInfoPanelProps {
  community: {
    name: string;
    expert_name?: string;
    expert_uuid?: string;
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
export function CommunityInfoPanel({
  community
}: CommunityInfoPanelProps) {
  const {
    data: expert
  } = useExpertQuery(community.expert_uuid);
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
  return <div className="space-y-8">
      {/* Main heading */}
      <div className="space-y-4">
        <h1 className="text-xl lg:text-2xl font-bold text-gray-900 leading-tight">
          Join{" "}
          <span className="text-primary">
            {community.name || "our community"}
          </span>
        </h1>
        
        <p className="text-sm text-gray-600 leading-relaxed max-w-md">
          Join our community to connect with like-minded individuals and grow together.
        </p>
      </div>

      {/* Community visual and info */}
      <div className="flex items-start gap-4">
        <Avatar className="h-16 w-16 rounded-2xl border-2 border-gray-100 flex-shrink-0">
          <AvatarImage src={community.thumbnail} alt={`${community.name} thumbnail`} className="object-cover" />
          <AvatarFallback className="text-lg font-semibold bg-primary/10 text-primary rounded-2xl">
            {community.name?.substring(0, 2)?.toUpperCase() || "CO"}
          </AvatarFallback>
        </Avatar>
        
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-semibold text-gray-900 mb-2">
            {community.name}
          </h3>
          
          {/* Expert info with thumbnail and name */}
          {expert ? <div className="flex items-center gap-2 mb-3">
              <span className="text-sm text-gray-600">By</span>
              <Avatar className="h-6 w-6">
                <AvatarImage src={expert.thumbnail} alt={`${expert.name} avatar`} className="object-cover" />
                <AvatarFallback className="text-xs bg-primary/10 text-primary">
                  {expert.name?.substring(0, 2)?.toUpperCase() || "EX"}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium text-gray-700">
                {expert.name || "Expert"}
              </span>
            </div> : <p className="text-sm text-gray-600 mb-3">
              Expert-led community
            </p>}
          
          {/* Community stats */}
          
        </div>
      </div>

      {/* Description */}
      {community.description && <div className="space-y-2">
          <h4 className="text-sm font-semibold text-gray-900">About this community</h4>
          <p className="text-sm text-gray-600 leading-relaxed line-clamp-4">
            {community.description}
          </p>
        </div>}

      {/* Community Metrics */}
      <div className="grid grid-cols-4 gap-3 pt-4 border-t border-gray-200">
        <div className="text-center">
          <div className="text-xl font-bold text-primary mb-1">{formatCount(community.member_count)}</div>
          <div className="text-xs font-medium text-gray-600">Members</div>
        </div>
        <div className="text-center">
          <div className="text-xl font-bold text-primary mb-1">{formatCount(community.product_count)}</div>
          <div className="text-xs font-medium text-gray-600">Products</div>
        </div>
        <div className="text-center">
          <div className="text-xl font-bold text-primary mb-1">{formatCount(community.post_count)}</div>
          <div className="text-xs font-medium text-gray-600">Posts</div>
        </div>
        <div className="text-center">
          <div className="text-xl font-bold text-primary mb-1">{formatCount(community.classroom_count)}</div>
          <div className="text-xs font-medium text-gray-600">Classrooms</div>
        </div>
      </div>
    </div>;
}