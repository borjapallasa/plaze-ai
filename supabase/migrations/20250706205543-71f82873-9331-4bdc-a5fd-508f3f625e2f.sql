
-- Fix the admin update policy for affiliates table to allow proper updates
DROP POLICY IF EXISTS "Allow admins to update affiliate status and paypal" ON public.affiliates;

CREATE POLICY "Allow admins to update affiliate status and paypal" 
ON public.affiliates 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE users.user_uuid = auth.uid() 
    AND users.is_admin = true
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM users 
    WHERE users.user_uuid = auth.uid() 
    AND users.is_admin = true
  )
);
