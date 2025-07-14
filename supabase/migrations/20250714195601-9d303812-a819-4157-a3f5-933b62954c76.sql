
-- Fix the RLS policy to avoid the "more than one row returned by a subquery" error
DROP POLICY IF EXISTS "Allow experts to update their own community products" ON public.community_products;

CREATE POLICY "Allow experts to update their own community products" 
ON public.community_products 
FOR UPDATE 
USING (
  -- User must be an expert
  (EXISTS ( SELECT 1
   FROM users
  WHERE ((users.user_uuid = auth.uid()) AND (users.is_expert = true))))
  AND 
  -- Community must belong to the expert
  (community_uuid IN ( SELECT communities.community_uuid
   FROM communities
  WHERE (communities.expert_uuid = ( SELECT experts.expert_uuid
           FROM experts
          WHERE (experts.user_uuid = auth.uid())
          LIMIT 1))))
)
WITH CHECK (
  -- User must be an expert
  (EXISTS ( SELECT 1
   FROM users
  WHERE ((users.user_uuid = auth.uid()) AND (users.is_expert = true))))
  AND 
  -- Community must belong to the expert
  (community_uuid IN ( SELECT communities.community_uuid
   FROM communities
  WHERE (communities.expert_uuid = ( SELECT experts.expert_uuid
           FROM experts
          WHERE (experts.user_uuid = auth.uid())
          LIMIT 1))))
  AND
  -- Ensure the community_product_uuid remains the same (prevent changing the UUID)
  (community_product_uuid = (SELECT cp.community_product_uuid 
                              FROM community_products cp 
                              WHERE cp.community_product_uuid = community_products.community_product_uuid))
);
