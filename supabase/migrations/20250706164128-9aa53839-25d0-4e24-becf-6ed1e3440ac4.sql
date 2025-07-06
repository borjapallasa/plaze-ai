
-- Update the RLS policy for community_subscriptions to allow experts to see all statuses for their communities
DROP POLICY IF EXISTS "Users can view their own active subscriptions or as expert or a" ON public.community_subscriptions;

CREATE POLICY "Users can view their own subscriptions or all statuses as expert or admin" 
ON public.community_subscriptions 
FOR SELECT 
USING (
  -- Users can see their own subscriptions regardless of status
  (user_uuid = auth.uid()) 
  OR 
  -- Experts can see all subscription statuses for their communities
  (expert_uuid = (
    SELECT users.expert_uuid
    FROM users
    WHERE users.user_uuid = auth.uid()
  )) 
  OR 
  -- Admins can see everything
  (
    SELECT users.is_admin
    FROM users
    WHERE users.user_uuid = auth.uid()
  )
);
