
import React from "react";
import { MainHeader } from "@/components/MainHeader";
import { ProductGallery } from "./ProductGallery";
import { ProductHeader } from "./ProductHeader";
import { VariantPicker } from "./VariantPicker";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { usePreloadImage } from "@/hooks/use-preload-image";
import { useIsMobile } from "@/hooks/use-mobile";
import { useProductImages } from "@/hooks/use-product-images";
import { ProductInfo } from "./ProductInfo";
import { MoreFromSeller } from "./MoreFromSeller";
import { RelatedProducts } from "./RelatedProducts";
import { ProductReviews } from "./ProductReviews";
import { getVideoEmbedUrl } from "@/utils/videoEmbed";

interface ProductLayoutProps {
  product: any;
  variants: any[];
  selectedVariant?: string;
  averageRating: number;
  onVariantChange: (variantId: string) => void;
  onAddToCart: () => void;
  reviews: any[];
}

export function ProductLayout({
  product,
  variants,
  selectedVariant,
  averageRating,
  onVariantChange,
  onAddToCart,
  reviews
}: ProductLayoutProps) {
  const isMobile = useIsMobile();
  const { images, isLoading: isLoadingImages } = useProductImages(product.product_uuid);
  
  const mainImage = images[0]?.url;
  usePreloadImage(mainImage);

  const embedUrl = getVideoEmbedUrl(product.demo);

  const renderDemo = () => {
    if (!embedUrl) return null;

    return (
      <Card className="p-6">
        <div className="relative w-full aspect-video rounded-lg overflow-hidden">
          <iframe
            src={embedUrl}
            className="absolute inset-0 w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </Card>
    );
  };

  return (
    <div className="min-h-screen">
      <MainHeader />
      <main className="container mx-auto px-4 pt-24">
        <div className="lg:hidden">
          <ProductGallery 
            images={images}
            className="mb-6" 
            priority={true}
          />
          <ProductHeader 
            title={product.name}
            seller="Design Master"
            rating={averageRating}
            className="mb-6"
          />
          <VariantPicker
            variants={variants}
            selectedVariant={selectedVariant}
            onVariantChange={onVariantChange}
            onAddToCart={onAddToCart}
            className="mb-3"
          />
          <Button 
            variant="outline" 
            className="w-full flex items-center justify-center gap-2 mb-7"
            onClick={() => console.log("Contact seller clicked")}
          >
            <MessageCircle className="h-4 w-4" />
            Contact Seller
          </Button>

          <div className="space-y-8">
            <Card className="p-6">
              <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {product.description}
              </p>
            </Card>

            {renderDemo()}

            <ProductInfo 
              techStack={product.tech_stack}
              productIncludes={product.product_includes}
              difficultyLevel={product.difficulty_level}
            />

            <ProductReviews reviews={reviews} />

            <MoreFromSeller expert_uuid={product.expert_uuid} />
            
            <RelatedProducts className="mb-24" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="hidden lg:block space-y-8">
              <ProductGallery 
                images={images}
                className="mb-8" 
                priority={!isMobile}
              />
              <Card className="p-6">
                <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                  {product.description}
                </p>
              </Card>

              {renderDemo()}

              <ProductReviews reviews={reviews} />
              
              <MoreFromSeller expert_uuid={product.expert_uuid} />
              
              <RelatedProducts className="mb-24" />
            </div>
          </div>

          <div className="hidden lg:block lg:space-y-6">
            <ProductHeader 
              title={product.name}
              seller="Design Master"
              rating={averageRating}
              className="mb-6"
            />
            <VariantPicker
              variants={variants}
              selectedVariant={selectedVariant}
              onVariantChange={onVariantChange}
              onAddToCart={onAddToCart}
              className="mb-1"
            />
            <Button 
              variant="outline" 
              className="w-full flex items-center justify-center gap-2 mb-6"
              onClick={() => console.log("Contact seller clicked")}
            >
              <MessageCircle className="h-4 w-4" />
              Contact Seller
            </Button>
            <ProductInfo 
              techStack={product.tech_stack}
              productIncludes={product.product_includes}
              difficultyLevel={product.difficulty_level}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
