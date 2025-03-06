
import React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
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
  onCommunityTypeChange: (value: CommunityType) => void;
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
  onCommunityNameChange,
  onCommunityIntroChange,
  onCommunityDescriptionChange,
  onPriceChange,
  onCommunityTypeChange,
  onBillingPeriodChange,
}: CommunityMainFormProps) {
  return (
    <Card>
      <CardContent className="p-6 space-y-4">
        <div>
          <Label htmlFor="name" className="text-base font-medium mb-2 block">Community Name</Label>
          <Input
            id="name"
            value={communityName}
            onChange={(e) => onCommunityNameChange(e.target.value)}
            placeholder="Enter a name for your community"
          />
        </div>

        <div>
          <Label htmlFor="intro" className="text-base font-medium mb-2 block">Video Introduction</Label>
          <Input
            id="intro"
            value={communityIntro}
            onChange={(e) => onCommunityIntroChange(e.target.value)}
            placeholder="Enter YouTube or Vimeo video URL"
          />
          <p className="text-xs text-muted-foreground mt-1">Add a video URL to introduce your community</p>
        </div>

        <div>
          <Label htmlFor="description" className="text-base font-medium mb-2 block">Community Description</Label>
          <Textarea
            id="description"
            value={communityDescription}
            onChange={(e) => onCommunityDescriptionChange(e.target.value)}
            placeholder="Describe what your community is all about"
            rows={5}
          />
        </div>

        <div>
          <Label htmlFor="type" className="text-base font-medium mb-2 block">Community Type</Label>
          <Select value={communityType} onValueChange={onCommunityTypeChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select community type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="free">Free</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {communityType === "paid" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="price" className="text-base font-medium mb-2 block">Price</Label>
              <Input
                id="price"
                type="number"
                value={price}
                onChange={(e) => onPriceChange(e.target.value)}
                placeholder="Enter price"
              />
            </div>

            <div>
              <Label htmlFor="billingPeriod" className="text-base font-medium mb-2 block">Billing Period</Label>
              <Select value={billingPeriod} onValueChange={onBillingPeriodChange}>
                <SelectTrigger>
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
      </CardContent>
    </Card>
  );
}
