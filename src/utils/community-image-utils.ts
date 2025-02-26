import { supabase } from "@/integrations/supabase/client";
import type { CommunityImage } from "@/types/community-images";

export async function uploadImageToStorage(file: File, communityUuid: string) {
  const fileExt = file.name.split('.').pop();
  const filePath = `${communityUuid}/${crypto.randomUUID()}.${fileExt}`;

  const { error: uploadError } = await supabase.storage
    .from('community_images')
    .upload(filePath, file);

  if (uploadError) throw uploadError;

  const { data: { publicUrl } } = supabase.storage
    .from('community_images')
    .getPublicUrl(filePath);

  return { publicUrl, storagePath: filePath };
}

export async function updateCommunityThumbnail(communityUuid: string, thumbnailUrl: string) {
  const { error } = await supabase
    .from('communities')
    .update({ thumbnail: thumbnailUrl })
    .eq('community_uuid', communityUuid);

  if (error) throw error;
}

export async function updateImagePrimaryStatus(imageId: number, isPrimary: boolean) {
  const { error } = await supabase
    .from('community_images')
    .update({ is_primary: isPrimary })
    .eq('id', imageId);

  if (error) throw error;
}

export function sortImagesByPrimary(images: CommunityImage[]) {
  return [...images].sort((a, b) => {
    if (a.is_primary === b.is_primary) return 0;
    return a.is_primary ? -1 : 1;
  });
}
