
import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ProductLayout } from "@/components/product/ProductLayout";
import { ProductSkeleton } from "@/components/product/ProductSkeleton";
import { ProductNotFound } from "@/components/product/ProductNotFound";
import { ProductDemo } from "@/components/product/ProductDemo";
import { ProductReviews } from "@/components/product/ProductReviews";
import { MoreFromSeller } from "@/components/product/MoreFromSeller";
import { RelatedProducts } from "@/components/product/RelatedProducts";
import { StickyATC } from "@/components/product/StickyATC";
import { ProductInfo } from "@/components/product/ProductInfo";
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
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('product_uuid', id)
        .maybeSingle();
      
      if (error) throw error;
      
      if (!data) return null;

      if (data && (!slug || slug !== data.slug)) {
        navigate(`/product/${data.slug}/${data.product_uuid}`, { replace: true });
      }
      
      return data;
    }
  });

  const { data: variants = [] } = useQuery({
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
    },
    enabled: !!id
  });

  const { data: reviews = [] } = useQuery({
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

  const { data: relatedProducts = [] } = useQuery({
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
    if (variants.length > 0 && !selectedVariant) {
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
    return <ProductSkeleton />;
  }

  if (productError || !product) {
    return <ProductNotFound />;
  }

  const averageRating = reviews.length 
    ? Number((reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length).toFixed(1))
    : 0;

  return (
    <div ref={variantsRef}>
      <ProductLayout
        product={product}
        variants={variants}
        selectedVariant={selectedVariant}
        averageRating={averageRating}
        onVariantChange={setSelectedVariant}
        onAddToCart={handleAddToCart}
      >
        <ProductInfo 
          description={product.description}
          techStack={product.tech_stack}
          productIncludes={product.product_includes}
          difficultyLevel={product.difficulty_level}
          className="mb-8"
        />
        <ProductDemo demo={product.demo} />
        <ProductReviews reviews={reviews} className="mb-8" />
        <MoreFromSeller expert_uuid={product.expert_uuid} className="mb-8" />
        {relatedProducts.length > 0 && (
          <RelatedProducts products={relatedProducts} className="mb-24" />
        )}
      </ProductLayout>
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
