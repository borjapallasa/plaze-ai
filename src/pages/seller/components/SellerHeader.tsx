
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
      <Card className="border-0 shadow-lg bg-gradient-to-br from-background via-background to-muted/20">
        <CardContent className="p-8">
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            {/* Avatar Section */}
            <div className="flex-shrink-0">
              <div className="relative">
                <Avatar className="h-32 w-32 border-4 border-background shadow-xl">
                  <AvatarImage 
                    src={avatarUrl}
                    className="object-cover"
                  />
                  <AvatarFallback className="text-2xl font-semibold bg-primary/10">
                    {seller.name?.[0] || 'S'}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-2 -right-2">
                  <UIBadge className="bg-primary text-primary-foreground shadow-lg px-3 py-1">
                    <Badge className="w-3 h-3 mr-1" />
                    Pro
                  </UIBadge>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 space-y-6">
              {/* Name and Title */}
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="text-3xl lg:text-4xl font-bold text-foreground">
                    {seller?.name || "Expert"}
                  </h1>
                  <UIBadge variant="outline" className="border-primary/20 text-primary">
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
                <p className="text-lg text-muted-foreground font-medium">
                  {seller?.title || "Expert in UI/UX Design & Development"}
                </p>
              </div>

              {/* Stats Row */}
              <div className="flex flex-wrap items-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  <span className="font-semibold">4.9</span>
                  <span className="text-muted-foreground">rating</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4 text-blue-500" />
                  <span className="font-semibold">{productsCount}</span>
                  <span className="text-muted-foreground">products</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-green-500" />
                  <span className="font-semibold">250+</span>
                  <span className="text-muted-foreground">clients</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-purple-500" />
                  <span className="text-muted-foreground">
                    Member since {new Date(seller.created_at || '').getFullYear()}
                  </span>
                </div>
              </div>

              {/* Description */}
              <p className="text-muted-foreground leading-relaxed max-w-3xl">
                {seller?.description || "Passionate designer and developer with over 8 years of experience creating beautiful, functional digital experiences. Specializing in user interface design, web applications, and design systems that scale."}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
