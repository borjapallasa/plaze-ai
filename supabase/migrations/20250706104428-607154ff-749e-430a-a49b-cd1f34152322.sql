
-- Create a security definer function to check admin status safely
CREATE OR REPLACE FUNCTION public.is_user_admin(user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(is_admin, false) 
  FROM users 
  WHERE user_uuid = user_id;
$$;

-- Drop existing problematic policies that might cause recursion
DROP POLICY IF EXISTS "Admin users can see all experts" ON public.experts;
DROP POLICY IF EXISTS "Admins can update expert status" ON public.experts;

-- Create new safe policies using the security definer function
CREATE POLICY "Admin users can see all experts" 
  ON public.experts 
  FOR SELECT 
  USING (public.is_user_admin(auth.uid()));

CREATE POLICY "Admins can update expert status" 
  ON public.experts 
  FOR UPDATE 
  USING (public.is_user_admin(auth.uid()))
  WITH CHECK (public.is_user_admin(auth.uid()));

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.is_user_admin(uuid) TO authenticated;
