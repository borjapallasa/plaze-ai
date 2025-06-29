
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ProductLayout } from "@/components/product/ProductLayout";
import { ProductSkeleton } from "@/components/product/ProductSkeleton";
import { ProductNotFound } from "@/components/product/ProductNotFound";
import { StickyATC } from "@/components/product/StickyATC";
import { useProductData } from "@/hooks/use-product-data";
import { useProductState } from "@/components/product/ProductState";
import { Sheet } from "@/components/ui/sheet";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { LeaveReviewDialog } from "@/components/product/LeaveReviewDialog";
import { productVariantsToVariants } from "@/utils/product-utils";

export default function ProductWithSlug() {
  const params = useParams();
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  
  // Parse the slug-id format to extract slug and id
  const combinedParam = params['slug-id'];
  const [slug, id] = combinedParam ? combinedParam.split('-').reduce((acc, part, index, arr) => {
    if (index === arr.length - 1) {
      // Last part is the ID
      acc[1] = part;
    } else {
      // All other parts are the slug
      acc[0] = acc[0] ? `${acc[0]}-${part}` : part;
    }
    return acc;
  }, ['', '']) : ['', ''];

  useEffect(() => {
    console.log("ProductWithSlug page params:", params);
    console.log("Parsed slug:", slug, "id:", id);
  }, [params, slug, id]);

  const {
    product,
    variants,
    relatedProductsWithVariants,
    reviews,
    averageRating,
    isLoading,
    error
  } = useProductData();

  const {
    selectedVariant,
    setSelectedVariant,
    showStickyATC,
    variantsRef,
    handleAddToCart,
    handleAdditionalVariantToggle,
    isLoading: isCartLoading,
    cartDrawerOpen,
    setCartDrawerOpen,
    lastAddedItem,
    lastAddedAdditionalItems,
    closeCartDrawer
  } = useProductState(variants);

  const handleLeaveReview = (variantId: string) => {
    console.log("Leave review for variant:", variantId);
    setReviewDialogOpen(true);
  };

  if (isLoading) {
    return <ProductSkeleton />;
  }

  if (error || !product) {
    return <ProductNotFound />;
  }

  // Convert variants to ensure they match the required type
  const convertedVariants = productVariantsToVariants(variants);

  return (
    <div ref={variantsRef}>
      <ProductLayout
        product={product}
        variants={convertedVariants}
        relatedProductsWithVariants={relatedProductsWithVariants}
        selectedVariant={selectedVariant}
        averageRating={averageRating}
        onVariantChange={setSelectedVariant}
        onAddToCart={() => handleAddToCart(product)}
        onAdditionalVariantToggle={handleAdditionalVariantToggle}
        reviews={reviews}
        isLoading={isCartLoading}
        onLeaveReview={handleLeaveReview}
      />
      <StickyATC
        variants={convertedVariants}
        selectedVariant={selectedVariant}
        onVariantChange={setSelectedVariant}
        visible={showStickyATC}
        onAddToCart={() => handleAddToCart(product)}
        isLoading={isCartLoading}
      />

      <Sheet open={cartDrawerOpen} onOpenChange={setCartDrawerOpen}>
        <CartDrawer 
          cartItem={lastAddedItem} 
          additionalItems={lastAddedAdditionalItems}
          onClose={closeCartDrawer} 
        />
      </Sheet>

      <LeaveReviewDialog
        open={reviewDialogOpen}
        onOpenChange={setReviewDialogOpen}
        productUuid={product.product_uuid}
        variantId={selectedVariant || ''}
      />
    </div>
  );
}
