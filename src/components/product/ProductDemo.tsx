
import { Card } from "@/components/ui/card";

interface ProductDemoProps {
  demo?: string;
}

type VideoProvider = {
  name: 'youtube' | 'vimeo' | 'loom' | 'unknown';
  embedUrl: string | null;
};

export function ProductDemo({ demo }: ProductDemoProps) {
  const getVideoProvider = (url: string): VideoProvider => {
    try {
      const urlObj = new URL(url);
      
      // YouTube
      if (urlObj.hostname.includes('youtube.com') || urlObj.hostname.includes('youtu.be')) {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        
        if (match && match[2].length === 11) {
          return {
            name: 'youtube',
            embedUrl: `https://www.youtube.com/embed/${match[2]}`
          };
        }
      }
      
      // Vimeo
      if (urlObj.hostname.includes('vimeo.com')) {
        const vimeoId = urlObj.pathname.split('/').pop();
        if (vimeoId) {
          return {
            name: 'vimeo',
            embedUrl: `https://player.vimeo.com/video/${vimeoId}`
          };
        }
      }
      
      // Loom
      if (urlObj.hostname.includes('loom.com')) {
        const loomPath = url.split('loom.com/share/')[1];
        if (loomPath) {
          return {
            name: 'loom',
            embedUrl: `https://www.loom.com/embed/${loomPath}`
          };
        }
      }

      // If it's already an embed URL, return as is
      if (url.includes('youtube.com/embed/') || 
          url.includes('player.vimeo.com/video/') || 
          url.includes('loom.com/embed/')) {
        return { 
          name: url.includes('youtube.com') ? 'youtube' : 
               url.includes('vimeo.com') ? 'vimeo' : 'loom',
          embedUrl: url 
        };
      }

      return { name: 'unknown', embedUrl: null };
    } catch (error) {
      console.error('Error parsing video URL:', error);
      return { name: 'unknown', embedUrl: null };
    }
  };

  const renderVideoEmbed = (url: string) => {
    const provider = getVideoProvider(url);
    
    if (provider.embedUrl) {
      return (
        <div className="aspect-video">
          <iframe
            src={provider.embedUrl}
            title="Video Demo"
            className="w-full h-full rounded-lg"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      );
    }

    return <div dangerouslySetInnerHTML={{ __html: url }} />;
  };

  return (
    <Card className="p-6 mb-8 w-full">
      <h2 className="text-2xl font-semibold mb-4">Demo</h2>
      {demo ? (
        renderVideoEmbed(demo)
      ) : (
        <div className="aspect-video bg-accent rounded-lg" />
      )}
    </Card>
  );
}
