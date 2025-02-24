
import { useEffect } from 'react';

export function usePreloadImage(imageUrl: string) {
  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = `${imageUrl}?w=800&q=75`; // Match the mobile image size
    
    // Add fetchpriority attribute
    link.setAttribute('fetchpriority', 'high');
    
    // Add media attribute for mobile-first approach
    link.media = '(max-width: 768px)';
    
    document.head.appendChild(link);
    
    return () => {
      document.head.removeChild(link);
    };
  }, [imageUrl]);
}
