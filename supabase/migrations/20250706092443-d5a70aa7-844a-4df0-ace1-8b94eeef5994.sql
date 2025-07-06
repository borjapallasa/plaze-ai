
-- Create a security definer function to check if an expert exists for a user
-- This function runs with elevated privileges and bypasses RLS policies
CREATE OR REPLACE FUNCTION public.user_has_expert_profile(user_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.experts 
    WHERE user_uuid = user_id
  );
$$;

-- Drop the existing problematic INSERT policy
DROP POLICY IF EXISTS "Allow authenticated users to insert experts with status in revi" ON public.experts;

-- Create a new INSERT policy that uses the security definer function
CREATE POLICY "Users can create expert profile if none exists"
ON public.experts
FOR INSERT
WITH CHECK (
  (status = 'in review'::expert_status) 
  AND (user_uuid = auth.uid()) 
  AND (NOT public.user_has_expert_profile(auth.uid()))
);
