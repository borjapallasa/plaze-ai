
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CommunityHeaderProps {
  onSave: () => void;
  isSaving: boolean;
}

export function CommunityHeader({ onSave, isSaving }: CommunityHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-6">
      <Link to="/communities" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" />
        Back to Communities
      </Link>
      <Button onClick={onSave} disabled={isSaving} className="min-w-[120px]">
        {isSaving ? "Saving..." : "Save changes"}
      </Button>
    </div>
  );
}
