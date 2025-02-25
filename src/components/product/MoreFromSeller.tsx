
import React, { useState } from "react";
import { ArrowRight } from "lucide-react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

interface Product {
  title: string;
  price: string;
  image: string;
  description: string;
  tags: string[];
  category: string;
  productUuid?: string;
  slug?: string;
}

interface MoreFromSellerProps {
  expert_uuid?: string;
  className?: string;
}

const fetchExpertProducts = async (expert_uuid: string) => {
  console.log('Fetching products for expert:', expert_uuid);

  const { data, error } = await supabase
    .from('products')
    .select('name, price_from, thumbnail, description, tech_stack, type, product_uuid, slug')
    .eq('expert_uuid', expert_uuid)
    .order('sales_amount', { ascending: false });

  if (error) {
    console.error('Error fetching products:', error);
    throw error;
  }

  console.log('Expert products raw data:', data);
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
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  const { data: products = [], isLoading } = useQuery({
    queryKey: ['expertProducts', expert_uuid],
    queryFn: () => expert_uuid ? fetchExpertProducts(expert_uuid) : Promise.resolve([]),
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
          {products.map((product, index) => {
            return (
              <CarouselItem key={index} className="pl-4 basis-full sm:basis-1/2 lg:basis-1/4">
                <ProductCard product={{
                  title: product.name || '',
                  price: formatPrice(product.price_from),
                  image: product.thumbnail || '',
                  description: product.description || '',
                  tags: product.tech_stack ? product.tech_stack.split(',') : [],
                  category: product.type || '',
                  productUuid: product.product_uuid,
                  slug: product.slug,
                  seller: 'Expert' // Adding a default seller name since it's required by the component
                }} />
              </CarouselItem>
            );
          })}
        </CarouselContent>
        <div className="flex items-center justify-end gap-2 mt-4">
          <CarouselPrevious className="static translate-y-0" />
          <CarouselNext className="static translate-y-0" />
        </div>
      </Carousel>
    </div>
  );
}

function ProductCard({
  product
}: {
  product: Product & { seller: string }; // Ensuring seller is required
}) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (product.slug && product.productUuid) {
      navigate(`/product/${product.slug}/${product.productUuid}`);
    }
  };

  return (
    <Card 
      className="group relative flex flex-col space-y-4 p-4 lg:p-6 hover:bg-accent transition-colors cursor-pointer" 
      onClick={handleClick}
    >
      <div className="flex items-start gap-3 lg:gap-4">
        <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-lg bg-accent flex items-center justify-center overflow-hidden flex-shrink-0">
          <img src={product.image} alt={product.title} className="w-full h-full object-cover" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-sm leading-tight truncate mb-[2px]">
            {product.title}
          </h3>
          <Badge variant="secondary" className="font-medium capitalize bg-blue-50 text-blue-600 hover:bg-blue-50 text-xs mt-1.5">
            {product.category}
          </Badge>
        </div>
      </div>

      <p className="text-sm text-muted-foreground line-clamp-2">
        {product.description}
      </p>

      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">From {product.price}</span>
      </div>

      <div className="flex items-center justify-between -mt-3">
        <div className="flex gap-2 flex-wrap">
          {product.tags.slice(0, 2).map((tag, index) => (
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
  );
}
