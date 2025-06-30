import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Mail } from "lucide-react";

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

interface UsersTableProps {
  users: UserData[];
  onSort?: (field: string) => void;
  sortBy?: keyof UserData;
  sortOrder?: "asc" | "desc";
  onUserClick: (user: UserData) => void;
  onLoadMore: () => void;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
}

export function UsersTable({ 
  users, 
  onSort, 
  sortBy, 
  sortOrder, 
  onUserClick, 
  onLoadMore, 
  hasNextPage, 
  isFetchingNextPage 
}: UsersTableProps) {
  const getStatusBadges = (user: UserData) => {
    const badges = [];
    if (user.is_admin) badges.push(<Badge key="admin" variant="secondary">Admin</Badge>);
    if (user.is_expert) badges.push(<Badge key="expert" variant="default">Expert</Badge>);
    if (user.is_affiliate) badges.push(<Badge key="affiliate" variant="outline">Affiliate</Badge>);
    if (badges.length === 0) badges.push(<Badge key="user" variant="secondary">User</Badge>);
    return badges;
  };

  const handleSort = (field: string) => {
    if (onSort) {
      onSort(field);
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Join Date</TableHead>
            <TableHead className="text-right">Total Spent</TableHead>
            <TableHead className="text-right">Total Sales</TableHead>
            <TableHead className="text-right">Products</TableHead>
            <TableHead className="text-right">Transactions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.user_uuid} className="cursor-pointer hover:bg-muted/50" onClick={() => onUserClick(user)}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={user.user_thumbnail} alt={user.first_name} />
                    <AvatarFallback>{user.first_name?.charAt(0)}{user.last_name?.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{user.first_name} {user.last_name}</div>
                    <div className="text-sm text-muted-foreground flex items-center gap-1">
                      <Mail className="h-3 w-3" />
                      {user.email}
                    </div>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex gap-1 flex-wrap">
                  {getStatusBadges(user)}
                </div>
              </TableCell>
              <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
              <TableCell className="text-right font-mono">${user.total_spent?.toLocaleString()}</TableCell>
              <TableCell className="text-right font-mono">${user.total_sales_amount?.toLocaleString()}</TableCell>
              <TableCell className="text-right">{user.product_count}</TableCell>
              <TableCell className="text-right">{user.transaction_count}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
