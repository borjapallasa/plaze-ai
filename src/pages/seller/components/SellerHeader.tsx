
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge as UIBadge } from "@/components/ui/badge";
import { Badge, Star, ShoppingBag, Users } from "lucide-react";
import type { Expert } from "@/types/expert";

interface SellerHeaderProps {
  seller: Expert;
  productsCount: number;
}

export function SellerHeader({ seller, productsCount }: SellerHeaderProps) {
  const stats = [
    { icon: Star, label: "Rating", value: "4.9", color: "text-yellow-500" },
    { icon: ShoppingBag, label: "Products", value: productsCount.toString(), color: "text-blue-500" },
    { icon: Users, label: "Clients", value: "250+", color: "text-green-500" },
    { icon: Badge, label: "Member Since", value: new Date(seller.created_at || '').getFullYear().toString(), color: "text-purple-500" },
  ];

  return (
    <div className="relative mb-8 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-muted/50 to-background rounded-xl" />
      
      <div className="relative px-6 py-10 sm:px-10 sm:py-12">
        <div className="flex flex-col sm:flex-row items-start gap-10 max-w-6xl mx-auto">
          <div className="relative flex-shrink-0">
            <Avatar className="h-32 w-32 sm:h-40 sm:w-40 rounded-full ring-4 ring-background shadow-xl border-2 border-primary/10">
              <AvatarImage 
                src={seller.user_uuid ? `https://api.dicebear.com/7.x/avataaars/svg?seed=${seller.user_uuid}` : "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e"}
                className="object-cover"
              />
              <AvatarFallback className="text-3xl">{seller.name?.[0] || 'S'}</AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-1 -right-1 bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full shadow-lg">
              Pro Seller
            </div>
          </div>

          <div className="flex-1 space-y-8">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                  {seller?.name || "Expert"}
                </h1>
                <UIBadge variant="secondary" className="font-semibold px-3 py-1">
                  <Badge className="w-4 h-4 mr-1" />
                  Verified Expert
                </UIBadge>
              </div>
              <p className="text-xl text-muted-foreground font-medium">
                {seller?.title || "Expert in UI/UX Design & Development"}
              </p>
            </div>

            <p className="text-base text-muted-foreground leading-relaxed max-w-3xl">
              {seller?.description || "Passionate designer and developer with over 8 years of experience creating beautiful, functional digital experiences. Specializing in user interface design, web applications, and design systems that scale."}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {stats.map((stat) => (
                <div 
                  key={stat.label}
                  className="bg-card rounded-xl px-4 py-4 shadow-lg border border-border/20 hover:border-border/40 transition-colors"
                >
                  <div className="flex items-center gap-2 text-muted-foreground mb-2">
                    <stat.icon className={`h-5 w-5 ${stat.color}`} />
                    <span className="text-sm font-medium">{stat.label}</span>
                  </div>
                  <p className="text-2xl font-bold tracking-tight">
                    {stat.value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
