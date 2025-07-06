
-- Update the RLS policy for community_subscriptions to allow experts to update to any status
DROP POLICY IF EXISTS "Users can set their own subscriptions to inactive" ON public.community_subscriptions;

CREATE POLICY "Users can update their own subscriptions or experts can manage their community subscriptions" 
ON public.community_subscriptions 
FOR UPDATE 
USING (
  -- Users can update their own subscriptions
  (user_uuid = auth.uid()) 
  OR 
  -- Experts can update subscriptions for their communities
  (expert_uuid = (
    SELECT users.expert_uuid
    FROM users
    WHERE users.user_uuid = auth.uid()
  )) 
  OR 
  -- Admins can update everything
  (
    SELECT users.is_admin
    FROM users
    WHERE users.user_uuid = auth.uid()
  )
)
WITH CHECK (
  -- Users can only set their own subscriptions to inactive (for leaving communities)
  ((user_uuid = auth.uid()) AND (status = 'inactive'::community_subscription_status))
  OR
  -- Experts can set any status for their community subscriptions
  (expert_uuid = (
    SELECT users.expert_uuid
    FROM users
    WHERE users.user_uuid = auth.uid()
  ))
  OR
  -- Admins can set any status
  (
    SELECT users.is_admin
    FROM users
    WHERE users.user_uuid = auth.uid()
  )
);
