
import { Card } from "@/components/ui/card";

interface ProductDemoProps {
  demo?: string;
}

export function ProductDemo({ demo }: ProductDemoProps) {
  const getYouTubeEmbedUrl = (url: string) => {
    try {
      // Handle different YouTube URL formats
      const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
      const match = url?.match(regExp);
      
      if (match && match[2].length === 11) {
        return `https://www.youtube.com/embed/${match[2]}`;
      }
      
      // If it's already an embed URL, return as is
      if (url.includes('youtube.com/embed/')) {
        return url;
      }
      
      return null;
    } catch (error) {
      console.error('Error parsing YouTube URL:', error);
      return null;
    }
  };

  const youtubeUrl = demo ? getYouTubeEmbedUrl(demo) : null;

  return (
    <>
      <h2 className="text-xl font-semibold mb-4">Demo</h2>
      <Card className="p-6 mb-8">
        {demo ? (
          youtubeUrl ? (
            <div className="aspect-video">
              <iframe
                src={youtubeUrl}
                title="Product Demo"
                className="w-full h-full rounded-lg"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          ) : (
            <div dangerouslySetInnerHTML={{ __html: demo }} />
          )
        ) : (
          <div className="aspect-video bg-accent rounded-lg" />
        )}
      </Card>
    </>
  );
}
