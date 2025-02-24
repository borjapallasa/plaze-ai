
import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function ProductStatus() {
  return (
    <Card className="p-3 sm:p-6">
      <h2 className="text-lg font-medium mb-3 sm:mb-4">Status</h2>
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <Select defaultValue="draft">
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="pending">Pending Review</SelectItem>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
              <SelectItem value="changes_needed">Changes Needed</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button>Save</Button>
      </div>
    </Card>
  );
}
