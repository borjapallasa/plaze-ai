
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
      <div className="space-y-4">
        <div className="flex justify-end">
          {showRemove && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onRemove(variant.id)}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        {showRemove && (
          <>
            <div>
              <Label htmlFor={`name-${variant.id}`}>Variant Name</Label>
              <Input
                id={`name-${variant.id}`}
                placeholder="Enter variant name"
                value={variant.name}
                onChange={(e) =>
                  onUpdate(variant.id, "name", e.target.value)
                }
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor={`price-${variant.id}`}>Price</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2">€</span>
                  <Input
                    id={`price-${variant.id}`}
                    type="number"
                    className="pl-7"
                    value={variant.price}
                    onChange={(e) =>
                      onUpdate(variant.id, "price", e.target.value)
                    }
                    placeholder="0.00"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor={`compare-price-${variant.id}`}>Compare-at price</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2">€</span>
                  <Input
                    id={`compare-price-${variant.id}`}
                    type="number"
                    className="pl-7"
                    value={variant.comparePrice}
                    onChange={(e) =>
                      onUpdate(variant.id, "comparePrice", e.target.value)
                    }
                    placeholder="0.00"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id={`highlight-${variant.id}`}
                checked={variant.highlight || false}
                onCheckedChange={(checked) =>
                  onUpdate(variant.id, "highlight", checked)
                }
              />
              <Label htmlFor={`highlight-${variant.id}`}>Highlight this variant</Label>
            </div>

            <div>
              <Label>Tags (max 2)</Label>
              <div className="flex flex-wrap gap-2 mt-2">
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
                    className="w-32"
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
          </>
        )}
      </div>
    </Card>
  );
}
