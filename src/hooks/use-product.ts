
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ProductData } from "@/types/Product";

export function useProduct() {
  const { id } = useParams();

  return useQuery({
    queryKey: ['product', id],
    queryFn: async (): Promise<ProductData | null> => {
      console.log("Fetching product with ID:", id);

      if (!id) {
        console.error("No product ID provided");
        return null;
      }

      // Try to fetch by product_uuid first
      let { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('product_uuid', id)
        .maybeSingle();

      // If no data found and no error, try with slug
      if (!data && !error) {
        console.log("No product found by UUID, trying with slug...");
        ({ data, error } = await supabase
          .from('products')
          .select('*')
          .eq('slug', id)
          .maybeSingle());
      }

      if (error) {
        console.error("Error fetching product:", error);
        throw error;
      }

      if (!data) {
        console.log("No product found");
        return null;
      }

      console.log("Product data found:", data);

      // Ensure all the fields are returned as expected and with correct types
      const productData: ProductData = {
        ...data,
        // Handle null or boolean values correctly
        accept_terms: data.accept_terms,
        changes_neeeded: data.changes_neeeded, // Keep the misspelled field as it is in the database
        changes_needed: data.changes_neeeded, // Use the misspelled field for code compatibility
        demo: data.demo || null
      };
      
      return productData;
    },
    enabled: !!id
  });
}
