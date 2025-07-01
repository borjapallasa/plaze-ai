import React from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, Users, DollarSign, Percent, Tag, User, Handshake } from "lucide-react";
import { toStartCase } from "@/lib/utils";
import { RequestPartnershipDialog } from "./RequestPartnershipDialog";

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
  type?: string;
}

interface AffiliateOfferCardProps {
  offer: AffiliateOffer;
}

export function AffiliateOfferCard({ offer }: AffiliateOfferCardProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge variant="default" className="text-xs px-2 py-1">Active</Badge>;
      case "pending":
        return <Badge variant="outline" className="text-xs px-2 py-1">Pending</Badge>;
      case "paused":
        return <Badge variant="secondary" className="text-xs px-2 py-1">Paused</Badge>;
      default:
        return <Badge variant="secondary" className="text-xs px-2 py-1">{status}</Badge>;
    }
  };

  return (
    <Card className="h-full flex flex-col hover:shadow-lg transition-shadow duration-200">
      <div className="aspect-video bg-gradient-to-br from-blue-50 to-purple-50 rounded-t-lg flex items-center justify-center relative overflow-hidden">
        {offer.thumbnail ? (
          <img
            src={offer.thumbnail}
            alt={offer.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
            <DollarSign className="w-5 h-5 text-blue-600" />
          </div>
        )}
        <div className="absolute top-2 right-2">
          {getStatusBadge(offer.status)}
        </div>
      </div>
      
      <CardContent className="flex-1 p-4 space-y-4">
        {/* Header Section */}
        <div className="space-y-1">
          <h3 className="font-semibold text-lg leading-tight text-gray-900">{offer.title}</h3>
          <div className="flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-gray-500" />
            <p className="text-sm text-gray-600">{offer.partnerName}</p>
          </div>
        </div>
        
        {/* Description */}
        <p className="text-sm text-gray-600 line-clamp-2">{offer.description}</p>
        
        {/* Metrics Row */}
        <div className="grid grid-cols-2 gap-3 py-2">
          <div className="flex items-center gap-1.5">
            <Tag className="w-3.5 h-3.5 text-gray-500" />
            <div className="text-xs">
              <span className="font-medium text-gray-700">Type:</span>
              <span className="text-gray-600 ml-1">{toStartCase(offer.type || offer.category)}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-1.5">
            <Percent className="w-3.5 h-3.5 text-gray-500" />
            <div className="text-xs">
              <span className="font-medium text-gray-700">Commission:</span>
              <span className="text-gray-600 ml-1">
                {offer.commissionType === "percentage" 
                  ? `${offer.commissionRate}%` 
                  : `$${offer.commissionRate}`}
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-1.5">
            <Star className="w-3.5 h-3.5 text-yellow-500 fill-current" />
            <div className="text-xs">
              <span className="font-medium text-gray-700">Rating:</span>
              <span className="text-gray-600 ml-1">{offer.rating}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-gray-500" />
            <div className="text-xs">
              <span className="font-medium text-gray-700">Users:</span>
              <span className="text-gray-600 ml-1">{offer.totalAffiliates}</span>
            </div>
          </div>
        </div>
        
        {/* Earnings - Subtle Integration */}
        <div className="text-center py-2 border-t border-gray-100">
          <div className="text-sm text-gray-600">
            <span>Earnings: </span>
            <span className="font-semibold text-green-600">${offer.monthlyEarnings}</span>
            <span className="text-gray-500 ml-1">
              {(offer.type || offer.category) === "product" ? "per transaction" : "per month"}
            </span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0">
        <RequestPartnershipDialog offer={offer}>
          <Button className="w-full h-11 font-medium">
            <Handshake className="w-4 h-4 mr-2" />
            Request Partnership
          </Button>
        </RequestPartnershipDialog>
      </CardFooter>
    </Card>
  );
}
