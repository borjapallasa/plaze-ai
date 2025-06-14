
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge as UIBadge } from "@/components/ui/badge";
import { Star, ShoppingBag, Users, Calendar } from "lucide-react";
import type { Expert } from "@/types/expert";
import { useAuth } from "@/lib/auth";
import { EditExpertDialog } from "./EditExpertDialog";

interface SellerHeaderProps {
  seller: Expert;
  productsCount: number;
  communitiesCount: number;
  onSellerUpdate?: (updatedSeller: Expert) => void;
}

export function SellerHeader({ seller, productsCount, communitiesCount, onSellerUpdate }: SellerHeaderProps) {
  const { user } = useAuth();
  const isCurrentUserExpert = user?.id === seller.user_uuid;

  const handleExpertUpdate = (updatedExpert: Expert) => {
    if (onSellerUpdate) {
      onSellerUpdate(updatedExpert);
    }
  };

  const avatarUrl = seller.thumbnail || 
    (seller.user_uuid ? `https://api.dicebear.com/7.x/avataaars/svg?seed=${seller.user_uuid}` : 
    "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05");

  const memberSince = new Date(seller.created_at || '').getFullYear();

  return (
    <div className="relative mb-8 overflow-hidden rounded-2xl">
      {/* Cover Image */}
      <div className="absolute inset-0">
        <img 
          src="https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1200&h=300"
          alt="Cover"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-black/70" />
      </div>
      
      <div className="relative px-6 py-12 sm:px-10 sm:py-16">
        <div className="flex flex-col sm:flex-row items-start gap-6 max-w-6xl mx-auto">
          <div className="relative flex-shrink-0">
            <Avatar className="h-24 w-24 sm:h-32 sm:w-32 rounded-full ring-4 ring-white/20 shadow-2xl border-2 border-white/30">
              <AvatarImage 
                src={avatarUrl}
                className="object-cover"
              />
              <AvatarFallback className="text-2xl bg-white/90 text-gray-800">{seller.name?.[0] || 'S'}</AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-1 -right-1 bg-primary text-primary-foreground text-xs font-semibold px-2 py-1 rounded-full shadow-lg">
              Pro
            </div>
          </div>

          <div className="flex-1 space-y-4 text-white">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
                  {seller?.name || "Expert"}
                </h1>
                <UIBadge variant="secondary" className="font-semibold px-3 py-1 bg-white/10 text-white border-white/20">
                  Verified Expert
                </UIBadge>
                
                {isCurrentUserExpert && (
                  <EditExpertDialog expert={seller} onUpdate={handleExpertUpdate} />
                )}
              </div>
              <p className="text-lg sm:text-xl text-white/90 font-medium">
                {seller?.title || "Expert in UI/UX Design & Development"}
              </p>
            </div>

            <p className="text-sm sm:text-base text-white/80 leading-relaxed max-w-2xl">
              {seller?.description || "Passionate designer and developer with over 8 years of experience creating beautiful, functional digital experiences."}
            </p>

            {/* Inline Stats */}
            <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-sm sm:text-base">
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                <span className="text-lg font-bold text-yellow-400">4.9</span>
              </div>
              <div className="w-px h-6 bg-white/20" />
              <div className="flex items-center gap-2">
                <ShoppingBag className="h-4 w-4 text-primary" />
                <span className="font-semibold">{productsCount} Products</span>
              </div>
              <div className="w-px h-6 bg-white/20" />
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-green-400" />
                <span className="font-semibold">250+ Clients</span>
              </div>
              <div className="w-px h-6 bg-white/20" />
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-white/70" />
                <span className="text-white/70">Since {memberSince}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
