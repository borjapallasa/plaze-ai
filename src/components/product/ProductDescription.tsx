
import React from "react";
import { Card } from "@/components/ui/card";

interface ProductDescriptionProps {
  description: string;
}

export function ProductDescription({ description }: ProductDescriptionProps) {
  return (
    <Card className="p-6">
      <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
        {description}
      </p>
    </Card>
  );
}
