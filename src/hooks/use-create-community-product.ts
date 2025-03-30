
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";

export type CommunityProductType = "free" | "paid";

interface CommunityProductData {
  name: string;
  communityUuid: string;
  productType: CommunityProductType;
  price?: number;
  paymentLink?: string;
}

export const useCreateCommunityProduct = () => {
  const [isCreating, setIsCreating] = useState(false);
  const { user } = useAuth();

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
        })
        .select()
        .single();

      if (error) {
        console.error("Error creating community product:", error);
        throw error;
      }

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
