
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, X } from "lucide-react";

interface ServiceFeaturesProps {
  features: string[];
  onAddFeature: () => void;
  onRemoveFeature: (index: number) => void;
  onFeatureChange: (index: number, value: string) => void;
}

export function ServiceFeatures({
  features,
  onAddFeature,
  onRemoveFeature,
  onFeatureChange,
}: ServiceFeaturesProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">Features</Label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-8"
          onClick={onAddFeature}
        >
          <Plus className="h-4 w-4 mr-1" />
          Add Feature
        </Button>
      </div>
      <div className="space-y-2">
        {features.map((feature, index) => (
          <div key={index} className="flex gap-2">
            <Input
              value={feature}
              onChange={(e) => onFeatureChange(index, e.target.value)}
              placeholder={`Feature ${index + 1}`}
              className="h-11"
            />
            {features.length > 1 && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-11 w-11 flex-shrink-0"
                onClick={() => onRemoveFeature(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
