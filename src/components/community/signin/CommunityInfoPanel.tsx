
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface CommunityInfoPanelProps {
  community: any;
}

export function CommunityInfoPanel({ community }: CommunityInfoPanelProps) {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold tracking-tight">
          Welcome back to{" "}
          <span className="text-primary">{community.name || "our community"}!</span>
        </h1>
        <div className="flex items-start gap-4">
          <Avatar className="h-16 w-16 rounded-lg border">
            <AvatarImage src={community.thumbnail || "https://images.unsplash.com/photo-1517022812141-23620dba5c23"} alt={`${community.name} thumbnail`} />
            <AvatarFallback>{community.name?.substring(0, 3)?.toUpperCase() || "COM"}</AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-xl font-semibold">{community.name}</h2>
            <p className="text-sm text-muted-foreground">
              This community is hosted by {community.expert_name || "an expert host"}.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="p-6 rounded-lg bg-muted/40">
          <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
            {community.description || "Welcome back to your community. Sign in to continue your journey."}
          </p>
        </div>
      </div>
    </div>
  );
}
