
import { useParams } from "react-router-dom";
import { useProductVariants } from "./use-product-variants";
import { useRelatedProducts } from "./use-related-products";
import { useProductReviews, calculateAverageRating } from "./use-product-reviews";
import { useProduct } from "./use-product";

export function useProductData() {
  const params = useParams();
  
  // Pass the URL parameters to the useProduct hook
  const { data: product, isLoading: isLoadingProduct, error: productError } = useProduct({
    productId: params.id,
    productSlug: params.slug
  });

  // Log the parameters and product data for debugging
  console.log("useProductData params:", params);
  console.log("useProductData product:", product);

  const { data: variants = [], isLoading: isLoadingVariants } = useProductVariants(
    product?.product_uuid
  );

  const { data: relatedProductsWithVariants = [] } = useRelatedProducts(
    product?.product_uuid
  );

  const { data: reviews = [] } = useProductReviews(
    product?.product_uuid
  );

  // Calculate average rating
  const averageRating = calculateAverageRating(reviews);

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

// Re-export from other hooks for convenience
export { useProduct } from "./use-product";
export { useProductVariants } from "./use-product-variants";
export { useRelatedProducts } from "./use-related-products";
export { useProductReviews, calculateAverageRating } from "./use-product-reviews";
