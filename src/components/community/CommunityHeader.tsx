
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface CommunityHeaderProps {
  onSave: () => void;
  isSaving: boolean;
}

export function CommunityHeader({ onSave, isSaving }: CommunityHeaderProps) {
  const { id } = useParams();
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate(-1); // Go to previous page in history
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
                <h1 className="text-xl sm:text-2xl font-semibold">Edit Community</h1>
                <p className="text-sm text-muted-foreground mt-1">Community settings and configuration</p>
              </div>
              
              {/* Desktop controls - hidden on mobile */}
              <div className="hidden sm:flex sm:flex-row sm:items-center gap-3">
                <Button
                  onClick={onSave}
                  disabled={isSaving}
                >
                  {isSaving ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile controls - completely separate from the flex container above */}
      <div className="sm:hidden space-y-3 mt-2">
        <Button
          onClick={onSave}
          disabled={isSaving}
          className="w-full"
        >
          {isSaving ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  );
}
