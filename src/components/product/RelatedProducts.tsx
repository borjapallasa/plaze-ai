
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
}

interface RelatedProductsProps {
  className?: string;
}

const fetchRelatedProducts = async (productId: string) => {
  console.log('Starting to fetch related products, productId:', productId);
  
  try {
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
        slug
      `)
      .order('created_at', { ascending: false })
      .limit(12);

    if (error) {
      console.error('Error fetching products:', error);
      throw error;
    }

    console.log('Successfully fetched products:', data?.length || 0, 'items');
    console.log('First few products:', data?.slice(0, 3));
    return data || [];
  } catch (err) {
    console.error('Exception in fetchRelatedProducts:', err);
    throw err;
  }
};

export function RelatedProducts({ className }: RelatedProductsProps) {
  const { id } = useParams<{ id: string }>();
  console.log('RelatedProducts component mounted, id from params:', id);

  const { data: products = [], isLoading, error } = useQuery({
    queryKey: ['relatedProducts', id],
    queryFn: () => id ? fetchRelatedProducts(id) : Promise.resolve([]),
    enabled: !!id
  });

  console.log('Query state:', { isLoading, error, productsCount: products.length });

  if (error) {
    console.error('Query error:', error);
  }

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
