
-- Update the RLS policy for affiliate_products to allow community insertions
DROP POLICY IF EXISTS "Allow experts to insert their own products" ON public.affiliate_products;

-- Create a new policy that handles both products and communities
CREATE POLICY "Allow experts to insert their own products and communities" 
ON public.affiliate_products 
FOR INSERT 
WITH CHECK (
  -- For product-based affiliate products
  (
    product_uuid IS NOT NULL 
    AND community_uuid IS NULL 
    AND EXISTS (
      SELECT 1
      FROM users u
      JOIN products p ON p.product_uuid = affiliate_products.product_uuid
      WHERE u.user_uuid = auth.uid() 
        AND u.is_expert = true 
        AND p.user_uuid = auth.uid()
    )
  )
  OR
  -- For community-based affiliate products
  (
    community_uuid IS NOT NULL 
    AND product_uuid IS NULL 
    AND EXISTS (
      SELECT 1
      FROM users u
      JOIN communities c ON c.community_uuid = affiliate_products.community_uuid
      WHERE u.user_uuid = auth.uid() 
        AND u.is_expert = true 
        AND c.user_uuid = auth.uid()
    )
  )
);
