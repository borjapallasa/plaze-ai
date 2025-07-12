
-- Drop the problematic INSERT policies that are causing infinite recursion
DROP POLICY IF EXISTS "Users can insert their own product relationships" ON public.product_relationships;
DROP POLICY IF EXISTS "Users can insert relationships for their own products" ON public.product_relationships;

-- Create a simple INSERT policy that only requires ownership of the main product
-- This allows users to relate any active product to their own products
CREATE POLICY "Users can insert relationships for products they own"
ON public.product_relationships
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM products 
    WHERE product_uuid = product_relationships.product_uuid 
    AND user_uuid = auth.uid()
  )
);
