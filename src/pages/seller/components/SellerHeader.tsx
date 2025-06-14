
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPin, Star, Calendar, Edit2, Users, DollarSign } from "lucide-react";
import { EditExpertDialog } from "./EditExpertDialog";
import type { Expert } from "@/types/expert";

interface SellerHeaderProps {
  seller: Expert;
  productsCount: number;
  communitiesCount: number;
  totalEarnings: number;
  onSellerUpdate: (updatedSeller: Expert) => void;
}

export function SellerHeader({ 
  seller, 
  productsCount, 
  communitiesCount, 
  totalEarnings, 
  onSellerUpdate 
}: SellerHeaderProps) {
  const formatEarnings = (amount: number) => {
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`;
    } else if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(1)}k`;
    } else {
      return `$${amount}`;
    }
  };

  return (
    <Card className="mb-8 shadow-sm">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Avatar and basic info */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <Avatar className="h-24 w-24 ring-2 ring-muted">
              <AvatarImage src={seller.thumbnail} alt={seller.name} />
              <AvatarFallback className="text-lg">
                {seller.name?.split(' ').map(n => n[0]).join('') || 'UN'}
              </AvatarFallback>
            </Avatar>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl font-bold">{seller.name}</h1>
                <div className="flex gap-2">
                  {communitiesCount > 0 && (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {communitiesCount} communities
                    </Badge>
                  )}
                  {totalEarnings > 0 && (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <DollarSign className="h-3 w-3" />
                      {formatEarnings(totalEarnings)} earned
                    </Badge>
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
                {seller.title && (
                  <span className="font-medium">{seller.title}</span>
                )}
                {seller.location && (
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    <span>{seller.location}</span>
                  </div>
                )}
              </div>

              {seller.description && (
                <p className="text-muted-foreground max-w-2xl">{seller.description}</p>
              )}
            </div>
          </div>

          {/* Stats and actions */}
          <div className="flex-1 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 min-w-0">
            <div className="flex items-center gap-6 text-sm">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="font-medium">{seller.client_satisfaction}%</span>
              </div>
              
              <div className="text-muted-foreground">
                {seller.completed_projects} projects completed
              </div>
              
              <div className="text-muted-foreground">
                {productsCount} products
              </div>
            </div>

            <EditExpertDialog
              expert={seller}
              onUpdate={onSellerUpdate}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
