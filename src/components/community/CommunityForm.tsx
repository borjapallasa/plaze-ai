
import React from "react";
import { CommunityFormHeader } from "@/components/community/form/CommunityFormHeader";
import { CommunityMainForm } from "@/components/community/form/CommunityMainForm";
import { CommunitySocialLinks } from "@/components/community/form/CommunitySocialLinks";
import type { BillingPeriod, CommunityType } from "@/hooks/use-create-community";

interface CommunityFormProps {
  communityName: string;
  communityIntro: string;
  communityDescription: string;
  price: string;
  communityType: CommunityType;
  billingPeriod: BillingPeriod;
  links: { platform: string; url: string }[];
  isSaving?: boolean;
  onCommunityNameChange: (value: string) => void;
  onCommunityIntroChange: (value: string) => void;
  onCommunityDescriptionChange: (value: string) => void;
  onPriceChange: (value: string) => void;
  onCommunityTypeChange: (value: CommunityType) => void;
  onBillingPeriodChange: (value: BillingPeriod) => void;
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
  links,
  isSaving = false,
  onCommunityNameChange,
  onCommunityIntroChange,
  onCommunityDescriptionChange,
  onPriceChange,
  onCommunityTypeChange,
  onBillingPeriodChange,
  onLinkChange,
  onAddLink,
  onRemoveLink,
  onSave,
}: CommunityFormProps) {
  return (
    <div className="w-full max-w-[1400px] mx-auto px-2 xs:px-3 sm:px-6 lg:px-8 py-3 sm:py-6 mt-16">
      <CommunityFormHeader
        communityName={communityName}
        communityType={communityType}
        onCommunityTypeChange={onCommunityTypeChange}
        onSave={onSave}
        isSaving={isSaving}
      />

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
              onCommunityNameChange={onCommunityNameChange}
              onCommunityIntroChange={onCommunityIntroChange}
              onCommunityDescriptionChange={onCommunityDescriptionChange}
              onPriceChange={onPriceChange}
              onBillingPeriodChange={onBillingPeriodChange}
            />
          </div>
        </div>

        {/* Right column - Social Links */}
        <div className="lg:col-span-4 self-start">
          <CommunitySocialLinks
            links={links}
            onLinkChange={onLinkChange}
            onAddLink={onAddLink}
            onRemoveLink={onRemoveLink}
          />
        </div>
      </div>
    </div>
  );
}
