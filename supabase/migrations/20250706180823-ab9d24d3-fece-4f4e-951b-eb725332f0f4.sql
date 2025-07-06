
-- Fix infinite recursion in affiliates RLS policies by using security definer functions
-- and add trigger to update users.is_affiliate

-- First, drop the problematic policies that might cause recursion
DROP POLICY IF EXISTS "Allow users to read their own affiliate record if exists" ON public.affiliates;
DROP POLICY IF EXISTS "Allow users to insert their own affiliate record if none exists" ON public.affiliates;

-- Create a security definer function to safely check if user already has affiliate record
CREATE OR REPLACE FUNCTION public.user_has_affiliate_record(user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM affiliates 
    WHERE user_uuid = user_id
  );
$$;

-- Create new safe policies for affiliates table
CREATE POLICY "Users can read their own affiliate data" 
ON public.affiliates 
FOR SELECT 
USING (user_uuid = auth.uid());

CREATE POLICY "Users can insert affiliate record if none exists" 
ON public.affiliates 
FOR INSERT 
WITH CHECK (
  user_uuid = auth.uid() 
  AND NOT public.user_has_affiliate_record(auth.uid())
  AND status = 'new'::affiliate_status
);

-- Create function to update user's is_affiliate flag when affiliate record is created
CREATE OR REPLACE FUNCTION public.handle_new_affiliate()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Update the users table to set is_affiliate = true
  UPDATE users 
  SET is_affiliate = true 
  WHERE user_uuid = NEW.user_uuid;
  
  RETURN NEW;
END;
$$;

-- Create trigger to automatically update users.is_affiliate when affiliate record is created
DROP TRIGGER IF EXISTS on_affiliate_created ON public.affiliates;
CREATE TRIGGER on_affiliate_created
  AFTER INSERT ON public.affiliates
  FOR EACH ROW 
  EXECUTE FUNCTION public.handle_new_affiliate();

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION public.user_has_affiliate_record(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.handle_new_affiliate() TO authenticated;
