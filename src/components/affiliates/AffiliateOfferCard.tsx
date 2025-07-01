
import React from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, ExternalLink, Users, DollarSign } from "lucide-react";

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

interface AffiliateOfferCardProps {
  offer: AffiliateOffer;
}

export function AffiliateOfferCard({ offer }: AffiliateOfferCardProps) {
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
    <Card className="h-full flex flex-col hover:shadow-lg transition-shadow duration-200">
      <div className="aspect-video bg-gradient-to-br from-blue-50 to-purple-50 rounded-t-lg flex items-center justify-center relative">
        <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center shadow-sm">
          <DollarSign className="w-8 h-8 text-blue-600" />
        </div>
        <div className="absolute top-2 right-2">
          {getStatusBadge(offer.status)}
        </div>
      </div>
      
      <CardContent className="flex-1 p-4 space-y-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="font-semibold text-lg leading-tight">{offer.title}</h3>
            <p className="text-sm text-muted-foreground">{offer.partnerName}</p>
          </div>
        </div>
        
        <p className="text-sm text-muted-foreground line-clamp-2">{offer.description}</p>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Commission</span>
            <span className="font-medium">
              {offer.commissionType === "percentage" 
                ? `${offer.commissionRate}%` 
                : `$${offer.commissionRate}`}
            </span>
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3 text-yellow-500 fill-current" />
              <span>{offer.rating}</span>
            </div>
            <div className="flex items-center gap-1 text-muted-foreground">
              <Users className="w-3 h-3" />
              <span>{offer.totalAffiliates}</span>
            </div>
          </div>
          
          <div className="text-sm">
            <span className="text-muted-foreground">Potential earnings: </span>
            <span className="font-medium text-green-600">
              ${offer.monthlyEarnings} {offer.category === "product" ? "per transaction" : "per month"}
            </span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0">
        <Button className="w-full" size="sm">
          <ExternalLink className="w-4 h-4 mr-2" />
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
}
