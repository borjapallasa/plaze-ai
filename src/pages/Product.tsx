import { MainHeader } from "@/components/MainHeader";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { ProductGallery } from "@/components/product/ProductGallery";
import { ProductHeader } from "@/components/product/ProductHeader";
import { ProductReviews } from "@/components/product/ProductReviews";
import { MoreFromSeller } from "@/components/product/MoreFromSeller";
import { StickyATC } from "@/components/product/StickyATC";
import { VariantPicker } from "@/components/product/VariantPicker";
import { ProductInfo } from "@/components/product/ProductInfo";
import { ProductDemo } from "@/components/product/ProductDemo";
import { RelatedProducts } from "@/components/product/RelatedProducts";
import { useToast } from "@/components/ui/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";

const getPlaceholderImage = () => "https://images.unsplash.com/photo-1649972904349-6e44c42644a7";

export default function Product() {
  const [selectedVariant, setSelectedVariant] = useState<string | undefined>();
  const [showStickyATC, setShowStickyATC] = useState(false);
  const variantsRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const { id, slug } = useParams();
  const navigate = useNavigate();

  const { data: product, isLoading: isLoadingProduct, error: productError } = useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      console.log('Fetching product with ID:', id);
      
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('product_uuid', id)
        .maybeSingle();
      
      if (error) {
        console.error('Error fetching product:', error);
        throw error;
      }
      
      console.log('Product data:', data);
      
      if (!data) {
        return null;
      }

      if (data && (!slug || slug !== data.slug)) {
        navigate(`/product/${data.slug}/${data.product_uuid}`, { replace: true });
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

      if (error) throw error;

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

  const { data: reviews, isLoading: isLoadingReviews } = useQuery({
    queryKey: ['reviews', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('product_uuid', id)
        .eq('status', 'published')
        .order('created_at', { ascending: false });

      if (error) throw error;

      return data.map(review => ({
        id: review.review_uuid,
        author: review.buyer_name || 'Anonymous',
        rating: review.rating || 5,
        content: review.title || 'No title provided',
        description: review.comments || 'No comments provided',
        avatar: getPlaceholderImage(),
        date: new Date(review.created_at).toLocaleDateString(),
        itemQuality: review.rating || 5,
        shipping: review.rating || 5,
        customerService: review.rating || 5
      }));
    }
  });

  const { data: moreFromSeller, isLoading: isLoadingMoreFromSeller } = useQuery({
    queryKey: ['moreFromSeller', product?.user_uuid],
    queryFn: async () => {
      if (!product?.user_uuid) return [];
      
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('user_uuid', product.user_uuid)
        .neq('product_uuid', id)
        .limit(12);

      if (error) throw error;

      return data.map(product => ({
        title: product.name,
        price: product.tech_stack_price || "$99.99",
        image: getPlaceholderImage(),
        seller: "Design Master",
        description: product.description || "No description provided",
        tags: product.tech_stack ? product.tech_stack.split(',').slice(0, 2) : [],
        category: product.type || "design"
      }));
    },
    enabled: !!product?.user_uuid
  });

  const { data: relatedProducts, isLoading: isLoadingRelated } = useQuery({
    queryKey: ['relatedProducts', product?.use_case],
    queryFn: async () => {
      if (!product?.use_case) return [];
      
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('use_case', product.use_case)
        .neq('product_uuid', id)
        .limit(12);

      if (error) throw error;

      return data.map(product => ({
        title: product.name,
        price: product.tech_stack_price || "$99.99",
        image: getPlaceholderImage(),
        seller: "Design Master",
        description: product.description || "No description provided",
        tags: product.tech_stack ? product.tech_stack.split(',').slice(0, 2) : [],
        category: product.type || "design"
      }));
    },
    enabled: !!product?.use_case
  });

  useEffect(() => {
    if (variants?.length > 0 && !selectedVariant) {
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

  if (isLoadingProduct) {
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
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
            <p className="text-muted-foreground mb-8">
              Sorry, we couldn't find the product you're looking for. It may have been removed or the URL might be incorrect.
            </p>
            <Button 
              onClick={() => navigate('/')}
              className="inline-flex items-center"
            >
              Return to Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const productVariants = variants || [];
  const productReviews = reviews || [];

  const averageRating = reviews?.length 
    ? Number((reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length).toFixed(1))
    : 0;

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
            rating={averageRating}
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
            onClick={() => console.log("Contact seller clicked")}
          >
            <MessageCircle className="h-4 w-4" />
            Contact Seller
          </Button>

          <Card className="p-6 mb-8">
            <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
              {product.description}
            </p>
          </Card>

          <div className="mb-8">
            <ProductDemo demo={product.demo} />
          </div>

          <Card className="p-6 mb-8">
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="hidden lg:block">
              <ProductGallery 
                image={getPlaceholderImage()}
                className="mb-8" 
              />
              <Card className="p-6 mb-8">
                <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                  {product.description}
                </p>
              </Card>
            </div>
          </div>

          <div className="hidden lg:block">
            <ProductHeader 
              title={product.name}
              seller="Design Master"
              rating={averageRating}
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
              onClick={() => console.log("Contact seller clicked")}
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

        <div className="hidden lg:block">
          <ProductDemo demo={product.demo} />
        </div>
        <ProductReviews reviews={productReviews} className="p-6" />
        <MoreFromSeller expert_uuid={product.expert_uuid} className="mb-24" />
        {relatedProducts && relatedProducts.length > 0 && (
          <RelatedProducts products={relatedProducts} />
        )}
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
