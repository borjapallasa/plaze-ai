import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link as LinkIcon, Edit } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { MainHeader } from "@/components/MainHeader";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { getVideoEmbedUrl } from "@/utils/videoEmbed";
import { useCommunityImages } from "@/hooks/use-community-images";
import { ProductGallery } from "@/components/product/ProductGallery";
import type { ProductImage } from "@/types/product-images";
import { formatNumber } from "@/lib/utils";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";
import { CommunitySubscriptionCheckout } from "@/components/checkout/CommunitySubscriptionCheckout";

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

export default function CommunityAboutPage() {
  const { id: communityId } = useParams();
  const { images } = useCommunityImages(communityId);
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [showSubscriptionCheckout, setShowSubscriptionCheckout] = useState(false);

  console.log('Community ID from params:', communityId);

  // Fetch community data
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
      console.log('Community type:', data?.type);
      console.log('Community price:', data?.price);
      return data;
    },
    enabled: !!communityId
  });

  // Fetch user's community subscription status
  const { data: subscription } = useQuery({
    queryKey: ['community-subscription', user?.id, communityId],
    queryFn: async () => {
      if (!user?.id || !communityId) return null;
      
      const { data, error } = await supabase
        .from('community_subscriptions')
        .select('status')
        .eq('user_uuid', user.id)
        .eq('community_uuid', communityId)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!user?.id && !!communityId
  });

  // Fetch community pricing for paid communities
  const { data: communityPricing } = useQuery({
    queryKey: ['community-pricing', communityId],
    queryFn: async () => {
      if (!communityId || community?.type !== 'paid') return null;
      
      // First try to get from community_prices table
      const { data, error } = await supabase
        .from('community_prices')
        .select('*')
        .eq('community_uuid', communityId)
        .eq('active', true)
        .order('amount', { ascending: true })
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error('Error fetching community pricing:', error);
      }
      
      // If no pricing found in community_prices, create fallback from community data
      if (!data && community?.price) {
        console.log('No pricing found in community_prices, using community.price as fallback');
        return {
          community_price_uuid: `fallback_${communityId}`,
          community_uuid: communityId,
          amount: community.price,
          currency: 'usd',
          billing_period: 'monthly',
          active: true,
          stripe_price_id: null, // Will need to be created in Stripe
        };
      }
      
      return data;
    },
    enabled: !!communityId && community?.type === 'paid'
  });

  // Join community mutation
  const joinCommunityMutation = useMutation({
    mutationFn: async () => {
      if (!user?.id || !communityId || !community) {
        throw new Error('User not authenticated or community data missing');
      }

      // Determine status based on community type
      const status = community.type === 'private' ? 'pending' : 'active';
      
      const { error } = await supabase
        .from('community_subscriptions')
        .insert({
          user_uuid: user.id,
          community_uuid: communityId,
          status: status,
          type: 'free',
          amount: 0,
          total_amount: 0
        });

      if (error) throw error;
      
      return { status, communityType: community.type };
    },
    onSuccess: ({ status, communityType }) => {
      if (status === 'pending') {
        toast.success("Join request sent! You'll be notified when approved.");
      } else {
        toast.success("Successfully joined the community!");
        // Redirect to community main page for free communities
        if (communityType === 'free') {
          navigate(`/community/${communityId}`);
        }
      }
      queryClient.invalidateQueries({ queryKey: ['community-subscription', user?.id, communityId] });
    },
    onError: (error) => {
      console.error('Failed to join community:', error);
      toast.error("Failed to join community. Please try again.");
    },
  });

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

  // Check if current user is the community owner
  const isOwner = currentUserExpertData && community && (
    currentUserExpertData.expert_uuid === community.expert_uuid ||
    currentUserExpertData.user_uuid === community.expert_uuid ||
    user?.id === community.expert_uuid
  );

  const videoEmbedUrl = getVideoEmbedUrl(community?.intro);
  const links = parseLinks(community?.links);

  // Determine user's membership status
  const getMembershipStatus = () => {
    if (!user) return 'not_authenticated';
    if (!subscription) return 'not_member';
    return subscription.status; // 'active', 'pending', etc.
  };

  const membershipStatus = getMembershipStatus();

  const getJoinButtonText = () => {
    if (joinCommunityMutation.isPending) return "Processing...";
    
    switch (community?.type) {
      case 'private':
        return "Request to Join";
      case 'paid':
        return `Join for $${community.price} / monthly`;
      default:
        return "Join Community";
    }
  };

  const getStatusText = () => {
    switch (membershipStatus) {
      case 'pending':
        return "Request Pending";
      case 'active':
        return "Member";
      default:
        return null;
    }
  };

  const handleOpenCommunity = () => {
    navigate(`/community/${communityId}`);
  };

  const handleJoinCommunity = () => {
    console.log('handleJoinCommunity called');
    console.log('Community type:', community?.type);
    console.log('Community pricing:', communityPricing);
    
    if (community?.type === 'paid') {
      if (!communityPricing) {
        console.error('No pricing found for paid community');
        toast.error('Community pricing not available. Please try again later.');
        return;
      }
      
      // Show subscription checkout for paid communities
      console.log('Showing subscription checkout');
      setShowSubscriptionCheckout(true);
    } else {
      // Use existing mutation for free/private communities
      console.log('Using free/private community join');
      joinCommunityMutation.mutate();
    }
  };

  const handleSubscriptionSuccess = (data: {
    subscriptionId: string;
    communityId: string;
    customerEmail: string;
  }) => {
    console.log('Subscription successful:', data);
    toast.success(`Successfully subscribed to ${community?.name}!`);
    
    // Hide checkout and invalidate queries to update UI
    setShowSubscriptionCheckout(false);
    queryClient.invalidateQueries({ queryKey: ['community-subscription', user?.id, communityId] });
    
    // Redirect to community page
    navigate(`/community/${communityId}`);
  };

  const handleSubscriptionCancel = () => {
    setShowSubscriptionCheckout(false);
    toast.info("Payment cancelled. You can try again anytime.", { duration: 5000 });
  };

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

  return (
    <>
      <MainHeader />
      <div className="container mx-auto px-4 py-8 max-w-[1400px] space-y-8 mt-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8">
            <Card className="p-6 space-y-6">
              <div className="flex items-center justify-between gap-4">
                <h1 className="text-2xl font-bold">{community?.name}</h1>
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
              {/* Show payment form inline when showSubscriptionCheckout is true */}
              {showSubscriptionCheckout && community && communityPricing ? (
                <div className="p-6 space-y-6">
                  <div className="text-center">
                    <h2 className="text-lg font-semibold text-gray-900 mb-1">
                      Complete Payment
                    </h2>
                    <p className="text-sm text-gray-500">
                      Secure payment to join {community.name}
                    </p>
                  </div>
                  
                  <CommunitySubscriptionCheckout
                    community={{
                      community_uuid: community.community_uuid,
                      name: community.name,
                      description: community.description || undefined,
                      thumbnail: community.thumbnail || undefined,
                    }}
                    pricing={{
                      community_price_uuid: communityPricing.community_price_uuid,
                      amount: communityPricing.amount || 0,
                      currency: communityPricing.currency || 'usd',
                      billing_period: communityPricing.billing_period || 'monthly',
                      stripe_price_id: communityPricing.stripe_price_id || undefined,
                    }}
                    onSuccess={handleSubscriptionSuccess}
                    onCancel={handleSubscriptionCancel}
                  />
                </div>
              ) : (
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

                {/* Guest User - Link to Signup Page */}
                {!user && (
                  <>
                    <Separator />
                    <Link to={`/sign-up/community/${communityId}`}>
                      <Button className="w-full h-10">
                        {community?.type === 'paid' 
                          ? `Join for $${community.price} / monthly` 
                          : community?.type === 'private'
                          ? "Request to Join"
                          : "Join Community"
                        }
                      </Button>
                    </Link>
                  </>
                )}

                {/* Join Community Button or Open Community Button */}
                {user && membershipStatus === 'not_member' && (
                  <>
                    <Separator />
                    <Button 
                      className="w-full h-10"
                      onClick={handleJoinCommunity}
                      disabled={joinCommunityMutation.isPending}
                    >
                      {getJoinButtonText()}
                    </Button>
                  </>
                )}

                {/* Active Member - Open Community Button */}
                {user && membershipStatus === 'active' && (
                  <>
                    <Separator />
                    <Button 
                      className="w-full h-10"
                      onClick={handleOpenCommunity}
                    >
                      Open Community
                    </Button>
                  </>
                )}

                {/* Status Display - Pending */}
                {user && membershipStatus === 'pending' && (
                  <>
                    <Separator />
                    <div className="w-full h-10 flex items-center justify-center rounded-lg font-medium text-sm bg-gray-100 text-gray-600 border border-gray-300 cursor-not-allowed">
                      Request Pending
                    </div>
                  </>
                )}
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>

    </>
  );
}
