
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, Users, ExternalLink, DollarSign } from "lucide-react";
import { toStartCase } from "@/lib/utils";
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
        return <Badge variant="default" className="bg-green-100 text-green-800 border-green-200">Active</Badge>;
      case "pending":
        return <Badge variant="outline" className="border-yellow-200 text-yellow-700">Pending</Badge>;
      case "paused":
        return <Badge variant="secondary" className="bg-gray-100 text-gray-600">Paused</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="rounded-lg border border-gray-200 overflow-hidden bg-white shadow-sm">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50/50 hover:bg-gray-50/50">
            <TableHead className="font-semibold text-gray-900 py-4">Product</TableHead>
            <TableHead className="font-semibold text-gray-900">Expert</TableHead>
            <TableHead className="font-semibold text-gray-900">Category</TableHead>
            <TableHead className="text-right font-semibold text-gray-900">Commission</TableHead>
            <TableHead className="text-right font-semibold text-gray-900">Rating</TableHead>
            <TableHead className="text-right font-semibold text-gray-900">Affiliates</TableHead>
            <TableHead className="text-right font-semibold text-gray-900">Potential earnings</TableHead>
            <TableHead className="font-semibold text-gray-900">Status</TableHead>
            <TableHead className="text-right font-semibold text-gray-900">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {offers.map((offer, index) => (
            <TableRow key={offer.id} className="hover:bg-gray-50/30 transition-colors duration-150">
              <TableCell className="py-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg flex items-center justify-center flex-shrink-0 border border-gray-100">
                    <DollarSign className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-semibold text-gray-900 text-sm leading-tight truncate">{offer.title}</div>
                    <div className="text-xs text-gray-500 mt-1 line-clamp-1">{offer.description}</div>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="text-sm font-medium text-gray-700">{offer.partnerName}</div>
              </TableCell>
              <TableCell>
                <Badge variant="outline" className="text-xs border-gray-200 text-gray-600 bg-gray-50">
                  {toStartCase(offer.category)}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="text-sm font-semibold text-green-600">
                  {offer.commissionType === "percentage" 
                    ? `${offer.commissionRate}%` 
                    : `$${offer.commissionRate}`}
                </div>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-1">
                  <Star className="w-3 h-3 text-yellow-500 fill-current" />
                  <span className="text-sm font-medium text-gray-700">{offer.rating}</span>
                </div>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-1">
                  <Users className="w-3 h-3 text-gray-400" />
                  <span className="text-sm text-gray-600">{offer.totalAffiliates}</span>
                </div>
              </TableCell>
              <TableCell className="text-right">
                <div className="text-sm font-semibold text-green-600">
                  ${offer.monthlyEarnings} {offer.category === "product" ? "per transaction" : "per month"}
                </div>
              </TableCell>
              <TableCell>
                {getStatusBadge(offer.status)}
              </TableCell>
              <TableCell className="text-right">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="hover:bg-blue-50 hover:text-blue-600 transition-colors duration-150"
                >
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
