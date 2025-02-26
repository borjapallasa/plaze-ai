
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { MainHeader } from "@/components/MainHeader";
import { CommunityForm } from "@/components/community/CommunityForm";
import { Toaster } from "@/components/ui/toaster";

export default function EditCommunity() {
  const { id } = useParams();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [communityName, setCommunityName] = useState("");
  const [communityDescription, setCommunityDescription] = useState("");
  const [communityIntro, setCommunityIntro] = useState("");
  const [price, setPrice] = useState("");

  const { data: community, isLoading } = useQuery({
    queryKey: ['community', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('communities')
        .select('*')
        .eq('community_uuid', id)
        .single();

      if (error) throw error;
      
      if (data) {
        setCommunityName(data.name || "");
        setCommunityDescription(data.description || "");
        setCommunityIntro(data.intro || "");
        setPrice(data.price?.toString() || "");
      }

      return data;
    },
    enabled: !!id
  });

  const handleSave = async () => {
    try {
      setIsSaving(true);

      const { error } = await supabase
        .from('communities')
        .update({
          name: communityName,
          description: communityDescription,
          intro: communityIntro,
          price: parseFloat(price) || 0,
        })
        .eq('community_uuid', id);

      if (error) throw error;

      toast({
        title: "Changes saved",
        description: "Your community has been updated successfully",
        className: "bg-green-50 border-green-200",
      });
    } catch (error) {
      console.error('Error updating community:', error);
      toast({
        title: "Error",
        description: "Failed to update community",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="mt-16 p-6">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="fixed top-0 left-0 right-0 z-50 bg-background">
        <MainHeader />
      </div>
      
      <CommunityForm 
        communityName={communityName}
        communityDescription={communityDescription}
        communityIntro={communityIntro}
        price={price}
        isSaving={isSaving}
        onCommunityNameChange={setCommunityName}
        onCommunityDescriptionChange={setCommunityDescription}
        onCommunityIntroChange={setCommunityIntro}
        onPriceChange={setPrice}
        onSave={handleSave}
      />
      <Toaster />
    </div>
  );
}
