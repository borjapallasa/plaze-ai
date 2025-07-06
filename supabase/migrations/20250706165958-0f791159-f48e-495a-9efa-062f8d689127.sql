
-- Fix the RLS policy to properly match community owners with their community subscriptions
DROP POLICY IF EXISTS "Users can update their own subscriptions or experts can manage their community subscriptions" ON public.community_subscriptions;

CREATE POLICY "Users can update their own subscriptions or experts can manage their community subscriptions" 
ON public.community_subscriptions 
FOR UPDATE 
USING (
  -- Users can update their own subscriptions
  (user_uuid = auth.uid()) 
  OR 
  -- Experts can update subscriptions for communities they own
  (community_uuid IN (
    SELECT communities.community_uuid
    FROM communities
    WHERE communities.expert_uuid = (
      SELECT users.expert_uuid
      FROM users
      WHERE users.user_uuid = auth.uid()
    )
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
  -- Experts can set any status for subscriptions in communities they own
  (community_uuid IN (
    SELECT communities.community_uuid
    FROM communities
    WHERE communities.expert_uuid = (
      SELECT users.expert_uuid
      FROM users
      WHERE users.user_uuid = auth.uid()
    )
  ))
  OR
  -- Admins can set any status
  (
    SELECT users.is_admin
    FROM users
    WHERE users.user_uuid = auth.uid()
  )
);
