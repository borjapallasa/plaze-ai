
import { ProductCard } from "@/components/ProductCard";
import React from "react";

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
    <div className={className}>
      <h2 className="text-xl font-semibold mb-8">More from seller</h2>
      <div className="product-grid">
        {products.map((product, index) => (
          <ProductCard key={index} {...product} />
        ))}
      </div>
    </div>
  );
}
