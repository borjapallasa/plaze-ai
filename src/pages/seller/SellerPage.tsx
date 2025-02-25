
import React from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { MainHeader } from "@/components/MainHeader";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ProductCard } from "@/components/ProductCard";
import { Star, Users, BookOpen, Badge, ShoppingBag, BriefcaseIcon, UsersRound, AppWindow } from "lucide-react";
import { Badge as UIBadge } from "@/components/ui/badge";

export default function SellerPage() {
  const { id } = useParams();

  const { data: seller } = useQuery({
    queryKey: ['seller', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('users')
        .select('*, services(*), products(*)')
        .eq('user_uuid', id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!id
  });

  const stats = [
    { icon: Star, label: "Rating", value: "4.9", color: "text-yellow-500" },
    { icon: ShoppingBag, label: "Products", value: "12", color: "text-blue-500" },
    { icon: Users, label: "Clients", value: "250+", color: "text-green-500" },
    { icon: Badge, label: "Member Since", value: "2022", color: "text-purple-500" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="fixed top-0 left-0 right-0 z-50 bg-background">
        <MainHeader />
      </div>

      <main className="container mx-auto px-4 pt-24 pb-8">
        {/* Enhanced Profile Section */}
        <div className="relative mb-8 overflow-hidden">
          {/* Improved Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-muted/50 to-background rounded-xl" />
          
          <div className="relative px-6 py-10 sm:px-10 sm:py-12">
            <div className="flex flex-col sm:flex-row items-start gap-10 max-w-6xl mx-auto">
              {/* Enhanced Avatar Section */}
              <div className="relative flex-shrink-0">
                <Avatar className="h-32 w-32 sm:h-40 sm:w-40 rounded-full ring-4 ring-background shadow-xl border-2 border-primary/10">
                  <AvatarImage 
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e"
                    className="object-cover"
                  />
                  <AvatarFallback className="text-3xl">JP</AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-1 -right-1 bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full shadow-lg">
                  Pro Seller
                </div>
              </div>

              {/* Enhanced Content Section */}
              <div className="flex-1 space-y-8">
                {/* Improved Header */}
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-3">
                    <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                      {seller?.first_name || "John Professional"}
                    </h1>
                    <UIBadge variant="secondary" className="font-semibold px-3 py-1">
                      <Badge className="w-4 h-4 mr-1" />
                      Verified Expert
                    </UIBadge>
                  </div>
                  <p className="text-xl text-muted-foreground font-medium">
                    Expert in UI/UX Design & Development
                  </p>
                </div>

                {/* Enhanced Description */}
                <p className="text-base text-muted-foreground leading-relaxed max-w-3xl">
                  Passionate designer and developer with over 8 years of experience creating beautiful, 
                  functional digital experiences. Specializing in user interface design, web applications, 
                  and design systems that scale.
                </p>

                {/* Enhanced Stats */}
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

        {/* Tabs Section */}
        <Tabs defaultValue="products" className="animate-fade-in">
          <TabsList className="grid grid-cols-4 h-12 items-center bg-muted/50 mb-6">
            <TabsTrigger value="products" className="data-[state=active]:bg-background">
              <ShoppingBag className="h-4 w-4 mr-2" />
              Products
            </TabsTrigger>
            <TabsTrigger value="services" className="data-[state=active]:bg-background">
              <BriefcaseIcon className="h-4 w-4 mr-2" />
              Services
            </TabsTrigger>
            <TabsTrigger value="communities" className="data-[state=active]:bg-background">
              <UsersRound className="h-4 w-4 mr-2" />
              Communities
            </TabsTrigger>
            <TabsTrigger value="applications" className="data-[state=active]:bg-background">
              <AppWindow className="h-4 w-4 mr-2" />
              Applications
            </TabsTrigger>
          </TabsList>

          <TabsContent value="products" className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <ProductCard
                  key={i}
                  id="sample"
                  slug="sample"
                  title="Sample Product"
                  price="$99.99"
                  image="https://images.unsplash.com/photo-1649972904349-6e44c42644a7"
                  seller="Design Master"
                  description="A beautiful product description goes here"
                  tags={["design", "ui"]}
                  category="design"
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="services" className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="p-6">
                  <h3 className="font-semibold mb-2">UI/UX Design Service</h3>
                  <p className="text-sm text-muted-foreground">Professional design services for your project</p>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="communities" className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2].map((i) => (
                <Card key={i} className="p-6">
                  <h3 className="font-semibold mb-2">Design Community</h3>
                  <p className="text-sm text-muted-foreground">Join our community of designers</p>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="applications" className="space-y-6">
            <div className="grid grid-cols-1 gap-4">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="p-6">
                  <h3 className="font-semibold mb-2">Job Application #{i}</h3>
                  <p className="text-sm text-muted-foreground">Applied for Senior Designer position</p>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
