
import React from "react";
import { Card } from "@/components/ui/card";

interface ProductDescriptionProps {
  description: string;
  className?: string;
}

export function ProductDescription({ description, className = "" }: ProductDescriptionProps) {
  if (!description) {
    return null;
  }

  return (
    <Card className={`p-4 border border-gray-200 ${className}`}>
      <div className="space-y-2">
        <p className="text-sm text-foreground leading-relaxed">
          {description}
        </p>
      </div>
    </Card>
  );
}
