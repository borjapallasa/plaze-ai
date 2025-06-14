
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { MapPin, Star, Briefcase, Package, Users, Edit2 } from "lucide-react";
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
  return (
    <Card className="mb-8 shadow-sm">
      <CardContent className="p-8">
        <div className="max-w-6xl mx-auto">
          {/* Main container with two sections */}
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-12">
            
            {/* Group A (Left): Profile Information */}
            <div className="flex items-start gap-4 flex-1">
              {/* Avatar */}
              <div className="w-20 h-20 flex-shrink-0">
                <AspectRatio ratio={1} className="overflow-hidden rounded-full">
                  <Avatar className="h-full w-full">
                    <AvatarImage 
                      src={seller.thumbnail} 
                      alt={seller.name}
                      className="object-cover"
                    />
                    <AvatarFallback className="text-lg font-semibold">
                      {seller.name?.split(' ').map(n => n[0]).join('') || 'UN'}
                    </AvatarFallback>
                  </Avatar>
                </AspectRatio>
              </div>
              
              {/* Profile Text Block */}
              <div className="flex-1 min-w-0">
                {/* Name */}
                <h1 className="text-3xl font-bold text-foreground mb-2 leading-tight">
                  {seller.name}
                </h1>
                
                {/* Role & Location Line */}
                <div className="flex items-center gap-3 mb-2 text-sm font-medium text-muted-foreground uppercase tracking-wide">
                  {seller.title && (
                    <span>{seller.title}</span>
                  )}
                  {seller.title && seller.location && (
                    <span className="text-muted-foreground/60">•</span>
                  )}
                  {seller.location && (
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" aria-hidden="true" />
                      <span>{seller.location}</span>
                    </div>
                  )}
                </div>

                {/* Description */}
                {seller.description && (
                  <p className="text-base font-medium text-muted-foreground leading-relaxed max-w-2xl">
                    {seller.description}
                  </p>
                )}
              </div>
            </div>

            {/* Group B (Right): Stats & CTA */}
            <div className="flex flex-col lg:flex-row lg:items-center gap-6">
              
              {/* Inline Stats Row */}
              <div className="flex flex-wrap lg:flex-nowrap items-center gap-6 md:gap-8">
                
                {/* Client Satisfaction */}
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" aria-hidden="true" />
                  <span className="text-sm font-semibold text-foreground">
                    {seller.client_satisfaction}%
                  </span>
                  <span className="sr-only">client satisfaction rate</span>
                </div>

                {/* Completed Projects */}
                <div className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                  <span className="text-sm font-semibold text-foreground">
                    {seller.completed_projects}
                  </span>
                  <span className="sr-only">completed projects</span>
                </div>

                {/* Products Count */}
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                  <span className="text-sm font-semibold text-foreground">
                    {productsCount}
                  </span>
                  <span className="sr-only">products</span>
                </div>

                {/* Communities Count */}
                {communitiesCount > 0 && (
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                    <span className="text-sm font-semibold text-foreground">
                      {communitiesCount}
                    </span>
                    <span className="sr-only">communities</span>
                  </div>
                )}
              </div>

              {/* Edit Profile Button */}
              <EditExpertDialog
                expert={seller}
                onUpdate={onSellerUpdate}
                trigger={
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex items-center gap-2 whitespace-nowrap"
                  >
                    <Edit2 className="h-4 w-4" aria-hidden="true" />
                    Edit Profile
                  </Button>
                }
              />
            </div>
          </div>

          {/* Responsive Layout for Mobile */}
          <div className="block md:hidden mt-6">
            {/* Stats Row - Horizontally Scrollable on Mobile */}
            <div className="flex items-center gap-6 overflow-x-auto pb-2 mb-4 scrollbar-hide">
              <div className="flex items-center gap-2 flex-shrink-0">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" aria-hidden="true" />
                <span className="text-sm font-semibold text-foreground">
                  {seller.client_satisfaction}%
                </span>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <Briefcase className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                <span className="text-sm font-semibold text-foreground">
                  {seller.completed_projects}
                </span>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <Package className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                <span className="text-sm font-semibold text-foreground">
                  {productsCount}
                </span>
              </div>

              {communitiesCount > 0 && (
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Users className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                  <span className="text-sm font-semibold text-foreground">
                    {communitiesCount}
                  </span>
                </div>
              )}
            </div>

            {/* Full-width Edit Button on Mobile */}
            <EditExpertDialog
              expert={seller}
              onUpdate={onSellerUpdate}
              trigger={
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full flex items-center justify-center gap-2"
                >
                  <Edit2 className="h-4 w-4" aria-hidden="true" />
                  Edit Profile
                </Button>
              }
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
