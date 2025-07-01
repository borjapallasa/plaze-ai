
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

export default function EditCommunity() {
  const { id } = useParams();
  const { images: communityImages } = useCommunityImages(id);
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
      <div className="fixed top-0 left-0 right-0 z-50 bg-background">
        <MainHeader />
      </div>

      <div className="container mx-auto px-4 pt-24 pb-8">
        <CommunityHeader onSave={handleSave} isSaving={isSaving} />

        <div className="space-y-4 sm:space-y-6 lg:space-y-0 lg:grid lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-8">
            <div className="space-y-6">
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
                communityType={communityType}
                setCommunityType={setCommunityType}
                communityUuid={id || ''}
                links={links}
                onLinkChange={handleLinkChange}
                onAddLink={handleAddLink}
                onRemoveLink={handleRemoveLink}
              />
              
              <div className="border rounded-lg p-6">
                <h2 className="text-lg font-semibold mb-4">Community Media</h2>
                <CommunityMediaUpload
                  communityUuid={id || ''}
                  initialImages={communityImages}
                />
              </div>
            </div>
          </div>

          <div className="lg:col-span-4">
            <div className="space-y-6">
              <CommunityStats
                paymentLink={paymentLink}
                onCopyPaymentLink={handleCopyPaymentLink}
                hasCopied={hasCopied}
                webhook={webhook}
                setWebhook={setWebhook}
                community={community}
                showDeleteDialog={showDeleteDialog}
                setShowDeleteDialog={setShowDeleteDialog}
                isDeleting={isDeleting}
                onDeleteCommunity={handleDeleteCommunity}
                communityName={communityName}
              />
              
              <AffiliateCommunitySection communityUuid={id} />
            </div>
          </div>
        </div>
      </div>
      <Toaster />
    </div>
  );
}
