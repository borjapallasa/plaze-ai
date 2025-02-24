
export interface Review {
  id: string;
  author: string;
  rating: number;
  content: string;
  description: string;
  avatar: string;
  date: string;
  type?: 'product' | 'service' | 'job' | 'community';
}

export interface ProductReviewsProps {
  reviews: Review[];
  className?: string;
}
