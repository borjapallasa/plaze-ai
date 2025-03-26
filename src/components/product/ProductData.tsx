
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface ProductData {
  product_uuid: string;
  name: string;
  description: string;
  tech_stack: string;
  product_includes: string;
  difficulty_level: string;
  demo: string | null;
  expert_uuid: string;
  slug: string;
  [key: string]: any;
}

export interface ProductVariant {
  id: string;
  name: string;
  price: number | string;
  comparePrice: number | string;
  label?: string;
  highlight?: boolean;
  features?: string[];
}

export interface ProductReview {
  id: string;
  author: string;
  rating: number;
  content: string;
  description: string;
  avatar: string;
  date: string;
  itemQuality: number;
  shipping: number;
  customerService: number;
  type: string;
}

const getPlaceholderImage = () => "https://images.unsplash.com/photo-1649972904349-6e44c42644a7";

export function useProductData() {
  const { id } = useParams();

  // Fetch product data
  const { data: product, isLoading: isLoadingProduct, error: productError } = useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      console.log("Fetching product with ID:", id);

      if (!id) {
        console.error("No product ID provided");
        return null;
      }

      // Try to fetch by product_uuid first
      let { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('product_uuid', id)
        .maybeSingle();

      // If no data found and no error, try with slug
      if (!data && !error) {
        console.log("No product found by UUID, trying with slug...");
        ({ data, error } = await supabase
          .from('products')
          .select('*')
          .eq('slug', id)
          .maybeSingle());
      }

      if (error) {
        console.error("Error fetching product:", error);
        throw error;
      }

      if (!data) {
        console.log("No product found");
        return null;
      }

      console.log("Product data found:", data);

      return {
        ...data,
        demo: data.demo || null
      };
    },
    enabled: !!id
  });

  // Fetch variants
  const { data: variants = [], isLoading: isLoadingVariants } = useQuery({
    queryKey: ['variants', product?.product_uuid],
    queryFn: async () => {
      console.log("Fetching variants for product:", product?.product_uuid);

      if (!product?.product_uuid) {
        return [];
      }

      const { data, error } = await supabase
        .from('variants')
        .select('*')
        .eq('product_uuid', product.product_uuid)
        .order('price', { ascending: true });

      if (error) {
        console.error("Error fetching variants:", error);
        throw error;
      }

      console.log("Variants found:", data.length);

      return data.map((variant, index) => ({
        id: variant.variant_uuid,
        name: variant.name || "Lorem Ipsum Package",
        price: variant.price || 99.99,
        comparePrice: variant.compare_price || 149.99,
        label: "Package",
        highlight: variant.highlighted || index === 1,
        features: Array.isArray(variant.tags)
          ? variant.tags.map(tag => String(tag))
          : ["Core Features", "Basic Support"]
      }));
    },
    enabled: !!product?.product_uuid
  });

  // Fetch related products with variants
  const { data: relatedProductsWithVariants } = useQuery({
    queryKey: ["relatedProducts", product?.product_uuid],
    queryFn: async () => {
      const { data: relatedProductsWithVariants, error } = await supabase
        .rpc('get_related_products_with_variants', { product_uuid_input: product?.product_uuid });

      if (error) {
        console.error("Error fetching related products:", error);
        throw error;
      }
      console.log("Found related products:", relatedProductsWithVariants.length);

      return relatedProductsWithVariants
    },
    enabled: !!product?.product_uuid
  });

  // Fetch reviews
  const { data: reviews = [] } = useQuery({
    queryKey: ['reviews', product?.product_uuid],
    queryFn: async () => {
      console.log("Fetching reviews for product:", product?.product_uuid);

      if (!product?.product_uuid) {
        return [];
      }

      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('product_uuid', product.product_uuid)
        .eq('status', 'published')
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Error fetching reviews:", error);
        throw error;
      }

      console.log("Reviews found:", data.length);

      return data.map(review => ({
        id: review.review_uuid,
        author: review.buyer_name || 'Anonymous',
        rating: review.rating || 5,
        content: review.title || 'No title provided',
        description: review.comments || 'No comments provided',
        avatar: getPlaceholderImage(),
        date: new Date(review.created_at).toLocaleDateString(),
        itemQuality: review.rating || 5,
        shipping: review.rating || 5,
        customerService: review.rating || 5,
        type: review.transaction_type?.toLowerCase() || 'product'
      }));
    },
    enabled: !!product?.product_uuid
  });

  // Calculate average rating
  const averageRating = reviews.length
    ? Number((reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length).toFixed(1))
    : 0;

  return {
    product,
    variants,
    relatedProductsWithVariants,
    reviews,
    averageRating,
    isLoading: isLoadingProduct || isLoadingVariants,
    error: productError
  };
}
