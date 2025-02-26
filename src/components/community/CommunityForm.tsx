
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { ProductEditor } from "@/components/product/ProductEditor";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

interface CommunityFormProps {
  communityName: string;
  communityDescription: string;
  communityIntro: string;
  price: string;
  isSaving: boolean;
  onCommunityNameChange: (value: string) => void;
  onCommunityDescriptionChange: (value: string) => void;
  onCommunityIntroChange: (value: string) => void;
  onPriceChange: (value: string) => void;
  onSave: () => void;
}

export function CommunityForm({
  communityName,
  communityDescription,
  communityIntro,
  price,
  isSaving,
  onCommunityNameChange,
  onCommunityDescriptionChange,
  onCommunityIntroChange,
  onPriceChange,
  onSave,
}: CommunityFormProps) {
  return (
    <div className="container mx-auto px-4 pt-24 pb-8">
      <div className="flex items-center justify-between mb-6">
        <Link to="/seller/communities" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" />
          Back to Communities
        </Link>
        <Button onClick={onSave} disabled={isSaving} className="min-w-[120px]">
          {isSaving ? "Saving..." : "Save changes"}
        </Button>
      </div>

      <div className="space-y-4 sm:space-y-6 lg:space-y-0 lg:grid lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-8">
          <Card className="p-4 sm:p-6">
            <div className="space-y-8">
              <div>
                <Label htmlFor="name" className="text-base font-medium mb-2 block">
                  Community Name
                </Label>
                <Input
                  id="name"
                  placeholder="Enter your community name"
                  value={communityName}
                  onChange={(e) => onCommunityNameChange(e.target.value)}
                  className="h-11"
                />
              </div>
              
              <div>
                <Label htmlFor="intro" className="text-base font-medium mb-2 block">
                  Introduction
                </Label>
                <ProductEditor 
                  value={communityIntro}
                  onChange={onCommunityIntroChange}
                />
              </div>

              <div>
                <Label htmlFor="description" className="text-base font-medium mb-2 block">
                  Description
                </Label>
                <ProductEditor 
                  value={communityDescription}
                  onChange={onCommunityDescriptionChange}
                />
              </div>

              <div>
                <Label htmlFor="price" className="text-base font-medium mb-2 block">
                  Price
                </Label>
                <Input
                  id="price"
                  type="number"
                  placeholder="Enter community price"
                  value={price}
                  onChange={(e) => onPriceChange(e.target.value)}
                  className="h-11 w-full max-w-[200px]"
                />
              </div>
            </div>
          </Card>
        </div>

        <div className="lg:col-span-4">
          <Card className="p-4 sm:p-6 border border-border/40 bg-card/40">
            <h2 className="text-lg font-semibold tracking-tight mb-4">Community Settings</h2>
            <div className="space-y-4">
              {/* Add additional community settings here */}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
