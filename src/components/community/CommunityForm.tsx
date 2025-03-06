
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ProductEditor } from "@/components/product/ProductEditor";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
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
  const isPaid = communityType === "paid";
  
  return (
    <div className="w-full max-w-[1400px] mx-auto px-2 xs:px-3 sm:px-6 lg:px-8 py-3 sm:py-6 mt-16">
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row items-start gap-2 sm:gap-4">
          <Link to="/communities">
            <Button variant="ghost" size="icon" className="rounded-full flex-shrink-0 h-8 w-8 sm:h-10 sm:w-10 mt-1">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div className="w-full">
            <h1 className="text-lg sm:text-xl md:text-2xl font-semibold break-words pr-2">Create New Community</h1>
            <div className="flex items-center justify-between mt-2">
              <p className="text-sm text-muted-foreground">Enter the details for your new community</p>
              <div className="flex items-center gap-4">
                <Select value={communityType} onValueChange={onCommunityTypeChange}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="free">Free</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                  </SelectContent>
                </Select>
                <Button 
                  onClick={onSave}
                  disabled={isSaving || !communityName.trim()}
                >
                  {isSaving ? "Creating..." : "Create Community"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-3 sm:space-y-6 lg:space-y-0 lg:grid lg:grid-cols-12 lg:gap-6">
        {/* Left column - Main form content */}
        <div className="lg:col-span-8">
          <div className="space-y-3 sm:space-y-6">
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
          </div>
        </div>

        {/* Right column - Social Links */}
        <div className="lg:col-span-4 self-start">
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-3 sm:p-6">
            <div className="mb-4">
              <Label className="text-base font-medium">Social Links</Label>
              <p className="text-sm text-muted-foreground mt-1">Add links to your social media profiles</p>
            </div>
            
            <div className="space-y-3">
              {links.map((link, index) => (
                <div key={index} className="grid grid-cols-[1fr,auto] gap-2">
                  <div className="space-y-2">
                    <Input
                      placeholder="Platform (e.g., Twitter, Instagram)"
                      value={link.platform}
                      onChange={(e) => onLinkChange(index, "platform", e.target.value)}
                    />
                    <Input
                      placeholder="URL"
                      value={link.url}
                      onChange={(e) => onLinkChange(index, "url", e.target.value)}
                    />
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => onRemoveLink(index)}
                    className="self-center"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              
              <Button
                type="button"
                variant="outline"
                onClick={onAddLink}
                className="w-full mt-2"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Link
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
