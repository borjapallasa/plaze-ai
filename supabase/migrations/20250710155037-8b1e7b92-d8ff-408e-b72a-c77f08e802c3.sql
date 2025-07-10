
-- Drop the problematic policy that causes infinite recursion
DROP POLICY IF EXISTS "Users can insert relationships for their own products" ON public.product_relationships;

-- Create a security definer function to check product ownership
CREATE OR REPLACE FUNCTION public.user_owns_product(product_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.products 
    WHERE product_uuid = product_id 
    AND user_uuid = auth.uid()
  );
$$;

-- Create a new INSERT policy using the security definer function
CREATE POLICY "Users can insert relationships for their own products"
ON public.product_relationships
FOR INSERT
WITH CHECK (
  public.user_owns_product(product_uuid)
);
