
import React from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { MainHeader } from "@/components/MainHeader";
import { ProductLayout } from "@/components/product/ProductLayout";
import { ProductNotFound } from "@/components/product/ProductNotFound";
import { ProductSkeleton } from "@/components/product/ProductSkeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Download } from "lucide-react";

export default function CommunityProductPage() {
  const { id: communityProductId } = useParams();

  const { data: communityProduct, isLoading, error } = useQuery({
    queryKey: ['communityProduct', communityProductId],
    queryFn: async () => {
      if (!communityProductId) {
        throw new Error('No community product ID provided');
      }

      console.log('Fetching community product with ID:', communityProductId);

      const { data, error } = await supabase
        .from('community_products')
        .select(`
          *,
          communities (
            name,
            expert_uuid,
            expert:expert_uuid (
              name,
              thumbnail
            )
          )
        `)
        .eq('community_product_uuid', communityProductId)
        .single();

      if (error) {
        console.error('Error fetching community product:', error);
        throw error;
      }

      return data;
    },
    enabled: !!communityProductId,
  });

  if (isLoading) {
    return (
      <>
        <MainHeader />
        <ProductSkeleton />
      </>
    );
  }

  if (error || !communityProduct) {
    return (
      <>
        <MainHeader />
        <ProductNotFound />
      </>
    );
  }

  // Transform community product data to match product structure
  const productData = {
    product_uuid: communityProduct.community_product_uuid,
    name: communityProduct.name,
    price_from: communityProduct.price,
    description: `A product from ${communityProduct.communities?.name || 'the community'}`,
    user_uuid: communityProduct.communities?.expert_uuid,
    expert_uuid: communityProduct.communities?.expert_uuid,
    expert: communityProduct.communities?.expert,
    status: 'active' as const,
    type: 'template' as const,
    created_at: communityProduct.created_at,
  };

  return (
    <>
      <MainHeader />
      <div className="container mx-auto px-4 py-8 mt-16 max-w-7xl">
        <ProductLayout 
          product={productData}
          variants={undefined}
          selectedVariant={undefined}
          relatedProductsWithVariants={undefined}
          averageRating={undefined}
          onVariantChange={undefined}
          onAddToCart={undefined}
          onAdditionalVariantToggle={undefined}
          reviews={undefined}
          isLoading={false}
        >
          <Card className="mt-8">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Community Product Access</h3>
              <p className="text-muted-foreground mb-6">
                This product is available through the {communityProduct.communities?.name} community.
              </p>
              
              <div className="flex gap-4">
                {communityProduct.payment_link && (
                  <Button asChild>
                    <a 
                      href={communityProduct.payment_link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-2"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Purchase Access
                    </a>
                  </Button>
                )}
                
                {communityProduct.files_link && (
                  <Button variant="outline" asChild>
                    <a 
                      href={communityProduct.files_link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-2"
                    >
                      <Download className="w-4 h-4" />
                      Download Files
                    </a>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </ProductLayout>
      </div>
    </>
  );
}
