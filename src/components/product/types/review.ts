
export interface Review {
  id: string;  // Changed from number to string to match UUID from database
  author: string;
  rating: number;
  content: string;
  description: string;
  avatar: string;
  date: string;
  itemQuality: number;
  shipping: number;
  customerService: number;
}

export interface ProductReviewsProps {
  reviews: Review[];
  className?: string;
}
