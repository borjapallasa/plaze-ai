
-- Drop the old version of the function first
DROP FUNCTION IF EXISTS public.create_expert_profile(uuid, text, text, jsonb);

-- Create the new simplified version
CREATE OR REPLACE FUNCTION public.create_expert_profile(
  p_user_uuid uuid,
  p_email text,
  p_name text
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  expert_id uuid;
BEGIN
  -- Insert expert profile with minimal fields
  INSERT INTO public.experts (
    user_uuid,
    email,
    name,
    status
  ) VALUES (
    p_user_uuid,
    p_email,
    p_name,
    'in review'
  )
  RETURNING expert_uuid INTO expert_id;
  
  -- Update users table to set expert_uuid
  UPDATE public.users 
  SET 
    expert_uuid = expert_id,
    is_expert = true
  WHERE user_uuid = p_user_uuid;
  
  RETURN expert_id;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.create_expert_profile(uuid, text, text) TO authenticated;
