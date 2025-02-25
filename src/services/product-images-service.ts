
import { supabase } from "@/integrations/supabase/client";
import type { ProductImage } from "@/types/product-images";

export async function fetchProductImages(productUuid: string): Promise<ProductImage[]> {
  const { data, error } = await supabase
    .from('product_images')
    .select('*')
    .eq('product_uuid', productUuid)
    .order('is_primary', { ascending: false });

  if (error) throw error;

  return await Promise.all(data.map(async (image) => {
    const { data: { publicUrl } } = supabase.storage
      .from('product_images')
      .getPublicUrl(image.storage_path);

    return {
      id: image.id,
      url: publicUrl,
      storage_path: image.storage_path,
      is_primary: image.is_primary,
      file_name: image.file_name,
      alt_text: image.alt_text
    };
  }));
}

export async function insertProductImage(productUuid: string, data: {
  storage_path: string;
  file_name: string;
  content_type: string;
  size: number;
  is_primary: boolean;
}) {
  const { data: insertedData, error } = await supabase
    .from('product_images')
    .insert(data)
    .select()
    .single();

  if (error) throw error;
  return insertedData;
}

export async function updateProductImage(imageId: number, updates: {
  file_name?: string;
  alt_text?: string;
}) {
  const { error } = await supabase
    .from('product_images')
    .update(updates)
    .eq('id', imageId);

  if (error) throw error;
}

export async function deleteProductImage(imageId: number, storagePath: string) {
  const { error: storageError } = await supabase.storage
    .from('product_images')
    .remove([storagePath]);

  if (storageError) throw storageError;

  const { error: dbError } = await supabase
    .from('product_images')
    .delete()
    .eq('id', imageId);

  if (dbError) throw dbError;
}
