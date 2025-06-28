import React, { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageSquare, Users, BookOpen, Calendar, Link as LinkIcon, ThumbsUp, Search, ArrowRight, Plus, Edit } from "lucide-react";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProductCard } from "@/components/ProductCard";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Separator } from "@/components/ui/separator";
import { ThreadDialog } from "@/components/ThreadDialog";
import { MainHeader } from "@/components/MainHeader";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { getVideoEmbedUrl } from "@/utils/videoEmbed";
import { useAuth } from "@/lib/auth";
import { useCommunityImages } from "@/hooks/use-community-images";
import { ProductGallery } from "@/components/product/ProductGallery";
import type { ProductImage } from "@/types/product-images";
import { CommunityProductDialog } from "@/components/community/CommunityProductDialog";
import { ProductCreationDialog } from "@/components/community/ProductCreationDialog";
import { formatNumber } from "@/lib/utils";
import { ClassroomDialog } from "@/components/community/ClassroomDialog";
import { CommunityAccessGuard } from "@/components/community/CommunityAccessGuard";
import { CreateThreadDialog } from "@/components/community/CreateThreadDialog";

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
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [isThreadOpen, setIsThreadOpen] = useState(false);
  const [selectedThread, setSelectedThread] = useState<any>(null);
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false);
  const [isProductCreationDialogOpen, setIsProductCreationDialogOpen] = useState(false);
  const [isClassroomDialogOpen, setIsClassroomDialogOpen] = useState(false);
  const [isCreateThreadDialogOpen, setIsCreateThreadDialogOpen] = useState(false);
  const [showProductTemplateSelector, setShowProductTemplateSelector] = useState(false);
  const [activeTab, setActiveTab] = useState("threads");
  const { user } = useAuth();
  const { images } = useCommunityImages(communityId);

  console.log('Community ID from params:', communityId);

  // Get current user's expert data
  const { data: currentUserExpertData } = useQuery({
    queryKey: ['current-user-expert', user?.email],
    queryFn: async () => {
      if (!user?.email) return null;
      
      const { data, error } = await supabase
        .from('experts')
        .select('expert_uuid, user_uuid')
        .ilike('email', user.email)
        .maybeSingle();
      
      if (error) {
        console.error('Error fetching current user expert:', error);
        return null;
      }
      
      return data;
    },
    enabled: !!user?.email,
  });

  const { data: community, isLoading: isCommunityLoading } = useQuery({
    queryKey: ['community', communityId],
    queryFn: async () => {
      if (!communityId) {
        console.error('No community ID provided');
        return null;
      }

      console.log('Fetching community with ID:', communityId);
      
      const { data, error } = await supabase
        .from('communities')
        .select(`
          *,
          expert:expert_uuid(
            expert_uuid,
            name,
            thumbnail
          )
        `)
        .eq('community_uuid', communityId)
        .maybeSingle();

      if (error) {
        console.error('Error fetching community:', error);
        throw error;
      }

      console.log('Community data fetched:', data);
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

  const { data: communityProducts, isLoading: isProductsLoading } = useQuery({
    queryKey: ['communityProducts', communityId],
    queryFn: async () => {
      if (!communityId) {
        console.error('No community ID provided for products query');
        return [];
      }

      console.log('Fetching community products for ID:', communityId);

      const { data, error } = await supabase
        .from('community_products')
        .select(`
          community_product_uuid,
          name,
          price,
          product_type,
          payment_link,
          files_link,
          product_uuid
        `)
        .eq('community_uuid', communityId);

      if (error) {
        console.error("Error fetching community products:", error);
        return [];
      }

      console.log('Community products fetched:', data);
      return data || [];
    },
    enabled: !!communityId
  });

  const { data: communityMembers, isLoading: isMembersLoading } = useQuery({
    queryKey: ['community-members', communityId],
    queryFn: async () => {
      if (!communityId) {
        console.error('No community ID provided for members query');
        return [];
      }

      console.log('Fetching community members for ID:', communityId);

      const { data, error } = await supabase
        .from('community_subscriptions')
        .select(`
          community_subscription_uuid,
          created_at,
          user_uuid,
          users!community_subscriptions_user_uuid_fkey (
            user_uuid,
            first_name,
            last_name,
            user_thumbnail
          )
        `)
        .eq('community_uuid', communityId)
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Error fetching community members:", error);
        throw error;
      }

      console.log('Community members fetched:', data);
      return data;
    },
    enabled: !!communityId
  });

  const videoEmbedUrl = getVideoEmbedUrl(community?.intro);
  const links = parseLinks(community?.links);

  // Parse threads_tags from community data
  const threadsTags = React.useMemo(() => {
    if (!community?.threads_tags) return [];
    if (Array.isArray(community.threads_tags)) return community.threads_tags;
    if (typeof community.threads_tags === 'string') {
      try {
        const parsed = JSON.parse(community.threads_tags);
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return [];
      }
    }
    return [];
  }, [community?.threads_tags]);

  // Check if current user is the community owner - enhanced debugging
  const isOwner = currentUserExpertData && community && (
    currentUserExpertData.expert_uuid === community.expert_uuid ||
    currentUserExpertData.user_uuid === community.expert_uuid ||
    user?.id === community.expert_uuid
  );

  // Add debugging logs
  console.log('Ownership debug:', {
    user: user?.id,
    userEmail: user?.email,
    currentUserExpertData,
    communityExpertUuid: community?.expert_uuid,
    isOwner
  });

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

  // Create gallery images - use community images if available, otherwise add placeholders
  const createGalleryImages = (): ProductImage[] => {
    const communityImages = images?.map(img => ({
      id: img.id,
      url: img.url,
      storage_path: img.storage_path,
      is_primary: img.is_primary,
      file_name: img.file_name,
      alt_text: img.alt_text || img.file_name
    } as ProductImage)) || [];

    // If we have community images, use them
    if (communityImages.length > 0) {
      return communityImages;
    }

    // Otherwise, create a mix of community thumbnail and placeholder images
    const galleryImages: ProductImage[] = [];
    
    // Add community thumbnail as primary if it exists
    if (community?.thumbnail) {
      galleryImages.push({
        id: 1,
        url: community.thumbnail,
        storage_path: 'community-thumbnail',
        is_primary: true,
        file_name: 'Community thumbnail',
        alt_text: `${community.name} thumbnail`
      });
    }

    // Add some placeholder images to create a gallery effect
    const placeholderImages = [
      {
        id: 2,
        url: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&q=80",
        storage_path: 'placeholder-1',
        is_primary: false,
        file_name: 'Community workspace',
        alt_text: 'Community workspace environment'
      },
      {
        id: 3,
        url: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80",
        storage_path: 'placeholder-2',
        is_primary: false,
        file_name: 'Team collaboration',
        alt_text: 'Team collaboration session'
      },
      {
        id: 4,
        url: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=800&q=80",
        storage_path: 'placeholder-3',
        is_primary: false,
        file_name: 'Learning environment',
        alt_text: 'Learning and development environment'
      }
    ];

    // Add placeholder images if we don't have enough images
    const remainingSlots = Math.max(0, 4 - galleryImages.length);
    galleryImages.push(...placeholderImages.slice(0, remainingSlots));

    // If no community thumbnail, make first placeholder primary
    if (!community?.thumbnail && galleryImages.length > 0) {
      galleryImages[0].is_primary = true;
    }

    return galleryImages;
  };

  const galleryImages = createGalleryImages();
  
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

  const handleOpenProductDialog = (useTemplates: boolean) => {
    setShowProductTemplateSelector(useTemplates);
    setIsProductDialogOpen(true);
    setIsProductCreationDialogOpen(false);
  };

  const handleOpenProductCreationDialog = () => {
    setIsProductCreationDialogOpen(true);
  };

  const handleProductClick = (productId: string) => {
    console.log('Opening community product with ID:', productId);
    window.open(`/community/product/${productId}`, '_blank');
  };

  const renderAddProductButton = () => {
    if (isOwner) {
      return (
        <Button
          className="flex items-center gap-2"
          onClick={handleOpenProductCreationDialog}
        >
          <span>Add Product</span>
        </Button>
      );
    }
    return null;
  };

  const renderAddClassroomButton = () => {
    if (isOwner) {
      return (
        <Button
          className="flex items-center gap-2"
          onClick={() => setIsClassroomDialogOpen(true)}
        >
          <span>Add Classroom</span>
        </Button>
      );
    }
    return null;
  };

  const tabs = [
    { id: "threads", label: "Threads", icon: MessageSquare },
    { id: "classrooms", label: "Classrooms", icon: BookOpen },
    { id: "templates", label: "Products", icon: Users },
    { id: "calendar", label: "Calendar", icon: Calendar },
    { id: "members", label: "Members", icon: Users }
  ];

  return (
    <>
      <MainHeader />
      <CommunityAccessGuard communityId={communityId || ''}>
        <div className="container mx-auto px-4 py-8 max-w-[1400px] space-y-8 mt-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8">
              <Card className="p-6 space-y-6">
                <div className="flex items-center justify-between gap-4">
                  <h1 className="text-3xl font-bold">{community?.name}</h1>
                  {isOwner && (
                    <Link to={`/community/${communityId}/edit`}>
                      <Button variant="ghost" size="sm" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
                        <Edit className="w-4 h-4" />
                        <span className="text-sm">Edit</span>
                      </Button>
                    </Link>
                  )}
                </div>

                <div>
                  <ProductGallery 
                    images={galleryImages}
                    priority
                  />
                </div>

                <div className="space-y-4">
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
                      <p className="text-2xl font-bold">{formatNumber(community?.member_count)}</p>
                      <p className="text-sm text-muted-foreground">Members</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold">{formatNumber(community?.post_count)}</p>
                      <p className="text-sm text-muted-foreground">Posts</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold">{formatNumber(community?.product_count)}</p>
                      <p className="text-sm text-muted-foreground">Products</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold">{formatNumber(community?.classroom_count)}</p>
                      <p className="text-sm text-muted-foreground">Classrooms</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10 flex-shrink-0">
                      <AvatarImage 
                        src={community?.expert?.name ? community.expert.thumbnail || "https://github.com/shadcn.png" : "https://github.com/shadcn.png"} 
                        alt={`${community?.expert?.name || "Expert"} avatar`}
                        className="object-cover"
                      />
                      <AvatarFallback className="text-sm font-medium">
                        {community?.expert?.name?.substring(0, 2)?.toUpperCase() || "EX"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <span className="text-sm text-muted-foreground">
                        Hosted by <span className="font-medium">{community?.expert?.name || "Expert"}</span>
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <div className="border-b border-border">
              <nav className="flex space-x-6 overflow-x-auto scrollbar-hide px-6" aria-label="Tabs">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 flex items-center gap-2 ${
                        isActive
                          ? "border-primary text-primary"
                          : "border-transparent text-muted-foreground hover:text-foreground hover:border-gray-300"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {tab.label}
                    </button>
                  );
                })}
              </nav>
            </div>

            <TabsContent value="threads" className="space-y-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <Input placeholder="Search thread" className="flex-1" />
                <Button 
                  className="w-full sm:w-auto"
                  onClick={() => setIsCreateThreadDialogOpen(true)}
                >
                  Create New Thread
                </Button>
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
              <div className="flex flex-col sm:flex-row gap-4 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input placeholder="Search classroom" className="pl-9 w-full" />
                </div>
                {renderAddClassroomButton()}
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
              <div className="flex flex-col sm:flex-row gap-4 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input placeholder="Search products" className="pl-9 w-full" />
                </div>
                {renderAddProductButton()}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {isProductsLoading ? (
                  Array.from({ length: 3 }).map((_, index) => (
                    <Card key={index} className="animate-pulse">
                      <div className="h-48 bg-muted"></div>
                      <CardContent className="p-4">
                        <div className="h-6 bg-muted rounded w-2/3 mb-2"></div>
                        <div className="h-4 bg-muted rounded w-full"></div>
                      </CardContent>
                    </Card>
                  ))
                ) : communityProducts && communityProducts.length > 0 ? (
                  communityProducts.map((product: any) => (
                    <div key={product.community_product_uuid} className="relative">
                      <ProductCard
                        title={product.name}
                        price={product.price ? `$${product.price}` : "Free"}
                        image="/placeholder.svg"
                        seller={community?.name || "Community"}
                        description={`A product by ${community?.name}`}
                        tags={[product.product_type || "product"]}
                        category="community"
                        href={`/community/product/${product.community_product_uuid}`}
                      />
                      {isOwner && product.product_uuid && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="absolute top-2 right-2 h-8 w-8 p-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/product/${product.product_uuid}/edit`);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="col-span-full text-center py-8 border border-dashed rounded-md bg-muted/10">
                    <p className="text-muted-foreground mb-2">No products available in this community.</p>
                    {isOwner && (
                      <Button 
                        variant="outline" 
                        onClick={() => handleOpenProductDialog(false)}
                        className="gap-2"
                      >
                        <Plus className="h-4 w-4" />
                        Add Your First Product
                      </Button>
                    )}
                  </div>
                )}
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

            <TabsContent value="members" className="space-y-6">
              {isMembersLoading ? (
                <div className="space-y-4">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <div key={index} className="flex items-center space-x-4 p-4 rounded-lg border bg-card animate-pulse">
                      <div className="w-12 h-12 bg-muted rounded-full"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-muted rounded w-1/4"></div>
                        <div className="h-3 bg-muted rounded w-1/6"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : communityMembers && communityMembers.length > 0 ? (
                <div className="space-y-4">
                  {communityMembers.map((member) => (
                    <div key={member.community_subscription_uuid} className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent transition-colors">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-12 w-12">
                          <AvatarImage 
                            src={member.users.user_thumbnail || "https://github.com/shadcn.png"} 
                            alt={`${member.users.first_name} ${member.users.last_name}`}
                          />
                          <AvatarFallback>
                            {`${member.users.first_name?.charAt(0) || ''}${member.users.last_name?.charAt(0) || ''}`}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">
                            {member.users.first_name} {member.users.last_name}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Member since {new Date(member.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No active members found in this community.</p>
                </div>
              )}
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

          <CreateThreadDialog
            open={isCreateThreadDialogOpen}
            onOpenChange={setIsCreateThreadDialogOpen}
            communityId={communityId || ''}
            expertUuid={community?.expert_uuid}
            threadsTags={threadsTags}
          />

          <ProductCreationDialog
            open={isProductCreationDialogOpen}
            onOpenChange={setIsProductCreationDialogOpen}
            onSelectFromScratch={() => handleOpenProductDialog(false)}
            onSelectFromTemplate={() => handleOpenProductDialog(true)}
          />

          <CommunityProductDialog
            open={isProductDialogOpen}
            onOpenChange={setIsProductDialogOpen}
            communityUuid={communityId || ''}
            expertUuid={community?.expert_uuid}
            showTemplateSelector={showProductTemplateSelector}
          />

          <ClassroomDialog
            open={isClassroomDialogOpen}
            onOpenChange={setIsClassroomDialogOpen}
            communityUuid={communityId || ''}
          />
        </div>
      </CommunityAccessGuard>
    </>
  );
}
