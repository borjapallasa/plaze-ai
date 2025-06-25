
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { ChevronDown, ChevronUp } from "lucide-react";

interface ProductDescriptionProps {
  description: string;
}

export function ProductDescription({ description }: ProductDescriptionProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Card className="p-4">
      <div 
        className="flex items-center justify-between cursor-pointer py-2"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h3 className="font-semibold">Details</h3>
        {isOpen ? (
          <ChevronUp className="h-5 w-5 text-gray-500" />
        ) : (
          <ChevronDown className="h-5 w-5 text-gray-500" />
        )}
      </div>
      {isOpen && (
        <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap mt-4">
          {description}
        </p>
      )}
    </Card>
  );
}
