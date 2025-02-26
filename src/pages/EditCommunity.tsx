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
import { useCommunityImages } from "@/hooks/use-community-images";

interface Link {
  name: string;
  url: string;
}

function isValidLink(link: unknown): link is Link {
  if (typeof link !== 'object' || link === null) return false;
  const l = link as any;
  return typeof l.name === 'string' && typeof l.url === 'string';
}

function parseLinks(data: unknown): Link[] {
  if (!Array.isArray(data)) return [{ name: "", url: "" }];
  const validLinks = data.filter(isValidLink);
  return validLinks.length > 0 ? validLinks : [{ name: "", url: "" }];
}

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
  const [links, setLinks] = useState<Link[]>([{ name: "", url: "" }]);

  // Use the community images hook with staleTime and cacheTime
  const { images: communityImages } = useCommunityImages(id);

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
        setLinks(parseLinks(data.links));
      }

      return data;
    },
    enabled: !!id,
    // Add staleTime to prevent unnecessary refetches
    staleTime: 1000 * 60 * 5, // Consider data fresh for 5 minutes
    // Add cacheTime to keep data in cache
    gcTime: 1000 * 60 * 10, // Keep in cache for 10 minutes
    // Disable automatic refetching
    refetchOnWindowFocus: false,
    refetchOnReconnect: false
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
          thumbnail: primaryImage?.url || null,
          links: JSON.stringify(links.filter(link => link.name && link.url)) // Convert to JSON string for JSONB column
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

  const handleAddLink = () => {
    setLinks([...links, { name: "", url: "" }]);
  };

  const handleLinkChange = (index: number, field: keyof Link, value: string) => {
    const newLinks = [...links];
    newLinks[index][field] = value;
    setLinks(newLinks);
  };

  const handleRemoveLink = (index: number) => {
    setLinks(links.filter((_, i) => i !== index));
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
              links={links}
              onLinkChange={handleLinkChange}
              onAddLink={handleAddLink}
              onRemoveLink={handleRemoveLink}
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
