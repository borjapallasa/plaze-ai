
// src/pages/Classroom.tsx
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { MainHeader } from "@/components/MainHeader";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { communityProductsToVariants } from "@/utils/product-utils";
import { ProductCard } from "@/components/product/ProductCard";
import { ProductNotFound } from "@/components/product/ProductNotFound";
import { ProductSkeleton } from "@/components/product/ProductSkeleton";
import { CommunityProduct } from "@/types/Product";

interface ClassroomParams {
  id: string;
}

interface Community {
  community_uuid: string;
  name: string;
  description: string;
  logo_url?: string;
  hero_image_url?: string;
  thumbnail?: string;
  // Include additional properties from communities table
  active_price_id?: string;
  active_product_id?: string;
  billing_period?: "monthly" | "yearly";
  classroom_count?: number;
  community_price_uuid?: string;
  expert_name?: string;
  expert_thumbnail?: string;
  expert_uuid?: string;
  last_activity?: string;
  member_count?: number;
  monthly_recurring_revenue?: number;
  paid_member_count?: number;
  payment_link?: string;
  post_count?: number;
  price?: number;
  product_count?: number;
  total_revenue?: number;
  type?: string;
  visibility?: string;
  webhook?: string;
}

async function fetchCommunity(communityId: string): Promise<Community | null> {
  const { data, error } = await supabase
    .from('communities')
    .select('*')
    .eq('community_uuid', communityId)
    .single();

  if (error) {
    console.error("Error fetching community:", error);
    return null;
  }

  return data;
}

async function fetchCommunityProducts(communityId: string): Promise<any[]> {
  const { data, error } = await supabase
    .from('community_products')
    .select('*')
    .eq('community_uuid', communityId);

  if (error) {
    console.error("Error fetching community products:", error);
    return [];
  }

  return data;
}

export default function ClassroomPage() {
  const { id } = useParams<{ id: string }>();
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const [community, setCommunity] = useState<Community | null>(null);
  const [products, setProducts] = useState<CommunityProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setError("Community ID is missing.");
      setIsLoading(false);
      return;
    }

    async function loadData() {
      setIsLoading(true);
      setError(null);

      try {
        const communityData = await fetchCommunity(id);
        if (communityData) {
          setCommunity(communityData);

          const rawProducts = await fetchCommunityProducts(id);
          
          const processedProducts: CommunityProduct[] = rawProducts.map(product => ({
            community_product_uuid: product.community_product_uuid,
            name: product.name,
            price: product.price,
            community_uuid: product.community_uuid || '',
            product_type: product.product_type || 'default',
            variant_uuid: product.variant_uuid,
            variant_name: product.variant_name,
            variant_price: product.variant_price
          }));
          
          setProducts(processedProducts);
        } else {
          setError("Community not found.");
        }
      } catch (e: any) {
        console.error("Failed to load data:", e);
        setError("Failed to load community data.");
        toast({
          title: "Error",
          description: "Failed to load community data. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, [id, toast]);

  if (isLoading) {
    return (
      <div>
        <MainHeader />
        <div className="container mx-auto px-4 pt-28 md:pt-32">
          <h1 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0 lg:text-4xl">
            Loading...
          </h1>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <ProductSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !community) {
    return (
      <div>
        <MainHeader />
        <div className="container mx-auto px-4 pt-28 md:pt-32">
          <ProductNotFound />
        </div>
      </div>
    );
  }

  const variants = communityProductsToVariants(products);

  return (
    <div>
      <MainHeader />
      <div className="container mx-auto px-4 pt-28 md:pt-32">
        <div className="relative">
          <AspectRatio ratio={isMobile ? 16 / 9 : 21 / 9}>
            <img
              src={community.hero_image_url || "/placeholder.svg"}
              alt={community.name}
              className="object-cover rounded-lg"
            />
          </AspectRatio>
          <div className="absolute bottom-4 left-4 text-white">
            <h1 className="scroll-m-20 text-3xl font-semibold tracking-tight transition-colors first:mt-0 lg:text-5xl">
              {community.name}
            </h1>
            <p className="text-sm">{community.description}</p>
          </div>
        </div>

        <h2 className="scroll-m-20 mt-10 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0 lg:text-4xl">
          Products
        </h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
          {products.map((product) => (
            <ProductCard
              key={product.community_product_uuid}
              product={product}
              href={`/product/${product.community_product_uuid}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
