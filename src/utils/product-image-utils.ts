
import { supabase } from "@/integrations/supabase/client";
import type { ProductImage } from "@/types/product-images";

// Ensure bucket exists before uploading
async function ensureBucketExists() {
  const { data: buckets } = await supabase.storage.listBuckets();
  if (!buckets?.some(bucket => bucket.id === 'product_images')) {
    const { error } = await supabase.storage.createBucket('product_images', {
      public: true,
      fileSizeLimit: 10485760, // 10MB
      allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
    });
    if (error) throw error;
  }
}

export async function uploadImageToStorage(file: File, productUuid: string): Promise<{ publicUrl: string; storagePath: string }> {
  console.log('uploadImageToStorage: Starting upload for product:', productUuid);
  
  // Ensure bucket exists
  await ensureBucketExists();
  
  const fileExt = file.name.split('.').pop();
  const storagePath = `${productUuid}/${crypto.randomUUID()}.${fileExt}`;
  
  console.log('uploadImageToStorage: Uploading to path:', storagePath);

  const { error: uploadError } = await supabase.storage
    .from('product_images')
    .upload(storagePath, file);

  if (uploadError) {
    console.error('uploadImageToStorage: Upload error:', uploadError);
    throw uploadError;
  }

  console.log('uploadImageToStorage: Upload successful');

  const { data: { publicUrl } } = supabase.storage
    .from('product_images')
    .getPublicUrl(storagePath);

  console.log('uploadImageToStorage: Generated public URL:', publicUrl);

  return { publicUrl, storagePath };
}

export async function updateProductThumbnail(productUuid: string, imageUrl: string) {
  console.log('updateProductThumbnail: Updating thumbnail for product:', productUuid);
  
  const { error: thumbnailError } = await supabase
    .from('products')
    .update({ thumbnail: imageUrl })
    .eq('product_uuid', productUuid);

  if (thumbnailError) {
    console.error('updateProductThumbnail: Update error:', thumbnailError);
    throw thumbnailError;
  }

  console.log('updateProductThumbnail: Successfully updated thumbnail');
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

