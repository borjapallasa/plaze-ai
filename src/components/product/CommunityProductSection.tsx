
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useExpertCommunities } from "@/hooks/expert/useExpertCommunities";
import { useProductVariants } from "@/hooks/use-product-variants";

interface CommunityProductSectionProps {
  expertUuid?: string;
  productUuid?: string;
}

export function CommunityProductSection({ expertUuid, productUuid }: CommunityProductSectionProps) {
  const [isCommunityProduct, setIsCommunityProduct] = useState(false);
  const [selectedCommunity, setSelectedCommunity] = useState("");
  const [productType, setProductType] = useState<"free" | "paid">("free");
  const [selectedVariant, setSelectedVariant] = useState("");
  const [price, setPrice] = useState("");

  const { data: communities = [] } = useExpertCommunities(expertUuid);
  const { data: variants = [] } = useProductVariants(productUuid);

  const showVariantSelector = variants.length > 1;

  return (
    <Card className="p-3 sm:p-6">
      <h2 className="text-lg font-medium mb-3 sm:mb-4">Community Product</h2>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="community-product-toggle" className="text-base font-medium">
            Community Product
          </Label>
          <Switch
            id="community-product-toggle"
            checked={isCommunityProduct}
            onCheckedChange={setIsCommunityProduct}
          />
        </div>

        {isCommunityProduct && (
          <div className="space-y-4 border-t pt-4">
            <div className="space-y-2">
              <Label htmlFor="community-select">Community</Label>
              <Select value={selectedCommunity} onValueChange={setSelectedCommunity}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a community" />
                </SelectTrigger>
                <SelectContent>
                  {communities.map((community) => (
                    <SelectItem key={community.community_uuid} value={community.community_uuid}>
                      {community.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Product Type</Label>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant={productType === "free" ? "default" : "outline"}
                  onClick={() => setProductType("free")}
                  className="flex-1"
                >
                  Free
                </Button>
                <Button
                  type="button"
                  variant={productType === "paid" ? "default" : "outline"}
                  onClick={() => setProductType("paid")}
                  className="flex-1"
                >
                  Paid
                </Button>
              </div>
            </div>

            {showVariantSelector && (
              <div className="space-y-2">
                <Label htmlFor="variant-select">Variant</Label>
                <Select value={selectedVariant} onValueChange={setSelectedVariant}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a variant" />
                  </SelectTrigger>
                  <SelectContent>
                    {variants.map((variant) => (
                      <SelectItem key={variant.id} value={variant.id}>
                        {variant.name} - ${variant.price}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {productType === "paid" && (
              <div className="space-y-2">
                <Label htmlFor="community-price">Price ($)</Label>
                <Input
                  id="community-price"
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="19.99"
                />
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}
