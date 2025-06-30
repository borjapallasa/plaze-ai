
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, Users, ExternalLink, DollarSign } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface AffiliateOffer {
  id: string;
  title: string;
  description: string;
  category: string;
  commissionRate: number;
  commissionType: "percentage" | "fixed";
  rating: number;
  totalAffiliates: number;
  monthlyEarnings: number;
  thumbnail: string;
  status: "active" | "pending" | "paused";
  partnerName: string;
}

interface AffiliateOffersListProps {
  offers: AffiliateOffer[];
}

export function AffiliateOffersList({ offers }: AffiliateOffersListProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge variant="default">Active</Badge>;
      case "pending":
        return <Badge variant="outline">Pending</Badge>;
      case "paused":
        return <Badge variant="secondary">Paused</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Offer</TableHead>
            <TableHead>Partner</TableHead>
            <TableHead>Category</TableHead>
            <TableHead className="text-right">Commission</TableHead>
            <TableHead className="text-right">Rating</TableHead>
            <TableHead className="text-right">Affiliates</TableHead>
            <TableHead className="text-right">Monthly Earnings</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {offers.map((offer) => (
            <TableRow key={offer.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-medium">{offer.title}</div>
                    <div className="text-sm text-muted-foreground line-clamp-1">{offer.description}</div>
                  </div>
                </div>
              </TableCell>
              <TableCell>{offer.partnerName}</TableCell>
              <TableCell>
                <Badge variant="outline">{offer.category}</Badge>
              </TableCell>
              <TableCell className="text-right">
                {offer.commissionType === "percentage" 
                  ? `${offer.commissionRate}%` 
                  : `$${offer.commissionRate}`}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-1">
                  <Star className="w-3 h-3 text-yellow-500 fill-current" />
                  <span>{offer.rating}</span>
                </div>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-1">
                  <Users className="w-3 h-3 text-muted-foreground" />
                  <span>{offer.totalAffiliates}</span>
                </div>
              </TableCell>
              <TableCell className="text-right font-mono text-green-600">
                ${offer.monthlyEarnings}
              </TableCell>
              <TableCell>{getStatusBadge(offer.status)}</TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="sm">
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
