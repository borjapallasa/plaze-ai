
-- Drop the existing update policy and create a simpler one
DROP POLICY IF EXISTS "Allow classroom updates by owner" ON classrooms;

-- Create a more straightforward update policy
CREATE POLICY "Allow classroom updates by owner" ON classrooms
FOR UPDATE 
USING (
  -- Allow if user owns the community that contains this classroom
  community_uuid IN (
    SELECT c.community_uuid 
    FROM communities c
    JOIN experts e ON e.expert_uuid = c.expert_uuid
    WHERE e.user_uuid = auth.uid()
  )
)
WITH CHECK (
  -- Same condition for WITH CHECK
  community_uuid IN (
    SELECT c.community_uuid 
    FROM communities c
    JOIN experts e ON e.expert_uuid = c.expert_uuid
    WHERE e.user_uuid = auth.uid()
  )
);
