
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import type { Json } from "@/integrations/supabase/types";

export type BillingPeriod = "monthly" | "yearly";
export type CommunityType = "free" | "paid";
export type CommunityVisibility = "public" | "private" | "draft";

interface CommunityData {
  name: string;
  intro: string;
  description: string;
  price: number;
  type: CommunityType;
  billing_period: BillingPeriod;
  visibility: CommunityVisibility;
  links: { platform: string; url: string }[];
  thumbnail?: string;
  videoUrl?: string;
}

export const useCreateCommunity = () => {
  const [isCreating, setIsCreating] = useState(false);
  const { user } = useAuth();

  const createCommunity = async (communityData: CommunityData) => {
    if (!user) {
      throw new Error("User not authenticated");
    }

    setIsCreating(true);
    
    try {
      const { data: expertData, error: expertError } = await supabase
        .from("experts")
        .select("expert_uuid")
        .eq("user_uuid", user.id)
        .single();

      if (expertError) {
        console.error("Error fetching expert:", expertError);
        throw expertError;
      }

      const expertUuid = expertData?.expert_uuid;

      const { data, error } = await supabase
        .from("communities")
        .insert({
          user_uuid: user.id,
          expert_uuid: expertUuid,
          name: communityData.name,
          intro: communityData.intro || communityData.videoUrl || "",
          description: communityData.description,
          price: communityData.price,
          type: communityData.type,
          billing_period: communityData.billing_period,
          visibility: communityData.visibility,
          links: communityData.links as unknown as Json,
          thumbnail: communityData.thumbnail || null,
        })
        .select()
        .single();

      if (error) {
        console.error("Error creating community:", error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error("Community creation failed:", error);
      throw error;
    } finally {
      setIsCreating(false);
    }
  };

  return { createCommunity, isCreating };
};
