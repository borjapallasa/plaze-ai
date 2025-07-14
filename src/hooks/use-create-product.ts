
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface CreateProductData {
  name: string;
  description?: string;
  price?: number;
  comparePrice?: number;
  additionalDetails?: string;
  tags?: string[];
  filesLink?: string;
  demoUrl?: string;
  thumbnail?: string;
  type: "product" | "community" | "service";
  // Community-specific fields
  communityDescription?: string;
  communityName?: string;
  communityType?: "free" | "paid";
  communityPrice?: number;
  // Service-specific fields
  serviceCategory?: string;
  serviceFeatures?: string[];
  serviceDeliveryTime?: string;
  serviceRevisions?: number;
}

export function useCreateProduct() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const createProduct = async (productData: CreateProductData) => {
    try {
      setIsLoading(true);

      // Get the current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;
      if (!user) throw new Error('No authenticated user found');

      // Create the product record
      const { data: product, error: productError } = await supabase
        .from('products')
        .insert({
          name: productData.name,
          description: productData.description || "",
          user_uuid: user.id,
          status: 'draft',
          thumbnail: productData.thumbnail || null,
          demo: productData.demoUrl || null,
          price_from: productData.price || 0,
        })
        .select()
        .single();

      if (productError) throw productError;

      // Create the variant record
      const { error: variantError } = await supabase
        .from('variants')
        .insert({
          user_uuid: user.id,
          product_uuid: product.product_uuid,
          name: productData.name,
          price: productData.price || 0,
          compare_price: productData.comparePrice || 0,
          files_link: productData.filesLink || null,
          additional_details: productData.additionalDetails || null,
          tags: productData.tags || [],
          highlighted: false,
        });

      if (variantError) throw variantError;

      // Handle different product types
      if (productData.type === "community") {
        // Create community record
        const { error: communityError } = await supabase
          .from('communities')
          .insert({
            name: productData.communityName || productData.name,
            description: productData.communityDescription || productData.description,
            user_uuid: user.id,
            expert_uuid: user.id,
            type: productData.communityType || 'free',
            price: productData.communityPrice || 0,
            status: 'draft',
          });

        if (communityError) throw communityError;
      } else if (productData.type === "service") {
        // Create service record
        const { error: serviceError } = await supabase
          .from('services')
          .insert({
            name: productData.name,
            description: productData.description || "",
            user_uuid: user.id,
            expert_uuid: user.id,
            category: productData.serviceCategory || 'other',
            features: productData.serviceFeatures || [],
            delivery_time: productData.serviceDeliveryTime || '1 week',
            revisions: productData.serviceRevisions || 1,
            price: productData.price || 0,
            status: 'draft',
          });

        if (serviceError) throw serviceError;
      }

      toast.success("Product created successfully!");
      navigate(`/products/${product.product_uuid}/edit`);
      
      return product;
    } catch (error) {
      console.error('Error creating product:', error);
      toast.error("Failed to create product");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    createProduct,
    isLoading,
  };
}
