
import { Card } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface CommunityInfoPanelProps {
  community: any;
}

export function CommunityInfoPanel({ community }: CommunityInfoPanelProps) {
  const navigate = useNavigate();
  
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
        <Card className="p-6">
          <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
            {community.description || "Welcome back to your community. Sign in to continue your journey."}
          </p>
        </Card>

        <ul className="space-y-4 text-sm">
          <li className="flex gap-3">
            <span className="font-semibold">Connect with Peers</span> - Share insights and learn from others' experiences.
          </li>
          <li className="flex gap-3">
            <span className="font-semibold">Access Resources</span> - Get the latest tools and strategies.
          </li>
          <li className="flex gap-3">
            <span className="font-semibold">Stay Updated</span> - Never miss important community updates.
          </li>
          <li className="flex gap-3">
            <span className="font-semibold">Get Support</span> - Direct access to our community of experts.
          </li>
        </ul>
      </div>
    </div>
  );
}
