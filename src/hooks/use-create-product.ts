
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { uploadPendingImages } from "@/hooks/use-pending-images";
import { Variant } from "@/components/product/types/variants";

export type ProductStatus = "draft" | "active" | "inactive";

export interface CreateProductData {
  name: string;
  description: string;
  techStack: string;
  techStackPrice: string;
  productIncludes: string;
  difficultyLevel: string;
  demo: string;
  status: ProductStatus;
  industries: string[];
  useCases: string[];
  platform: string[];
  team: string[];
  variants: Variant[];
  pendingImages: Array<{ file: File; previewUrl: string }>;
}

export function useCreateProduct() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (data: CreateProductData) => {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;
      if (!user) throw new Error('No authenticated user found');

      // Create product
      const { data: productData, error: productError } = await supabase
        .from('products')
        .insert({
          user_uuid: user.id,
          name: data.name,
          description: data.description,
          tech_stack: data.techStack,
          tech_stack_price: data.techStackPrice,
          product_includes: data.productIncludes,
          difficulty_level: data.difficultyLevel,
          demo: data.demo,
          status: data.status,
          industries: data.industries,
          use_case: data.useCases,
          platform: data.platform,
          team: data.team
        })
        .select()
        .single();

      if (productError) throw productError;

      // Create variants
      for (const variant of data.variants) {
        const { error: variantError } = await supabase
          .from('variants')
          .insert({
            user_uuid: user.id,
            product_uuid: productData.product_uuid,
            name: variant.name,
            price: variant.price,
            compare_price: variant.comparePrice,
            highlighted: variant.highlight,
            tags: variant.tags,
            files_link: variant.filesLink,
            additional_details: variant.additionalDetails
          });

        if (variantError) throw variantError;
      }

      // Upload images
      if (data.pendingImages.length > 0) {
        await uploadPendingImages(data.pendingImages, productData.product_uuid);
      }

      toast.success("Product created successfully!");
      navigate(`/product/${productData.product_uuid}/edit`);
      
      return productData;
    },
    onError: (error) => {
      console.error('Error creating product:', error);
      toast.error("Failed to create product");
    }
  });

  return {
    mutate: mutation.mutate,
    isLoading: mutation.isPending,
    error: mutation.error,
    handleSave: mutation.mutate,
    isSaving: mutation.isPending
  };
}
