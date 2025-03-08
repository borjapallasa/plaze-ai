
import React from "react";
import { Card } from "@/components/ui/card";

interface ProductDemoProps {
  embedUrl: string | null;
}

export function ProductDemo({ embedUrl }: ProductDemoProps) {
  if (!embedUrl) return null;

  return (
    <Card className="p-6">
      <div className="relative w-full aspect-video rounded-lg overflow-hidden">
        <iframe
          src={embedUrl}
          className="absolute inset-0 w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    </Card>
  );
}
