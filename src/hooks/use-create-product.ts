import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Variant } from "@/components/product/types/variants";
import { PendingImage, usePendingImages } from "@/hooks/use-pending-images";

export type ProductStatus = 'draft' | 'active' | 'inactive';

export interface ProductData {
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
  pendingImages?: PendingImage[]
}

export function useCreateProduct() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const { uploadPendingImages } = usePendingImages();

  const { data: currentUser } = useQuery({
    queryKey: ['currentUser'],
    queryFn: async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) throw error;
      return user;
    }
  });

  const { data: expertData } = useQuery({
    queryKey: ['expertUuid', currentUser?.id],
    queryFn: async () => {
      if (!currentUser?.id) throw new Error('No user logged in');
      
      const { data, error } = await supabase
        .from('experts')
        .select('expert_uuid')
        .eq('user_uuid', currentUser.id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!currentUser?.id
  });

  const handleSave = async (productData: ProductData) => {
    if (!currentUser?.id) {
      toast({
        title: "Error",
        description: "You must be logged in to create a product",
        variant: "destructive",
      });
      return;
    }

    if (!expertData?.expert_uuid) {
      toast({
        title: "Error",
        description: "Expert profile not found",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSaving(true);
      console.log('Starting product creation...');

      // Step 1: Create the product first and wait for the response
      const { data: product, error: productError } = await supabase
        .from('products')
        .insert({
          status: productData.status,
          name: productData.name,
          description: productData.description,
          tech_stack: productData.techStack,
          tech_stack_price: productData.techStackPrice,
          product_includes: productData.productIncludes,
          difficulty_level: productData.difficultyLevel,
          demo: productData.demo,
          industries: productData.industries,
          use_case: productData.useCases,
          platform: productData.platform,
          team: productData.team,
          user_uuid: currentUser.id,
          expert_uuid: expertData.expert_uuid,
        })
        .select()
        .single();

      if (productError) {
        console.error('Product creation error:', productError);
        throw productError;
      }

      console.log('Product created successfully:', product);

      // Step 2: Double-check that we have a valid product UUID
      if (!product?.product_uuid) {
        throw new Error('Product created but no UUID was returned');
      }

      // Step 3: Create variants if any
      if (productData.variants.length > 0) {
        console.log('Creating variants...');
        const variantsToInsert = productData.variants.map(variant => ({
          name: variant.name,
          price: Number(variant.price) || 0,
          compare_price: Number(variant.comparePrice) || 0,
          highlighted: variant.highlight,
          tags: variant.tags,
          product_uuid: product.product_uuid,
          user_uuid: currentUser.id,
          created_at: variant.createdAt,
          files_link: variant.filesLink,
        }));

        const { error: variantsError } = await supabase
          .from('variants')
          .insert(variantsToInsert);

        if (variantsError) {
          console.error('Variants creation error:', variantsError);
          throw variantsError;
        }
        console.log('Variants created successfully');
      }

      // Step 4: Upload images and wait for completion
      console.log('Starting image upload...');
      await uploadPendingImages(product.product_uuid, productData?.pendingImages);
      console.log('Images uploaded successfully');

      // Step 5: Verify the product and its images
      console.log('Verifying product creation...');
      const { data: verifyProduct, error: verifyError } = await supabase
        .from('products')
        .select('*, product_images(*)')
        .eq('product_uuid', product.product_uuid)
        .single();

      if (verifyError) {
        console.error('Product verification error:', verifyError);
        throw verifyError;
      }

      console.log('Product verified with images:', verifyProduct);

      toast({
        title: "Success",
        description: "Product created successfully",
        className: "bg-[#F2FCE2] border-green-100 text-green-800",
      });

      // Finally, navigate to the product page
      navigate(`/product/${product.product_uuid}`);

    } catch (error) {
      console.error('Error in handleSave:', error);
      toast({
        title: "Error",
        description: "Failed to create product",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return {
    handleSave,
    isSaving,
    currentUser,
    expertData
  };
}
