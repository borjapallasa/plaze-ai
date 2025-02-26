
import React from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";

interface Link {
  name: string;
  url: string;
}

interface CommunityBasicInfoProps {
  communityName: string;
  setCommunityName: (name: string) => void;
  communityIntro: string;
  setCommunityIntro: (intro: string) => void;
  communityDescription: string;
  setCommunityDescription: (description: string) => void;
  price: string;
  setPrice: (price: string) => void;
  pricePeriod: string;
  setPricePeriod: (period: string) => void;
  webhook: string;
  setWebhook: (webhook: string) => void;
  communityUuid: string;
  links: Link[];
  onLinkChange: (index: number, field: 'name' | 'url', value: string) => void;
  onAddLink: () => void;
  onRemoveLink: (index: number) => void;
}

export function CommunityBasicInfo({
  communityName,
  setCommunityName,
  communityIntro,
  setCommunityIntro,
  communityDescription,
  setCommunityDescription,
  price,
  setPrice,
  pricePeriod,
  setPricePeriod,
  webhook,
  setWebhook,
  communityUuid,
  links,
  onLinkChange,
  onAddLink,
  onRemoveLink,
}: CommunityBasicInfoProps) {
  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="communityName">Community Name</Label>
          <Input
            id="communityName"
            value={communityName}
            onChange={(e) => setCommunityName(e.target.value)}
            placeholder="Enter community name"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="communityIntro">Community Video URL</Label>
          <Input
            id="communityIntro"
            value={communityIntro}
            onChange={(e) => setCommunityIntro(e.target.value)}
            placeholder="Enter video URL (YouTube or Vimeo)"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="communityDescription">Community Description</Label>
          <Textarea
            id="communityDescription"
            value={communityDescription}
            onChange={(e) => setCommunityDescription(e.target.value)}
            placeholder="Enter community description"
            className="min-h-[150px]"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="price">Price</Label>
            <Input
              id="price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Enter price"
              type="number"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="pricePeriod">Price Period</Label>
            <Input
              id="pricePeriod"
              value={pricePeriod}
              onChange={(e) => setPricePeriod(e.target.value)}
              placeholder="e.g., monthly, yearly"
            />
          </div>
        </div>

        <div className="space-y-4">
          <Label>Links</Label>
          {links.map((link, index) => (
            <div key={index} className="grid grid-cols-[1fr_2fr_auto] gap-2">
              <Input
                value={link.name}
                onChange={(e) => onLinkChange(index, 'name', e.target.value)}
                placeholder="Link name"
              />
              <Input
                value={link.url}
                onChange={(e) => onLinkChange(index, 'url', e.target.value)}
                placeholder="URL"
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onRemoveLink(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button
            variant="outline"
            className="w-full"
            onClick={onAddLink}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Link
          </Button>
        </div>
      </div>
    </Card>
  );
}
