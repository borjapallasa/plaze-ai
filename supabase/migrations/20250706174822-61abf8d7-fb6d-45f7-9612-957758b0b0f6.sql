
-- Drop the conflicting restrictive policy
DROP POLICY IF EXISTS "Users can update their own subscriptions or experts can manage their community subscriptions" ON public.community_subscriptions;

-- Create a simple policy for users to leave communities (set their own status to inactive)
CREATE POLICY "Users can leave communities by setting status to inactive" 
ON public.community_subscriptions 
FOR UPDATE 
USING (user_uuid = auth.uid())
WITH CHECK (
  (user_uuid = auth.uid()) AND (status = 'inactive'::community_subscription_status)
);

-- The "Community owners can update subscription status" policy already exists and should handle expert updates
