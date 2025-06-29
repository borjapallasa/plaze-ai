
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { MainHeader } from "@/components/MainHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { AffiliateDashboard } from "@/components/affiliates/AffiliateDashboard";
import { AffiliateTable } from "@/components/affiliates/AffiliateTable";
import { AffiliateProductSection } from "@/components/product/AffiliateProductSection";
import { useAllAffiliateProducts } from "@/hooks/use-affiliate-products";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function AffiliatesPage() {
  const { user } = useAuth();

  // Fetch affiliate data for current user
  const { data: affiliateData, isLoading: isLoadingAffiliate } = useQuery({
    queryKey: ['affiliate-data', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      const { data, error } = await supabase
        .from('affiliates')
        .select('*')
        .eq('user_uuid', user.id)
        .maybeSingle();
      
      if (error) {
        console.error('Error fetching affiliate data:', error);
        return null;
      }
      return data;
    },
    enabled: !!user?.id,
  });

  // Fetch user data to check if admin
  const { data: userData } = useQuery({
    queryKey: ['user-data', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      const { data, error } = await supabase
        .from('users')
        .select('is_admin')
        .eq('user_uuid', user.id)
        .single();

      if (error) {
        console.error('Error fetching user data:', error);
        return null;
      }

      return data;
    },
    enabled: !!user?.id
  });

  // Fetch all affiliate products
  const { data: affiliateProducts = [] } = useAllAffiliateProducts();

  const isAdmin = userData?.is_admin || false;
  const isAffiliate = !!affiliateData;

  if (isLoadingAffiliate) {
    return (
      <>
        <MainHeader />
        <div className="container mx-auto px-4 py-8 mt-16">
          <div className="space-y-6">
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-muted rounded w-1/4"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-32 bg-muted rounded"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <MainHeader />
      <div className="container mx-auto px-4 py-8 mt-16 space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Affiliate Program</h1>
            <p className="text-muted-foreground mt-2">
              Manage your affiliate partnerships and track commissions
            </p>
          </div>
        </div>

        {user ? (
          <Tabs defaultValue={isAffiliate ? "dashboard" : "products"} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              {isAffiliate && (
                <TabsTrigger value="dashboard">My Dashboard</TabsTrigger>
              )}
              <TabsTrigger value="products">Affiliate Products</TabsTrigger>
              {isAdmin && (
                <TabsTrigger value="management">Management</TabsTrigger>
              )}
            </TabsList>

            {isAffiliate && (
              <TabsContent value="dashboard" className="space-y-6">
                <AffiliateDashboard />
              </TabsContent>
            )}

            <TabsContent value="products" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Available Affiliate Products</CardTitle>
                </CardHeader>
                <CardContent>
                  {affiliateProducts.length > 0 ? (
                    <div className="grid gap-4">
                      {affiliateProducts.map((product) => (
                        <div key={product.affiliate_products_uuid} className="p-4 border rounded-lg">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-semibold">{product.product_name}</h3>
                              <p className="text-sm text-muted-foreground mt-1">
                                {product.product_description}
                              </p>
                              <div className="flex items-center gap-4 mt-2">
                                <span className="text-sm">
                                  Price: ${product.product_price_from}
                                </span>
                                <span className="text-sm">
                                  Commission: {Math.round(product.affiliate_share * 100)}%
                                </span>
                              </div>
                            </div>
                            <div className="text-right">
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                {product.status}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">No affiliate products available at the moment.</p>
                  )}
                </CardContent>
              </Card>

              {!isAffiliate && (
                <Card>
                  <CardHeader>
                    <CardTitle>Join Our Affiliate Program</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">
                      Start earning commissions by referring customers to our platform.
                    </p>
                    <Button>Apply to Become an Affiliate</Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {isAdmin && (
              <TabsContent value="management" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Affiliate Management</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <AffiliateTable />
                  </CardContent>
                </Card>
              </TabsContent>
            )}
          </Tabs>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Sign In Required</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Please sign in to access the affiliate program.
              </p>
              <Button asChild>
                <a href="/sign-in">Sign In</a>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </>
  );
}
