
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatNumber } from "@/lib/utils";

interface Community {
  community_uuid: string;
  name: string;
  description?: string;
  thumbnail?: string;
  member_count?: number;
  post_count?: number;
  product_count?: number;
  classroom_count?: number;
  expert?: {
    name: string;
    thumbnail?: string;
  };
}

interface CommunityInfoPanelProps {
  community: Community;
  mode?: 'sign-in' | 'sign-up';
}

export function CommunityInfoPanel({ community, mode = 'sign-in' }: CommunityInfoPanelProps) {
  const actionText = mode === 'sign-up' ? 'Join' : 'Welcome back to';
  
  return (
    <div className="space-y-8">
      <div className="space-y-6">
        <h1 className="text-4xl font-bold text-gray-900">
          {actionText} {community.name}
        </h1>
        
        <p className="text-lg text-gray-600 leading-relaxed">
          {mode === 'sign-up' 
            ? "Create your account to connect with like-minded individuals and grow together."
            : "Sign in to continue your journey with the community."
          }
        </p>
      </div>

      {/* Community Card */}
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-white flex items-center justify-center">
            {community.thumbnail ? (
              <img 
                src={community.thumbnail} 
                alt={community.name}
                className="w-12 h-12 object-cover rounded-lg"
              />
            ) : (
              <div className="w-12 h-12 bg-primary/10 flex items-center justify-center rounded-lg">
                <span className="text-primary font-semibold text-lg">
                  {community.name.charAt(0)}
                </span>
              </div>
            )}
          </div>
          
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-gray-900">{community.name}</h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-sm text-gray-500">By</span>
              <Avatar className="w-5 h-5">
                <AvatarImage 
                  src={community.expert?.thumbnail} 
                  alt={community.expert?.name}
                />
                <AvatarFallback className="text-xs">
                  {community.expert?.name?.charAt(0) || 'E'}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium text-gray-700">
                {community.expert?.name || 'Expert'}
              </span>
            </div>
          </div>
        </div>

        {/* About Section */}
        <div className="space-y-3">
          <h3 className="font-semibold text-gray-900">About this community</h3>
          <p className="text-gray-600 leading-relaxed">
            {community.description || "A community focused on growth and learning together."}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-4 gap-4 pt-4 border-t border-gray-200">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">
              {formatNumber(community.member_count || 0)}
            </div>
            <div className="text-sm text-gray-500">Members</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">
              {formatNumber(community.product_count || 0)}
            </div>
            <div className="text-sm text-gray-500">Products</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">
              {formatNumber(community.post_count || 0)}
            </div>
            <div className="text-sm text-gray-500">Posts</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">
              {formatNumber(community.classroom_count || 0)}
            </div>
            <div className="text-sm text-gray-500">Classrooms</div>
          </div>
        </div>
      </div>
    </div>
  );
}
