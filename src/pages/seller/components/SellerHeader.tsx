
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { MapPin, Star, Users, Package, Edit2 } from "lucide-react";
import { EditExpertDialog } from "./EditExpertDialog";
import { EditExpertStatusDialog } from "./EditExpertStatusDialog";
import { useExpertReviews } from "@/hooks/expert/useExpertReviews";
import type { Expert } from "@/types/expert";

interface SellerHeaderProps {
  seller: Expert;
  productsCount: number;
  communitiesCount: number;
  totalEarnings: number;
  onSellerUpdate: (updatedSeller: Expert) => void;
  isAdminView?: boolean;
}

export function SellerHeader({ 
  seller, 
  productsCount, 
  communitiesCount, 
  totalEarnings, 
  onSellerUpdate,
  isAdminView = false
}: SellerHeaderProps) {
  // Fetch actual reviews to calculate average rating
  const { data: reviews = [] } = useExpertReviews(seller.expert_uuid);

  const getBadgeVariant = (status: string) => {
    switch (status) {
      case 'active':
        return 'default';
      case 'in review':
        return 'warning';
      case 'suspended':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  // Calculate actual average rating from reviews
  const averageRating = reviews.length > 0 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
    : 0;
  
  // Calculate satisfaction percentage (100% if rating is 4.5+)
  const satisfactionPercentage = averageRating >= 4.5 ? 100 : Math.round((averageRating / 5) * 100);

  return (
    <Card className="mb-8 shadow-sm">
      <CardContent className="p-6">
        <div className="max-w-6xl mx-auto">
          {/* Desktop Layout */}
          <div className="hidden lg:flex items-start gap-6">
            {/* Main Content Section */}
            <div className="flex items-start gap-4 flex-1">
              {/* Avatar */}
              <div className="w-16 h-16 flex-shrink-0">
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
              
              {/* Name, Title, Location, Description */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <h1 className="text-3xl font-bold text-foreground leading-tight">
                      {seller.name}
                    </h1>
                    {seller.status && (
                      <Badge 
                        variant={getBadgeVariant(seller.status)}
                        className="text-xs px-2 py-1 capitalize"
                      >
                        {seller.status}
                      </Badge>
                    )}
                  </div>
                  {isAdminView ? (
                    <EditExpertStatusDialog
                      expert={seller}
                      onUpdate={onSellerUpdate}
                      trigger={
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex items-center gap-2"
                        >
                          <Edit2 className="h-4 w-4" />
                          Edit Status
                        </Button>
                      }
                    />
                  ) : (
                    <EditExpertDialog
                      expert={seller}
                      onUpdate={onSellerUpdate}
                      trigger={
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex items-center gap-2"
                        >
                          <Edit2 className="h-4 w-4" />
                          Edit Profile
                        </Button>
                      }
                    />
                  )}
                </div>
                
                {/* Role & Location */}
                <div className="flex items-center gap-3 text-sm text-muted-foreground mb-3">
                  {seller.title && <span className="font-medium">{seller.title}</span>}
                  {seller.title && seller.location && <span>•</span>}
                  {seller.location && (
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      <span>{seller.location}</span>
                    </div>
                  )}
                </div>
                
                {/* Description */}
                {seller.description && (
                  <p className="text-base text-muted-foreground leading-relaxed">
                    {seller.description}
                  </p>
                )}
              </div>
            </div>

            {/* Vertical Divider */}
            <Separator orientation="vertical" className="h-32" />

            {/* Stats Section - Stacked Vertically */}
            <div className="flex-shrink-0">
              <div className="flex flex-col gap-4 text-left">
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-semibold">
                    {averageRating > 0 ? averageRating.toFixed(1) : '0.0'} avg rating ({satisfactionPercentage}%)
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-semibold">
                    {communitiesCount} communities
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-semibold">
                    {productsCount} products
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile/Tablet Layout */}
          <div className="lg:hidden">
            {/* Avatar and Name Row */}
            <div className="flex items-start gap-4 mb-4">
              <div className="w-14 h-14 flex-shrink-0">
                <AspectRatio ratio={1} className="overflow-hidden rounded-full">
                  <Avatar className="h-full w-full">
                    <AvatarImage 
                      src={seller.thumbnail} 
                      alt={seller.name}
                      className="object-cover"
                    />
                    <AvatarFallback className="text-sm font-semibold">
                      {seller.name?.split(' ').map(n => n[0]).join('') || 'UN'}
                    </AvatarFallback>
                  </Avatar>
                </AspectRatio>
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="text-2xl font-bold text-foreground leading-tight">
                    {seller.name}
                  </h1>
                  {seller.status && (
                    <Badge 
                      variant={getBadgeVariant(seller.status)}
                      className="text-xs px-2 py-1 capitalize"
                    >
                      {seller.status}
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  {seller.title && <span className="font-medium">{seller.title}</span>}
                  {seller.title && seller.location && <span>•</span>}
                  {seller.location && (
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      <span>{seller.location}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Description */}
            {seller.description && (
              <p className="text-base text-muted-foreground leading-relaxed mb-4">
                {seller.description}
              </p>
            )}

            {/* Stats Row with separators for mobile */}
            <div className="flex items-center gap-3 overflow-x-auto pb-2 mb-4">
              <div className="flex items-center gap-2 flex-shrink-0">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-semibold">
                  {averageRating > 0 ? averageRating.toFixed(1) : '0.0'}
                </span>
              </div>

              <Separator orientation="vertical" className="h-4" />

              <div className="flex items-center gap-2 flex-shrink-0">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-semibold">
                  {communitiesCount}
                </span>
              </div>

              <Separator orientation="vertical" className="h-4" />

              <div className="flex items-center gap-2 flex-shrink-0">
                <Package className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-semibold">
                  {productsCount}
                </span>
              </div>
            </div>

            {/* Edit Button */}
            {isAdminView ? (
              <EditExpertStatusDialog
                expert={seller}
                onUpdate={onSellerUpdate}
                trigger={
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full flex items-center justify-center gap-2"
                  >
                    <Edit2 className="h-4 w-4" />
                    Edit Status
                  </Button>
                }
              />
            ) : (
              <EditExpertDialog
                expert={seller}
                onUpdate={onSellerUpdate}
                trigger={
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full flex items-center justify-center gap-2"
                  >
                    <Edit2 className="h-4 w-4" />
                    Edit Profile
                  </Button>
                }
              />
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
