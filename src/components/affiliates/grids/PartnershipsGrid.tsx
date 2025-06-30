
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, DollarSign, Package, Mail } from "lucide-react";

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

interface PartnershipsGridProps {
  partnerships: Partnership[];
}

export function PartnershipsGrid({ partnerships }: PartnershipsGridProps) {
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {partnerships.map((partnership) => (
        <Card key={partnership.id} className="hover:shadow-lg transition-shadow">
          <CardContent className="p-4 space-y-3">
            <div className="space-y-2">
              <h3 className="font-semibold truncate">{partnership.partnerName}</h3>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-3 w-3" />
                <span className="truncate">{partnership.partnerEmail}</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              {getTypeBadge(partnership.partnershipType)}
              {getStatusBadge(partnership.status)}
            </div>
            
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-3 w-3" />
              <span>{new Date(partnership.startDate).toLocaleDateString()}</span>
            </div>
            
            <div className="space-y-2 pt-2 border-t">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Commission Rate</span>
                <span>{(partnership.commissionRate * 100).toFixed(0)}%</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Revenue</span>
                <span className="font-mono">${partnership.revenueGenerated.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Products</span>
                <span>{partnership.productsCount}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
