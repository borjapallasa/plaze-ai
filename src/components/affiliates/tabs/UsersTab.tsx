
import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Mail } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { AffiliateDetailsDialog } from "../AffiliateDetailsDialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface AffiliateUser {
  user_uuid: string;
  first_name: string;
  last_name: string;
  email: string;
  created_at: string;
  total_spent: number;
  affiliate_fees_amount: number;
  transaction_count: number;
  is_affiliate: boolean;
  is_admin: boolean;
  is_expert: boolean;
}

export function UsersTab() {
  const { user } = useAuth();
  const [selectedUser, setSelectedUser] = useState<AffiliateUser | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: users = [], isLoading, error } = useQuery({
    queryKey: ['affiliate-referred-users', user?.id],
    queryFn: async () => {
      if (!user?.id) {
        throw new Error('No authenticated user');
      }

      console.log('Fetching referred users for user:', user.id);
      
      // First, get the current user's affiliate code
      const { data: affiliateData, error: affiliateError } = await supabase
        .from('affiliates')
        .select('affiliate_code')
        .eq('user_uuid', user.id)
        .maybeSingle();

      if (affiliateError) {
        console.error('Error fetching affiliate data:', affiliateError);
        throw affiliateError;
      }

      if (!affiliateData?.affiliate_code) {
        console.log('No affiliate code found for user');
        return [];
      }

      console.log('Found affiliate code:', affiliateData.affiliate_code);

      // Then, get users who have this affiliate code as their referral code
      const { data: usersData, error: usersError } = await supabase
        .from('users')
        .select(`
          user_uuid,
          first_name,
          last_name,
          email,
          created_at,
          total_spent,
          affiliate_fees_amount,
          transaction_count,
          is_affiliate,
          is_admin,
          is_expert
        `)
        .eq('referral_affiliate_code', affiliateData.affiliate_code)
        .order('created_at', { ascending: false });

      if (usersError) {
        console.error('Error fetching referred users:', usersError);
        throw usersError;
      }

      console.log('Found referred users:', usersData);
      return usersData || [];
    },
    enabled: !!user?.id,
  });

  const getStatusBadges = (user: AffiliateUser) => {
    const badges = [];
    if (user.is_admin) badges.push(<Badge key="admin" variant="secondary">Admin</Badge>);
    if (user.is_expert) badges.push(<Badge key="expert" variant="default">Expert</Badge>);
    if (user.is_affiliate) badges.push(<Badge key="affiliate" variant="outline">Affiliate</Badge>);
    if (badges.length === 0) badges.push(<Badge key="user" variant="secondary">User</Badge>);
    return badges;
  };

  const getUserStatus = (user: AffiliateUser) => {
    if (user.is_admin) return "Admin";
    if (user.is_expert) return "Expert";
    if (user.is_affiliate) return "Affiliate";
    return "User";
  };

  const transformUserForDialog = (user: AffiliateUser) => {
    return {
      name: user.first_name && user.last_name 
        ? `${user.first_name} ${user.last_name}` 
        : 'Unnamed User',
      status: getUserStatus(user),
      activeTemplates: user.transaction_count || 0,
      totalSales: `$${(user.total_spent || 0).toLocaleString()}`,
      affiliateFees: `$${(user.affiliate_fees_amount || 0).toLocaleString()}`,
    };
  };

  const handleUserClick = (user: AffiliateUser) => {
    setSelectedUser(user);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedUser(null);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-muted-foreground">Loading referred users...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-red-500">Error loading users: {error.message}</div>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-muted-foreground">No referred users found</div>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Join Date</TableHead>
              <TableHead className="text-right">Total Spent</TableHead>
              <TableHead className="text-right">Commission Earned</TableHead>
              <TableHead className="text-right">Transactions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow 
                key={user.user_uuid}
                className="cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => handleUserClick(user)}
              >
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div>
                      <div className="font-medium">
                        {user.first_name && user.last_name 
                          ? `${user.first_name} ${user.last_name}` 
                          : 'Unnamed User'}
                      </div>
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
                <TableCell className="text-right font-mono">
                  ${(user.total_spent || 0).toLocaleString()}
                </TableCell>
                <TableCell className="text-right font-mono">
                  ${(user.affiliate_fees_amount || 0).toLocaleString()}
                </TableCell>
                <TableCell className="text-right">{user.transaction_count || 0}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {selectedUser && (
        <AffiliateDetailsDialog
          isOpen={isDialogOpen}
          onClose={handleCloseDialog}
          affiliate={transformUserForDialog(selectedUser)}
        />
      )}
    </>
  );
}
