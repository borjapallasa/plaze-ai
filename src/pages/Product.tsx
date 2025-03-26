
import { ProductLayout } from "@/components/product/ProductLayout";
import { ProductSkeleton } from "@/components/product/ProductSkeleton";
import { ProductNotFound } from "@/components/product/ProductNotFound";
import { StickyATC } from "@/components/product/StickyATC";
import { useProductData } from "@/hooks/use-product-data";
import { useProductState } from "@/components/product/ProductState";
import { Sheet } from "@/components/ui/sheet";
import { CartDrawer } from "@/components/cart/CartDrawer";

export default function Product() {
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
    closeCartDrawer
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
        relatedProductsWithVariants={relatedProductsWithVariants}
        selectedVariant={selectedVariant}
        averageRating={averageRating}
        onVariantChange={setSelectedVariant}
        onAddToCart={() => handleAddToCart(product)}
        onAdditionalVariantToggle={handleAdditionalVariantToggle}
        reviews={reviews}
        isLoading={isCartLoading}
      />
      <StickyATC
        variants={variants}
        selectedVariant={selectedVariant}
        onVariantChange={setSelectedVariant}
        visible={showStickyATC}
        onAddToCart={() => handleAddToCart(product)}
        isLoading={isCartLoading}
      />

      <Sheet open={cartDrawerOpen} onOpenChange={setCartDrawerOpen}>
        <CartDrawer cartItem={lastAddedItem} onClose={closeCartDrawer} />
      </Sheet>
    </div>
  );
}
