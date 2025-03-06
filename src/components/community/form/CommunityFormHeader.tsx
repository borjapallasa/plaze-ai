
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft } from "lucide-react";
import type { CommunityVisibility } from "@/hooks/use-create-community";

interface CommunityFormHeaderProps {
  communityName: string;
  visibility: CommunityVisibility;
  onVisibilityChange: (value: CommunityVisibility) => void;
  onSave: () => void;
  isSaving: boolean;
}

export function CommunityFormHeader({
  communityName,
  visibility,
  onVisibilityChange,
  onSave,
  isSaving
}: CommunityFormHeaderProps) {
  return (
    <div className="mb-6">
      <div className="flex flex-col sm:flex-row items-start gap-2 sm:gap-4">
        <Link to="/communities">
          <Button variant="ghost" size="icon" className="rounded-full flex-shrink-0 h-8 w-8 sm:h-10 sm:w-10 mt-1">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="w-full">
          <h1 className="text-lg sm:text-xl md:text-2xl font-semibold break-words pr-2">Create New Community</h1>
          <div className="flex items-center justify-between mt-2">
            <p className="text-sm text-muted-foreground">Enter the details for your new community</p>
            <div className="flex items-center gap-4">
              <Select value={visibility} onValueChange={onVisibilityChange}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Visibility" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="public">Public</SelectItem>
                  <SelectItem value="private">Private</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                </SelectContent>
              </Select>
              <Button 
                onClick={onSave}
                disabled={isSaving || !communityName.trim()}
              >
                {isSaving ? "Creating..." : "Create Community"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
