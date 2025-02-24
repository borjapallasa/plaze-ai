
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Heart, Crown } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Expert {
  id: number;
  expert_uuid: string;
  name?: string;
  slug?: string;
  title?: string;
  location?: string;
  description?: string;
  completed_projects?: number;
  client_satisfaction?: number;  // Changed from string to number
  response_rate?: number;
}

interface ExpertCardProps {
  expert: Expert;
}

export const ExpertCard = ({ expert }: ExpertCardProps) => {
  const navigate = useNavigate();

  return (
    <Card 
      className="p-6 cursor-pointer transition-colors hover:bg-accent"
      onClick={() => navigate(`/expert/${expert.slug || expert.id}/${expert.id}`)}
    >
      <div className="flex flex-col space-y-6">
        {/* Header Section */}
        <div className="flex items-start gap-4">
          <div className="relative">
            <Avatar className="h-16 w-16">
              <AvatarImage src="/placeholder.svg" />
              <AvatarFallback>{expert.name?.[0] || 'E'}</AvatarFallback>
            </Avatar>
            <Badge 
              variant="secondary" 
              className="absolute -bottom-2 -right-2 bg-[#F1F1F1] text-[#222222]"
            >
              <Crown className="h-3 w-3" />
            </Badge>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-lg font-medium">{expert.name || 'Anonymous Expert'}</h3>
            </div>
            <p className="text-base text-[#333333] mb-1">{expert.title || 'Expert'}</p>
            <p className="text-sm text-[#888888]">{expert.location || 'Location not specified'}</p>
          </div>

          <div className="hidden md:flex items-start gap-2">
            <Button 
              variant="outline" 
              size="icon" 
              className="rounded-full border-[#C8C8C9]"
              onClick={(e) => e.stopPropagation()}
            >
              <Heart className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              className="whitespace-nowrap border-[#C8C8C9]"
              onClick={(e) => e.stopPropagation()}
            >
              Message
            </Button>
            <Button 
              className="whitespace-nowrap bg-[#222222] hover:bg-[#000000]"
              onClick={(e) => e.stopPropagation()}
            >
              Invite to job
            </Button>
          </div>
        </div>

        {/* Stats Section */}
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
          <span className="text-base text-[#333333]">Projects completed: {expert.completed_projects || 0}</span>
          <div className="flex items-center gap-1">
            <Crown className="h-4 w-4 text-[#555555]" />
            <span className="text-base text-[#333333]">{expert.client_satisfaction || 100}% Client Satisfaction</span>
          </div>
        </div>

        {/* Description Section */}
        <p className="text-base text-[#888888]">{expert.description || 'No description available'}</p>

        {/* Mobile Buttons */}
        <div className="md:hidden flex flex-col space-y-2">
          <Button 
            variant="outline" 
            className="w-full border-[#C8C8C9]"
            onClick={(e) => e.stopPropagation()}
          >
            Message
          </Button>
          <Button 
            className="w-full bg-[#222222] hover:bg-[#000000]"
            onClick={(e) => e.stopPropagation()}
          >
            Invite to job
          </Button>
        </div>
      </div>
    </Card>
  );
};
