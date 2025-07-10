import React, { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageSquare, Users, BookOpen, Calendar, Link as LinkIcon, ThumbsUp, Search, ArrowRight, Plus, Edit, Package, Settings, UserX, Check, X, UserCheck } from "lucide-react";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MemberRequestsDialog } from "@/components/community/MemberRequestsDialog";
import { MemberApprovalDialog } from "@/components/community/MemberApprovalDialog";
import { MemberRejectDialog } from "@/components/community/MemberRejectDialog";
import { ThreadCard } from "@/components/community/ThreadCard";
import { useToast } from "@/hooks/use-toast";

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
  const { toast } = useToast();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [isThreadOpen, setIsThreadOpen] = useState(false);
  const [selectedThread, setSelectedThread] = useState<any>(null);
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false);
  const [isProductCreationDialogOpen, setIsProductCreationDialogOpen] = useState(false);
  const [isClassroomDialogOpen, setIsClassroomDialogOpen] = useState(false);
  const [isCreateThreadDialogOpen, setIsCreateThreadDialogOpen] = useState(false);
  const [isMemberRequestsDialogOpen, setIsMemberRequestsDialogOpen] = useState(false);
  const [isApprovalDialogOpen, setIsApprovalDialogOpen] = useState(false);
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [selectedMemberForAction, setSelectedMemberForAction] = useState<any>(null);
  const [showProductTemplateSelector, setShowProductTemplateSelector] = useState(false);
  const [activeTab, setActiveTab] = useState("threads");
  const [selectedTag, setSelectedTag] = useState<string>("all");
  const { user } = useAuth();
  const { images } = useCommunityImages(communityId);

  // Add validation for communityId
  React.useEffect(() => {
    console.log('Community ID from params:', communityId);
    if (communityId === ':id' || !communityId) {
      console.error('Invalid community ID detected:', communityId);
    }
  }, [communityId]);

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
      if (!communityId || communityId === ':id') {
        console.error('No valid community ID provided');
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
    enabled: !!communityId && communityId !== ':id'
  });

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
        .order('last_message_at', { ascending: false });

      if (error) {
        throw error;
      }

      // If user is owner, show all threads (open and closed)
      // If not owner, only show open threads
      return isOwner ? data : data?.filter(thread => thread.status === 'open') || [];
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
      if (!communityId || communityId === ':id') {
        console.error('No valid community ID provided for members query');
        return [];
      }

      console.log('Fetching community members for ID:', communityId);

      const { data, error } = await supabase
        .from('community_subscriptions')
        .select(`
          community_subscription_uuid,
          created_at,
          user_uuid,
          status,
          users!community_subscriptions_user_uuid_fkey (
            user_uuid,
            first_name,
            last_name,
            user_thumbnail
          )
        `)
        .eq('community_uuid', communityId)
        .in('status', ['active', 'pending'])
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Error fetching community members:", error);
        throw error;
      }

      console.log('Community members fetched:', data);
      return data;
    },
    enabled: !!communityId && communityId !== ':id'
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

  // Filter threads by selected tag
  const filteredThreads = React.useMemo(() => {
    if (!threads || selectedTag === "all") return threads;
    return threads.filter(thread => thread.tag === selectedTag);
  }, [threads, selectedTag]);

  // Filter members by status - only show active members in main list
  const activeMembers = communityMembers?.filter(m => m.status === 'active') || [];
  const pendingMembers = communityMembers?.filter(m => m.status === 'pending').map(member => ({
    ...member,
    status: member.status as 'pending' | 'active' | 'cancelled' | 'rejected'
  })) || [];

  // New handler functions for the dialogs
  const handleOpenApprovalDialog = (member: any) => {
    setSelectedMemberForAction(member);
    setIsApprovalDialogOpen(true);
  };

  const handleOpenRejectDialog = (member: any, isKick = false) => {
    setSelectedMemberForAction({ ...member, isKick });
    setIsRejectDialogOpen(true);
  };

  // Early return for invalid community ID
  if (communityId === ':id' || !communityId) {
    return (
      <>
        <MainHeader />
        <div className="container mx-auto px-4 py-8 mt-16">
          <Card className="p-6">
            <h1 className="text-xl font-semibold">Invalid Community URL</h1>
            <p className="text-muted-foreground mt-2">
              The community URL appears to be invalid. Please check the link and try again.
            </p>
          </Card>
        </div>
      </>
    );
  }

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

  const formatDescription = (description: string | null | undefined, maxLines: number = 4) => {
    if (!description) return '';
    
    // Strip HTML tags
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = description;
    const plainText = tempDiv.textContent || tempDiv.innerText || '';
    
    // Split into words and approximate line limit
    const words = plainText.split(' ');
    const wordsPerLine = 12; // Approximate words per line
    const maxWords = maxLines * wordsPerLine;
    
    if (words.length <= maxWords) {
      return plainText;
    }
    
    return words.slice(0, maxWords).join(' ') + '...';
  };

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

  const renderMemberRequestsButton = () => {
    if (isOwner && pendingMembers.length > 0) {
      return (
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
          onClick={() => setIsMemberRequestsDialogOpen(true)}
        >
          <Settings className="w-4 h-4" />
          Member Requests ({pendingMembers.length})
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
                
                {threadsTags.length > 0 && (
                  <Select value={selectedTag} onValueChange={setSelectedTag}>
                    <SelectTrigger className="w-full sm:w-[180px]">
                      <SelectValue placeholder="Filter by tag" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Tags</SelectItem>
                      {threadsTags.map((tag) => (
                        <SelectItem key={tag} value={tag}>
                          {tag}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
                
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
              ) : filteredThreads && filteredThreads.length > 0 ? (
                <div className="space-y-4">
                  {filteredThreads.map((thread) => (
                    <ThreadCard 
                      key={thread.thread_uuid}
                      thread={thread}
                      isOwner={isOwner}
                      onThreadClick={handleThreadClick}
                    />
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  <Card className="border-2 border-dashed border-muted-foreground/25 bg-muted/10">
                    <CardContent className="flex flex-col items-center justify-center py-16 px-8 text-center relative">
                      <div className="mb-6 p-6 rounded-full bg-gradient-to-br from-primary/10 to-primary/20 border border-primary/20">
                        <MessageSquare className="h-12 w-12 text-primary" />
                      </div>
                      
                      <h3 className="text-xl font-semibold text-foreground mb-3">
                        {selectedTag === "all" 
                          ? "No discussions yet" 
                          : `No threads with "${selectedTag}" tag`
                        }
                      </h3>
                      
                      <p className="text-muted-foreground max-w-md mb-8 leading-relaxed">
                        {selectedTag === "all" 
                          ? "This community doesn't have any discussion threads yet. Start a conversation to engage with other members!"
                          : `No threads found with the "${selectedTag}" tag. Try selecting a different tag or create a new thread.`
                        }
                      </p>
                      
                      <Button 
                        onClick={() => setIsCreateThreadDialogOpen(true)}
                        size="lg"
                        className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 rounded-lg font-medium transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl"
                      >
                        <Plus className="h-5 w-5 mr-2" />
                        {selectedTag === "all" 
                          ? "Start the First Discussion" 
                          : "Create New Thread"
                        }
                      </Button>
                      
                      <div className="absolute inset-0 -z-10 opacity-5">
                        <div className="absolute top-4 left-4 w-8 h-8 border border-primary rounded-full"></div>
                        <div className="absolute top-8 right-8 w-4 h-4 bg-primary/20 rounded-full"></div>
                        <div className="absolute bottom-8 left-8 w-6 h-6 border border-primary/30 rotate-45"></div>
                        <div className="absolute bottom-4 right-4 w-10 h-10 border-2 border-primary/20 rounded-full"></div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
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
                          <p className="text-muted-foreground text-sm flex-1 line-clamp-4 leading-relaxed">
                            {formatDescription(classroom.description || classroom.summary, 4)}
                          </p>
                          <div className="absolute right-6 bottom-6 opacity-0 transform translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200">
                            <ArrowRight className="w-4 h-4 text-primary" />
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))
                ) : (
                  <div className="col-span-full">
                    <Card className="border-2 border-dashed border-muted-foreground/25 bg-muted/10">
                      <CardContent className="flex flex-col items-center justify-center py-16 px-8 text-center">
                        {/* Icon Container */}
                        <div className="mb-6 p-6 rounded-full bg-gradient-to-br from-primary/10 to-primary/20 border border-primary/20">
                          <BookOpen className="h-12 w-12 text-primary" />
                        </div>
                        
                        {/* Main Message */}
                        <h3 className="text-xl font-semibold text-foreground mb-3">
                          No classrooms yet
                        </h3>
                        
                        {/* Description */}
                        <p className="text-muted-foreground max-w-md mb-8 leading-relaxed">
                          This community doesn't have any classrooms available yet. 
                          {isOwner 
                            ? " Start creating educational content to engage with your community members."
                            : " Check back later as the community owner adds new learning materials."
                          }
                        </p>
                        
                        {/* Action Button */}
                        {isOwner && (
                          <Button 
                            onClick={() => setIsClassroomDialogOpen(true)}
                            size="lg"
                            className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 rounded-lg font-medium transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl"
                          >
                            <Plus className="h-5 w-5 mr-2" />
                            Create Your First Classroom
                          </Button>
                        )}
                        
                        {/* Decorative Elements */}
                        <div className="absolute inset-0 -z-10 opacity-5">
                          <div className="absolute top-4 left-4 w-8 h-8 border border-primary rounded-full"></div>
                          <div className="absolute top-8 right-8 w-4 h-4 bg-primary/20 rounded-full"></div>
                          <div className="absolute bottom-8 left-8 w-6 h-6 border border-primary/30 rotate-45"></div>
                          <div className="absolute bottom-4 right-4 w-10 h-10 border-2 border-primary/20 rounded-full"></div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
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
                  <div className="col-span-full">
                    <Card className="border-2 border-dashed border-muted-foreground/25 bg-muted/10">
                      <CardContent className="flex flex-col items-center justify-center py-16 px-8 text-center">
                        {/* Icon Container */}
                        <div className="mb-6 p-6 rounded-full bg-gradient-to-br from-primary/10 to-primary/20 border border-primary/20">
                          <Package className="h-12 w-12 text-primary" />
                        </div>
                        
                        {/* Main Message */}
                        <h3 className="text-xl font-semibold text-foreground mb-3">
                          No products yet
                        </h3>
                        
                        {/* Description */}
                        <p className="text-muted-foreground max-w-md mb-8 leading-relaxed">
                          This community doesn't have any products available yet. 
                          {isOwner 
                            ? " Start building your product catalog to engage with your community members."
                            : " Check back later as the community owner adds new content."
                          }
                        </p>
                        
                        {/* Action Button */}
                        {isOwner && (
                          <Button 
                            onClick={() => handleOpenProductDialog(false)}
                            size="lg"
                            className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 rounded-lg font-medium transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl"
                          >
                            <Plus className="h-5 w-5 mr-2" />
                            Create Your First Product
                          </Button>
                        )}
                        
                        {/* Decorative Elements */}
                        <div className="absolute inset-0 -z-10 opacity-5">
                          <div className="absolute top-4 left-4 w-8 h-8 border border-primary rounded-full"></div>
                          <div className="absolute top-8 right-8 w-4 h-4 bg-primary/20 rounded-full"></div>
                          <div className="absolute bottom-8 left-8 w-6 h-6 border border-primary/30 rotate-45"></div>
                          <div className="absolute bottom-4 right-4 w-10 h-10 border-2 border-primary/20 rounded-full"></div>
                        </div>
                      </CardContent>
                    </Card>
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
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Community Members</h3>
                {renderMemberRequestsButton()}
              </div>
              
              {isMembersLoading ? (
                <div className="space-y-4">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <div key={index} className="flex items-center space-x-4 p-6 rounded-xl border bg-card animate-pulse">
                      <div className="w-16 h-16 bg-muted rounded-full"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-5 bg-muted rounded w-1/4"></div>
                        <div className="h-4 bg-muted rounded w-1/6"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : activeMembers.length > 0 ? (
                <div className="space-y-4">
                  {/* Only Active Members - Pending members are hidden from main list */}
                  {activeMembers.map((member) => (
                    <div key={member.community_subscription_uuid} className="flex items-center justify-between p-6 rounded-xl border bg-card hover:bg-accent/20 transition-colors">
                      <div className="flex items-center space-x-4 flex-1">
                        <Avatar className="h-16 w-16">
                          <AvatarImage 
                            src={member.users.user_thumbnail || "https://github.com/shadcn.png"} 
                            alt={`${member.users.first_name} ${member.users.last_name}`}
                          />
                          <AvatarFallback className="bg-primary/10 text-primary font-medium text-lg">
                            {`${member.users.first_name?.charAt(0) || ''}${member.users.last_name?.charAt(0) || ''}`}
                          </AvatarFallback>
                        </Avatar>
                        <div className="space-y-2 flex-1">
                          <p className="font-semibold text-lg">
                            {member.users.first_name} {member.users.last_name}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Member since {new Date(member.created_at).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="bg-green-100 text-green-800 px-3 py-1">
                          Active
                        </Badge>
                        {isOwner && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleOpenRejectDialog(member, true)}
                            className="h-10 w-10 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-full ml-2"
                          >
                            <UserX className="h-5 w-5" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  <Card className="border-2 border-dashed border-muted-foreground/25 bg-muted/10">
                    <CardContent className="flex flex-col items-center justify-center py-16 px-8 text-center">
                      {/* Icon Container */}
                      <div className="mb-6 p-6 rounded-full bg-gradient-to-br from-primary/10 to-primary/20 border border-primary/20">
                        <Users className="h-12 w-12 text-primary" />
                      </div>
                      
                      {/* Main Message */}
                      <h3 className="text-xl font-semibold text-foreground mb-3">
                        No members yet
                      </h3>
                      
                      {/* Description */}
                      <p className="text-muted-foreground max-w-md mb-8 leading-relaxed">
                        This community doesn't have any active members yet. Once people join your community, they'll appear here and you can see who's part of your growing community.
                      </p>
                      
                      {/* Decorative Elements */}
                      <div className="absolute inset-0 -z-10 opacity-5">
                        <div className="absolute top-4 left-4 w-8 h-8 border border-primary rounded-full"></div>
                        <div className="absolute top-8 right-8 w-4 h-4 bg-primary/20 rounded-full"></div>
                        <div className="absolute bottom-8 left-8 w-6 h-6 border border-primary/30 rotate-45"></div>
                        <div className="absolute bottom-4 right-4 w-10 h-10 border-2 border-primary/20 rounded-full"></div>
                      </div>
                    </CardContent>
                  </Card>
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

          <MemberRequestsDialog
            open={isMemberRequestsDialogOpen}
            onOpenChange={setIsMemberRequestsDialogOpen}
            members={pendingMembers}
            isOwner={isOwner}
            communityId={communityId || ''}
          />

          <MemberApprovalDialog
            open={isApprovalDialogOpen}
            onOpenChange={setIsApprovalDialogOpen}
            member={selectedMemberForAction}
            communityId={communityId || ''}
          />

          <MemberRejectDialog
            open={isRejectDialogOpen}
            onOpenChange={setIsRejectDialogOpen}
            member={selectedMemberForAction}
            communityId={communityId || ''}
            isKick={selectedMemberForAction?.isKick || false}
          />
        </div>
      </CommunityAccessGuard>
    </>
  );
}
