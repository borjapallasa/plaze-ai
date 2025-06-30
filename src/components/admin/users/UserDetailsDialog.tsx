
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useUserDetails } from "@/hooks/admin/useUserDetails";
import { useUserTransactions } from "@/hooks/admin/useUserTransactions";
import { Loader2 } from "lucide-react";

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
  user_thumbnail: string;
}

interface UserDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: UserData | null;
}

export function UserDetailsDialog({ open, onOpenChange, user }: UserDetailsDialogProps) {
  const { data: userDetails, isLoading: userLoading } = useUserDetails(user?.user_uuid || '');
  const { transactions, isLoading: transactionsLoading } = useUserTransactions(user?.user_uuid || '');

  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>User Details</DialogTitle>
        </DialogHeader>

        {userLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span className="ml-2">Loading user details...</span>
          </div>
        ) : userDetails ? (
          <div className="space-y-6">
            {/* User Information */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-lg mb-3">User Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Name</p>
                  <p className="font-medium">
                    {userDetails.first_name} {userDetails.last_name}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-medium">{userDetails.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Created At</p>
                  <p className="font-medium">
                    {new Date(userDetails.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Spent</p>
                  <p className="font-medium">${(userDetails.total_spent || 0).toFixed(2)}</p>
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                {userDetails.is_admin && (
                  <Badge variant="secondary">Admin</Badge>
                )}
                {userDetails.is_expert && (
                  <Badge variant="secondary">Expert</Badge>
                )}
                {userDetails.is_affiliate && (
                  <Badge variant="secondary">Affiliate</Badge>
                )}
              </div>
            </div>

            {/* Transactions */}
            <div>
              <h3 className="font-semibold text-lg mb-3">Transaction History</h3>
              {transactionsLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin" />
                  <span className="ml-2">Loading transactions...</span>
                </div>
              ) : transactions && transactions.length > 0 ? (
                <div className="border rounded-lg">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Affiliate Fees</TableHead>
                        <TableHead>Seller</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {transactions.map((transaction) => (
                        <TableRow key={transaction.transaction_uuid}>
                          <TableCell>
                            {new Date(transaction.created_at).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {transaction.type}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            ${(transaction.amount || 0).toFixed(2)}
                          </TableCell>
                          <TableCell>
                            ${(transaction.afiliate_fees || 0).toFixed(2)}
                          </TableCell>
                          <TableCell>
                            {transaction.seller_name || 'Unknown'}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">
                  No transactions found for this user.
                </p>
              )}
            </div>
          </div>
        ) : (
          <p className="text-center py-8">User not found.</p>
        )}
      </DialogContent>
    </Dialog>
  );
}
