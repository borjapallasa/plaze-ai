
import React from "react";
import { CommunityFormHeader } from "@/components/community/form/CommunityFormHeader";
import { CommunityMainForm } from "@/components/community/form/CommunityMainForm";
import { CommunitySocialLinks } from "@/components/community/form/CommunitySocialLinks";
import { CommunityStatusCard } from "@/components/community/form/CommunityStatusCard";
import type { BillingPeriod, CommunityType, CommunityVisibility } from "@/hooks/use-create-community";

interface CommunityFormProps {
  communityName: string;
  communityIntro: string;
  communityDescription: string;
  price: string;
  communityType: CommunityType;
  billingPeriod: BillingPeriod;
  visibility: CommunityVisibility;
  links: { platform: string; url: string }[];
  isSaving?: boolean;
  onCommunityNameChange: (value: string) => void;
  onCommunityIntroChange: (value: string) => void;
  onCommunityDescriptionChange: (value: string) => void;
  onPriceChange: (value: string) => void;
  onCommunityTypeChange: (value: CommunityType) => void;
  onBillingPeriodChange: (value: BillingPeriod) => void;
  onVisibilityChange: (value: CommunityVisibility) => void;
  onLinkChange: (index: number, field: "platform" | "url", value: string) => void;
  onAddLink: () => void;
  onRemoveLink: (index: number) => void;
  onSave: () => void;
}

export function CommunityForm({
  communityName,
  communityIntro,
  communityDescription,
  price,
  communityType,
  billingPeriod,
  visibility,
  links,
  isSaving = false,
  onCommunityNameChange,
  onCommunityIntroChange,
  onCommunityDescriptionChange,
  onPriceChange,
  onCommunityTypeChange,
  onBillingPeriodChange,
  onVisibilityChange,
  onLinkChange,
  onAddLink,
  onRemoveLink,
  onSave,
}: CommunityFormProps) {
  return (
    <div className="w-full max-w-[1400px] mx-auto px-2 xs:px-3 sm:px-6 lg:px-8 py-3 sm:py-6 mt-16">
      {/* Header - now simplified without status controls */}
      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl font-semibold">Create New Community</h1>
        <p className="text-sm text-muted-foreground mt-1">Set up your community and start building your audience</p>
      </div>

      <div className="space-y-3 sm:space-y-6 lg:space-y-0 lg:grid lg:grid-cols-12 lg:gap-6">
        {/* Left column - Main form content */}
        <div className="lg:col-span-8">
          <div className="space-y-3 sm:space-y-6">
            <CommunityMainForm
              communityName={communityName}
              communityIntro={communityIntro}
              communityDescription={communityDescription}
              price={price}
              communityType={communityType}
              billingPeriod={billingPeriod}
              visibility={visibility}
              onCommunityNameChange={onCommunityNameChange}
              onCommunityIntroChange={onCommunityIntroChange}
              onCommunityDescriptionChange={onCommunityDescriptionChange}
              onPriceChange={onPriceChange}
              onCommunityTypeChange={onCommunityTypeChange}
              onBillingPeriodChange={onBillingPeriodChange}
              onVisibilityChange={onVisibilityChange}
            />
          </div>
        </div>

        {/* Right column - Status Card and Social Links */}
        <div className="lg:col-span-4 self-start">
          <div className="space-y-3 sm:space-y-6">
            <CommunityStatusCard
              visibility={visibility}
              onVisibilityChange={onVisibilityChange}
              onSave={onSave}
              isSaving={isSaving}
            />
            
            <CommunitySocialLinks
              links={links}
              onLinkChange={onLinkChange}
              onAddLink={onAddLink}
              onRemoveLink={onRemoveLink}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
