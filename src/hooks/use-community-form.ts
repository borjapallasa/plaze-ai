
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

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
  try {
    if (typeof data === 'string') {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed)) {
        const validLinks = parsed.filter(isValidLink);
        return validLinks.length > 0 ? validLinks : [{ name: "", url: "" }];
      }
    }
    if (Array.isArray(data)) {
      const validLinks = data.filter(isValidLink);
      return validLinks.length > 0 ? validLinks : [{ name: "", url: "" }];
    }
  } catch (e) {
    console.error('Error parsing links:', e);
  }
  return [{ name: "", url: "" }];
}

export function useCommunityForm(id: string | undefined) {
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
        setPricePeriod(data.billing_period || "monthly");
        setPaymentLink(data.payment_link || "");
        setWebhook(data.webhook || "");
        
        const parsedLinks = parseLinks(data.links);
        setLinks(parsedLinks);
      }

      return data;
    },
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false
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
          billing_period: pricePeriod,
          webhook: webhook,
          links: JSON.stringify(links.filter(link => link.name && link.url))
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

  return {
    communityName,
    setCommunityName,
    communityDescription,
    setCommunityDescription,
    communityIntro,
    setCommunityIntro,
    price,
    setPrice,
    pricePeriod,
    setPricePeriod,
    paymentLink,
    webhook,
    setWebhook,
    hasCopied,
    links,
    community,
    isLoading,
    isSaving,
    handleSave,
    handleCopyPaymentLink,
    handleAddLink,
    handleLinkChange,
    handleRemoveLink
  };
}
