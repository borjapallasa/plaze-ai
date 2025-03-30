
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MainHeader } from "@/components/MainHeader";
import { CommunityProductForm } from "@/components/community/CommunityProductForm";
import { useCreateCommunityProduct } from "@/hooks/use-create-community-product";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function NewCommunityProductPage() {
  const { id: communityId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { createCommunityProduct, isCreating } = useCreateCommunityProduct();
  
  const [communityName, setCommunityName] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCommunityDetails = async () => {
      if (!communityId) return;

      try {
        const { data, error } = await supabase
          .from("communities")
          .select("name")
          .eq("community_uuid", communityId)
          .single();

        if (error) {
          console.error("Error fetching community details:", error);
          setError("Failed to load community details");
          toast.error("Failed to load community details");
          return;
        }

        if (data) {
          setCommunityName(data.name);
        }
      } catch (err) {
        console.error("Error in fetching community:", err);
        setError("An unexpected error occurred");
        toast.error("An unexpected error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCommunityDetails();
  }, [communityId]);

  const handleSubmit = async (data: any) => {
    if (!communityId) {
      toast.error("Community ID is missing");
      return;
    }

    try {
      await createCommunityProduct({
        name: data.name,
        communityUuid: communityId,
        productType: data.productType,
        price: data.price ? parseFloat(data.price) : undefined,
        paymentLink: data.paymentLink || undefined,
      });

      toast.success("Product added to your community successfully");
      navigate(`/community/${communityId}`);
    } catch (error) {
      // Error is already handled in the hook
      console.error("Error in form submission:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <MainHeader />
        <div className="container max-w-6xl py-12">
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2">Loading community details...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <MainHeader />
        <div className="container max-w-6xl py-12">
          <div className="flex flex-col items-center justify-center h-64">
            <h2 className="text-xl font-semibold text-destructive mb-2">Error</h2>
            <p>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <MainHeader />
      <div className="container max-w-6xl py-12">
        <CommunityProductForm
          communityId={communityId || ""}
          communityName={communityName}
          onSubmit={handleSubmit}
          isSubmitting={isCreating}
        />
      </div>
    </div>
  );
}
