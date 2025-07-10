
-- Drop the existing restrictive INSERT policy that requires ownership of both products
DROP POLICY IF EXISTS "Users can insert their own product relationships" ON public.product_relationships;

-- Create a new, simpler INSERT policy that only requires:
-- 1. User owns the main product (product_uuid)
-- 2. User is authenticated
CREATE POLICY "Users can insert relationships for their own products"
ON public.product_relationships
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM products 
    WHERE product_uuid = product_relationships.product_uuid 
    AND user_uuid = auth.uid()
  )
);
