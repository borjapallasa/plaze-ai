
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { ProductLayout } from "@/components/product/ProductLayout";
import { ProductSkeleton } from "@/components/product/ProductSkeleton";
import { ProductNotFound } from "@/components/product/ProductNotFound";
import { StickyATC } from "@/components/product/StickyATC";
import { useProductData } from "@/hooks/use-product-data";
import { useProductState } from "@/components/product/ProductState";
import { Sheet } from "@/components/ui/sheet";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { productVariantsToVariants } from "@/utils/product-utils";
import { Variant } from "@/components/product/types/variants";

export default function Product() {
  const params = useParams();
  
  useEffect(() => {
    console.log("Product page params:", params);
  }, [params]);

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
    // TODO: Open review dialog or navigate to review page
    // For now, just log the action
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
    </div>
  );
}
