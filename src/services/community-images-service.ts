import { supabase } from "@/integrations/supabase/client";
import type { CommunityImage } from "@/types/community-images";

export async function fetchCommunityImages(communityUuid: string): Promise<CommunityImage[]> {
  const { data, error } = await supabase
    .from('community_images')
    .select('*')
    .eq('community_uuid', communityUuid)
    .order('is_primary', { ascending: false });

  if (error) throw error;

  return await Promise.all(data.map(async (image) => {
    const { data: { publicUrl } } = supabase.storage
      .from('community_images')
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

export async function insertCommunityImage(communityUuid: string, data: {
  storage_path: string;
  file_name: string;
  content_type: string;
  size: number;
  is_primary: boolean;
}) {
  const { data: insertedData, error } = await supabase
    .from('community_images')
    .insert({
      community_uuid: communityUuid,
      storage_path: data.storage_path,
      file_name: data.file_name,
      content_type: data.content_type,
      size: data.size,
      is_primary: data.is_primary
    })
    .select()
    .single();

  if (error) throw error;
  return insertedData;
}

export async function updateCommunityImage(imageId: number, updates: {
  file_name?: string;
  alt_text?: string;
}) {
  const { error } = await supabase
    .from('community_images')
    .update(updates)
    .eq('id', imageId);

  if (error) throw error;
}

export async function deleteCommunityImage(imageId: number, storagePath: string) {
  const { error: storageError } = await supabase.storage
    .from('community_images')
    .remove([storagePath]);

  if (storageError) throw storageError;

  const { error: dbError } = await supabase
    .from('community_images')
    .delete()
    .eq('id', imageId);

  if (dbError) throw dbError;
}
