
import { ProductLayout } from "@/components/product/ProductLayout";
import { ProductSkeleton } from "@/components/product/ProductSkeleton";
import { ProductNotFound } from "@/components/product/ProductNotFound";
import { StickyATC } from "@/components/product/StickyATC";
import { useProductData } from "@/components/product/ProductData";
import { useProductState } from "@/components/product/ProductState";

export default function Product() {
  const { 
    product, 
    variants, 
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
    handleAdditionalVariantToggle
  } = useProductState(variants);

  if (isLoading) {
    return <ProductSkeleton />;
  }

  if (error || !product) {
    return <ProductNotFound />;
  }

  return (
    <div ref={variantsRef}>
      <ProductLayout
        product={product}
        variants={variants}
        selectedVariant={selectedVariant}
        averageRating={averageRating}
        onVariantChange={setSelectedVariant}
        onAddToCart={handleAddToCart}
        onAdditionalVariantToggle={handleAdditionalVariantToggle}
        reviews={reviews}
      />
      <StickyATC 
        variants={variants}
        selectedVariant={selectedVariant}
        onVariantChange={setSelectedVariant}
        visible={showStickyATC}
        onAddToCart={handleAddToCart}
      />
    </div>
  );
}
