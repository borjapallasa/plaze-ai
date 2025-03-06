
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ProductEditor } from "@/components/product/ProductEditor";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { BillingPeriod, CommunityType, CommunityVisibility } from "@/hooks/use-create-community";

interface CommunityMainFormProps {
  communityName: string;
  communityIntro: string;
  communityDescription: string;
  price: string;
  communityType: CommunityType;
  billingPeriod: BillingPeriod;
  visibility: CommunityVisibility;
  onCommunityNameChange: (value: string) => void;
  onCommunityIntroChange: (value: string) => void;
  onCommunityDescriptionChange: (value: string) => void;
  onPriceChange: (value: string) => void;
  onBillingPeriodChange: (value: BillingPeriod) => void;
  onVisibilityChange: (value: CommunityVisibility) => void;
}

export function CommunityMainForm({
  communityName,
  communityIntro,
  communityDescription,
  price,
  communityType,
  billingPeriod,
  visibility,
  onCommunityNameChange,
  onCommunityIntroChange,
  onCommunityDescriptionChange,
  onPriceChange,
  onBillingPeriodChange,
  onVisibilityChange
}: CommunityMainFormProps) {
  const isPaid = communityType === "paid";

  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-3 sm:p-6">
      <div className="space-y-3 sm:space-y-4">
        <div>
          <Label htmlFor="name" className="text-base font-medium mb-2 block">
            Community Name
          </Label>
          <Input
            id="name"
            value={communityName}
            onChange={(e) => onCommunityNameChange(e.target.value)}
            placeholder="Enter your community name"
            className="h-11"
          />
        </div>

        <div>
          <Label htmlFor="intro" className="text-base font-medium mb-2 block">
            Video Introduction
          </Label>
          <Input
            id="intro"
            value={communityIntro}
            onChange={(e) => onCommunityIntroChange(e.target.value)}
            placeholder="Enter YouTube or Vimeo video URL"
            className="h-11"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="communityType" className="text-base font-medium mb-2 block">
              Community Type
            </Label>
            <Select value={communityType} disabled>
              <SelectTrigger className="h-11">
                <SelectValue placeholder="Select community type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="free">Free</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="visibility" className="text-base font-medium mb-2 block">
              Visibility
            </Label>
            <Select value={visibility} onValueChange={onVisibilityChange}>
              <SelectTrigger className="h-11">
                <SelectValue placeholder="Select visibility" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="public">Public</SelectItem>
                <SelectItem value="private">Private</SelectItem>
                <SelectItem value="unlisted">Unlisted</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label htmlFor="description" className="text-base font-medium mb-2 block">
            Description
          </Label>
          <ProductEditor
            value={communityDescription}
            onChange={onCommunityDescriptionChange}
            placeholder="Write your community description..."
          />
        </div>

        {isPaid && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="price" className="text-base font-medium mb-2 block">
                Price
              </Label>
              <Input
                id="price"
                type="number"
                value={price}
                onChange={(e) => onPriceChange(e.target.value)}
                placeholder="Enter community price"
                className="h-11"
              />
            </div>

            <div>
              <Label htmlFor="billingPeriod" className="text-base font-medium mb-2 block">
                Billing Period
              </Label>
              <Select value={billingPeriod} onValueChange={onBillingPeriodChange}>
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="Select billing period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
