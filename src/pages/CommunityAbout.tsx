import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link as LinkIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { MainHeader } from "@/components/MainHeader";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { getVideoEmbedUrl } from "@/utils/videoEmbed";
import { useCommunityImages } from "@/hooks/use-community-images";
import { ProductGallery } from "@/components/product/ProductGallery";
import type { ProductImage } from "@/types/product-images";
import { formatNumber } from "@/lib/utils";

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

  console.log('Community ID from params:', communityId);

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
              <div>
                <ProductGallery 
                  images={galleryImages}
                  priority
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between gap-4">
                  <h1 className="text-2xl font-bold">{community?.name}</h1>
                </div>
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
      </div>
    </>
  );
}
