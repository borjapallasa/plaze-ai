
import React from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { MainHeader } from "@/components/MainHeader";
import { supabase } from "@/integrations/supabase/client";
import { ProductVariantsEditor } from "@/components/product/ProductVariants";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import type { Variant } from "@/components/product/types/variants";

export default function EditProduct() {
  const { id } = useParams();
  const { toast } = useToast();
  const [variants, setVariants] = React.useState<Variant[]>([]);
  const [isSaving, setIsSaving] = React.useState(false);

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
      return data;
    },
    enabled: !!id,
    retry: 1
  });

  const { 
    data: existingVariants = [], 
    isLoading: isLoadingVariants, 
    error: variantsError,
    refetch: refetchVariants 
  } = useQuery({
    queryKey: ['variants', id],
    queryFn: async () => {
      console.log('Fetching variants for product:', id);
      const { data, error } = await supabase
        .from('variants')
        .select('*')
        .eq('product_uuid', id);
      
      if (error) {
        console.error('Error fetching variants:', error);
        throw error;
      }

      console.log('Variants data:', data);

      return (data || []).map(variant => ({
        variant_uuid: variant.variant_uuid,
        id: variant.variant_uuid,
        name: variant.name,
        price: variant.price,
        comparePrice: variant.compare_price,
        highlight: variant.highlighted,
        tags: variant.tags as string[],
      }));
    },
    enabled: !!id
  });

  React.useEffect(() => {
    if (existingVariants.length > 0) {
      setVariants(existingVariants);
    }
  }, [existingVariants]);

  const handleSave = async () => {
    if (!id) return;

    setIsSaving(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) throw new Error("User not authenticated");

      const { error: deleteError } = await supabase
        .from('variants')
        .delete()
        .eq('product_uuid', id);

      if (deleteError) throw deleteError;

      const variantsToInsert = variants.map(variant => ({
        variant_uuid: variant.variant_uuid || variant.id,
        product_uuid: id,
        user_uuid: session.user.id,
        name: variant.name || '',
        price: typeof variant.price === 'string' ? parseFloat(variant.price) : variant.price,
        compare_price: variant.comparePrice ? (typeof variant.comparePrice === 'string' ? parseFloat(variant.comparePrice) : variant.comparePrice) : null,
        highlighted: variant.highlight || false,
        tags: variant.tags || []
      }));

      const { error: insertError } = await supabase
        .from('variants')
        .insert(variantsToInsert);

      if (insertError) throw insertError;

      await refetchVariants();
      
      toast({
        title: "Success",
        description: "Product variants have been saved successfully.",
      });
    } catch (error) {
      console.error('Error saving variants:', error);
      toast({
        title: "Error",
        description: "Failed to save product variants. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (productError || variantsError) {
    return (
      <div className="min-h-screen bg-background">
        <MainHeader />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <p className="text-center text-destructive">
              {productError ? "Error loading product" : "Error loading variants"}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (isLoadingProduct || isLoadingVariants) {
    return (
      <div className="min-h-screen bg-background">
        <MainHeader />
        <div className="container mx-auto px-4 py-8 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <MainHeader />
        <div className="container mx-auto px-4 py-8">
          <p className="text-center text-muted-foreground">Product not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <MainHeader />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">Edit Product Variants</h1>
            <Button 
              onClick={handleSave}
              disabled={isSaving}
              className="min-w-[100px]"
            >
              {isSaving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Save"
              )}
            </Button>
          </div>

          <ProductVariantsEditor 
            variants={variants}
            onVariantsChange={setVariants}
          />
        </div>
      </div>
    </div>
  );
}
