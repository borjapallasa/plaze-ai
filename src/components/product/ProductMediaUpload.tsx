
import React from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export function ProductMediaUpload() {
  return (
    <div className="grid grid-cols-4 gap-4">
      <div className="col-span-2 aspect-[3/2] rounded-lg border-2 border-dashed flex items-center justify-center">
        <Button variant="ghost" className="h-full w-full rounded-lg">
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      {[1, 2, 3].map((i) => (
        <div key={i} className="aspect-square rounded-lg border bg-muted">
          <img
            src="/lovable-uploads/59ac4591-1363-4d8b-9f4c-4743b26ade16.png"
            alt={`Product ${i}`}
            className="w-full h-full object-cover rounded-lg"
          />
        </div>
      ))}
    </div>
  );
}
