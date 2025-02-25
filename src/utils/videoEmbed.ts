
// Helper function to get YouTube video ID from various URL formats
const getYouTubeId = (url: string): string | null => {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /^([^&\n?#]+)$/  // Direct video ID
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
};

// Helper function to get Vimeo video ID
const getVimeoId = (url: string): string | null => {
  const patterns = [
    /vimeo\.com\/([0-9]+)/,
    /player\.vimeo\.com\/video\/([0-9]+)/,
    /^([0-9]+)$/  // Direct video ID
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
};

// Helper function to get Loom video ID
const getLoomId = (url: string): string | null => {
  const patterns = [
    /loom\.com\/share\/([a-zA-Z0-9]+)/,
    /loom\.com\/embed\/([a-zA-Z0-9]+)/,
    /^([a-zA-Z0-9]+)$/  // Direct video ID
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
};

export const getVideoEmbedUrl = (url: string | null): string | null => {
  if (!url) return null;

  try {
    // Try to parse the URL first
    const normalizedUrl = url.trim();

    // Check for YouTube
    const youtubeId = getYouTubeId(normalizedUrl);
    if (youtubeId) {
      return `https://www.youtube.com/embed/${youtubeId}`;
    }

    // Check for Vimeo
    const vimeoId = getVimeoId(normalizedUrl);
    if (vimeoId) {
      return `https://player.vimeo.com/video/${vimeoId}`;
    }

    // Check for Loom
    const loomId = getLoomId(normalizedUrl);
    if (loomId) {
      return `https://www.loom.com/embed/${loomId}`;
    }

    // If no match is found, return the original URL
    return url;
  } catch (error) {
    console.error('Error parsing video URL:', error);
    return null;
  }
};
