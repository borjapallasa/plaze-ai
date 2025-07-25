
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { ProductLayout } from "@/components/product/ProductLayout";
import { useProduct } from "@/hooks/use-product";
import { useProductVariants } from "@/hooks/use-product-variants";
import { useProductReviews } from "@/hooks/use-product-reviews";
import { useRelatedProducts } from "@/hooks/use-related-products";
import { useCart } from "@/hooks/use-cart";
import { ProductSkeleton } from "@/components/product/ProductSkeleton";
import { ProductNotFound } from "@/components/product/ProductNotFound";
import { LeaveReviewDialog } from "@/components/product/LeaveReviewDialog";
import { Variant } from "@/components/product/types/variants";
import { toast } from "sonner";

export default function Product() {
  const { id } = useParams();
  const { data: product, isLoading, error } = useProduct(id);
  const { data: variants = [] } = useProductVariants(id);
  const { data: reviews = [], refetch: refetchReviews } = useProductReviews(id);
  const { data: relatedProductsWithVariants = [] } = useRelatedProducts(id);
  const { addToCart } = useCart();

  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);

  useEffect(() => {
    if (variants.length > 0 && !selectedVariant) {
      setSelectedVariant(variants[0]);
    }
  }, [variants, selectedVariant]);

  const handleVariantChange = (variant: Variant) => {
    setSelectedVariant(variant);
  };

  const handleAddToCart = (variant: Variant) => {
    if (!variant) {
      toast.error("Please select a variant");
      return;
    }

    addToCart({
      variantId: variant.id,
      productId: product?.product_uuid || "",
      productName: product?.name || "",
      variantName: variant.name,
      price: variant.price,
      image: variant.filesLink || product?.thumbnail || "",
    });

    toast.success("Added to cart!");
  };

  const handleAdditionalVariantToggle = (variantId: string, selected: boolean) => {
    console.log(`Toggle variant ${variantId}: ${selected}`);
  };

  const handleLeaveReview = (variantId: string) => {
    console.log('Opening review dialog for variant:', variantId);
    setIsReviewDialogOpen(true);
  };

  const handleReviewDialogClose = () => {
    setIsReviewDialogOpen(false);
    // Refetch reviews after closing dialog to show new review
    refetchReviews();
  };

  const averageRating = reviews.length > 0 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
    : 0;

  if (isLoading) {
    return <ProductSkeleton />;
  }

  if (error || !product) {
    return <ProductNotFound />;
  }

  return (
    <>
      <ProductLayout
        product={product}
        variants={variants}
        selectedVariant={selectedVariant}
        relatedProductsWithVariants={relatedProductsWithVariants}
        averageRating={averageRating}
        onVariantChange={handleVariantChange}
        onAddToCart={handleAddToCart}
        onAdditionalVariantToggle={handleAdditionalVariantToggle}
        reviews={reviews}
        isLoading={isLoading}
        onLeaveReview={handleLeaveReview}
      />
      
      {selectedVariant && (
        <LeaveReviewDialog
          open={isReviewDialogOpen}
          onOpenChange={setIsReviewDialogOpen}
          productUuid={product.product_uuid}
          variantId={selectedVariant.id}
          expertUuid={product.expert_uuid}
        />
      )}
    </>
  );
}
