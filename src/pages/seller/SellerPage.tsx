import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { MainHeader } from "@/components/MainHeader";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
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
  Search,
  Sparkles,
  ArrowRight,
  ArrowUpDown,
  ArrowDown,
  ArrowUp,
  DollarSign,
  CalendarDays,
  Users2,
  Building2,
  MessageCircle
} from "lucide-react";
import { Badge as UIBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import type { Service } from "@/components/expert/types";
import { useExpertCommunities } from "@/hooks/expert/useExpertCommunities";

type SortField = 'name' | 'status' | 'variant_count' | 'price_from' | 'created_at';
type SortDirection = 'asc' | 'desc';

export default function SellerPage() {
  const { id } = useParams();
  const [sortField, setSortField] = useState<SortField>('created_at');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

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

  const { data: services = [] } = useQuery({
    queryKey: ['sellerServices', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('services')
        .select(`
          name,
          description,
          price,
          features,
          type,
          status,
          service_uuid,
          monthly_recurring_revenue,
          revenue_amount,
          active_subscriptions_count,
          created_at
        `)
        .eq('expert_uuid', id);

      if (error) throw error;

      return (data || []).map(service => ({
        ...service,
        features: Array.isArray(service.features) ? service.features : []
      })) as Service[];
    },
    enabled: !!id
  });

  const { data: communities } = useExpertCommunities(id);

  const sortedProducts = [...(products || [])].sort((a, b) => {
    const direction = sortDirection === 'asc' ? 1 : -1;
    
    switch (sortField) {
      case 'name':
        return direction * (a.name || '').localeCompare(b.name || '');
      case 'status':
        return direction * (a.status || '').localeCompare(b.status || '');
      case 'variant_count':
        return direction * ((a.variant_count || 0) - (b.variant_count || 0));
      case 'price_from':
        return direction * ((a.price_from || 0) - (b.price_from || 0));
      case 'created_at':
        return direction * (new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
      default:
        return 0;
    }
  });

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <ArrowUpDown className="w-4 h-4 ml-1" />;
    return sortDirection === 'asc' ? 
      <ArrowUp className="w-4 h-4 ml-1" /> : 
      <ArrowDown className="w-4 h-4 ml-1" />;
  };

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
              <ScrollArea className="w-full relative" type="always">
                <div className="w-[calc(100vw-4rem)] sm:w-full min-w-[800px]">
                  <div className="rounded-lg border border-border">
                    <table className="w-full">
                      <thead className="bg-muted/50">
                        <tr>
                          <th className="w-[72px] sticky left-0 bg-muted/50"></th>
                          <th 
                            className="px-4 py-2.5 text-left text-sm font-medium text-muted-foreground cursor-pointer hover:text-foreground"
                            onClick={() => handleSort('name')}
                          >
                            <span className="flex items-center">
                              Product
                              <SortIcon field="name" />
                            </span>
                          </th>
                          <th 
                            className="px-4 py-2.5 text-left text-sm font-medium text-muted-foreground cursor-pointer hover:text-foreground"
                            onClick={() => handleSort('status')}
                          >
                            <span className="flex items-center">
                              Status
                              <SortIcon field="status" />
                            </span>
                          </th>
                          <th 
                            className="px-4 py-2.5 text-left text-sm font-medium text-muted-foreground cursor-pointer hover:text-foreground"
                            onClick={() => handleSort('variant_count')}
                          >
                            <span className="flex items-center">
                              Variants
                              <SortIcon field="variant_count" />
                            </span>
                          </th>
                          <th 
                            className="px-4 py-2.5 text-left text-sm font-medium text-muted-foreground cursor-pointer hover:text-foreground"
                            onClick={() => handleSort('price_from')}
                          >
                            <span className="flex items-center">
                              Price
                              <SortIcon field="price_from" />
                            </span>
                          </th>
                          <th 
                            className="px-4 py-2.5 text-left text-sm font-medium text-muted-foreground cursor-pointer hover:text-foreground"
                            onClick={() => handleSort('created_at')}
                          >
                            <span className="flex items-center">
                              Created
                              <SortIcon field="created_at" />
                            </span>
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {sortedProducts.map((product) => (
                          <tr key={product.product_uuid} className="hover:bg-muted/50 transition-colors">
                            <td className="p-3 sticky left-0 bg-background">
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
                </div>
              </ScrollArea>
            </Card>
          </TabsContent>

          <TabsContent value="services" className="space-y-6 mt-6">
            <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4 sm:items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search services..." 
                  className="pl-9"
                />
              </div>
              <Button className="sm:w-auto">
                <Plus className="h-4 w-4 mr-2" />
                Add service
              </Button>
            </div>

            <div className="grid grid-cols-1 gap-6">
              {services.map((service) => (
                <Card 
                  key={service.service_uuid} 
                  className="overflow-hidden border bg-card shadow-sm hover:shadow-md transition-all duration-200"
                >
                  <div className="grid lg:grid-cols-[2fr,1fr,1fr] divide-y lg:divide-y-0 lg:divide-x divide-border">
                    <div className="p-6 space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-start justify-between gap-4">
                          <h3 className="text-2xl font-semibold tracking-tight text-foreground">
                            {service.name}
                          </h3>
                          <UIBadge 
                            variant={service.status === 'active' ? 'default' : 'secondary'}
                            className="capitalize whitespace-nowrap shrink-0"
                          >
                            {service.status}
                          </UIBadge>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {service.description}
                        </p>
                      </div>

                      <div className="pt-4 flex flex-wrap items-baseline gap-x-6">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">Starting at</span>
                          <span className="text-2xl font-semibold tracking-tight">
                            ${service.price?.toLocaleString() || '0'}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">Type</span>
                          <span className="text-lg font-medium capitalize">
                            {service.type}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="p-6 bg-muted/5">
                      <div className="space-y-4">
                        <h4 className="text-sm font-medium flex items-center gap-1.5 text-foreground">
                          <Sparkles className="h-4 w-4 text-blue-500" />
                          Features
                        </h4>
                        <ul className="space-y-2">
                          {service.features?.map((feature, index) => (
                            <li 
                              key={index}
                              className="flex items-start gap-2 text-sm text-muted-foreground"
                            >
                              <ArrowRight className="h-4 w-4 text-blue-500 shrink-0 mt-0.5" />
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="p-6 bg-muted/5">
                      <div className="h-full flex flex-col">
                        <div className="space-y-4 flex-grow">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                              <div className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                                <DollarSign className="w-3 h-3" />
                                MRR
                              </div>
                              <div className="font-medium whitespace-nowrap">
                                ${service.monthly_recurring_revenue?.toLocaleString() || '0'}/mo
                              </div>
                            </div>
                            <div className="space-y-1">
                              <div className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                                <DollarSign className="w-3 h-3" />
                                Revenue
                              </div>
                              <div className="font-medium whitespace-nowrap">
                                ${service.revenue_amount?.toLocaleString() || '0'}
                              </div>
                            </div>
                            <div className="space-y-1">
                              <div className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                                <Users2 className="w-3 h-3" />
                                Active Subs
                              </div>
                              <div className="font-medium">
                                {service.active_subscriptions_count || 0}
                              </div>
                            </div>
                            <div className="space-y-1">
                              <div className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                                <CalendarDays className="w-3 h-3" />
                                Created
                              </div>
                              <div className="font-medium whitespace-nowrap">
                                {format(new Date(service.created_at), 'MMM d, yyyy')}
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="mt-6">
                          <Button 
                            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                          >
                            View Details
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}

              {services.length === 0 && (
                <Card className="p-8 text-center text-muted-foreground">
                  No services found
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="communities" className="space-y-6 mt-6">
            <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4 sm:items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search communities..." 
                  className="pl-9"
                />
              </div>
              <Button className="sm:w-auto">
                <Plus className="h-4 w-4 mr-2" />
                Create community
              </Button>
            </div>

            <div className="grid grid-cols-1 gap-6">
              {communities?.map((community) => (
                <Card 
                  key={community.community_uuid}
                  className="overflow-hidden border bg-card hover:bg-muted/5 shadow-sm hover:shadow-md transition-all duration-200"
                >
                  <div className="grid lg:grid-cols-[2fr,1fr,1fr] divide-y lg:divide-y-0 lg:divide-x divide-border">
                    <div className="p-6 space-y-4">
                      <div className="space-y-3">
                        <div className="flex items-start gap-4">
                          <Avatar className="h-12 w-12 rounded-full shrink-0 ring-2 ring-border">
                            <AvatarImage 
                              src={community.thumbnail} 
                              alt={community.name}
                              className="object-cover"
                            />
                            <AvatarFallback>{community.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                              <h3 className="text-2xl font-semibold tracking-tight text-foreground truncate">
                                {community.name}
                              </h3>
                              <UIBadge 
                                variant={community.price > 0 ? "default" : "secondary"}
                                className="capitalize whitespace-nowrap shrink-0"
                              >
                                {community.price > 0 ? `$${community.price}/mo` : 'Free'}
                              </UIBadge>
                            </div>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {community.description || community.intro}
                        </p>
                      </div>
                    </div>

                    <div className="p-6 bg-muted/5">
                      <div className="h-full space-y-4">
                        <h4 className="text-sm font-medium flex items-center gap-1.5 text-foreground">
                          <Building2 className="h-4 w-4 text-blue-500" />
                          Community Stats
                        </h4>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <span className="text-xs font-medium text-muted-foreground">Total Members</span>
                            <p className="font-medium">{community.member_count?.toLocaleString() || 0}</p>
                          </div>
                          <div className="space-y-1">
                            <span className="text-xs font-medium text-muted-foreground">Paid Members</span>
                            <p className="font-medium">{community.paid_member_count?.toLocaleString() || 0}</p>
                          </div>
                          <div className="space-y-1">
                            <span className="text-xs font-medium text-muted-foreground">Products</span>
                            <p className="font-medium">{community.product_count?.toLocaleString() || 0}</p>
                          </div>
                          <div className="space-y-1">
                            <span className="text-xs font-medium text-muted-foreground">Classrooms</span>
                            <p className="font-medium">{community.classroom_count?.toLocaleString() || 0}</p>
                          </div>
                          <div className="space-y-1">
                            <span className="text-xs font-medium text-muted-foreground">Posts</span>
                            <p className="font-medium">{community.post_count?.toLocaleString() || 0}</p>
                          </div>
                          <div className="space-y-1">
                            <span className="text-xs font-medium text-muted-foreground">Payment Rate</span>
                            <p className="font-medium">
                              {community.member_count 
                                ? Math.round((community.paid_member_count / community.member_count) * 100)
                                : 0}%
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-6 bg-muted/5">
                      <div className="h-full flex flex-col">
                        <div className="space-y-4 flex-grow">
                          <div className="space-y-2">
                            <div className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                              <DollarSign className="w-3 h-3" />
                              Monthly Recurring Revenue
                            </div>
                            <div className="font-medium text-xl text-green-600">
                              ${community.monthly_recurring_revenue?.toLocaleString() || '0'}
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                              <CalendarDays className="w-3 h-3" />
                              Last Activity
                            </div>
                            <div className="font-medium">
                              {community.last_activity 
                                ? format(new Date(community.last_activity), 'MMM d, yyyy')
                                : 'No activity yet'}
                            </div>
                          </div>
                        </div>
                        
                        <div className="mt-6 flex flex-col gap-2">
                          <Button className="w-full bg-black hover:bg-black/90 text-white">
                            <MessageCircle className="h-4 w-4 mr-2" />
                            View Discussion
                          </Button>
                          <Button variant="outline" className="w-full">
                            Manage Community
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}

              {!communities || communities.length === 0 && (
                <Card className="p-8 text-center text-muted-foreground">
                  No communities found
                </Card>
              )}
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
