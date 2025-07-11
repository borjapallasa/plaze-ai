
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Variant } from '@/components/product/types/variants';

export const useClassroomProducts = (classroomId: string) => {
  return useQuery({
    queryKey: ['classroomProducts', classroomId],
    queryFn: async (): Promise<Variant[]> => {
      if (!classroomId) {
        return [];
      }

      console.log('Fetching classroom products for classroom:', classroomId);
      
      const { data, error } = await supabase
        .from('community_product_relationships')
        .select(`
          community_product_relationship_uuid,
          community_product_uuid!inner(
            community_product_uuid,
            name,
            price,
            files_link
          )
        `)
        .eq('classroom_uuid', classroomId);

      if (error) {
        console.error('Error fetching classroom products:', error);
        throw error;
      }

      console.log('Raw classroom products data:', data);

      // Transform the data to match the Variant interface
      const variants: Variant[] = (data || []).map((item: any) => ({
        id: item.community_product_uuid.community_product_uuid,
        name: item.community_product_uuid.name || 'Unnamed Product',
        price: item.community_product_uuid.price || 0,
        comparePrice: 0,
        label: '',
        highlight: false,
        tags: [],
        features: [],
        hidden: false,
        createdAt: null,
        filesLink: item.community_product_uuid.files_link,
        relationshipUuid: item.community_product_relationship_uuid
      }));

      console.log('Transformed variants:', variants);
      return variants;
    },
    enabled: !!classroomId,
  });
};
