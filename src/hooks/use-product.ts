
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ProductData } from '@/types/Product';
import { useToast } from '@/components/ui/use-toast';

// Maps the raw data from Supabase to our ProductData type
const mapProductData = (data: any): ProductData => {
  if (!data) return null;
  
  return {
    product_uuid: data.product_uuid,
    name: data.name || '',
    description: data.description || '',
    thumbnail: data.thumbnail || '',
    slug: data.slug || '',
    variant_count: data.variant_count || 0,
    price_from: data.price_from || 0,
    created_at: data.created_at || '',
    status: data.status || '',
    type: data.type || '',
    free_or_paid: data.free_or_paid || '',
    accept_terms: data.accept_terms === null ? false : Boolean(data.accept_terms),
    affiliate_information: data.affiliate_information || '',
    affiliate_program: data.affiliate_program === null ? false : Boolean(data.affiliate_program),
    affiliation_amount: data.affiliation_amount || null,
    change_reasons: data.change_reasons || null,
    changes_neeeded: data.changes_neeeded || null,
    demo: data.demo || '',
    fees_amount: data.fees_amount || null,
    product_includes: data.product_includes || null,
    public_link: data.public_link || null,
    related_products: data.related_products || [],
    reviewed_by: data.reviewed_by || null,
    sales_amount: data.sales_amount || null,
    sales_count: data.sales_count || null,
    tech_stack: data.tech_stack || null,
    tech_stack_price: data.tech_stack_price || null,
    difficulty_level: data.difficulty_level || null,
    use_case: data.use_case || null,
    utm_campaign: data.utm_campaign || null,
    utm_content: data.utm_content || null,
    utm_id: data.utm_id || null,
    utm_medium: data.utm_medium || null,
    utm_source: data.utm_source || null,
    utm_term: data.utm_term || null,
    platform: data.platform || null,
    team: data.team || null,
    industries: data.industries || null,
    expert_uuid: data.expert_uuid || null,
    user_uuid: data.user_uuid || null,
  };
};

interface UseProductDataProps {
  productId?: string;
  productSlug?: string;
}

export function useProductData({ productId, productSlug }: UseProductDataProps = {}) {
  const [product, setProduct] = useState<ProductData | null>(null);
  const [variants, setVariants] = useState<any[]>([]);
  const [relatedProductsWithVariants, setRelatedProductsWithVariants] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [averageRating, setAverageRating] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchProductData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        let productQuery = supabase
          .from('products')
          .select('*')
          .eq('status', 'live') // This is intentionally 'live', we'll handle the type conversion inside

        if (productId) {
          productQuery = productQuery.eq('product_uuid', productId);
        } else if (productSlug) {
          productQuery = productQuery.eq('slug', productSlug);
        } else {
          throw new Error("Either productId or productSlug must be provided.");
        }

        const { data: productData, error: productError } = await productQuery.single();

        if (productError) {
          setError(productError);
          toast({
            title: "Error",
            description: "Failed to load product data.",
            variant: "destructive"
          });
          return;
        }

        const mappedProduct = mapProductData(productData);
        setProduct(mappedProduct);

        // Fetch variants
        const { data: variantsData, error: variantsError } = await supabase
          .from('variants')
          .select('*')
          .eq('product_uuid', mappedProduct.product_uuid)
          .order('highlighted', { ascending: false });

        if (variantsError) {
          setError(variantsError);
          toast({
            title: "Error",
            description: "Failed to load product variants.",
            variant: "destructive"
          });
          return;
        }

        setVariants(variantsData);

        // Fetch related products with variants
        if (mappedProduct.related_products && mappedProduct.related_products.length > 0) {
          const { data: relatedProductsData, error: relatedProductsError } = await supabase
            .from('products')
            .select('*, variants(*)')
            .in('product_uuid', mappedProduct.related_products)
            .eq('status', 'live'); // This is intentionally 'live'

          if (relatedProductsError) {
            setError(relatedProductsError);
            toast({
              title: "Error",
              description: "Failed to load related products.",
              variant: "destructive"
            });
            return;
          }

          setRelatedProductsWithVariants(relatedProductsData || []);
        }

        // Use custom query for reviews since product_reviews might not be a direct table
        try {
          const { data: reviewsData, error: reviewsError } = await supabase
            .from('reviews')
            .select('*')
            .eq('product_uuid', mappedProduct.product_uuid);

          if (reviewsError) {
            console.error("Error fetching reviews:", reviewsError);
          } else {
            setReviews(reviewsData || []);

            if (reviewsData && reviewsData.length > 0) {
              // Calculate average based on the actual field from the reviews table
              const totalRating = reviewsData.reduce((sum, review) => {
                return sum + (review.rating || 0);
              }, 0);
              const avgRating = totalRating / reviewsData.length;
              setAverageRating(avgRating);
            } else {
              setAverageRating(0);
            }
          }
        } catch (reviewErr) {
          console.error("Error in reviews processing:", reviewErr);
        }

      } catch (err: any) {
        setError(err);
        toast({
          title: "Error",
          description: "An unexpected error occurred.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProductData();
  }, [productId, productSlug, toast]);

  return {
    product,
    variants,
    relatedProductsWithVariants,
    reviews,
    averageRating,
    isLoading,
    error
  };
}

// Export the hook to be used elsewhere
export { useProductData as useProduct };
