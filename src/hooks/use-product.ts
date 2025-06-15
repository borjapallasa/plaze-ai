import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ProductData } from '@/types/Product';
import { useToast } from '@/components/ui/use-toast';
import { useParams } from 'react-router-dom';

// Maps the raw data from Supabase to our ProductData type
const mapProductData = (data: any): ProductData => {
  if (!data) return null;

  return {
    id: data.id,
    product_uuid: data.product_uuid,
    name: data.name || '',
    description: data.description || '',
    thumbnail: data.thumbnail || '',
    slug: data.slug || '',
    variant_count: data.variant_count || 0,
    price_from: data.price_from || 0,
    created_at: data.created_at || '',
    status: data.status || '',
    type: data.type || null,
    free_or_paid: data.free_or_paid || null,
    accept_terms: data.accept_terms === null ? null : Boolean(data.accept_terms),
    affiliate_information: data.affiliate_information || null,
    affiliate_program: data.affiliate_program === null ? null : Boolean(data.affiliate_program),
    affiliation_amount: data.affiliation_amount || null,
    change_reasons: data.change_reasons || null,
    changes_neeeded: data.changes_neeeded || null,
    demo: data.demo || '',
    fees_amount: data.fees_amount || null,
    product_includes: data.product_includes || '',
    public_link: data.public_link || null,
    related_products: data.related_products || [],
    reviewed_by: data.reviewed_by || null,
    review_count: data.review_count || null,
    sales_amount: data.sales_amount || null,
    sales_count: data.sales_count || null,
    tech_stack: data.tech_stack || '',
    tech_stack_price: data.tech_stack_price || '',
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
    product_files: data.product_files || null,
  };
};

interface UseProductDataProps {
  productId?: string;
  productSlug?: string;
}

export function useProduct({ productId, productSlug }: UseProductDataProps = {}) {
  const params = useParams();
  const [product, setProduct] = useState<ProductData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();
  
  // Use URL params if direct props aren't provided
  const effectiveProductId = productId || params.id;
  const effectiveProductSlug = productSlug || params.slug;

  useEffect(() => {
    const fetchProductData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        console.log("Fetching product with ID:", effectiveProductId, "or slug:", effectiveProductSlug);
        
        let productQuery = supabase
          .from('products')
          .select('*')
          .eq('status', 'active')

        if (effectiveProductId) {
          productQuery = productQuery.eq('product_uuid', effectiveProductId);
        } else if (effectiveProductSlug) {
          productQuery = productQuery.eq('slug', effectiveProductSlug);
        } else {
          throw new Error("Either productId or productSlug must be provided.");
        }

        const { data: productData, error: productError } = await productQuery.single();

        if (productError) {
          console.error("Error fetching product:", productError);
          setError(productError);
          toast({
            title: "Error",
            description: "Failed to load product data.",
            variant: "destructive"
          });
          return;
        }

        console.log("Product data retrieved:", productData);
        const mappedProduct = mapProductData(productData);
        setProduct(mappedProduct);

      } catch (err: any) {
        console.error("Error in useProduct hook:", err);
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

    if (effectiveProductId || effectiveProductSlug) {
      fetchProductData();
    } else {
      setIsLoading(false);
      setError(new Error("No product ID or slug provided"));
    }
  }, [effectiveProductId, effectiveProductSlug, toast]);

  return {
    product,
    isLoading,
    error
  };
}
