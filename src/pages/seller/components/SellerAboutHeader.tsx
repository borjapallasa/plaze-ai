
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { MapPin, Star, Users, Package } from "lucide-react";
import { useExpertReviews } from "@/hooks/expert/useExpertReviews";
import { ChatButton } from "./ChatButton";
import type { Expert } from "@/types/expert";

interface SellerAboutHeaderProps {
  seller: Expert;
  productsCount: number;
  communitiesCount: number;
}

export function SellerAboutHeader({ 
  seller, 
  productsCount, 
  communitiesCount
}: SellerAboutHeaderProps) {
  // Fetch actual reviews to calculate average rating
  const { data: reviews = [] } = useExpertReviews(seller.expert_uuid);

  const getBadgeVariant = (status: string) => {
    switch (status) {
      case 'active':
        return 'default';
      case 'in review':
        return 'secondary';
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
  
  // Calculate satisfaction percentage with granular scaling
  const calculateSatisfactionPercentage = (rating: number): number => {
    if (rating >= 4.5) {
      return 100;
    } else if (rating >= 4.0) {
      return Math.round(90 + ((rating - 4.0) / 0.5) * 10);
    } else if (rating >= 3.0) {
      return Math.round(80 + ((rating - 3.0) / 1.0) * 10);
    } else if (rating >= 2.0) {
      return Math.round(60 + ((rating - 2.0) / 1.0) * 20);
    } else if (rating >= 1.0) {
      return Math.round(40 + ((rating - 1.0) / 1.0) * 20);
    } else {
      return 0;
    }
  };

  const satisfactionPercentage = calculateSatisfactionPercentage(averageRating);

  return (
    <Card className="mb-6 shadow-sm border-0 bg-white">
      <CardContent className="p-6">
        <div className="max-w-6xl mx-auto">
          {/* Desktop Layout */}
          <div className="hidden lg:flex items-start gap-6">
            {/* Main Content Section */}
            <div className="flex items-start gap-4 flex-1">
              {/* Avatar */}
              <div className="w-16 h-16 flex-shrink-0">
                <AspectRatio ratio={1} className="overflow-hidden rounded-full">
                  <Avatar className="h-full w-full border-2 border-gray-100 shadow-md">
                    <AvatarImage 
                      src={seller.thumbnail} 
                      alt={seller.name}
                      className="object-cover"
                    />
                    <AvatarFallback className="text-lg font-bold bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                      {seller.name?.split(' ').map(n => n[0]).join('') || 'UN'}
                    </AvatarFallback>
                  </Avatar>
                </AspectRatio>
              </div>
              
              {/* Name, Title, Location, Description */}
              <div className="flex-1 min-w-0 space-y-2">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h1 className="text-xl font-bold text-gray-900 leading-tight tracking-tight">
                        {seller.name}
                      </h1>
                      <ChatButton 
                        expertUuid={seller.expert_uuid} 
                        expertName={seller.name || "Expert"} 
                      />
                      {seller.status && (
                        <Badge 
                          variant={getBadgeVariant(seller.status)}
                          className="text-xs px-2 py-0.5 capitalize font-medium"
                        >
                          {seller.status}
                        </Badge>
                      )}
                    </div>
                    
                    {/* Category and Location */}
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      {seller.title && (
                        <span className="font-medium text-gray-700">{seller.title}</span>
                      )}
                      {seller.title && seller.location && (
                        <span className="text-gray-400">•</span>
                      )}
                      {seller.location && (
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3 text-gray-400" />
                          <span>{seller.location}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Description */}
                {seller.description && (
                  <div className="max-w-3xl">
                    <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">
                      {seller.description}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Vertical Divider */}
            <Separator orientation="vertical" className="h-20" />

            {/* Stats Section - Stacked Vertically */}
            <div className="flex-shrink-0">
              <div className="flex flex-col gap-3 text-left">
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-semibold">
                    {satisfactionPercentage}% Satisfaction
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-semibold">
                    {communitiesCount} Communities
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-semibold">
                    {productsCount} Products
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile/Tablet Layout */}
          <div className="lg:hidden">
            {/* Avatar and Name Row */}
            <div className="flex items-start gap-3 mb-3">
              <div className="w-14 h-14 flex-shrink-0">
                <AspectRatio ratio={1} className="overflow-hidden rounded-full">
                  <Avatar className="h-full w-full border-2 border-gray-100 shadow-md">
                    <AvatarImage 
                      src={seller.thumbnail} 
                      alt={seller.name}
                      className="object-cover"
                    />
                    <AvatarFallback className="text-base font-bold bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                      {seller.name?.split(' ').map(n => n[0]).join('') || 'UN'}
                    </AvatarFallback>
                  </Avatar>
                </AspectRatio>
              </div>
              
              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-lg font-bold text-gray-900 leading-tight tracking-tight">
                    {seller.name}
                  </h1>
                  <ChatButton 
                    expertUuid={seller.expert_uuid} 
                    expertName={seller.name || "Expert"} 
                  />
                  {seller.status && (
                    <Badge 
                      variant={getBadgeVariant(seller.status)}
                      className="text-xs px-2 py-0.5 capitalize"
                    >
                      {seller.status}
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 flex-wrap">
                  {seller.title && <span className="font-medium text-gray-700">{seller.title}</span>}
                  {seller.title && seller.location && <span className="text-gray-400">•</span>}
                  {seller.location && (
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-gray-400" />
                      <span>{seller.location}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Description */}
            {seller.description && (
              <div className="mb-3">
                <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">
                  {seller.description}
                </p>
              </div>
            )}

            {/* Stats Row with separators for mobile */}
            <div className="flex items-center gap-3 overflow-x-auto pb-2 mb-3">
              <div className="flex items-center gap-2 flex-shrink-0">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-semibold">
                  {satisfactionPercentage}%
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
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
