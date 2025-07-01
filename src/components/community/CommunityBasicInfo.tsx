
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ProductEditor } from "@/components/product/ProductEditor";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlusCircle, Trash2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import type { CommunityType } from "@/hooks/use-create-community";

interface CommunityBasicInfoProps {
  communityName: string;
  setCommunityName: (value: string) => void;
  communityIntro: string;
  setCommunityIntro: (value: string) => void;
  communityDescription: string;
  setCommunityDescription: (value: string) => void;
  price: string;
  setPrice: (value: string) => void;
  pricePeriod: "monthly" | "yearly";
  setPricePeriod: (value: "monthly" | "yearly") => void;
  communityType: CommunityType;
  setCommunityType: (value: CommunityType) => void;
  communityUuid: string;
  links: { name: string; url: string }[];
  onLinkChange: (index: number, field: keyof { name: string; url: string }, value: string) => void;
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
  communityType,
  setCommunityType,
  communityUuid,
  links,
  onLinkChange,
  onAddLink,
  onRemoveLink,
}: CommunityBasicInfoProps) {
  return (
    <Card>
      <CardContent className="p-6 space-y-6">
        <div>
          <Label htmlFor="name" className="text-base font-medium mb-2 block">
            Community Name
          </Label>
          <Input
            id="name"
            value={communityName}
            onChange={(e) => setCommunityName(e.target.value)}
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
            onChange={(e) => setCommunityIntro(e.target.value)}
            placeholder="Enter YouTube or Vimeo video URL"
            className="h-11"
          />
        </div>

        <div>
          <Label htmlFor="description" className="text-base font-medium mb-2 block">
            Community Description
          </Label>
          <ProductEditor
            value={communityDescription}
            onChange={setCommunityDescription}
            placeholder="Describe your community..."
          />
        </div>

        <div>
          <Label htmlFor="type" className="text-base font-medium mb-2 block">
            Community Type
          </Label>
          <Select value={communityType} onValueChange={setCommunityType as (value: string) => void}>
            <SelectTrigger className="h-11">
              <SelectValue placeholder="Select community type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="free">Free</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
              <SelectItem value="private">Private</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {communityType === "paid" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="price" className="text-base font-medium mb-2 block">
                Price
              </Label>
              <Input
                id="price"
                type="text"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="Enter community price"
                className="h-11"
              />
            </div>

            <div>
              <Label htmlFor="pricePeriod" className="text-base font-medium mb-2 block">
                Billing Period
              </Label>
              <Select value={pricePeriod} onValueChange={setPricePeriod as (value: string) => void}>
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

        <div>
          <div className="flex items-center justify-between mb-4">
            <Label className="text-base font-medium">Social Links</Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onAddLink}
              className="h-8"
            >
              <PlusCircle className="h-4 w-4 mr-1" />
              Add Link
            </Button>
          </div>

          <div className="space-y-3">
            {links.map((link, index) => (
              <div key={index} className="flex gap-3">
                <Input
                  placeholder="Platform (e.g. Twitter)"
                  value={link.name}
                  onChange={(e) => onLinkChange(index, "name", e.target.value)}
                  className="h-11"
                />
                <Input
                  placeholder="URL"
                  value={link.url}
                  onChange={(e) => onLinkChange(index, "url", e.target.value)}
                  className="h-11"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => onRemoveLink(index)}
                  className="h-11 w-11 flex-shrink-0"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
