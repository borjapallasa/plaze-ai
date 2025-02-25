
import React, { useState } from "react";
import { ArrowRight } from "lucide-react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";

interface Product {
  name: string;
  price_from: number;
  thumbnail: string;
  description: string;
  tech_stack: string;
  type: string;
  product_uuid: string;
  slug: string;
  use_case: string[];
}

interface MoreFromSellerProps {
  expert_uuid?: string;
  className?: string;
}

const fetchExpertProducts = async (expert_uuid: string, currentProductUuid?: string) => {
  console.log('Fetching products for expert:', expert_uuid);
  
  let query = supabase
    .from('products')
    .select('name, price_from, thumbnail, description, tech_stack, type, product_uuid, slug, use_case')
    .eq('expert_uuid', expert_uuid)
    .order('created_at', { ascending: false })
    .limit(12);

  // Only add the not equals filter if we have a current product UUID
  if (currentProductUuid) {
    query = query.neq('product_uuid', currentProductUuid);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching products:', error);
    throw error;
  }

  console.log('Fetched products:', data);
  return data || [];
};

const formatPrice = (price: number | null): string => {
  if (!price) return '$0.00';
  return `$${price.toFixed(2)}`;
};

export function MoreFromSeller({
  expert_uuid,
  className
}: MoreFromSellerProps) {
  const navigate = useNavigate();
  const { id: currentProductUuid } = useParams();
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  const { data: products = [], isLoading } = useQuery({
    queryKey: ['expertProducts', expert_uuid, currentProductUuid],
    queryFn: () => expert_uuid ? fetchExpertProducts(expert_uuid, currentProductUuid) : Promise.resolve([]),
    enabled: !!expert_uuid
  });

  React.useEffect(() => {
    if (!api) {
      return;
    }
    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  if (isLoading) {
    return <div>Loading products...</div>;
  }

  if (!products.length) {
    return null;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 pt-[50px]">More from seller</h2>
      
      <Carousel 
        setApi={setApi} 
        className="w-full" 
        opts={{
          align: "start",
          dragFree: true
        }}
      >
        <CarouselContent className="-ml-4">
          {products.map((product, index) => (
            <CarouselItem key={index} className="pl-4 basis-full sm:basis-1/2 lg:basis-1/4">
              <Card 
                className="group relative flex flex-col space-y-4 p-4 lg:p-6 hover:bg-accent transition-colors cursor-pointer" 
                onClick={() => {
                  if (product.slug && product.product_uuid) {
                    navigate(`/product/${product.slug}/${product.product_uuid}`);
                  }
                }}
              >
                <div className="flex items-start gap-3 lg:gap-4">
                  <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-lg bg-accent flex items-center justify-center overflow-hidden flex-shrink-0">
                    <img src={product.thumbnail} alt={product.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm leading-tight truncate mb-[2px]">
                      {product.name}
                    </h3>
                    <Badge variant="secondary" className="font-medium capitalize bg-blue-50 text-blue-600 hover:bg-blue-50 text-xs mt-1.5">
                      {product.type}
                    </Badge>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground line-clamp-2">
                  {product.description}
                </p>

                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">From {formatPrice(product.price_from)}</span>
                </div>

                <div className="flex items-center justify-between -mt-3">
                  <div className="flex gap-2 flex-wrap">
                    {product.tech_stack?.split(',').slice(0, 2).map((tag, index) => (
                      <span key={index} className="text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full text-xs">
                        #{tag}
                      </span>
                    ))}
                  </div>
                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="flex items-center justify-end gap-2 mt-4">
          <CarouselPrevious className="static translate-y-0" />
          <CarouselNext className="static translate-y-0" />
        </div>
      </Carousel>
    </div>
  );
}
