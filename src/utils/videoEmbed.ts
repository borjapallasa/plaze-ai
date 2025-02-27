
/**
 * Converts a regular YouTube URL to an embed URL
 * @param url YouTube URL (e.g., https://www.youtube.com/watch?v=VIDEO_ID or https://youtu.be/VIDEO_ID)
 * @returns Embed URL for the YouTube video
 */
export const getVideoEmbedUrl = (url: string): string | null => {
  if (!url) return null;
  
  try {
    // Try to create a URL object to validate the URL
    new URL(url);
  } catch (e) {
    // If URL is invalid, check if it might be just a video ID
    if (/^[a-zA-Z0-9_-]{11}$/.test(url)) {
      return `https://www.youtube.com/embed/${url}`;
    }
    return null;
  }
  
  // Extract video ID from YouTube URL
  let videoId = '';
  
  // Handle youtube.com/watch?v=
  if (url.includes('youtube.com/watch')) {
    const urlObj = new URL(url);
    videoId = urlObj.searchParams.get('v') || '';
  } 
  // Handle youtu.be/
  else if (url.includes('youtu.be/')) {
    const parts = url.split('youtu.be/');
    if (parts.length > 1) {
      videoId = parts[1].split('?')[0].split('&')[0];
    }
  } 
  // Handle youtube.com/embed/
  else if (url.includes('youtube.com/embed/')) {
    return url; // Already an embed URL
  }
  
  // Return null if no valid video ID
  if (!videoId) return null;
  
  // Create and return embed URL
  return `https://www.youtube.com/embed/${videoId}`;
};
