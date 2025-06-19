
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { User, Calendar, DollarSign } from "lucide-react";

interface UserData {
  user_uuid: string;
  email: string;
  first_name: string;
  last_name: string;
  created_at: string;
  is_expert: boolean;
  is_affiliate: boolean;
  is_admin: boolean;
  total_spent: number;
  total_sales_amount: number;
  user_thumbnail?: string;
}

interface UsersListProps {
  users: UserData[];
  sortField: keyof UserData;
  sortDirection: "asc" | "desc";
  onSort: (field: keyof UserData) => void;
}

export function UsersList({ users }: UsersListProps) {
  const navigate = useNavigate();

  const getUserRoleBadges = (user: UserData) => {
    const badges = [];
    if (user.is_admin) badges.push(<Badge key="admin" variant="secondary" className="bg-purple-100 text-purple-800">Admin</Badge>);
    if (user.is_expert) badges.push(<Badge key="expert" variant="secondary" className="bg-blue-100 text-blue-800">Expert</Badge>);
    if (user.is_affiliate) badges.push(<Badge key="affiliate" variant="secondary" className="bg-green-100 text-green-800">Affiliate</Badge>);
    return badges;
  };

  const handleUserClick = (userUuid: string) => {
    navigate(`/admin/users/user/${userUuid}`);
  };

  return (
    <div className="space-y-6">
      {users.length === 0 ? (
        <div className="text-center py-8 text-[#8E9196]">
          No users found matching your criteria
        </div>
      ) : (
        users.map((user) => (
          <Card 
            key={user.user_uuid}
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => handleUserClick(user.user_uuid)}
          >
            <CardContent className="p-6">
              <div className="flex gap-6">
                <div className="w-32 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
                  {user.user_thumbnail ? (
                    <img
                      src={user.user_thumbnail}
                      alt={`${user.first_name} ${user.last_name}` || 'User'}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="h-12 w-12 text-gray-400" />
                  )}
                </div>
                
                <div className="flex-1 space-y-3">
                  <div>
                    <h3 className="font-semibold text-xl mb-1">{`${user.first_name} ${user.last_name}` || 'Unnamed User'}</h3>
                    <p className="text-lg text-[#8E9196] mb-2">{user.email || 'No email'}</p>
                  </div>
                  
                  <div className="flex flex-wrap gap-6 text-sm">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-[#8E9196]" />
                      <span className="text-[#8E9196]">Spent:</span>
                      <span className="font-medium">${(user.total_spent || 0).toFixed(2)}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-[#8E9196]" />
                      <span className="text-[#8E9196]">Sales:</span>
                      <span className="font-medium">${(user.total_sales_amount || 0).toFixed(2)}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-[#8E9196]" />
                      <span className="text-[#8E9196]">Created:</span>
                      <span className="font-medium">{new Date(user.created_at).toLocaleString()}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                      {getUserRoleBadges(user)}
                    </div>
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
