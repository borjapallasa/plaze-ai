
import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ProductLayout } from "@/components/product/ProductLayout";
import { ProductSkeleton } from "@/components/product/ProductSkeleton";
import { ProductNotFound } from "@/components/product/ProductNotFound";
import { StickyATC } from "@/components/product/StickyATC";

const getPlaceholderImage = () => "https://images.unsplash.com/photo-1649972904349-6e44c42644a7";

export default function Product() {
  const [selectedVariant, setSelectedVariant] = useState<string | undefined>();
  const [showStickyATC, setShowStickyATC] = useState(false);
  const variantsRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const { id } = useParams();
  const navigate = useNavigate();

  console.log("Product page - id from params:", id);

  const { data: product, isLoading: isLoadingProduct, error: productError } = useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      console.log("Fetching product with ID:", id);

      if (!id) {
        console.error("No product ID provided");
        return null;
      }

      // Try to fetch by product_uuid first
      let { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('product_uuid', id)
        .maybeSingle();
      
      // If no data found and no error, try with slug
      if (!data && !error) {
        console.log("No product found by UUID, trying with slug...");
        ({ data, error } = await supabase
          .from('products')
          .select('*')
          .eq('slug', id)
          .maybeSingle());
      }
      
      if (error) {
        console.error("Error fetching product:", error);
        throw error;
      }
      
      if (!data) {
        console.log("No product found");
        return null;
      }
      
      console.log("Product data found:", data);
      
      return {
        ...data,
        demo: data.demo || null
      };
    },
    enabled: !!id
  });

  // Fetch related products using the new product_relationships table
  const { data: relatedProductIds = [] } = useQuery({
    queryKey: ['productRelationships', product?.product_uuid],
    queryFn: async () => {
      if (!product?.product_uuid) return [];
      
      const { data, error } = await supabase
        .from('product_relationships')
        .select('related_product_uuid')
        .eq('product_uuid', product.product_uuid)
        .order('display_order', { ascending: true });
      
      if (error) {
        console.error("Error fetching product relationships:", error);
        return [];
      }
      
      return data.map(item => item.related_product_uuid);
    },
    enabled: !!product?.product_uuid
  });

  const { data: variants = [], isLoading: isLoadingVariants } = useQuery({
    queryKey: ['variants', product?.product_uuid],
    queryFn: async () => {
      console.log("Fetching variants for product:", product?.product_uuid);

      if (!product?.product_uuid) {
        return [];
      }

      const { data, error } = await supabase
        .from('variants')
        .select('*')
        .eq('product_uuid', product.product_uuid)
        .order('price', { ascending: true });

      if (error) {
        console.error("Error fetching variants:", error);
        throw error;
      }

      console.log("Variants found:", data.length);

      return data.map((variant, index) => ({
        id: variant.variant_uuid,
        name: variant.name || "Lorem Ipsum Package",
        price: variant.price || 99.99,
        comparePrice: variant.compare_price || 149.99,
        label: "Package",
        highlight: variant.highlighted || index === 1,
        features: Array.isArray(variant.tags) 
          ? variant.tags.map(tag => String(tag))
          : ["Core Features", "Basic Support"]
      }));
    },
    enabled: !!product?.product_uuid
  });

  const { data: reviews = [] } = useQuery({
    queryKey: ['reviews', product?.product_uuid],
    queryFn: async () => {
      console.log("Fetching reviews for product:", product?.product_uuid);

      if (!product?.product_uuid) {
        return [];
      }

      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('product_uuid', product.product_uuid)
        .eq('status', 'published')
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Error fetching reviews:", error);
        throw error;
      }

      console.log("Reviews found:", data.length);

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
        customerService: review.rating || 5,
        type: review.transaction_type?.toLowerCase() || 'product'
      }));
    },
    enabled: !!product?.product_uuid
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

  if (isLoadingProduct || isLoadingVariants) {
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
        product={{
          ...product,
          related_products: relatedProductIds // Pass the related product IDs to the layout
        }}
        variants={variants}
        selectedVariant={selectedVariant}
        averageRating={averageRating}
        onVariantChange={setSelectedVariant}
        onAddToCart={handleAddToCart}
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
