
import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Mail } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AffiliateLayoutSwitcher } from "../AffiliateLayoutSwitcher";
import { UsersGrid } from "../grids/UsersGrid";

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

const mockUsers: AffiliateUser[] = [
  {
    id: "1",
    name: "John Smith",
    email: "john@example.com",
    status: "active",
    joinDate: "2024-01-15",
    totalSales: 15420.50,
    commissionEarned: 1542.05,
    referrals: 23
  },
  {
    id: "2",
    name: "Sarah Johnson",
    email: "sarah@example.com",
    status: "active",
    joinDate: "2024-02-20",
    totalSales: 8750.00,
    commissionEarned: 875.00,
    referrals: 12
  },
  {
    id: "3",
    name: "Mike Wilson",
    email: "mike@example.com",
    status: "pending",
    joinDate: "2024-06-10",
    totalSales: 0,
    commissionEarned: 0,
    referrals: 0
  },
  {
    id: "4",
    name: "Emma Davis",
    email: "emma@example.com",
    status: "inactive",
    joinDate: "2023-11-05",
    totalSales: 3200.00,
    commissionEarned: 320.00,
    referrals: 5
  }
];

export function UsersTab() {
  const [layout, setLayout] = useState<"table" | "grid">("table");

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
    <div className="space-y-4">
      <div className="flex justify-end">
        <AffiliateLayoutSwitcher layout={layout} onLayoutChange={setLayout} />
      </div>

      {layout === "table" ? (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Join Date</TableHead>
                <TableHead className="text-right">Total Sales</TableHead>
                <TableHead className="text-right">Commission Earned</TableHead>
                <TableHead className="text-right">Referrals</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div>
                        <div className="font-medium">{user.name}</div>
                        <div className="text-sm text-muted-foreground flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(user.status)}</TableCell>
                  <TableCell>{new Date(user.joinDate).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right font-mono">
                    ${user.totalSales.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    ${user.commissionEarned.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right">{user.referrals}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <UsersGrid users={mockUsers} />
      )}
    </div>
  );
}
