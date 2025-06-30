
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { User, Calendar } from "lucide-react";

interface UserData {
  user_uuid: string;
  email: string;
  first_name: string;
  last_name: string;
  created_at: string;
  is_expert: boolean;
  is_affiliate: boolean;
  is_admin: boolean;
}

interface UsersGalleryProps {
  users: UserData[];
  onUserClick: (user: UserData) => void;
  onLoadMore: () => void;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
}

export function UsersGallery({ users, onUserClick }: UsersGalleryProps) {
  const getUserRoleBadges = (user: UserData) => {
    const badges = [];
    if (user.is_admin) badges.push(<Badge key="admin" variant="secondary" className="bg-purple-100 text-purple-800">Admin</Badge>);
    if (user.is_expert) badges.push(<Badge key="expert" variant="secondary" className="bg-blue-100 text-blue-800">Expert</Badge>);
    if (user.is_affiliate) badges.push(<Badge key="affiliate" variant="secondary" className="bg-green-100 text-green-800">Affiliate</Badge>);
    return badges;
  };

  const handleUserClick = (user: UserData) => {
    onUserClick(user);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {users.length === 0 ? (
        <div className="col-span-full text-center py-8 text-[#8E9196]">
          No users found matching your criteria
        </div>
      ) : (
        users.map((user) => (
          <Card 
            key={user.user_uuid}
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => handleUserClick(user)}
          >
            <CardContent className="p-0">
              <div className="aspect-video w-full overflow-hidden rounded-t-lg bg-gray-100 flex items-center justify-center relative">
                <User className="h-16 w-16 text-gray-400" />
                <div className="absolute top-2 right-2 flex gap-1 flex-wrap">
                  {getUserRoleBadges(user)}
                </div>
              </div>
              <div className="p-4 space-y-3">
                <div>
                  <h3 className="font-semibold text-lg line-clamp-1">{`${user.first_name} ${user.last_name}` || 'Unnamed User'}</h3>
                  <p className="text-sm text-[#8E9196] line-clamp-1">{user.email || 'No email'}</p>
                </div>
                
                <div className="space-y-2 text-xs">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-3 w-3 text-[#8E9196]" />
                    <span className="text-[#8E9196]">Created:</span>
                    <span className="font-medium text-xs">{new Date(user.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}
