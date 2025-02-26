import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageSquare, Users, BookOpen, Calendar, Link as LinkIcon, ThumbsUp, Search, ArrowRight } from "lucide-react";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProductCard } from "@/components/ProductCard";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { useState } from "react";
import { ThreadDialog } from "@/components/ThreadDialog";
import { MainHeader } from "@/components/MainHeader";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { getVideoEmbedUrl } from "@/utils/videoEmbed";
import { useAuth } from "@/lib/auth";

interface Link {
  name: string;
  url: string;
}

function isValidLink(link: unknown): link is Link {
  if (typeof link !== 'object' || link === null) return false;
  const l = link as any;
  return typeof l.name === 'string' && typeof l.url === 'string';
}

function parseLinks(data: unknown): Link[] {
  console.log('Raw links data:', data);
  
  if (typeof data === 'string') {
    try {
      data = JSON.parse(data);
    } catch (e) {
      console.error('Failed to parse links JSON string:', e);
      return [];
    }
  }
  
  if (!Array.isArray(data)) {
    console.log('Links data is not an array, returning empty array');
    return [];
  }
  
  const validLinks = data.filter(isValidLink);
  console.log('Parsed valid links:', validLinks);
  return validLinks;
}

export default function Community() {
  const { id } = useParams();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [isThreadOpen, setIsThreadOpen] = useState(false);
  const { user } = useAuth();

  const { data: community, isLoading } = useQuery({
    queryKey: ['community', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('communities')
        .select('*, expert:expert_uuid(*)')
        .eq('community_uuid', id)
        .single();

      if (error) {
        throw error;
      }

      console.log('Community data:', data);
      console.log('Links from community:', data?.links);

      return data;
    },
    enabled: !!id
  });

  const videoEmbedUrl = getVideoEmbedUrl(community?.intro);
  const links = parseLinks(community?.links);
  
  if (isLoading) {
    return (
      <>
        <MainHeader />
        <div className="container mx-auto px-4 py-8 mt-16">
          <div className="animate-pulse space-y-4">
            <div className="h-64 bg-muted rounded-lg"></div>
            <div className="h-8 w-1/3 bg-muted rounded"></div>
            <div className="h-4 w-2/3 bg-muted rounded"></div>
          </div>
        </div>
      </>
    );
  }

  if (!community) {
    return (
      <>
        <MainHeader />
        <div className="container mx-auto px-4 py-8 mt-16">
          <Card className="p-6">
            <h1 className="text-xl font-semibold">Community not found</h1>
            <p className="text-muted-foreground mt-2">
              The community you're looking for doesn't exist or has been removed.
            </p>
          </Card>
        </div>
      </>
    );
  }

  const isOwner = user?.id === community?.expert?.user_uuid;

  const templates = [
    {
      title: "Automated Email Workflow",
      price: "$49.99",
      image: "/placeholder.svg",
      seller: "Automation Pro",
      description: "Streamline your email marketing with this automated workflow template.",
      tags: ["email", "automation"],
      category: "marketing"
    },
    {
      title: "CRM Integration Template",
      price: "$79.99",
      image: "/placeholder.svg",
      seller: "CRM Expert",
      description: "Connect your favorite CRM with other tools seamlessly.",
      tags: ["crm", "integration"],
      category: "business"
    },
    {
      title: "Social Media Manager",
      price: "$39.99",
      image: "/placeholder.svg",
      seller: "Social Pro",
      description: "Manage all your social media accounts from one place.",
      tags: ["social", "management"],
      category: "marketing"
    },
    {
      title: "Project Tracker",
      price: "$59.99",
      image: "/placeholder.svg",
      seller: "PM Tools",
      description: "Keep track of your projects with this comprehensive template.",
      tags: ["project", "management"],
      category: "business"
    },
    {
      title: "Lead Generation System",
      price: "$89.99",
      image: "/placeholder.svg",
      seller: "Lead Gen Pro",
      description: "Generate and nurture leads automatically.",
      tags: ["leads", "automation"],
      category: "sales"
    },
    {
      title: "Customer Support Flow",
      price: "$69.99",
      image: "/placeholder.svg",
      seller: "Support Expert",
      description: "Streamline your customer support process.",
      tags: ["support", "workflow"],
      category: "service"
    }
  ];

  const events = [
    {
      title: "Community Meetup",
      date: new Date(2024, 3, 15), // April 15, 2024
      type: "meetup",
      description: "Monthly community gathering to discuss automation trends"
    },
    {
      title: "Workshop: No-Code Automation",
      date: new Date(2024, 3, 20), // April 20, 2024
      type: "workshop",
      description: "Learn how to build powerful automation without coding"
    },
    {
      title: "Q&A Session",
      date: new Date(2024, 3, 25), // April 25, 2024
      type: "qa",
      description: "Open Q&A session with automation experts"
    }
  ];

  const classrooms = [
    {
      title: "How To Create Automated SEO Blogs With AI?",
      description: "In this classroom you will learn how to create SEO blogs automatically with AI, using Make.com and Airtable.",
      image: "/lovable-uploads/0f691532-4ffb-4ec9-82cb-3be9cc93d658.png"
    },
    {
      title: "Fully Automated Affiliate Marketing Dashboard",
      description: "Learn how to create an Affiliate Marketing Dashboard in Airtable, seamlessly integrating HubSpot and Google Analytics with Make.com.",
      image: "/lovable-uploads/0f691532-4ffb-4ec9-82cb-3be9cc93d658.png"
    },
    {
      title: "How To Obtain The Emails Of The Followers Of An Instagram Account",
      description: "In this classroom we explain how you can obtain the emails of the followers of certain instagram user, using Make.com, RapidAPI and Airtable.",
      image: "/lovable-uploads/0f691532-4ffb-4ec9-82cb-3be9cc93d658.png"
    },
  ];

  return (
    <>
      <MainHeader />
      <div className="container mx-auto px-4 py-8 max-w-[1200px] space-y-8 mt-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8">
            <Card className="p-6 space-y-6">
              <div className="aspect-video bg-muted rounded-lg overflow-hidden relative">
                {videoEmbedUrl ? (
                  <iframe
                    src={videoEmbedUrl}
                    className="absolute inset-0 w-full h-full"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <img 
                    src={community.thumbnail || "/lovable-uploads/890bbce9-6ca6-4a0e-958a-d7ba6f61bf73.png"}
                    alt="Community thumbnail"
                    className="w-full h-full object-cover"
                  />
                )}
              </div>

              <div className="space-y-4">
                <h1 className="text-2xl font-bold">{community.name}</h1>
                <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: community.description || '' }} />
              </div>
            </Card>
          </div>

          <div className="lg:col-span-4 space-y-6">
            <Card className="p-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12 ring-1 ring-border">
                    <AvatarImage src={community?.expert_thumbnail || "https://github.com/shadcn.png"} />
                    <AvatarFallback>CM</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm text-muted-foreground">Hosted by</p>
                    <p className="font-semibold">{community?.expert_name}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Products</p>
                    <p className="font-semibold">{community?.product_count || 0}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Classrooms</p>
                    <p className="font-semibold">{community?.classroom_count || 0}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Posts</p>
                    <p className="font-semibold">{community?.post_count || 0}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Members</p>
                    <p className="font-semibold">{community?.member_count || 0}</p>
                  </div>
                </div>

                {!isOwner && (
                  <Button className="w-full">Join Community</Button>
                )}
              </div>
            </Card>

            {links.length > 0 && (
              <Card className="p-6">
                <h3 className="font-semibold mb-4">Quick Links</h3>
                <div className="space-y-3">
                  {links.map((link, index) => (
                    <a 
                      key={index}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <LinkIcon className="w-4 h-4" />
                      <span>{link.name}</span>
                    </a>
                  ))}
                </div>
              </Card>
            )}
          </div>
        </div>

        <Tabs defaultValue="threads" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12">
            <div className="lg:col-span-8 w-full overflow-x-auto">
              <TabsList>
                <TabsTrigger value="threads" className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" />
                  Threads
                </TabsTrigger>
                <TabsTrigger value="classrooms" className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  Classrooms
                </TabsTrigger>
                <TabsTrigger value="templates" className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Products
                </TabsTrigger>
                <TabsTrigger value="calendar" className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Calendar
                </TabsTrigger>
              </TabsList>
            </div>
          </div>

          <TabsContent value="threads" className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <Button className="w-full sm:w-auto">Create New Thread</Button>
              <Input placeholder="Search thread" className="flex-1" />
            </div>
            <Card 
              className="group hover:bg-accent transition-colors cursor-pointer"
              onClick={() => setIsThreadOpen(true)}
            >
              <CardContent className="p-6 space-y-4">
                <div className="flex items-start gap-4">
                  <Avatar className="h-12 w-12 flex-shrink-0">
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>BP</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col gap-1">
                    <h3 className="font-semibold">Letter from Borja</h3>
                    <div className="text-sm text-muted-foreground">
                      Created by Borja P
                    </div>
                    <Badge variant="secondary" className="text-xs w-fit">Messages: 1</Badge>
                  </div>
                </div>

                <div className="space-y-4">
                  <p>👋 Welcome to Optimal Path Automations! 👋</p>
                  <p className="text-muted-foreground">
                    Hey everyone! I'm Borja, and I'm thrilled to welcome you to our community. Creating this space is a dream come true for me because I am passionate about helping others discover the power of no-code automation...
                  </p>
                  
                  <div className="flex justify-between items-end">
                    <div className="text-sm text-muted-foreground">
                      Last Message: 10/24/2024, 8:31 PM
                    </div>
                    <Badge variant="outline" className="flex items-center gap-1 w-fit">
                      <ThumbsUp className="w-3 h-3" />
                      8
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="classrooms" className="space-y-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input placeholder="Search classroom" className="pl-9" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {classrooms.map((classroom, index) => (
                <Card key={index} className="group relative flex flex-col hover:bg-accent transition-colors cursor-pointer overflow-hidden">
                  <div className="aspect-[1.25] relative overflow-hidden bg-gradient-to-br from-blue-400 to-blue-600 rounded-t-lg">
                    <div className="absolute inset-0 p-6 flex items-center justify-center">
                      <h3 className="text-white text-2xl font-bold text-center leading-tight">Classroom</h3>
                    </div>
                  </div>
                  <CardContent className="p-6 relative">
                    <CardTitle className="text-lg font-semibold mb-2">{classroom.title}</CardTitle>
                    <p className="text-muted-foreground text-sm mb-8">{classroom.description}</p>
                    <div className="absolute right-6 bottom-6 opacity-0 transform translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200">
                      <ArrowRight className="w-4 h-4 text-primary" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="templates" className="space-y-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input placeholder="Search products" className="pl-9" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {templates.map((template, index) => (
                <ProductCard
                  key={index}
                  title={template.title}
                  price={template.price}
                  image={template.image}
                  seller={template.seller}
                  description={template.description}
                  tags={template.tags}
                  category={template.category}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="calendar" className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <CalendarComponent
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  modifiers={{
                    event: events.map(event => event.date)
                  }}
                  modifiersClassNames={{
                    event: "text-primary font-bold underline"
                  }}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <ThreadDialog 
          isOpen={isThreadOpen}
          onClose={() => setIsThreadOpen(false)}
        />
      </div>
    </>
  );
}
