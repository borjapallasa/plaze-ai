
import { MainHeader } from "@/components/MainHeader";
import { ProductCard } from "@/components/ProductCard";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

interface Product {
  product_uuid: string;
  name: string;
  description: string;
  type: string;
  sales_amount: number;
  user_uuid: string;
  tech_stack: string;
}

export default function Products() {
  const { data: products, isLoading, error } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('type', 'template');
      
      if (error) throw error;
      return data;
    }
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <MainHeader />
        <div className="container mx-auto px-4 pt-24 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <MainHeader />
        <div className="container mx-auto px-4 pt-24">
          <div className="text-center text-red-500">
            Error loading products. Please try again later.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <MainHeader />
      <main className="container mx-auto px-4 pt-24">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold mb-8">All Products</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products?.map((product) => (
              <ProductCard
                key={product.product_uuid}
                title={product.name}
                price="$99.99"
                image="https://images.unsplash.com/photo-1649972904349-6e44c42644a7"
                seller="Design Master"
                description={product.description}
                tags={product.tech_stack ? product.tech_stack.split(',') : []}
                category={product.type}
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
