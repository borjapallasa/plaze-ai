
import { supabase } from "@/integrations/supabase/client";
import type { ProductImage } from "@/types/product-images";

export async function uploadImageToStorage(file: File, productUuid: string): Promise<{ publicUrl: string; storagePath: string }> {
  const fileExt = file.name.split('.').pop();
  const storagePath = `${productUuid}/${crypto.randomUUID()}.${fileExt}`;
  
  const { error: uploadError } = await supabase.storage
    .from('product_images')
    .upload(storagePath, file);

  if (uploadError) throw uploadError;

  const { data: { publicUrl } } = supabase.storage
    .from('product_images')
    .getPublicUrl(storagePath);

  return { publicUrl, storagePath };
}

export async function updateProductThumbnail(productUuid: string, imageUrl: string) {
  const { error: thumbnailError } = await supabase
    .from('products')
    .update({ thumbnail: imageUrl })
    .eq('product_uuid', productUuid);

  if (thumbnailError) throw thumbnailError;
}

export async function updateImagePrimaryStatus(imageId: number, isPrimary: boolean) {
  const { error } = await supabase
    .from('product_images')
    .update({ is_primary: isPrimary })
    .eq('id', imageId);

  if (error) throw error;
}

export const sortImagesByPrimary = (images: ProductImage[]): ProductImage[] => {
  return [...images].sort((a, b) => (b.is_primary ? 1 : 0) - (a.is_primary ? 1 : 0));
};
