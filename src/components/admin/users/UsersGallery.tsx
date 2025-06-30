import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

interface UserData {
  user_uuid: string;
  first_name: string;
  last_name: string;
  email: string;
  is_admin: boolean;
  is_affiliate: boolean;
  is_expert: boolean;
  created_at: string;
  transaction_count: number;
  product_count: number;
  total_spent: number;
  total_sales_amount: number;
  user_thumbnail: string;
}

interface UsersGalleryProps {
  users: UserData[];
  onUserClick: (user: UserData) => void;
  onLoadMore: () => void;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
}

export function UsersGallery({ 
  users, 
  onUserClick, 
  onLoadMore, 
  hasNextPage, 
  isFetchingNextPage 
}: UsersGalleryProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {users.map((user) => (
        <div 
          key={user.user_uuid}
          className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow duration-300"
          onClick={() => onUserClick(user)}
        >
          <div className="p-4">
            <div className="flex items-center space-x-4">
              <Avatar>
                <AvatarImage src={user.user_thumbnail} alt={user.first_name} />
                <AvatarFallback>{user.first_name[0]}{user.last_name[0]}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-lg font-semibold">{user.first_name} {user.last_name}</h3>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>
            </div>
            <div className="mt-2">
              <p className="text-sm text-gray-600">Transactions: {user.transaction_count}</p>
              <p className="text-sm text-gray-600">Total Spent: ${user.total_spent}</p>
            </div>
          </div>
        </div>
      ))}
      {hasNextPage && (
        <Button onClick={onLoadMore} disabled={isFetchingNextPage}>
          {isFetchingNextPage ? "Loading more..." : "Load More"}
        </Button>
      )}
    </div>
  );
}
