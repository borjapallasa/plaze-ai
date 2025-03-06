
import React from "react";
import { Card } from "@/components/ui/card";

export function ApplicationsTab() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="p-6">
            <h3 className="font-semibold mb-2">Job Application #{i}</h3>
            <p className="text-sm text-muted-foreground">Applied for Senior Designer position</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
