
import { useQuery } from "@tanstack/react-query";

// Mock review data for testing
const mockReviews = [
  {
    id: "1",
    author: "John Doe",
    rating: 5,
    content: "Excellent product!",
    description: "This product exceeded my expectations. Highly recommended!",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e",
    date: "2024-01-15",
    itemQuality: 5,
    shipping: 5,
    customerService: 5,
    reviewType: "purchase"
  },
  {
    id: "2",
    author: "Jane Smith",
    rating: 4,
    content: "Great value for money",
    description: "Good quality product with reasonable pricing. Would buy again.",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80",
    date: "2024-01-10",
    itemQuality: 4,
    shipping: 4,
    customerService: 4,
    reviewType: "purchase"
  }
];

export function useProductReviews(productUuid?: string) {
  return useQuery({
    queryKey: ['productReviews', productUuid],
    queryFn: async () => {
      // For now, return mock data to ensure reviews are visible
      // In a real implementation, this would fetch from Supabase
      console.log('Fetching reviews for product:', productUuid);
      return mockReviews;
    },
    enabled: !!productUuid,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function calculateAverageRating(reviews: any[]) {
  if (!reviews || reviews.length === 0) return 0;
  
  const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
  return Math.round((sum / reviews.length) * 10) / 10;
}
