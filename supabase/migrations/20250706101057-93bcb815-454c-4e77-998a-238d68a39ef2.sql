
-- Create a security definer function to create expert profiles
-- This bypasses RLS by running with elevated privileges
CREATE OR REPLACE FUNCTION public.create_expert_profile(
  p_user_uuid uuid,
  p_email text,
  p_name text,
  p_areas jsonb DEFAULT '[]'::jsonb
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  expert_id uuid;
BEGIN
  -- Insert expert profile
  INSERT INTO public.experts (
    user_uuid,
    email,
    name,
    areas,
    status,
    description
  ) VALUES (
    p_user_uuid,
    p_email,
    p_name,
    p_areas,
    'in review',
    'Expert specializing in ' || (p_areas->>0)
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
GRANT EXECUTE ON FUNCTION public.create_expert_profile(uuid, text, text, jsonb) TO authenticated;
