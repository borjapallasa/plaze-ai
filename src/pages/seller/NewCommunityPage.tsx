
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { MainHeader } from "@/components/MainHeader";
import { CommunityForm } from "@/components/sell/community/CommunityForm";
import { useCreateCommunity } from "@/hooks/use-create-community";
import { toast } from "sonner";
import type { CommunityType, BillingPeriod, CommunityVisibility } from "@/hooks/use-create-community";
import { getVideoEmbedUrl } from "@/utils/videoEmbed";

export default function NewCommunityPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const initialFormData = location.state || {};
  const { createCommunity, isCreating } = useCreateCommunity();

  const [formData, setFormData] = useState({
    name: initialFormData.name || "",
    description: initialFormData.description || "",
    intro: initialFormData.intro || initialFormData.videoUrl || "",
    type: initialFormData.type || "free" as CommunityType,
    price: initialFormData.price || "",
    thumbnail: initialFormData.thumbnail || ""
  });

  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    console.log("Initial form data received:", initialFormData);
  }, [initialFormData]);

  const handleFormChange = (field: string, value: any) => {
    console.log(`Updating field ${field} with value:`, value);
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageUpload = async (file: File) => {
    setIsUploading(true);
    try {
      // Handle image upload logic here
      console.log("Uploading image:", file);
      // For now, just create a mock URL
      const imageUrl = URL.createObjectURL(file);
      handleFormChange("thumbnail", imageUrl);
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Failed to upload image");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      toast.error("Community name is required");
      return;
    }

    try {
      // Process the video URL to ensure it's in the correct format
      const videoUrl = getVideoEmbedUrl(formData.intro) || formData.intro;
      
      const communityData = {
        name: formData.name,
        intro: videoUrl,
        description: formData.description,
        price: parseFloat(formData.price) || 0,
        type: formData.type,
        billing_period: "monthly" as BillingPeriod,
        visibility: "draft" as CommunityVisibility,
        links: [],
        thumbnail: formData.thumbnail,
        videoUrl: initialFormData.videoUrl
      };

      console.log("Submitting community data:", communityData);
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
      <MainHeader />
      <div className="container mx-auto px-4 pt-24 pb-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">Create New Community</h1>
          <CommunityForm
            formData={formData}
            onChange={handleFormChange}
            onImageUpload={handleImageUpload}
            isUploading={isUploading}
          />
          <div className="mt-6 flex justify-end">
            <button
              onClick={handleSave}
              disabled={isCreating}
              className="bg-primary text-primary-foreground px-6 py-2 rounded-md hover:bg-primary/90 disabled:opacity-50"
            >
              {isCreating ? "Creating..." : "Create Community"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
