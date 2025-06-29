
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface CommunityInfoPanelProps {
  community: {
    name: string;
    expert_name?: string;
    thumbnail?: string;
    description?: string;
    member_count?: number;
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

  return (
    <div className="space-y-6 h-full flex flex-col justify-start">
      {/* Main heading with dynamic sizing */}
      <div className="space-y-4">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight leading-tight">
          <span className="text-gray-900">Welcome to </span>
          <span className="text-primary break-words">
            {community.name || "our community"}
          </span>
        </h1>
        
        {/* Community visual and host info */}
        <div className="flex items-start gap-4">
          <Avatar className="h-16 w-16 rounded-xl border-2 border-white shadow-md flex-shrink-0">
            <AvatarImage 
              src={community.thumbnail} 
              alt={`${community.name} thumbnail`} 
              className="object-cover"
            />
            <AvatarFallback className="text-lg font-semibold bg-gradient-to-br from-primary/20 to-primary/10">
              {community.name?.substring(0, 2)?.toUpperCase() || "CO"}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-semibold text-gray-900 truncate">
              {community.name}
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              {community.expert_name ? 
                `Hosted by ${community.expert_name}` : 
                "Expert-led community"
              }
            </p>
            
            {/* Community stats - only show if data exists */}
            <div className="flex flex-wrap gap-3 mt-3">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                {formatMemberCount(community.member_count)}
              </span>
              
              {community.type && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 capitalize">
                  {community.type} community
                </span>
              )}
              
              {formatLastActivity(community.last_activity) && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                  {formatLastActivity(community.last_activity)}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Description with fade-out for overflow */}
      <div className="flex-1">
        <div className="relative">
          <p className="text-gray-600 leading-relaxed text-sm sm:text-base line-clamp-4">
            {community.description || 
             "Join our community to connect with like-minded individuals, access exclusive content, and grow together."}
          </p>
          {community.description && community.description.length > 200 && (
            <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-slate-100 to-transparent pointer-events-none" />
          )}
        </div>
      </div>

      {/* Optional trust indicators */}
      <div className="border-t border-gray-200 pt-4 mt-auto">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>🔒 Secure & Private</span>
          <span>✨ Premium Content</span>
          <span>🤝 Expert Support</span>
        </div>
      </div>
    </div>
  );
}
