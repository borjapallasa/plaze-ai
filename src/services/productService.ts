
import { supabase } from "@/integrations/supabase/client";
import { Variant } from "@/components/product/types/variants";

export interface ProductUpdateData {
  name: string;
  description: string;
  tech_stack: string;
  tech_stack_price: string;
  product_includes: string;
  difficulty_level: string;
  demo: string;
  industries: string[];
  use_case: string;
  platform: string[];
  team: string[];
}

export const saveProductChanges = async (
  productId: string,
  productData: ProductUpdateData,
  variants: Variant[]
) => {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.user) throw new Error("Not authenticated");

  // Update product
  const { error: productError } = await supabase
    .from('products')
    .update({
      ...productData,
      updated_at: new Date().toISOString()
    })
    .eq('product_uuid', productId);

  if (productError) throw productError;

  if (variants.length > 0) {
    // Delete existing variants
    const { error: deleteError } = await supabase
      .from('variants')
      .delete()
      .eq('product_uuid', productId);

    if (deleteError) throw deleteError;

    // Insert new variants
    const variantsToInsert = variants.map(variant => ({
      variant_uuid: variant.id,
      product_uuid: productId,
      user_uuid: session.user.id,
      name: variant.name,
      price: Number(variant.price) || 0,
      compare_price: Number(variant.comparePrice) || 0,
      highlighted: variant.highlight,
      tags: variant.tags || []
    }));

    const { error: insertError } = await supabase
      .from('variants')
      .insert(variantsToInsert);

    if (insertError) throw insertError;
  }
};
