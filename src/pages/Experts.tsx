import { useState } from "react";
import { MainHeader } from "@/components/MainHeader";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Heart, MessageCircle, Search, Star, ChevronDown } from "lucide-react";
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
        <div className="container max-w-6xl mx-auto px-4 py-8">
          {/* Search Section */}
          <div className="mb-8 space-y-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5" />
              <Input 
                placeholder="Search for experts" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12"
              />
            </div>
            
            {/* Filters */}
            <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar">
              <Button variant="outline" className="whitespace-nowrap">
                Talent badge
                <ChevronDown className="ml-1 h-4 w-4" />
              </Button>
              <Button variant="outline" className="whitespace-nowrap">
                Hourly rate
                <ChevronDown className="ml-1 h-4 w-4" />
              </Button>
              <Button variant="outline" className="whitespace-nowrap">
                Location
                <ChevronDown className="ml-1 h-4 w-4" />
              </Button>
              <Button variant="outline" className="whitespace-nowrap">
                Skills
                <ChevronDown className="ml-1 h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Experts List */}
          <div className="space-y-4">
            {experts.map((expert) => (
              <Card key={expert.id} className="p-4 md:p-6">
                <div className="flex flex-row gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={expert.avatar} />
                    <AvatarFallback>{expert.name.split(' ')[0][0]}</AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 min-w-0">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-medium">{expert.name}</h3>
                        {expert.boosted && (
                          <Badge variant="secondary">
                            Boosted
                          </Badge>
                        )}
                      </div>
                      <p className="text-base mb-1">{expert.title}</p>
                      <p className="text-sm text-muted-foreground mb-2">{expert.location}</p>
                      
                      {expert.available && (
                        <Badge variant="secondary" className="mb-2">
                          Available now
                        </Badge>
                      )}
                    </div>

                    <div className="flex items-center gap-4 mb-3">
                      <div className="flex items-center gap-1">
                        <span className="text-sm">${expert.rate}/hr</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4" />
                        <span className="text-sm">{expert.successRate}% Job Success</span>
                      </div>
                      <span className="text-sm">{expert.earned} earned</span>
                    </div>

                    <p className="text-sm text-muted-foreground mb-4">{expert.description}</p>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {expert.skills.map((skill, index) => (
                        <Badge 
                          key={index}
                          variant="secondary" 
                          className="rounded-full"
                        >
                          {skill}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex flex-col space-y-2 md:flex-row md:space-y-0 md:gap-2">
                      <Button variant="outline" size="sm" className="md:w-auto">
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Message
                      </Button>
                      <Button size="sm" className="md:w-auto">
                        Invite to job
                      </Button>
                    </div>
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
