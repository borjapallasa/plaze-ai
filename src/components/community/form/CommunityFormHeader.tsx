
import React from "react";
import { useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate(-1);
  };

  return (
    <div className="mb-6">
      <div className="flex items-start gap-3 sm:gap-4">
        <Button 
          variant="ghost" 
          size="icon" 
          className="rounded-full h-8 w-8 sm:h-10 sm:w-10 flex-shrink-0 mt-1"
          onClick={handleBackClick}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        
        <div className="flex-1 min-w-0">
          {/* Title and subtitle */}
          <div className="mb-4 sm:mb-0">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between sm:gap-3">
              <div className="flex-1 min-w-0">
                <h1 className="text-xl sm:text-2xl font-semibold">Create New Community</h1>
                <p className="text-sm text-muted-foreground mt-1">Enter the details for your new community</p>
              </div>
              
              {/* Desktop controls - hidden on mobile */}
              <div className="hidden sm:flex sm:flex-row sm:items-center gap-3">
                <Select value={visibility} onValueChange={onVisibilityChange}>
                  <SelectTrigger className="w-[140px]">
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
      
      {/* Mobile controls - completely separate from the flex container above */}
      <div className="sm:hidden space-y-3 mt-2">
        <Select value={visibility} onValueChange={onVisibilityChange}>
          <SelectTrigger className="w-full">
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
          className="w-full"
        >
          {isSaving ? "Creating..." : "Create Community"}
        </Button>
      </div>
    </div>
  );
}
