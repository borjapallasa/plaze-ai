
import React from "react";
import { ArrowRight } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
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

export function MoreFromSeller({ products, className }: MoreFromSellerProps) {
  return (
    <div>
      <div className={className}>
        <h2 className="text-xl font-semibold mb-8">More from seller</h2>
        
        {/* Mobile Layout (2 visible + 6 hidden) */}
        <div className="lg:hidden">
          <Carousel className="w-full">
            <CarouselContent className="-ml-2 md:-ml-4">
              {products.map((product, index) => (
                <CarouselItem key={index} className="pl-2 md:pl-4 basis-1/2">
                  <ProductCard product={product} />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden" />
            <CarouselNext />
          </Carousel>
        </div>

        {/* Desktop Layout (4 visible + 4 hidden) */}
        <div className="hidden lg:block">
          <Carousel className="w-full">
            <CarouselContent className="-ml-4">
              {products.map((product, index) => (
                <CarouselItem key={index} className="pl-4 basis-1/4">
                  <ProductCard product={product} />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      </div>

      {/* Related Products Section */}
      <div className="mt-16">
        <h2 className="text-xl font-semibold mb-8">Related products</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {products.map((product, index) => (
            <ProductCard key={index} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}

function ProductCard({ product }: { product: Product }) {
  return (
    <Card className="group relative flex flex-col space-y-4 p-6 hover:bg-accent transition-colors">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-lg bg-accent flex items-center justify-center overflow-hidden flex-shrink-0">
          <img
            src={product.image}
            alt={product.title}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-sm leading-tight truncate mb-[2px]">
            {product.title}
          </h3>
          <Badge 
            variant="secondary" 
            className="font-medium capitalize bg-blue-50 text-blue-600 hover:bg-blue-50 text-xs"
          >
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
            <span
              key={index}
              className="text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full text-xs"
            >
              #{tag}
            </span>
          ))}
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
}
