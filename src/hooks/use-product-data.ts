
import { useParams } from "react-router-dom";
import { useProductVariants } from "./use-product-variants";
import { useRelatedProducts } from "./use-related-products";
import { useProductReviews, calculateAverageRating } from "./use-product-reviews";
import { useProduct } from "./use-product";

export function useProductData() {
  const params = useParams();
  
  // Parse the slug-id format to extract slug and id
  const combinedParam = params['slug-id'];
  let effectiveProductId = params.id;
  let effectiveProductSlug = params.slug;

  if (combinedParam) {
    const parts = combinedParam.split('-');
    if (parts.length >= 2) {
      // Last part is the ID, everything before is the slug
      effectiveProductId = parts[parts.length - 1];
      effectiveProductSlug = parts.slice(0, -1).join('-');
    }
  }

  console.log("useProductData parsed params:", {
    originalParams: params,
    combinedParam,
    effectiveProductId,
    effectiveProductSlug
  });

  // Pass the parsed parameters to the useProduct hook
  const { product, isLoading: isLoadingProduct, error: productError } = useProduct({
    productId: effectiveProductId,
    productSlug: effectiveProductSlug
  });

  // Log the parameters and product data for debugging
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
