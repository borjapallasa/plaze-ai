
import React from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface ProductTechnicalDetailsProps {
  techStack: string;
  techStackPrice: string;
  productIncludes: string;
  difficultyLevel: string;
  demo: string;
  onTechStackChange: (value: string) => void;
  onTechStackPriceChange: (value: string) => void;
  onProductIncludesChange: (value: string) => void;
  onDifficultyLevelChange: (value: string) => void;
  onDemoChange: (value: string) => void;
}

export function ProductTechnicalDetails({
  techStack,
  techStackPrice,
  productIncludes,
  difficultyLevel,
  demo,
  onTechStackChange,
  onTechStackPriceChange,
  onProductIncludesChange,
  onDifficultyLevelChange,
  onDemoChange,
}: ProductTechnicalDetailsProps) {
  return (
    <Card className="p-3 sm:p-6">
      <h2 className="text-lg font-medium mb-3 sm:mb-4">Product Details</h2>
      <div className="space-y-3 sm:space-y-4">
        <div>
          <Label htmlFor="tech_stack">Tech Stack</Label>
          <Input
            id="tech_stack"
            placeholder="Enter required tech stack"
            value={techStack}
            onChange={(e) => onTechStackChange(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="tech_stack_price">Tech Stack Pricing</Label>
          <Input
            id="tech_stack_price"
            placeholder="Enter tech stack pricing details"
            value={techStackPrice}
            onChange={(e) => onTechStackPriceChange(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="product_includes">What's Included</Label>
          <Input
            id="product_includes"
            placeholder="Enter what's included in the product"
            value={productIncludes}
            onChange={(e) => onProductIncludesChange(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="difficulty_level">Difficulty Level</Label>
          <Input
            id="difficulty_level"
            placeholder="Select difficulty level"
            value={difficultyLevel}
            onChange={(e) => onDifficultyLevelChange(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="demo">Demo Link</Label>
          <Input
            id="demo"
            placeholder="Enter demo URL"
            type="url"
            value={demo}
            onChange={(e) => onDemoChange(e.target.value)}
          />
        </div>
      </div>
    </Card>
  );
}
