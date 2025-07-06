
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { CommunityVisibility } from "@/hooks/use-create-community";

interface CommunityStatusCardProps {
  visibility: CommunityVisibility;
  onVisibilityChange: (value: CommunityVisibility) => void;
  onSave: () => void;
  isSaving?: boolean;
}

export function CommunityStatusCard({
  visibility,
  onVisibilityChange,
  onSave,
  isSaving = false
}: CommunityStatusCardProps) {
  return (
    <Card>
      <CardContent className="p-4 sm:p-6">
        <div className="space-y-4">
          <div>
            <Label className="text-base font-medium mb-2 block">Community Status</Label>
            <Select value={visibility} onValueChange={onVisibilityChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="visible">Active</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Button 
            onClick={onSave} 
            disabled={isSaving}
            className="w-full"
          >
            {isSaving ? "Creating..." : "Create Community"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
