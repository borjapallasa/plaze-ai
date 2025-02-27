
/**
 * Converts a regular YouTube URL to an embed URL
 * @param url YouTube URL (e.g., https://www.youtube.com/watch?v=VIDEO_ID or https://youtu.be/VIDEO_ID)
 * @returns Embed URL for the YouTube video
 */
export const getVideoEmbedUrl = (url: string): string | null => {
  if (!url) return null;
  
  // Extract video ID from YouTube URL
  let videoId = '';
  
  // Handle youtube.com/watch?v=
  const watchPattern = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\?]*)/;
  const watchMatch = url.match(watchPattern);
  
  if (watchMatch && watchMatch[1]) {
    videoId = watchMatch[1];
  } else if (url.includes('youtube.com/embed/')) {
    // Already an embed URL
    return url;
  } else {
    // Try to use the URL as is if it might be a valid video ID
    videoId = url.trim();
  }
  
  // Return null if no valid video ID
  if (!videoId) return null;
  
  // Create and return embed URL
  return `https://www.youtube.com/embed/${videoId}`;
};
