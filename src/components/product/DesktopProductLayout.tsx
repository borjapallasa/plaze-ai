
import { ProductGallery } from "./ProductGallery";
import { ProductHeader } from "./ProductHeader";
import { VariantPicker } from "./VariantPicker";
import { AdditionalVariants } from "./AdditionalVariants";
import { ProductDescription } from "./ProductDescription";
import { ProductInfo } from "./ProductInfo";
import { ProductFullWidthSections } from "./ProductFullWidthSections";
import { ProductImage } from "@/hooks/use-product-images";
import { getVideoEmbedUrl } from "@/utils/videoEmbed";
import { Product, RelatedProduct } from "@/types/Product";
import { RelatedProductsList } from "./RelatedProductsList";

interface DesktopProductLayoutProps {
  product: Product;
  images: ProductImage[];
  variants: any[];
  relatedProductsWithVariants: any[];
  selectedVariant?: string;
  averageRating: number;
  onVariantChange: (variantId: string) => void;
  onAddToCart: () => void;
  onAdditionalVariantToggle: (variantId: string, selected: boolean) => void;
  handleContactSeller: () => void;
  isMobile: boolean;
  reviews: any[];
  isLoading?: boolean;
}

export function DesktopProductLayout({
  product,
  images,
  variants = [],
  relatedProductsWithVariants = [],
  selectedVariant,
  averageRating,
  onVariantChange,
  onAddToCart,
  onAdditionalVariantToggle,
  handleContactSeller,
  isMobile,
  reviews,
  isLoading = false
}: DesktopProductLayoutProps) {
  const embedUrl = getVideoEmbedUrl(product.demo);

  return (
    <>
      <div className="hidden lg:grid grid-cols-1 lg:grid-cols-3 gap-7">
        <div className="lg:col-span-2">
          <div className="space-y-6">
            <ProductGallery
              images={images}
              className="mb-5"
              priority={!isMobile}
            />
            <ProductDescription description={product.description} />
          </div>
        </div>

        <div className="lg:space-y-4">
          <ProductHeader
            title={product.name}
            seller="Design Master"
            rating={averageRating}
            onContactSeller={handleContactSeller}
            className="mb-2"
          />
          {Array.isArray(variants) && variants.length > 0 && (
            <VariantPicker
              variants={variants}
              selectedVariant={selectedVariant}
              onVariantChange={onVariantChange}
              onAddToCart={onAddToCart}
              className="mb-3"
              isLoading={isLoading}
            />)
          }
          {Array.isArray(variants) && variants.length > 0 && Array.isArray(relatedProductsWithVariants) && relatedProductsWithVariants.length > 0 && (
            <AdditionalVariants
              relatedProductsWithVariants={relatedProductsWithVariants}
              onAdditionalSelect={onAdditionalVariantToggle}
              className="mb-4"
            />)
          }

          <ProductInfo
            techStack={product.tech_stack}
            productIncludes={product.product_includes}
            difficultyLevel={product.difficulty_level}
          />
        </div>
      </div>

      <div className="hidden lg:block mt-8 space-y-6">
        <ProductFullWidthSections
          embedUrl={embedUrl}
          reviews={reviews}
          expert_uuid={product.expert_uuid}
          productUuid={product.product_uuid}
        />
      </div>
    </>
  );
}
