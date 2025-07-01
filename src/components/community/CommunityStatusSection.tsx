
import React from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

type CommunityStatus = "visible" | "not visible" | "draft";

interface CommunityStatusSectionProps {
  status: CommunityStatus;
  onStatusChange: (status: CommunityStatus) => void;
  onSave: () => void;
  isSaving: boolean;
}

export function CommunityStatusSection({ 
  status, 
  onStatusChange, 
  onSave, 
  isSaving 
}: CommunityStatusSectionProps) {
  return (
    <Card className="p-4 sm:p-6 border border-border/40 bg-card/40">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="community-status" className="text-base font-medium">
            Community Status
          </Label>
          <div className="flex flex-col sm:flex-row gap-3 sm:items-end">
            <div className="flex-1">
              <Select value={status} onValueChange={(value) => onStatusChange(value as CommunityStatus)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="visible">Visible</SelectItem>
                  <SelectItem value="not visible">Not Visible</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Button 
              onClick={onSave} 
              disabled={isSaving}
              className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {isSaving ? "Saving changes..." : "Save changes"}
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
