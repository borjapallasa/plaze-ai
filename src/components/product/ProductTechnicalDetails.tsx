
import React from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ProductTechnicalDetailsProps {
  techStack: string;
  setTechStack: (value: string) => void;
  techStackPrice: string;
  setTechStackPrice: (value: string) => void;
  productIncludes: string;
  setProductIncludes: (value: string) => void;
  difficultyLevel: string;
  setDifficultyLevel: (value: string) => void;
  demo: string;
  setDemo: (value: string) => void;
}

export function ProductTechnicalDetails({
  techStack,
  setTechStack,
  techStackPrice,
  setTechStackPrice,
  productIncludes,
  setProductIncludes,
  difficultyLevel,
  setDifficultyLevel,
  demo,
  setDemo
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
            onChange={(e) => setTechStack(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="tech_stack_price">Tech Stack Pricing</Label>
          <Input 
            id="tech_stack_price" 
            placeholder="Enter tech stack pricing details"
            value={techStackPrice}
            onChange={(e) => setTechStackPrice(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="product_includes">What's Included</Label>
          <Input 
            id="product_includes" 
            placeholder="Enter what's included in the product"
            value={productIncludes}
            onChange={(e) => setProductIncludes(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="difficulty_level">Difficulty Level</Label>
          <Input 
            id="difficulty_level" 
            placeholder="Select difficulty level"
            value={difficultyLevel}
            onChange={(e) => setDifficultyLevel(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="demo">Demo Link</Label>
          <Input 
            id="demo" 
            placeholder="Enter demo URL" 
            type="url"
            value={demo}
            onChange={(e) => setDemo(e.target.value)}
          />
        </div>
      </div>
    </Card>
  );
}
