import React from "react";
import { useParams } from "react-router-dom";
import { MainHeader } from "@/components/MainHeader";
import { Toaster } from "@/components/ui/toaster";
import { CommunityHeader } from "@/components/community/CommunityHeader";
import { CommunityBasicInfo } from "@/components/community/CommunityBasicInfo";
import { CommunityStats } from "@/components/community/CommunityStats";
import { useCommunityImages } from "@/hooks/use-community-images";
import { useCommunityForm } from "@/hooks/use-community-form";
import { CommunityMediaUpload } from "@/components/community/CommunityMediaUpload";
import { AffiliateCommunitySection } from "@/components/community/AffiliateCommunitySection";
import { CommunityMainForm } from "@/components/community/CommunityMainForm";
import { CommunitySocialLinks } from "@/components/community/CommunitySocialLinks";
import { CommunityImageCard } from "@/components/community/CommunityImageCard";
import { CommunityDangerZone } from "@/components/community/CommunityDangerZone";

export default function EditCommunity() {
  const { id } = useParams();
  const {
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
  } = useCommunityForm(id);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="mt-16 p-6">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <MainHeader />
      
      <div className="pt-16">
        <div className="container mx-auto px-4 py-6">
          <CommunityHeader />
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Main Form */}
            <div className="lg:col-span-2 space-y-6">
              <CommunityMainForm
                communityName={communityName}
                setCommunityName={setCommunityName}
                communityDescription={communityDescription}
                setCommunityDescription={setCommunityDescription}
                communityIntro={communityIntro}
                setCommunityIntro={setCommunityIntro}
                price={price}
                setPrice={setPrice}
                pricePeriod={pricePeriod}
                setPricePeriod={setPricePeriod}
                communityType={communityType}
                setCommunityType={setCommunityType}
                webhook={webhook}
                setWebhook={setWebhook}
              />

              <CommunitySocialLinks
                links={links}
                onAddLink={handleAddLink}
                onLinkChange={handleLinkChange}
                onRemoveLink={handleRemoveLink}
              />

              <CommunityMediaUpload communityId={id} />
            </div>

            {/* Right Column - Stats and Actions */}
            <div className="space-y-6">
              <CommunityStats 
                community={community}
                communityStatus={communityStatus}
                setCommunityStatus={setCommunityStatus}
                onSave={handleSave}
                isSaving={isSaving}
              />
              
              <CommunityImageCard communityId={id} />
              
              <CommunityDangerZone
                isDeleting={isDeleting}
                showDeleteDialog={showDeleteDialog}
                setShowDeleteDialog={setShowDeleteDialog}
                onDeleteCommunity={handleDeleteCommunity}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
