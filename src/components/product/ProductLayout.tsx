
import React from "react";
import { MainHeader } from "@/components/MainHeader";
import { ProductGallery } from "./ProductGallery";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { usePreloadImage } from "@/hooks/use-preload-image";
import { useIsMobile } from "@/hooks/use-mobile";
import { useProductImages } from "@/hooks/use-product-images";
import { ProductInfo } from "./ProductInfo";
import { MoreFromSeller } from "./MoreFromSeller";
import { ProductReviews } from "./ProductReviews";
import { VariantPicker } from "./VariantPicker";
import { AdditionalVariants } from "./AdditionalVariants";
import { getVideoEmbedUrl } from "@/utils/videoEmbed";

interface ProductLayoutProps {
  product: any;
  variants: any[];
  selectedVariant?: string;
  averageRating: number;
  onVariantChange: (variantId: string) => void;
  onAddToCart: () => void;
  onAdditionalVariantToggle?: (variantId: string, selected: boolean) => void;
  reviews: any[];
}

interface ProductHeaderProps {
  title: string;
  seller: string;
  rating: number;
  className?: string;
  onContactSeller: () => void;
}

function ProductHeader({ title, seller, rating, onContactSeller, className = "" }: ProductHeaderProps) {
  return (
    <div className={className}>
      <h1 className="text-2xl font-semibold mb-2">{title}</h1>
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-3">
        <div className="flex items-center gap-2">
          <span 
            className="text-muted-foreground hover:underline hover:text-muted-foreground/80 cursor-pointer transition-colors"
          >
            {seller}
          </span>
          <button 
            onClick={onContactSeller}
            className="inline-flex items-center justify-center p-1 rounded-full hover:bg-muted/30 transition-colors"
            aria-label="Message seller"
            title="Message seller"
          >
            <MessageCircle className="h-3.5 w-3.5 text-muted-foreground" />
          </button>
          <span className="text-muted-foreground">•</span>
          <span className="text-muted-foreground">{rating.toFixed(1)} Rating</span>
        </div>
      </div>
    </div>
  );
}

export function ProductLayout({
  product,
  variants,
  selectedVariant,
  averageRating,
  onVariantChange,
  onAddToCart,
  onAdditionalVariantToggle,
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

  const handleContactSeller = () => {
    console.log("Contact seller clicked");
  };

  const handleAdditionalVariantSelect = (variantId: string, selected: boolean) => {
    console.log(`Additional variant ${variantId} ${selected ? 'selected' : 'unselected'}`);
    if (onAdditionalVariantToggle) {
      onAdditionalVariantToggle(variantId, selected);
    }
  };

  const fullWidthSections = (
    <>
      {renderDemo()}
      <ProductReviews reviews={reviews} />
      <MoreFromSeller expert_uuid={product.expert_uuid} />
    </>
  );

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
            onContactSeller={handleContactSeller}
            className="mb-4"
          />
          <VariantPicker
            variants={variants}
            selectedVariant={selectedVariant}
            onVariantChange={onVariantChange}
            onAddToCart={onAddToCart}
            className="mb-5"
          />
          
          <AdditionalVariants
            variants={variants}
            selectedMainVariant={selectedVariant}
            onAdditionalSelect={handleAdditionalVariantSelect}
            className="mb-7"
          />

          <div className="space-y-8">
            <Card className="p-6">
              <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {product.description}
              </p>
            </Card>

            <ProductInfo 
              techStack={product.tech_stack}
              productIncludes={product.product_includes}
              difficultyLevel={product.difficulty_level}
            />

            {fullWidthSections}
          </div>
        </div>

        <div className="hidden lg:grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="space-y-8">
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
            </div>
          </div>

          <div className="lg:space-y-6">
            <ProductHeader 
              title={product.name}
              seller="Design Master"
              rating={averageRating}
              onContactSeller={handleContactSeller}
              className="mb-4"
            />
            <VariantPicker
              variants={variants}
              selectedVariant={selectedVariant}
              onVariantChange={onVariantChange}
              onAddToCart={onAddToCart}
              className="mb-5"
            />
            
            <AdditionalVariants
              variants={variants}
              selectedMainVariant={selectedVariant}
              onAdditionalSelect={handleAdditionalVariantSelect}
              className="mb-6"
            />
            
            <ProductInfo 
              techStack={product.tech_stack}
              productIncludes={product.product_includes}
              difficultyLevel={product.difficulty_level}
            />
          </div>
        </div>

        <div className="hidden lg:block mt-12 space-y-8">
          {fullWidthSections}
        </div>
      </main>
    </div>
  );
}
