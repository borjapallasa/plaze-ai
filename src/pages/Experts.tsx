
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MainHeader } from "@/components/MainHeader";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Heart, MessageCircle, Search, Star, ChevronDown, Zap, Crown } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

const Experts = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  const { data: experts, isLoading } = useQuery({
    queryKey: ['experts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('experts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    }
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="pt-16">
          <MainHeader />
          <div className="container max-w-6xl mx-auto px-4 py-6 flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="pt-16">
        <MainHeader />
        <div className="container max-w-6xl mx-auto px-4 py-6">
          {/* Search Section */}
          <div className="mb-6 flex flex-col gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input 
                placeholder="Search for experts" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-10 text-sm"
              />
            </div>
            
            {/* Filters */}
            <div className="flex gap-2 overflow-x-auto pb-1 hide-scrollbar">
              <Button variant="outline" size="sm" className="h-8 text-sm">
                Talent badge
                <ChevronDown className="ml-1 h-3 w-3" />
              </Button>
              <Button variant="outline" size="sm" className="h-8 text-sm">
                Hourly rate
                <ChevronDown className="ml-1 h-3 w-3" />
              </Button>
              <Button variant="outline" size="sm" className="h-8 text-sm">
                Location
                <ChevronDown className="ml-1 h-3 w-3" />
              </Button>
              <Button variant="outline" size="sm" className="h-8 text-sm">
                Skills
                <ChevronDown className="ml-1 h-3 w-3" />
              </Button>
            </div>
          </div>

          {/* Experts List */}
          <div className="space-y-4">
            {experts?.map((expert) => (
              <Card 
                key={expert.id} 
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
                      <span className="text-base text-[#333333]">{expert.client_satisfaction || '100%'} Client Satisfaction</span>
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
            ))}

            {experts?.length === 0 && (
              <div className="text-center text-muted-foreground py-8">
                No experts found. Check back later!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Experts;
