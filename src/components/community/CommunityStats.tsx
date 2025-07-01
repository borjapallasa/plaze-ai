import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { CheckCheck } from "lucide-react";

interface CommunityStatsProps {
  community: any;
  communityStatus: "visible" | "not visible" | "draft";
  setCommunityStatus: (status: "visible" | "not visible" | "draft") => void;
  onSave: () => void;
  isSaving: boolean;
}

export function CommunityStats({ 
  community, 
  communityStatus, 
  setCommunityStatus, 
  onSave, 
  isSaving 
}: CommunityStatsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Community Stats</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="status">Status</Label>
          </div>
          <Select value={communityStatus} onValueChange={setCommunityStatus}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="visible">Visible</SelectItem>
              <SelectItem value="not visible">Not Visible</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <Label>Members</Label>
          </div>
          <div>
            {community?.member_count || 0}
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <Label>Created At</Label>
          </div>
          <div>
            {community?.created_at ? new Date(community.created_at).toLocaleDateString() : 'N/A'}
          </div>
        </div>
        <Button onClick={onSave} disabled={isSaving} className="w-full">
          {isSaving ? 'Saving...' : 'Save Changes'}
          {isSaving && <CheckCheck className="ml-2 h-4 w-4" />}
        </Button>
      </CardContent>
    </Card>
  );
}
