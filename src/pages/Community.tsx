import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageSquare, Users, BookOpen, Calendar, Link as LinkIcon, ThumbsUp, Search, ArrowRight, Plus } from "lucide-react";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProductCard } from "@/components/ProductCard";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Separator } from "@/components/ui/separator";
import { ThreadDialog } from "@/components/ThreadDialog";
import { MainHeader } from "@/components/MainHeader";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { getVideoEmbedUrl } from "@/utils/videoEmbed";
import { useAuth } from "@/lib/auth";
import { useCommunityImages } from "@/hooks/use-community-images";
import { ProductGallery } from "@/components/product/ProductGallery";
import type { ProductImage } from "@/types/product-images";

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

export default function CommunityPage() {
  const { id: communityId } = useParams();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [isThreadOpen, setIsThreadOpen] = useState(false);
  const [selectedThread, setSelectedThread] = useState<any>(null);
  const { user } = useAuth();
  const { images } = useCommunityImages(communityId);

  const { data: community, isLoading: isCommunityLoading } = useQuery({
    queryKey: ['community', communityId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('communities')
        .select('*, expert:expert_uuid(*)')
        .eq('community_uuid', communityId)
        .single();

      if (error) {
        throw error;
      }

      return data;
    },
    enabled: !!communityId
  });

  const { data: threads, isLoading: isThreadsLoading } = useQuery({
    queryKey: ['community-threads', communityId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('threads')
        .select(`
          *,
          user:user_uuid(*)
        `)
        .eq('community_uuid', communityId)
        .eq('status', 'open')
        .order('last_message_at', { ascending: false });

      if (error) {
        throw error;
      }

      return data;
    },
    enabled: !!communityId
  });

  const { data: classrooms, isLoading: isClassroomsLoading } = useQuery({
    queryKey: ['community-classrooms', communityId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('classrooms')
        .select('*')
        .eq('community_uuid', communityId)
        .eq('status', 'visible')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      return data;
    },
    enabled: !!communityId
  });

  const videoEmbedUrl = getVideoEmbedUrl(community?.intro);
  const links = parseLinks(community?.links);
  
  if (isCommunityLoading) {
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

  const handleThreadClick = (thread: any) => {
    setSelectedThread(thread);
    setIsThreadOpen(true);
  };

  const renderAddProductButton = () => {
    if (isOwner) {
      return (
        <Link to={`/community/${communityId}/products/new`}>
          <Button variant="outline" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            <span>Add Product</span>
          </Button>
        </Link>
      );
    }
    return null;
  };

  return (
    <>
      <MainHeader />
      <div className="container mx-auto px-4 py-8 max-w-[1200px] space-y-8 mt-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8">
            <Card className="p-6 space-y-6">
              {images && images.length > 0 ? (
                <div>
                  <ProductGallery 
                    images={images.map(img => ({
                      id: img.id,
                      url: img.url,
                      storage_path: img.storage_path,
                      is_primary: img.is_primary,
                      file_name: img.file_name,
                      alt_text: img.alt_text || img.file_name
                    } as ProductImage))}
                    priority
                  />
                </div>
              ) : (
                <div className="aspect-video bg-muted rounded-lg overflow-hidden relative">
                  <img 
                    src={community?.thumbnail || "/lovable-uploads/890bbce9-6ca6-4a0e-958a-d7ba6f61bf73.png"}
                    alt="Community thumbnail"
                    className="w-full h-full object-contain"
                  />
                </div>
              )}

              <div className="space-y-4">
                <h1 className="text-2xl font-bold">{community?.name}</h1>
                <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: community?.description || '' }} />
              </div>
            </Card>
          </div>

          <div className="lg:col-span-4 space-y-6">
            <Card className="overflow-hidden bg-white">
              <div className="p-6 space-y-6">
                {videoEmbedUrl && (
                  <div className="aspect-video w-full bg-muted rounded-lg overflow-hidden">
                    <iframe
                      src={videoEmbedUrl}
                      className="w-full h-full"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                )}

                <div>
                  <h2 className="text-2xl font-bold mb-2">{community?.name}</h2>
                  <p className="text-muted-foreground text-sm mb-4">
                    {community?.description?.substring(0, 150)}...
                  </p>
                </div>

                {links.length > 0 && (
                  <div className="space-y-2">
                    {links.map((link, index) => (
                      <a 
                        key={index}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
                      >
                        <LinkIcon className="w-4 h-4" />
                        <span className="text-sm">{link.name}</span>
                      </a>
                    ))}
                  </div>
                )}

                <div className="grid grid-cols-4 gap-4 py-4 border-y">
                  <div className="text-center">
                    <p className="text-2xl font-bold">{community?.member_count || 0}</p>
                    <p className="text-sm text-muted-foreground">Members</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold">{community?.post_count || 0}</p>
                    <p className="text-sm text-muted-foreground">Posts</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold">{community?.product_count || 0}</p>
                    <p className="text-sm text-muted-foreground">Products</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold">{community?.classroom_count || 0}</p>
                    <p className="text-sm text-muted-foreground">Classrooms</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8 ring-1 ring-primary/10">
                    <AvatarImage src={community?.expert_thumbnail || "https://github.com/shadcn.png"} />
                    <AvatarFallback>EX</AvatarFallback>
                  </Avatar>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Hosted by</span>
                    <span className="font-medium">{community?.expert_name}</span>
                  </div>
                </div>
              </div>
            </Card>
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

            {isThreadsLoading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <Card key={i} className="p-6">
                    <div className="animate-pulse space-y-4">
                      <div className="flex gap-4">
                        <div className="w-12 h-12 bg-muted rounded-full" />
                        <div className="flex-1 space-y-2">
                          <div className="h-4 w-1/4 bg-muted rounded" />
                          <div className="h-3 w-1/3 bg-muted rounded" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="h-4 w-full bg-muted rounded" />
                        <div className="h-4 w-2/3 bg-muted rounded" />
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : threads && threads.length > 0 ? (
              <div className="space-y-4">
                {threads.map((thread) => (
                  <Card 
                    key={thread.thread_uuid}
                    className="group hover:bg-accent transition-colors cursor-pointer"
                    onClick={() => handleThreadClick(thread)}
                  >
                    <CardContent className="p-6 space-y-4">
                      <div className="flex items-start gap-4">
                        <Avatar className="h-12 w-12 flex-shrink-0">
                          <AvatarImage src="https://github.com/shadcn.png" />
                          <AvatarFallback>{thread.user_name?.substring(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col gap-1">
                          <h3 className="font-semibold">{thread.title}</h3>
                          <div className="text-sm text-muted-foreground">
                            Created by {thread.user_name}
                          </div>
                          <Badge variant="secondary" className="text-xs w-fit">Messages: {thread.number_messages || 0}</Badge>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <p className="text-muted-foreground line-clamp-3">{thread.initial_message}</p>
                        
                        <div className="flex justify-between items-end">
                          <div className="text-sm text-muted-foreground">
                            Last Message: {thread.last_message_at ? new Date(thread.last_message_at).toLocaleString() : 'No messages yet'}
                          </div>
                          <Badge variant="outline" className="flex items-center gap-1 w-fit">
                            <ThumbsUp className="w-3 h-3" />
                            {thread.upvote_count || 0}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="p-6">
                <p className="text-center text-muted-foreground">No threads found in this community.</p>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="classrooms" className="space-y-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input placeholder="Search classroom" className="pl-9" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {isClassroomsLoading ? (
                [...Array(3)].map((_, index) => (
                  <Card key={index} className="group relative flex flex-col hover:bg-accent transition-colors animate-pulse">
                    <div className="aspect-[1.25] bg-muted rounded-t-lg"></div>
                    <CardContent className="p-6 relative space-y-4">
                      <div className="h-6 bg-muted rounded w-3/4"></div>
                      <div className="h-4 bg-muted rounded w-full"></div>
                      <div className="h-4 bg-muted rounded w-2/3"></div>
                    </CardContent>
                  </Card>
                ))
              ) : classrooms && classrooms.length > 0 ? (
                classrooms.map((classroom) => (
                  <Link 
                    key={classroom.classroom_uuid}
                    to={`/classroom/${classroom.classroom_uuid}`}
                    className="block"
                  >
                    <Card className="group relative flex flex-col hover:bg-accent transition-colors cursor-pointer overflow-hidden h-full">
                      <div className="aspect-[1.25] relative overflow-hidden bg-gradient-to-br from-blue-400 to-blue-600 rounded-t-lg">
                        {classroom.thumbnail ? (
                          <img 
                            src={classroom.thumbnail} 
                            alt={classroom.name} 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="absolute inset-0 p-6 flex items-center justify-center">
                            <h3 className="text-white text-2xl font-bold text-center leading-tight">Classroom</h3>
                          </div>
                        )}
                      </div>
                      <CardContent className="p-6 relative flex flex-col flex-1">
                        <CardTitle className="text-lg font-semibold mb-2">{classroom.name}</CardTitle>
                        <p className="text-muted-foreground text-sm flex-1">{classroom.description || classroom.summary}</p>
                        <div className="absolute right-6 bottom-6 opacity-0 transform translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200">
                          <ArrowRight className="w-4 h-4 text-primary" />
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))
              ) : (
                <Card className="col-span-full p-6">
                  <p className="text-center text-muted-foreground">No classrooms found in this community.</p>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="templates" className="space-y-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input placeholder="Search products" className="pl-9" />
            </div>
            <div className="flex justify-end mb-4">
              {renderAddProductButton()}
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
          onClose={() => {
            setIsThreadOpen(false);
            setSelectedThread(null);
          }}
          thread={selectedThread}
        />
      </div>
    </>
  );
}
