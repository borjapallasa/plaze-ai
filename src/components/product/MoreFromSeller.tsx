import React, { useState } from "react";
import { ArrowRight } from "lucide-react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
interface Product {
  title: string;
  price: string;
  image: string;
  seller: string;
  description: string;
  tags: string[];
  category: string;
}
interface MoreFromSellerProps {
  products: Product[];
  className?: string;
}
export function MoreFromSeller({
  products,
  className
}: MoreFromSellerProps) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  React.useEffect(() => {
    if (!api) {
      return;
    }
    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);
  return <div>
      <h2 className="text-2xl font-bold mb-6 py-[50px]">More from seller</h2>
      
      <Carousel setApi={setApi} className="w-full" opts={{
      align: "start",
      dragFree: true
    }}>
        <CarouselContent className="-ml-4">
          {products.map((product, index) => <CarouselItem key={index} className="pl-4 basis-full sm:basis-1/2 lg:basis-1/4">
              <ProductCard product={product} />
            </CarouselItem>)}
        </CarouselContent>
        <div className="flex items-center justify-end gap-2 mt-4">
          <CarouselPrevious className="static translate-y-0" />
          <CarouselNext className="static translate-y-0" />
        </div>
      </Carousel>
    </div>;
}
function ProductCard({
  product
}: {
  product: Product;
}) {
  return <Card className="group relative flex flex-col space-y-4 p-4 lg:p-6 hover:bg-accent transition-colors max-w-full py-[24px]">
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
          {product.tags.slice(0, 2).map((tag, index) => <span key={index} className="text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full text-xs">
              #{tag}
            </span>)}
        </div>
        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </Card>;
}