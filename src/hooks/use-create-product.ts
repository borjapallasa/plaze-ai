
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Variant } from "@/components/product/types/variants";

export type ProductStatus = "draft" | "active" | "inactive" | "review";

export interface CreateProductData {
  name: string;
  description: string;
  status: ProductStatus;
  variants: Variant[];
  images?: File[];
  thumbnailFile?: File;
  demo?: string;
  productIncludes?: string;
  techStack?: string;
  techStackPrice?: string;
  difficultyLevel?: string;
  industries?: string[];
  useCases?: string[];
  platform?: string[];
  team?: string[];
}

export function useCreateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateProductData) => {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;
      if (!user) throw new Error('No authenticated user found');

      // Create the product
      const { data: product, error: productError } = await supabase
        .from('products')
        .insert({
          user_uuid: user.id,
          name: data.name,
          description: data.description,
          status: data.status,
          demo: data.demo,
          product_includes: data.productIncludes,
          tech_stack: data.techStack,
          tech_stack_price: data.techStackPrice,
          difficulty_level: data.difficultyLevel,
          industries: data.industries,
          use_case: data.useCases,
          platform: data.platform,
          team: data.team,
          price_from: data.variants.length > 0 ? Math.min(...data.variants.map(v => v.price)) : 0,
          price_to: data.variants.length > 0 ? Math.max(...data.variants.map(v => v.price)) : 0
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
            product_uuid: product.product_uuid,
            name: variant.name,
            price: variant.price,
            compare_price: variant.comparePrice || null,
            highlighted: variant.highlight || false,
            tags: variant.tags || [],
            files_link: variant.filesLink || '',
            additional_details: variant.additionalDetails || ''
          });

        if (variantError) throw variantError;
      }

      // Handle thumbnail upload
      if (data.thumbnailFile) {
        const fileName = `${product.product_uuid}/thumbnail-${Date.now()}.${data.thumbnailFile.name.split('.').pop()}`;
        
        const { error: uploadError } = await supabase.storage
          .from('product_images')
          .upload(fileName, data.thumbnailFile);

        if (uploadError) {
          console.error('Thumbnail upload error:', uploadError);
        } else {
          const { data: { publicUrl } } = supabase.storage
            .from('product_images')
            .getPublicUrl(fileName);

          // Update product with thumbnail URL
          const { error: updateError } = await supabase
            .from('products')
            .update({ thumbnail: publicUrl })
            .eq('product_uuid', product.product_uuid);

          if (updateError) console.error('Error updating product with thumbnail:', updateError);
        }
      }

      // Handle additional image uploads
      if (data.images && data.images.length > 0) {
        for (const image of data.images) {
          const fileName = `${product.product_uuid}/image-${Date.now()}-${image.name}`;
          
          const { error: uploadError } = await supabase.storage
            .from('product_images')
            .upload(fileName, image);

          if (uploadError) {
            console.error('Image upload error:', uploadError);
          } else {
            // Create product image record
            const { error: imageRecordError } = await supabase
              .from('product_images')
              .insert({
                product_uuid: product.product_uuid,
                storage_path: fileName,
                file_name: image.name,
                content_type: image.type,
                size: image.size
              });

            if (imageRecordError) console.error('Error creating image record:', imageRecordError);
          }
        }
      }

      return product;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('Product created successfully!');
    },
    onError: (error) => {
      console.error('Error creating product:', error);
      toast.error('Failed to create product');
    }
  });
}
