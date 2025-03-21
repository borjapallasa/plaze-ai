import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Globe, Users, GraduationCap, MessageSquare, Package2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";

interface ExpertCommunityProps {
  community?: any | null;
}

// Helper function to format numbers
const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k';
  }
  return num.toString();
};

// Helper function to get YouTube video thumbnail
const getYouTubeThumbnail = (videoId: string): string => {
  return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
};

// Video provider helper with thumbnail support
const getVideoProvider = (url: string | null) => {
  if (!url) return { name: 'unknown', embedUrl: null, thumbnailUrl: null };

  try {
    const normalizedUrl = url.trim();

    // If it's already an embed URL, extract video ID
    if (normalizedUrl.includes('youtube.com/embed/')) {
      const videoId = normalizedUrl.split('/embed/')[1]?.split('?')[0];
      return { 
        name: 'youtube',
        embedUrl: `https://www.youtube.com/embed/${videoId}?rel=0`,
        thumbnailUrl: getYouTubeThumbnail(videoId)
      };
    }
    
    if (normalizedUrl.includes('player.vimeo.com/video/')) {
      const videoId = normalizedUrl.split('/video/')[1]?.split('?')[0];
      return { 
        name: 'vimeo',
        embedUrl: `https://player.vimeo.com/video/${videoId}?dnt=1`,
        thumbnailUrl: null
      };
    }
    
    if (normalizedUrl.includes('loom.com/embed/')) {
      const videoId = normalizedUrl.split('/embed/')[1]?.split('?')[0];
      return { 
        name: 'loom',
        embedUrl: `https://www.loom.com/embed/${videoId}`,
        thumbnailUrl: null
      };
    }

    // Parse URL for non-embed links
    const urlObj = new URL(normalizedUrl);
    
    // YouTube
    if (urlObj.hostname.includes('youtube.com') || urlObj.hostname.includes('youtu.be')) {
      let videoId;
      if (urlObj.hostname.includes('youtu.be')) {
        videoId = urlObj.pathname.slice(1);
      } else {
        const searchParams = new URLSearchParams(urlObj.search);
        videoId = searchParams.get('v');
      }
      
      if (videoId) {
        return {
          name: 'youtube',
          embedUrl: `https://www.youtube.com/embed/${videoId}?rel=0`,
          thumbnailUrl: getYouTubeThumbnail(videoId)
        };
      }
    }
    
    // Vimeo
    if (urlObj.hostname.includes('vimeo.com')) {
      const vimeoId = urlObj.pathname.split('/').pop();
      if (vimeoId) {
        return {
          name: 'vimeo',
          embedUrl: `https://player.vimeo.com/video/${vimeoId}?dnt=1`,
          thumbnailUrl: null
        };
      }
    }
    
    // Loom
    if (urlObj.hostname.includes('loom.com')) {
      const loomPath = normalizedUrl.split('loom.com/share/')[1];
      if (loomPath) {
        return {
          name: 'loom',
          embedUrl: `https://www.loom.com/embed/${loomPath}`,
          thumbnailUrl: null
        };
      }
    }

    return { name: 'unknown', embedUrl: null, thumbnailUrl: null };
  } catch (error) {
    console.error('Error parsing video URL:', error);
    console.log('Attempted to parse URL:', url);
    return { name: 'unknown', embedUrl: null, thumbnailUrl: null };
  }
};

export const ExpertCommunity = ({ community }: ExpertCommunityProps) => {
  const [isIframeLoaded, setIsIframeLoaded] = useState(false);
  const [shouldLoadIframe, setShouldLoadIframe] = useState(false);

  if (!community) {
    return null;
  }

  const videoProvider = getVideoProvider(community.intro);
  console.log('Video provider result:', videoProvider);

  const handleThumbnailClick = () => {
    setShouldLoadIframe(true);
  };

  return (
    <div className="col-span-4 col-start-2 lg:col-span-4 lg:col-start-2">
      <h2 className="text-2xl font-bold mb-6">Community</h2>
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column - Video and Description */}
            <div className="lg:col-span-7 space-y-4">
              {/* Video thumbnail or iframe */}
              <div className="aspect-video bg-muted rounded-lg overflow-hidden relative">
                {videoProvider.embedUrl && shouldLoadIframe ? (
                  <iframe
                    src={videoProvider.embedUrl}
                    title="Community video"
                    className={`w-full h-full transition-opacity duration-300 ${isIframeLoaded ? 'opacity-100' : 'opacity-0'}`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    loading="lazy"
                    onLoad={() => setIsIframeLoaded(true)}
                    allowFullScreen
                  />
                ) : (
                  <button 
                    onClick={handleThumbnailClick}
                    className="w-full h-full relative block"
                  >
                    <img 
                      src={videoProvider.thumbnailUrl || community.thumbnail || "https://images.unsplash.com/photo-1499951360447-b19be8fe80f5"}
                      alt="Community thumbnail"
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center">
                        <div className="w-4 h-4 border-8 border-transparent border-l-primary ml-1" style={{ transform: 'rotate(-45deg)' }} />
                      </div>
                    </div>
                  </button>
                )}
              </div>

              {/* Title and badges moved here */}
              <div className="space-y-3">
                <h3 className="text-xl font-semibold">{community.name}</h3>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Public Community</span>
                  </div>
                  <Badge variant="secondary" className="text-xs px-2 py-0.5">
                    {community.type === 'paid' ? `$${community.price}/month` : 'Free Access'}
                  </Badge>
                </div>
              </div>

              {/* Description */}
              <p className="text-sm leading-relaxed text-muted-foreground">
                {community.description}
              </p>
            </div>

            {/* Right Column - Stats and CTAs */}
            <div className="lg:col-span-5 space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-2 gap-3">
                <Card className="p-3 space-y-1">
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <Users className="w-4 h-4" />
                    <span className="text-xs font-medium uppercase">Members</span>
                  </div>
                  <p className="text-2xl font-bold">{formatNumber(community.member_count || 0)}</p>
                </Card>
                <Card className="p-3 space-y-1">
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <GraduationCap className="w-4 h-4" />
                    <span className="text-xs font-medium uppercase">Classrooms</span>
                  </div>
                  <p className="text-2xl font-bold">{formatNumber(community.classroom_count || 0)}</p>
                </Card>
                <Card className="p-3 space-y-1">
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <MessageSquare className="w-4 h-4" />
                    <span className="text-xs font-medium uppercase">Posts</span>
                  </div>
                  <p className="text-2xl font-bold">{formatNumber(community.post_count || 0)}</p>
                </Card>
                <Card className="p-3 space-y-1">
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <Package2 className="w-4 h-4" />
                    <span className="text-xs font-medium uppercase">Products</span>
                  </div>
                  <p className="text-2xl font-bold">{formatNumber(community.product_count || 0)}</p>
                </Card>
              </div>

              <Separator />

              {/* CTAs */}
              <div className="space-y-2">
                <Button size="lg" className="w-full text-base font-semibold">
                  Join Community
                </Button>
                <Button variant="outline" size="lg" className="w-full text-base">
                  Learn More
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
