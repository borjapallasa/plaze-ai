
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge as UIBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge, Star, ShoppingBag, Users, Calendar, Edit } from "lucide-react";
import type { Expert } from "@/types/expert";
import { useAuth } from "@/lib/auth";
import { EditExpertDialog } from "./EditExpertDialog";

interface SellerHeaderProps {
  seller: Expert;
  productsCount: number;
  onSellerUpdate?: (updatedSeller: Expert) => void;
}

export function SellerHeader({ seller, productsCount, onSellerUpdate }: SellerHeaderProps) {
  const { user } = useAuth();
  const isCurrentUserExpert = user?.id === seller.user_uuid;
  
  const handleExpertUpdate = (updatedExpert: Expert) => {
    if (onSellerUpdate) {
      onSellerUpdate(updatedExpert);
    }
  };

  const avatarUrl = seller.thumbnail || 
    (seller.user_uuid ? `https://api.dicebear.com/7.x/avataaars/svg?seed=${seller.user_uuid}` : 
    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e");

  return (
    <div className="mb-8">
      <Card className="border shadow-sm bg-card">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-6 items-start">
            {/* Avatar Section */}
            <div className="flex-shrink-0">
              <div className="relative">
                <Avatar className="h-20 w-20 border-2 border-border">
                  <AvatarImage 
                    src={avatarUrl}
                    className="object-cover"
                  />
                  <AvatarFallback className="text-xl font-semibold">
                    {seller.name?.[0] || 'S'}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-1 -right-1">
                  <UIBadge className="bg-primary text-primary-foreground text-xs px-2 py-0.5">
                    <Badge className="w-3 h-3 mr-1" />
                    Pro
                  </UIBadge>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 space-y-4">
              {/* Name and Title */}
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
                    {seller?.name || "Expert"}
                  </h1>
                  <UIBadge variant="outline" className="text-xs">
                    Verified Expert
                  </UIBadge>
                  {isCurrentUserExpert && (
                    <EditExpertDialog expert={seller} onUpdate={handleExpertUpdate}>
                      <Button variant="outline" size="sm" className="ml-auto">
                        <Edit className="w-4 h-4 mr-2" />
                        Edit Profile
                      </Button>
                    </EditExpertDialog>
                  )}
                </div>
                <p className="text-muted-foreground">
                  {seller?.title || "Expert in UI/UX Design & Development"}
                </p>
              </div>

              {/* Stats Row */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  <span className="font-medium text-foreground">4.9</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <ShoppingBag className="w-4 h-4 text-blue-500" />
                  <span className="font-medium text-foreground">{productsCount}</span>
                  <span>products</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-green-500" />
                  <span className="font-medium text-foreground">250+</span>
                  <span>clients</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-purple-500" />
                  <span>Member since {new Date(seller.created_at || '').getFullYear()}</span>
                </div>
              </div>

              {/* Description */}
              <p className="text-muted-foreground text-sm leading-relaxed max-w-2xl">
                {seller?.description || "Passionate designer and developer with over 8 years of experience creating beautiful, functional digital experiences. Specializing in user interface design, web applications, and design systems that scale."}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
