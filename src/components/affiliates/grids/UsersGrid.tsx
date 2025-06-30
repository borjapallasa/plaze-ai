
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mail, Calendar, DollarSign, Users } from "lucide-react";

interface AffiliateUser {
  id: string;
  name: string;
  email: string;
  status: "active" | "inactive" | "pending";
  joinDate: string;
  totalSales: number;
  commissionEarned: number;
  referrals: number;
}

interface UsersGridProps {
  users: AffiliateUser[];
}

export function UsersGrid({ users }: UsersGridProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge variant="default">Active</Badge>;
      case "inactive":
        return <Badge variant="secondary">Inactive</Badge>;
      case "pending":
        return <Badge variant="outline">Pending</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {users.map((user) => (
        <Card key={user.id} className="hover:shadow-lg transition-shadow">
          <CardContent className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold truncate">{user.name}</h3>
              {getStatusBadge(user.status)}
            </div>
            
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Mail className="h-3 w-3" />
              <span className="truncate">{user.email}</span>
            </div>
            
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-3 w-3" />
              <span>{new Date(user.joinDate).toLocaleDateString()}</span>
            </div>
            
            <div className="space-y-2 pt-2 border-t">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Total Sales</span>
                <span className="font-mono">${user.totalSales.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Commission</span>
                <span className="font-mono">${user.commissionEarned.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Referrals</span>
                <span>{user.referrals}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
