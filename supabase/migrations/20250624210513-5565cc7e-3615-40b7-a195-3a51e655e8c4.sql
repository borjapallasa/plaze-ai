
-- Update the trigger function to extract first_name and last_name from user metadata
CREATE OR REPLACE FUNCTION public.handle_new_auth_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  INSERT INTO public.users (
    user_uuid,
    email,
    first_name,
    last_name,
    is_affiliate,
    is_admin
  ) VALUES (
    new.id,
    new.email,
    new.raw_user_meta_data ->> 'first_name',
    new.raw_user_meta_data ->> 'last_name',
    false,
    false
  );
  RETURN new;
END;
$function$
