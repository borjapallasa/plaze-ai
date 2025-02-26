
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { MainHeader } from "@/components/MainHeader";
import { Toaster } from "@/components/ui/toaster";
import { CommunityHeader } from "@/components/community/CommunityHeader";
import { CommunityBasicInfo } from "@/components/community/CommunityBasicInfo";
import { CommunityStats } from "@/components/community/CommunityStats";

export default function EditCommunity() {
  const { id } = useParams();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [communityName, setCommunityName] = useState("");
  const [communityDescription, setCommunityDescription] = useState("");
  const [communityIntro, setCommunityIntro] = useState("");
  const [price, setPrice] = useState("");
  const [pricePeriod, setPricePeriod] = useState<"monthly" | "yearly">("monthly");
  const [paymentLink, setPaymentLink] = useState("");
  const [webhook, setWebhook] = useState("");
  const [hasCopied, setHasCopied] = useState(false);

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
        setPricePeriod(data.price_period || "monthly");
        setPaymentLink(data.payment_link || "");
        setWebhook(data.webhook || "");
      }

      return data;
    },
    enabled: !!id
  });

  const { data: communityImages = [] } = useQuery({
    queryKey: ['communityImages', id],
    queryFn: async () => {
      if (!id) return [];

      const { data: images, error } = await supabase
        .from('community_images')
        .select('*')
        .eq('community_uuid', id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return images.map(img => ({
        id: img.id,
        url: supabase.storage.from('community_images').getPublicUrl(img.storage_path).data.publicUrl,
        storage_path: img.storage_path,
        is_primary: img.is_primary,
        file_name: img.file_name
      }));
    },
    enabled: !!id
  });

  const handleSave = async () => {
    try {
      setIsSaving(true);

      const primaryImage = communityImages.find(img => img.is_primary);
      
      const { error } = await supabase
        .from('communities')
        .update({
          name: communityName,
          description: communityDescription,
          intro: communityIntro,
          price: parseFloat(price) || 0,
          price_period: pricePeriod,
          webhook: webhook,
          thumbnail: primaryImage?.url || null
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

  const handleCopyPaymentLink = async () => {
    if (!paymentLink) return;
    
    try {
      await navigator.clipboard.writeText(paymentLink);
      setHasCopied(true);
      toast({
        description: "Payment link copied to clipboard",
      });
      
      setTimeout(() => {
        setHasCopied(false);
      }, 2000);
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Please try again",
        variant: "destructive",
      });
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
      
      <div className="container mx-auto px-4 pt-24 pb-8">
        <CommunityHeader onSave={handleSave} isSaving={isSaving} />

        <div className="space-y-4 sm:space-y-6 lg:space-y-0 lg:grid lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-8">
            <CommunityBasicInfo
              communityName={communityName}
              setCommunityName={setCommunityName}
              communityIntro={communityIntro}
              setCommunityIntro={setCommunityIntro}
              communityDescription={communityDescription}
              setCommunityDescription={setCommunityDescription}
              price={price}
              setPrice={setPrice}
              pricePeriod={pricePeriod}
              setPricePeriod={setPricePeriod}
              webhook={webhook}
              setWebhook={setWebhook}
              communityUuid={id || ''}
              communityImages={communityImages}
            />
          </div>

          <div className="lg:col-span-4">
            <CommunityStats
              paymentLink={paymentLink}
              onCopyPaymentLink={handleCopyPaymentLink}
              hasCopied={hasCopied}
              webhook={webhook}
              setWebhook={setWebhook}
              community={community}
            />
          </div>
        </div>
      </div>
      <Toaster />
    </div>
  );
}
