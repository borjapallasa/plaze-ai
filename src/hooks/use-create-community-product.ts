
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

export type CommunityProductType = "free" | "paid";

interface CommunityProductData {
  name: string;
  communityUuid: string;
  productType: CommunityProductType;
  price?: number;
  paymentLink?: string;
  filesLink?: string;
}

export const useCreateCommunityProduct = () => {
  const [isCreating, setIsCreating] = useState(false);
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const createCommunityProduct = async (productData: CommunityProductData) => {
    if (!user) {
      toast.error("You must be logged in to create a community product");
      throw new Error("User not authenticated");
    }

    if (!productData.communityUuid) {
      toast.error("Community ID is required");
      throw new Error("Community ID is required");
    }

    setIsCreating(true);
    
    try {
      // Verify user has permission to add products to this community
      const { data: communityData, error: communityError } = await supabase
        .from("communities")
        .select("user_uuid")
        .eq("community_uuid", productData.communityUuid)
        .single();

      if (communityError) {
        console.error("Error verifying community ownership:", communityError);
        throw new Error("Could not verify community ownership");
      }

      if (communityData.user_uuid !== user.id) {
        throw new Error("You do not have permission to add products to this community");
      }

      // Create the community product
      const { data, error } = await supabase
        .from("community_products")
        .insert({
          name: productData.name,
          community_uuid: productData.communityUuid,
          product_type: productData.productType,
          price: productData.productType === "paid" ? productData.price : null,
          payment_link: productData.productType === "paid" ? productData.paymentLink : null,
          files_link: productData.filesLink || null,
        })
        .select()
        .single();

      if (error) {
        console.error("Error creating community product:", error);
        throw error;
      }

      // Create the product relationship to make it appear in the community
      const { error: relationshipError } = await supabase
        .from("community_product_relationships")
        .insert({
          community_uuid: productData.communityUuid,
          community_product_uuid: data.community_product_uuid,
          user_uuid: user.id,
        });

      if (relationshipError) {
        console.error("Error creating product relationship:", relationshipError);
        toast.error("Product created but not fully linked to community");
      }

      // Invalidate related queries to refresh the UI
      queryClient.invalidateQueries({ queryKey: ['classroomCommunityProducts', productData.communityUuid] });
      queryClient.invalidateQueries({ queryKey: ['communityProducts', productData.communityUuid] });
      queryClient.invalidateQueries({ queryKey: ['communityProductRelationships'] });

      toast.success("Community product created successfully");
      return data;
    } catch (error) {
      console.error("Community product creation failed:", error);
      toast.error("Failed to create community product");
      throw error;
    } finally {
      setIsCreating(false);
    }
  };

  return { createCommunityProduct, isCreating };
};
