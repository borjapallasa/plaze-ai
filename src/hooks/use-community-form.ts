
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import type { CommunityType } from "@/hooks/use-create-community";

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
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [communityName, setCommunityName] = useState("");
  const [communityDescription, setCommunityDescription] = useState("");
  const [communityIntro, setCommunityIntro] = useState("");
  const [price, setPrice] = useState("");
  const [pricePeriod, setPricePeriod] = useState<"monthly" | "yearly">("monthly");
  const [communityType, setCommunityType] = useState<CommunityType>("free");
  const [communityStatus, setCommunityStatus] = useState<"visible" | "not visible" | "draft">("visible");
  const [paymentLink, setPaymentLink] = useState("");
  const [webhook, setWebhook] = useState("");
  const [hasCopied, setHasCopied] = useState(false);
  const [links, setLinks] = useState<Link[]>([{ name: "", url: "" }]);

  const { data: community, isLoading } = useQuery({
    queryKey: ['community', id],
    queryFn: async () => {
      if (!id) return null;
      
      console.log('Fetching community details for UUID:', id);
      
      const { data, error } = await supabase
        .from('communities')
        .select('*')
        .eq('community_uuid', id)
        .single();

      if (error) {
        console.error('Error fetching community:', error);
        throw error;
      }
      
      if (data) {
        console.log('Setting community data:', data);
        setCommunityName(data.name || "");
        setCommunityDescription(data.description || "");
        setCommunityIntro(data.intro || "");
        setPrice(data.price?.toString() || "");
        setPricePeriod(data.billing_period || "monthly");
        setCommunityType(data.type || "free");
        setCommunityStatus((data.status as "visible" | "not visible" | "draft") || "visible");
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
    if (!id) {
      console.error('No community ID provided');
      toast({
        title: "Error",
        description: "No community ID found",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSaving(true);
      
      console.log('Saving community data:', {
        name: communityName,
        description: communityDescription,
        intro: communityIntro,
        type: communityType,
        price: parseFloat(price) || 0,
        billing_period: pricePeriod,
        status: communityStatus,
        webhook: webhook,
        links: JSON.stringify(links.filter(link => link.name && link.url))
      });

      const { data, error } = await supabase
        .from('communities')
        .update({
          name: communityName,
          description: communityDescription,
          intro: communityIntro,
          type: communityType,
          price: parseFloat(price) || 0,
          billing_period: pricePeriod,
          status: communityStatus,
          webhook: webhook,
          links: JSON.stringify(links.filter(link => link.name && link.url))
        })
        .eq('community_uuid', id)
        .select()
        .single();

      if (error) {
        console.error('Database update error:', error);
        throw error;
      }

      console.log('Update successful, data returned:', data);

      // Invalidate and refetch the community data
      await queryClient.invalidateQueries({ queryKey: ['community', id] });

      toast({
        title: "Changes saved",
        description: "Your community has been updated successfully",
        className: "bg-green-50 border-green-200",
      });
    } catch (error) {
      console.error('Error updating community:', error);
      toast({
        title: "Error",
        description: "Failed to update community. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteCommunity = async (redirectUrl: string) => {
    if (!id) return;
    
    try {
      setIsDeleting(true);
      
      const { error } = await supabase
        .from('communities')
        .delete()
        .eq('community_uuid', id);

      if (error) throw error;

      toast({
        title: "Community deleted",
        description: "Your community has been permanently deleted",
      });
      
      navigate(redirectUrl);
    } catch (error) {
      console.error('Error deleting community:', error);
      toast({
        title: "Error",
        description: "Failed to delete community",
        variant: "destructive",
      });
      setIsDeleting(false);
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
    communityType,
    setCommunityType,
    communityStatus,
    setCommunityStatus,
    paymentLink,
    webhook,
    setWebhook,
    hasCopied,
    links,
    community,
    isLoading,
    isSaving,
    isDeleting,
    showDeleteDialog,
    setShowDeleteDialog,
    handleSave,
    handleDeleteCommunity,
    handleCopyPaymentLink,
    handleAddLink,
    handleLinkChange,
    handleRemoveLink
  };
}
