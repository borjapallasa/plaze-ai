
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useClassroomProducts = (classroomId: string) => {
  return useQuery({
    queryKey: ['classroomProducts', classroomId],
    queryFn: async () => {
      if (!classroomId) return [];

      const { data, error } = await supabase
        .from('community_product_relationships')
        .select(`
          community_product_relationship_uuid,
          community_products (
            community_product_uuid,
            name,
            price,
            product_type,
            files_link,
            payment_link
          )
        `)
        .eq('classroom_uuid', classroomId);

      if (error) {
        console.error("Error fetching classroom products:", error);
        throw error;
      }

      // Transform the data to match the expected Variant interface
      const variants = data?.map(relationship => {
        const product = relationship.community_products;
        if (!product) return null;

        return {
          id: product.community_product_uuid,
          name: product.name,
          price: product.price || 0,
          features: [], // Community products don't have features array
          filesLink: product.files_link,
          paymentLink: product.payment_link,
          relationshipUuid: relationship.community_product_relationship_uuid
        };
      }).filter(Boolean) || [];

      return variants;
    },
    enabled: !!classroomId
  });
};
