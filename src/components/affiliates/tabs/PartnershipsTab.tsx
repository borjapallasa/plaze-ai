
import React from "react";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Partnership {
  id: string;
  partnerName: string;
  partnerEmail: string;
  partnershipType: "standard" | "premium" | "enterprise";
  commissionRate: number;
  startDate: string;
  status: "active" | "inactive" | "pending";
  revenueGenerated: number;
  productsCount: number;
}

const mockPartnerships: Partnership[] = [
  {
    id: "1",
    partnerName: "TechCorp Solutions",
    partnerEmail: "partnerships@techcorp.com",
    partnershipType: "enterprise",
    commissionRate: 0.20,
    startDate: "2024-01-01",
    status: "active",
    revenueGenerated: 45000.00,
    productsCount: 15
  },
  {
    id: "2",
    partnerName: "Digital Marketing Pro",
    partnerEmail: "hello@digitalmarketingpro.com",
    partnershipType: "premium",
    commissionRate: 0.15,
    startDate: "2024-03-15",
    status: "active",
    revenueGenerated: 28500.00,
    productsCount: 8
  },
  {
    id: "3",
    partnerName: "StartupHub",
    partnerEmail: "partners@startuphub.io",
    partnershipType: "standard",
    commissionRate: 0.10,
    startDate: "2024-05-20",
    status: "pending",
    revenueGenerated: 0,
    productsCount: 0
  },
  {
    id: "4",
    partnerName: "Creative Agency",
    partnerEmail: "info@creativeagency.com",
    partnershipType: "premium",
    commissionRate: 0.12,
    startDate: "2023-12-10",
    status: "inactive",
    revenueGenerated: 12300.00,
    productsCount: 5
  }
];

export function PartnershipsTab() {
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

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "enterprise":
        return <Badge variant="default">Enterprise</Badge>;
      case "premium":
        return <Badge variant="secondary">Premium</Badge>;
      case "standard":
        return <Badge variant="outline">Standard</Badge>;
      default:
        return <Badge variant="secondary">{type}</Badge>;
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Partner</TableHead>
            <TableHead>Type</TableHead>
            <TableHead className="text-right">Commission Rate</TableHead>
            <TableHead>Start Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Revenue</TableHead>
            <TableHead className="text-right">Products</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {mockPartnerships.map((partnership) => (
            <TableRow key={partnership.id}>
              <TableCell>
                <div>
                  <div className="font-medium">{partnership.partnerName}</div>
                  <div className="text-sm text-muted-foreground">{partnership.partnerEmail}</div>
                </div>
              </TableCell>
              <TableCell>{getTypeBadge(partnership.partnershipType)}</TableCell>
              <TableCell className="text-right">
                {(partnership.commissionRate * 100).toFixed(0)}%
              </TableCell>
              <TableCell>{new Date(partnership.startDate).toLocaleDateString()}</TableCell>
              <TableCell>{getStatusBadge(partnership.status)}</TableCell>
              <TableCell className="text-right font-mono">
                ${partnership.revenueGenerated.toLocaleString()}
              </TableCell>
              <TableCell className="text-right">{partnership.productsCount}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
