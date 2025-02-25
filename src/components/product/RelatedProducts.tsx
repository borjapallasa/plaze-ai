
import React from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { ProductCard } from "@/components/ProductCard";

interface Product {
  name: string;
  price_from: number;
  thumbnail: string;
  description: string;
  tech_stack: string;
  type: string;
  product_uuid: string;
  slug: string;
  use_case: string;
}

interface RelatedProductsProps {
  className?: string;
}

const fetchRelatedProducts = async (productId: string) => {
  console.log('Fetching all products');
  
  // First get the current product's use case
  const { data: currentProduct } = await supabase
    .from('products')
    .select('use_case')
    .eq('product_uuid', productId)
    .single();

  // Then fetch related products with the same use case
  const { data, error } = await supabase
    .from('products')
    .select(`
      name,
      price_from,
      thumbnail,
      description,
      tech_stack,
      type,
      product_uuid,
      slug,
      use_case
    `)
    .eq('use_case', currentProduct?.use_case)
    .neq('product_uuid', productId)
    .order('created_at', { ascending: false })
    .limit(12);

  if (error) {
    console.error('Error fetching products:', error);
    throw error;
  }

  console.log('Fetched related products:', data);
  return data || [];
};

export function RelatedProducts({ className }: RelatedProductsProps) {
  const { id } = useParams<{ id: string }>();

  const { data: products = [], isLoading } = useQuery({
    queryKey: ['relatedProducts', id],
    queryFn: () => id ? fetchRelatedProducts(id) : Promise.resolve([]),
    enabled: !!id
  });

  return (
    <div className={className}>
      <h2 className="text-2xl font-bold mb-6">Related Products</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          <div>Loading products...</div>
        ) : products.length === 0 ? (
          <div>No products found</div>
        ) : (
          products.map((product) => (
            <ProductCard
              key={product.product_uuid}
              id={product.product_uuid}
              slug={product.slug}
              title={product.name}
              price={`$${product.price_from?.toFixed(2) || '0.00'}`}
              image={product.thumbnail || "https://images.unsplash.com/photo-1649972904349-6e44c42644a7"}
              seller="Design Master"
              description={product.description}
              tags={product.tech_stack ? product.tech_stack.split(',').slice(0, 2) : []}
              category={product.type}
            />
          ))
        )}
      </div>
    </div>
  );
}
