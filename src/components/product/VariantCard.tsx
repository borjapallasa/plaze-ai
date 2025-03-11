
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { X } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Variant } from "./types/variants";

interface VariantCardProps {
  variant: Variant;
  showRemove: boolean;
  onRemove: (id: string) => void;
  onUpdate: (id: string, field: keyof Variant, value: any) => void;
  onAddTag: (variantId: string, tag: string) => void;
  onRemoveTag: (variantId: string, tag: string) => void;
}

export function VariantCard({
  variant,
  showRemove,
  onRemove,
  onUpdate,
  onAddTag,
  onRemoveTag,
}: VariantCardProps) {
  return (
    <Card className="p-4 border rounded-lg shadow-sm">
      <div className="space-y-3">
        {showRemove && (
          <div className="flex justify-between items-start gap-4">
            <Input
              id={`name-${variant.id}`}
              placeholder="Enter variant name"
              value={variant.name}
              onChange={(e) => onUpdate(variant.id, "name", e.target.value)}
              className="flex-1"
            />
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 -mt-1"
              onClick={() => onRemove(variant.id)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <Label htmlFor={`price-${variant.id}`} className="sr-only">Price</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">€</span>
              <Input
                id={`price-${variant.id}`}
                type="number"
                className="pl-7"
                value={variant.price}
                onChange={(e) => onUpdate(variant.id, "price", e.target.value)}
                placeholder="Price"
              />
            </div>
          </div>
          <div>
            <Label htmlFor={`compare-price-${variant.id}`} className="sr-only">Compare-at price</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">€</span>
              <Input
                id={`compare-price-${variant.id}`}
                type="number"
                className="pl-7"
                value={variant.comparePrice}
                onChange={(e) => onUpdate(variant.id, "comparePrice", e.target.value)}
                placeholder="Compare-at price"
              />
            </div>
          </div>
        </div>

        <div>
          <Label htmlFor={`files-link-${variant.id}`}>Files link</Label>
          <Input
            id={`files-link-${variant.id}`}
            placeholder="Enter files link URL"
            value={variant.filesLink || ""}
            onChange={(e) => onUpdate(variant.id, "filesLink", e.target.value)}
            className="w-full"
          />
        </div>

        <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id={`highlight-${variant.id}`}
              checked={variant.highlight || false}
              onCheckedChange={(checked) => onUpdate(variant.id, "highlight", checked)}
            />
            <Label htmlFor={`highlight-${variant.id}`} className="text-sm">
              Highlight this variant
            </Label>
          </div>

          <div className="flex-1 flex items-center gap-2">
            {(variant.tags || []).map((tag) => (
              <span
                key={tag}
                className="bg-secondary text-secondary-foreground px-2 py-1 rounded-md text-sm flex items-center gap-1"
              >
                {tag}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-4 w-4 p-0 hover:bg-transparent"
                  onClick={() => onRemoveTag(variant.id, tag)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </span>
            ))}
            {(!variant.tags || variant.tags.length < 2) && (
              <Input
                className="w-24 h-8 text-sm"
                placeholder="Add tag"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    const input = e.currentTarget;
                    if (input.value) {
                      onAddTag(variant.id, input.value);
                      input.value = '';
                    }
                  }
                }}
              />
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
