
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

  const { data: product, isLoading: isLoadingProduct } = useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      console.log('Fetching product with ID:', id);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('product_uuid', id)
        .single();
      
      if (error) throw error;
      console.log('Product data:', data);
      return data;
    },
    enabled: !!id
  });

  const { data: existingVariants = [], isLoading: isLoadingVariants, refetch: refetchVariants } = useQuery({
    queryKey: ['variants', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('variants')
        .select('*')
        .eq('product_uuid', id);
      
      if (error) throw error;
      return data || [];
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
      // First delete all existing variants for this product
      const { error: deleteError } = await supabase
        .from('variants')
        .delete()
        .eq('product_uuid', id);

      if (deleteError) throw deleteError;

      // Then insert the new variants
      const { error: insertError } = await supabase
        .from('variants')
        .insert(
          variants.map(variant => ({
            ...variant,
            product_uuid: id,
            user_uuid: (supabase.auth.getUser())?.data?.user?.id,
            price: parseFloat(variant.price),
            compare_price: variant.comparePrice ? parseFloat(variant.comparePrice) : null,
            tags: variant.tags || []
          }))
        );

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
