import { MainHeader } from "@/components/MainHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { ProductGallery } from "@/components/product/ProductGallery";
import { ProductHeader } from "@/components/product/ProductHeader";
import { ProductReviews } from "@/components/product/ProductReviews";
import { MoreFromSeller } from "@/components/product/MoreFromSeller";
import { StickyATC } from "@/components/product/StickyATC";
import { VariantPicker } from "@/components/product/VariantPicker";
import { ProductCard } from "@/components/ProductCard";
import { useToast } from "@/components/ui/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

const getPlaceholderImage = () => "https://images.unsplash.com/photo-1649972904349-6e44c42644a7";

export default function Product() {
  const [selectedVariant, setSelectedVariant] = useState<string | undefined>();
  const [showStickyATC, setShowStickyATC] = useState(false);
  const variantsRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const { id } = useParams();

  const { data: product, isLoading: isLoadingProduct, error: productError } = useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('product_uuid', id)
        .single();

      if (error) {
        console.error('Error fetching product:', error);
        throw error;
      }

      return data;
    }
  });

  const { data: variants, isLoading: isLoadingVariants } = useQuery({
    queryKey: ['variants', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('variants')
        .select('*')
        .eq('product_uuid', id)
        .order('price', { ascending: true });

      if (error) {
        console.error('Error fetching variants:', error);
        throw error;
      }

      console.log('Variants data:', data);

      return data.map(variant => ({
        id: variant.variant_uuid,
        name: variant.name || "Lorem Ipsum Package",
        price: variant.price || 99.99,
        comparePrice: variant.compare_price || 149.99,
        label: "Package",
        highlight: variant.highlighted || false,
        features: ["Core Features", "Basic Support"]
      }));
    }
  });

  useEffect(() => {
    if (variants && variants.length > 0 && !selectedVariant) {
      const highlightedVariant = variants.find(v => v.highlight);
      setSelectedVariant(highlightedVariant ? highlightedVariant.id : variants[0].id);
    }
  }, [variants, selectedVariant]);

  useEffect(() => {
    const handleScroll = () => {
      if (variantsRef.current) {
        const variantsRect = variantsRef.current.getBoundingClientRect();
        setShowStickyATC(variantsRect.bottom < -100);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleAddToCart = () => {
    toast({
      title: "Added to cart",
      description: "Your item has been added to the cart.",
    });
  };

  if (isLoadingProduct || isLoadingVariants) {
    return (
      <div className="min-h-screen bg-background">
        <MainHeader />
        <div className="container mx-auto px-4 pt-24 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    );
  }

  if (productError || !product) {
    return (
      <div className="min-h-screen bg-background">
        <MainHeader />
        <div className="container mx-auto px-4 pt-24">
          <div className="text-center text-red-500">
            Product not found or error loading product details.
          </div>
        </div>
      </div>
    );
  }

  const productVariants = variants || [];

  const reviews = [
    { 
      id: 1, 
      author: "John Doe", 
      rating: 5, 
      content: "Excellent course, very detailed",
      description: "The course content is well structured and easy to follow. I learned a lot about UI/UX design principles.",
      avatar: getPlaceholderImage(),
      date: "2 days ago",
      itemQuality: 5,
      shipping: 5,
      customerService: 5
    },
    { 
      id: 2, 
      author: "Jane Smith", 
      rating: 4, 
      content: "Great content, well structured",
      description: "Very comprehensive material with practical examples. Could use more exercises.",
      avatar: getPlaceholderImage(),
      date: "1 week ago",
      itemQuality: 4,
      shipping: 5,
      customerService: 4
    },
    { 
      id: 3, 
      author: "Mike Johnson", 
      rating: 5, 
      content: "Best design course I've taken!",
      description: "The instructor explains complex concepts in a very clear and engaging way.",
      avatar: getPlaceholderImage(),
      date: "2 weeks ago",
      itemQuality: 5,
      shipping: 4,
      customerService: 5
    }
  ];

  const moreFromSeller = Array(12).fill(null).map((_, index) => ({
    title: `Product ${index + 1}`,
    price: "$99.99",
    image: getPlaceholderImage(),
    seller: "Design Master",
    description: "Sample product description",
    tags: ["design", "ui"],
    category: "design"
  }));

  const relatedProducts = Array(12).fill(null).map((_, index) => ({
    title: `Related Product ${index + 1}`,
    price: "$99.99",
    image: getPlaceholderImage(),
    seller: "Another Seller",
    description: "Sample related product description",
    tags: ["design", "ui"],
    category: "design"
  }));

  return (
    <div className="min-h-screen">
      <MainHeader />
      <main className="container mx-auto px-4 pt-24">
        <div className="lg:hidden">
          <ProductGallery 
            image={getPlaceholderImage()} 
            className="mb-6" 
          />
          <ProductHeader 
            title={product.name}
            seller="Design Master"
            rating={4.8}
            className="mb-6"
          />
          <div ref={variantsRef}>
            <VariantPicker
              variants={productVariants}
              selectedVariant={selectedVariant}
              onVariantChange={setSelectedVariant}
              onAddToCart={handleAddToCart}
              className="mb-2"
            />
          </div>
          <Button 
            variant="outline" 
            className="w-full flex items-center justify-center gap-2 mb-8"
            onClick={() => {
              console.log("Contact seller clicked");
            }}
          >
            <MessageCircle className="h-4 w-4" />
            Contact Seller
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2">
            <div className="hidden lg:block">
              <ProductGallery 
                image={getPlaceholderImage()}
                className="mb-8" 
              />
            </div>

            <Card className="p-6 mb-8">
              <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {product.description}
              </p>
            </Card>
          </div>

          <div className="hidden lg:block">
            <ProductHeader 
              title={product.name}
              seller="Design Master"
              rating={4.8}
              className="mb-6"
            />
            <div ref={variantsRef}>
              <VariantPicker
                variants={productVariants}
                selectedVariant={selectedVariant}
                onVariantChange={setSelectedVariant}
                onAddToCart={handleAddToCart}
                className="mb-2"
              />
            </div>

            <Button 
              variant="outline" 
              className="w-full flex items-center justify-center gap-2 mb-6"
              onClick={() => {
                console.log("Contact seller clicked");
              }}
            >
              <MessageCircle className="h-4 w-4" />
              Contact Seller
            </Button>

            <Card className="p-6">
              <h3 className="font-semibold mb-4">Additional Information</h3>
              <div className="space-y-4">
                {product.tech_stack && (
                  <div>
                    <h4 className="font-medium mb-2">Tech Stack</h4>
                    <ul className="list-disc list-inside text-sm text-muted-foreground">
                      {product.tech_stack.split(',').map((tech, index) => (
                        <li key={index}>{tech.trim()}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div>
                  <h4 className="font-medium mb-2">What's Included</h4>
                  <div className="text-sm text-muted-foreground">
                    {product.product_includes || 'No information provided'}
                  </div>
                </div>

                {product.difficulty_level && (
                  <div>
                    <h4 className="font-medium mb-2">Difficulty Level</h4>
                    <span className="text-sm text-muted-foreground">
                      {product.difficulty_level}
                    </span>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>

        <h2 className="text-xl font-semibold mb-4">Demo</h2>
        <Card className="p-6 mb-8">
          {product.demo ? (
            <div dangerouslySetInnerHTML={{ __html: product.demo }} />
          ) : (
            <div className="aspect-video bg-accent rounded-lg"></div>
          )}
        </Card>

        <ProductReviews reviews={reviews} className="p-6 mb-16" />

        <div className="pt-8">
          <MoreFromSeller products={moreFromSeller} className="mt-30" />
        </div>

        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-6">Related Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((product, index) => (
              <ProductCard
                key={index}
                title={product.title}
                price={product.price}
                image={product.image}
                seller={product.seller}
                description={product.description}
                tags={product.tags}
                category={product.category}
              />
            ))}
          </div>
        </div>

        <StickyATC 
          variants={productVariants}
          selectedVariant={selectedVariant}
          onVariantChange={setSelectedVariant}
          visible={showStickyATC}
          onAddToCart={handleAddToCart}
        />
      </main>
    </div>
  );
}
