
export interface Review {
  id: string;
  author: string;
  rating: number;
  content: string;
  description: string;
  avatar: string;
  date: string;
  reviewType?: 'product' | 'service' | 'job' | 'community' | 'purchase';
}

export interface ProductReviewsProps {
  reviews: Review[];
  className?: string;
}
