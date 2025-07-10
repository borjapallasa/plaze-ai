
-- Check current RLS policies for product_relationships table
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check 
FROM pg_policies 
WHERE tablename = 'product_relationships';

-- If there are no policies or they're too restrictive, let's create proper RLS policies
-- First, enable RLS if not already enabled
ALTER TABLE public.product_relationships ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can manage their own product relationships" ON public.product_relationships;
DROP POLICY IF EXISTS "Users can view their own product relationships" ON public.product_relationships;
DROP POLICY IF EXISTS "Users can insert their own product relationships" ON public.product_relationships;
DROP POLICY IF EXISTS "Users can update their own product relationships" ON public.product_relationships;
DROP POLICY IF EXISTS "Users can delete their own product relationships" ON public.product_relationships;

-- Create policies that allow users to manage relationships for their own products
CREATE POLICY "Users can view their own product relationships"
ON public.product_relationships
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM products 
    WHERE product_uuid = product_relationships.product_uuid 
    AND user_uuid = auth.uid()
  )
);

CREATE POLICY "Users can insert their own product relationships"
ON public.product_relationships
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM products 
    WHERE product_uuid = product_relationships.product_uuid 
    AND user_uuid = auth.uid()
  )
  AND
  EXISTS (
    SELECT 1 FROM products 
    WHERE product_uuid = product_relationships.related_product_uuid 
    AND user_uuid = auth.uid()
  )
);

CREATE POLICY "Users can update their own product relationships"
ON public.product_relationships
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM products 
    WHERE product_uuid = product_relationships.product_uuid 
    AND user_uuid = auth.uid()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM products 
    WHERE product_uuid = product_relationships.product_uuid 
    AND user_uuid = auth.uid()
  )
  AND
  EXISTS (
    SELECT 1 FROM products 
    WHERE product_uuid = product_relationships.related_product_uuid 
    AND user_uuid = auth.uid()
  )
);

CREATE POLICY "Users can delete their own product relationships"
ON public.product_relationships
FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM products 
    WHERE product_uuid = product_relationships.product_uuid 
    AND user_uuid = auth.uid()
  )
);
