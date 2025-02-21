
import { useState } from "react";
import { MainHeader } from "@/components/MainHeader";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Heart, MessageCircle, Search, Star, ChevronDown, Zap, Crown } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface Expert {
  id: number;
  name: string;
  title: string;
  location: string;
  avatar: string;
  rate: number;
  successRate: number;
  earned: string;
  skills: string[];
  description: string;
  boosted?: boolean;
  available?: boolean;
}

const experts: Expert[] = [
  {
    id: 1,
    name: "Muhammad T.",
    title: "Lead Generation | Data Mining | Research Expert",
    location: "United States",
    avatar: "/placeholder.svg",
    rate: 35,
    successRate: 98,
    earned: "$90K+",
    skills: ["Lead Generation", "Data Mining", "Market Research", "Web Scraping", "Data Analysis", "+4"],
    description: "Experienced lead generation specialist with expertise in B2B marketing and data mining. Proven track record of delivering high-quality leads and maintaining excellent client relationships.",
    boosted: true,
    available: true
  },
  {
    id: 2,
    name: "Sarah K.",
    title: "UI/UX Designer | Full Stack Developer",
    location: "Canada",
    avatar: "/placeholder.svg",
    rate: 45,
    successRate: 100,
    earned: "$150K+",
    skills: ["UI Design", "UX Design", "Web Development", "React", "Node.js", "+3"],
    description: "Senior UI/UX designer and full stack developer with 8+ years of experience creating beautiful, intuitive interfaces and robust web applications.",
    available: true
  },
];

const Experts = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const isMobile = useIsMobile();

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
            {experts.map((expert) => (
              <Card key={expert.id} className="p-6">
                <div className="flex flex-col space-y-6">
                  {/* Header Section */}
                  <div className="flex items-start gap-4">
                    <div className="relative">
                      <Avatar className="h-16 w-16">
                        <AvatarImage src={expert.avatar} />
                        <AvatarFallback>{expert.name.split(' ')[0][0]}</AvatarFallback>
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
                        <h3 className="text-lg font-medium">{expert.name}</h3>
                        {expert.boosted && (
                          <Badge variant="secondary" className="flex items-center gap-1 bg-[#333333] text-white">
                            <Zap className="h-3 w-3" />
                            Boosted
                          </Badge>
                        )}
                      </div>
                      <p className="text-base text-[#333333] mb-1">{expert.title}</p>
                      <p className="text-sm text-[#888888]">{expert.location}</p>
                    </div>

                    <div className="hidden md:flex items-start gap-2">
                      <Button variant="outline" size="icon" className="rounded-full border-[#C8C8C9]">
                        <Heart className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" className="whitespace-nowrap border-[#C8C8C9]">
                        Message
                      </Button>
                      <Button className="whitespace-nowrap bg-[#222222] hover:bg-[#000000]">
                        Invite to job
                      </Button>
                    </div>
                  </div>

                  {/* Stats Section */}
                  <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
                    <span className="text-base text-[#333333]">${expert.rate}/hr</span>
                    <div className="flex items-center gap-1">
                      <Crown className="h-4 w-4 text-[#555555]" />
                      <span className="text-base text-[#333333]">{expert.successRate}% Job Success</span>
                    </div>
                    <span className="text-base text-[#333333]">{expert.earned} earned</span>
                    {expert.available && (
                      <Badge variant="secondary" className="flex items-center gap-1 bg-[#333333] text-white">
                        <Zap className="h-3 w-3" />
                        Available now
                      </Badge>
                    )}
                  </div>

                  {/* Skills Section */}
                  <div className="flex flex-wrap gap-2">
                    {expert.skills.map((skill, index) => (
                      <Badge 
                        key={index}
                        variant="secondary" 
                        className="rounded-full bg-[#F1F1F1] text-[#333333] hover:bg-[#F1F1F1]"
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>

                  {/* Description Section */}
                  <p className="text-base text-[#888888]">{expert.description}</p>

                  {/* Mobile Buttons */}
                  <div className="md:hidden flex flex-col space-y-2">
                    <Button variant="outline" className="w-full border-[#C8C8C9]">
                      Message
                    </Button>
                    <Button className="w-full bg-[#222222] hover:bg-[#000000]">
                      Invite to job
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Experts;
