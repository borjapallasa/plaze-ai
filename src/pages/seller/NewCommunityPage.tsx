
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { DefaultHeader } from "@/components/DefaultHeader";
import { CommunityForm } from "@/components/community/CommunityForm";
import { useCreateCommunity } from "@/hooks/use-create-community";
import { toast } from "sonner";
import type { CommunityType, BillingPeriod, CommunityVisibility } from "@/hooks/use-create-community";
import { getVideoEmbedUrl } from "@/utils/videoEmbed";

export default function NewCommunityPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const initialFormData = location.state || {};
  const { createCommunity, isCreating } = useCreateCommunity();

  const [communityName, setCommunityName] = useState(initialFormData.name || "");
  const [communityIntro, setCommunityIntro] = useState(initialFormData.intro || initialFormData.videoUrl || "");
  const [communityDescription, setCommunityDescription] = useState(initialFormData.description || "");
  const [price, setPrice] = useState(initialFormData.price || "");
  const [communityType, setCommunityType] = useState<CommunityType>(initialFormData.type || "free");
  const [billingPeriod, setBillingPeriod] = useState<BillingPeriod>("monthly");
  const [visibility, setVisibility] = useState<CommunityVisibility>("draft");
  const [links, setLinks] = useState<{ platform: string; url: string }[]>([{ platform: "", url: "" }]);
  const [thumbnail, setThumbnail] = useState(initialFormData.thumbnail || "");

  useEffect(() => {
    console.log("Initial form data received:", initialFormData);
  }, [initialFormData]);

  const handleLinkChange = (index: number, field: "platform" | "url", value: string) => {
    const updatedLinks = [...links];
    updatedLinks[index][field] = value;
    setLinks(updatedLinks);
  };

  const handleAddLink = () => {
    setLinks([...links, { platform: "", url: "" }]);
  };

  const handleRemoveLink = (index: number) => {
    if (links.length > 1) {
      const updatedLinks = [...links];
      updatedLinks.splice(index, 1);
      setLinks(updatedLinks);
    }
  };

  const handleSave = async () => {
    if (!communityName.trim()) {
      toast.error("Community name is required");
      return;
    }

    try {
      const validLinks = links.filter(link => link.platform.trim() && link.url.trim());
      
      // Process the video URL to ensure it's in the correct format
      const videoUrl = getVideoEmbedUrl(communityIntro) || communityIntro;
      
      const communityData = {
        name: communityName,
        intro: videoUrl,
        description: communityDescription,
        price: parseFloat(price) || 0,
        type: communityType,
        billing_period: billingPeriod,
        visibility: visibility,
        links: validLinks,
        thumbnail: thumbnail,
        videoUrl: initialFormData.videoUrl
      };

      const result = await createCommunity(communityData);
      if (result?.community_uuid) {
        toast.success("Community created successfully");
        navigate(`/community/${result.community_uuid}/edit`);
      }
    } catch (error) {
      console.error("Error creating community:", error);
      toast.error("Failed to create community");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <DefaultHeader 
        title="Create New Community"
        subtitle="Enter the details for your new community"
      />
      <CommunityForm
        communityName={communityName}
        communityIntro={communityIntro}
        communityDescription={communityDescription}
        price={price}
        communityType={communityType}
        billingPeriod={billingPeriod}
        visibility={visibility}
        links={links}
        isSaving={isCreating}
        onCommunityNameChange={setCommunityName}
        onCommunityIntroChange={setCommunityIntro}
        onCommunityDescriptionChange={setCommunityDescription}
        onPriceChange={setPrice}
        onCommunityTypeChange={setCommunityType}
        onBillingPeriodChange={setBillingPeriod}
        onVisibilityChange={setVisibility}
        onLinkChange={handleLinkChange}
        onAddLink={handleAddLink}
        onRemoveLink={handleRemoveLink}
        onSave={handleSave}
      />
    </div>
  );
}
