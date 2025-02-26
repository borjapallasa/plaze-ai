import React from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { MainHeader } from "@/components/MainHeader";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { 
  Star, 
  Users, 
  BookOpen, 
  Badge, 
  ShoppingBag, 
  BriefcaseIcon, 
  UsersRound, 
  AppWindow,
  Plus,
  Search
} from "lucide-react";
import { Badge as UIBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function SellerPage() {
  const { id } = useParams();

  const { data: seller } = useQuery({
    queryKey: ['seller', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('user_uuid', id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!id
  });

  const { data: products = [] } = useQuery({
    queryKey: ['sellerProducts', id],
    queryFn: async () => {
      console.log('Fetching products for seller:', id);
      const { data, error } = await supabase
        .from('products')
        .select(`
          name,
          status,
          variant_count,
          price_from,
          created_at,
          thumbnail,
          product_uuid
        `)
        .eq('expert_uuid', id);

      if (error) {
        console.error('Error fetching seller products:', error);
        throw error;
      }

      console.log('Fetched products:', data);
      return data || [];
    },
    enabled: !!id
  });

  const stats = [
    { icon: Star, label: "Rating", value: "4.9", color: "text-yellow-500" },
    { icon: ShoppingBag, label: "Products", value: products.length.toString(), color: "text-blue-500" },
    { icon: Users, label: "Clients", value: "250+", color: "text-green-500" },
    { icon: Badge, label: "Member Since", value: "2022", color: "text-purple-500" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="fixed top-0 left-0 right-0 z-50 bg-background">
        <MainHeader />
      </div>

      <main className="container mx-auto px-4 pt-24 pb-8">
        <div className="relative mb-8 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-muted/50 to-background rounded-xl" />
          
          <div className="relative px-6 py-10 sm:px-10 sm:py-12">
            <div className="flex flex-col sm:flex-row items-start gap-10 max-w-6xl mx-auto">
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

              <div className="flex-1 space-y-8">
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

                <p className="text-base text-muted-foreground leading-relaxed max-w-3xl">
                  Passionate designer and developer with over 8 years of experience creating beautiful, 
                  functional digital experiences. Specializing in user interface design, web applications, 
                  and design systems that scale.
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

        <Tabs defaultValue="products" className="animate-fade-in">
          <TabsList className="grid grid-cols-4 h-12 items-center bg-muted/50">
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

          <TabsContent value="products" className="space-y-6 mt-6">
            <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4 sm:items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search products..." 
                  className="pl-9"
                />
              </div>
              <Button asChild className="sm:w-auto">
                <Link to="/seller/products/new">
                  <Plus className="h-4 w-4 mr-2" />
                  Add product
                </Link>
              </Button>
            </div>

            <Card className="p-6">
              <div className="rounded-lg overflow-hidden border border-border">
                <table className="w-full">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="w-[72px]"></th>
                      <th className="px-4 py-2.5 text-left text-sm font-medium text-muted-foreground">Product</th>
                      <th className="px-4 py-2.5 text-left text-sm font-medium text-muted-foreground">Status</th>
                      <th className="px-4 py-2.5 text-left text-sm font-medium text-muted-foreground">Variants</th>
                      <th className="px-4 py-2.5 text-left text-sm font-medium text-muted-foreground">Price</th>
                      <th className="px-4 py-2.5 text-left text-sm font-medium text-muted-foreground">Created</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {products.map((product) => (
                      <tr key={product.product_uuid} className="hover:bg-muted/50 transition-colors">
                        <td className="p-3">
                          <div className="w-12 h-12 rounded bg-muted flex-shrink-0 overflow-hidden">
                            {product.thumbnail && (
                              <img 
                                src={product.thumbnail} 
                                alt={product.name}
                                className="w-full h-full object-cover"
                              />
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <h3 className="font-medium text-sm">{product.name}</h3>
                        </td>
                        <td className="px-4 py-3">
                          <UIBadge 
                            variant={product.status === 'active' ? 'default' : 'secondary'}
                            className="capitalize"
                          >
                            {product.status || 'Draft'}
                          </UIBadge>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-sm">{product.variant_count || 0}</span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-sm">${product.price_from || '0.00'}</span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-sm text-muted-foreground">
                            {new Date(product.created_at).toLocaleDateString()}
                          </span>
                        </td>
                      </tr>
                    ))}
                    {products.length === 0 && (
                      <tr>
                        <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                          No products found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </Card>
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
