
-- First, let's check what's in the current policy and fix it
DROP POLICY IF EXISTS "Allow classroom updates by owner" ON classrooms;

-- Create a more comprehensive update policy for classrooms
CREATE POLICY "Allow classroom updates by owner" ON classrooms
FOR UPDATE 
USING (
  -- Allow if the authenticated user is the direct expert owner of the classroom
  (expert_uuid IS NOT NULL AND auth.uid() IN (
    SELECT e.user_uuid 
    FROM experts e 
    WHERE e.expert_uuid = classrooms.expert_uuid
  ))
  
  OR
  
  -- Allow if the authenticated user owns the community that contains this classroom
  (community_uuid IS NOT NULL AND auth.uid() IN (
    SELECT e.user_uuid
    FROM experts e
    JOIN communities c ON c.expert_uuid = e.expert_uuid
    WHERE c.community_uuid = classrooms.community_uuid
  ))
  
  OR
  
  -- Allow if the authenticated user has an expert profile and the classroom has no explicit expert_uuid
  -- but belongs to a community owned by this expert
  (expert_uuid IS NULL AND community_uuid IS NOT NULL AND auth.uid() IN (
    SELECT e.user_uuid
    FROM experts e
    JOIN communities c ON c.expert_uuid = e.expert_uuid
    WHERE c.community_uuid = classrooms.community_uuid
  ))
)
WITH CHECK (
  -- Same conditions for the WITH CHECK constraint
  (expert_uuid IS NOT NULL AND auth.uid() IN (
    SELECT e.user_uuid 
    FROM experts e 
    WHERE e.expert_uuid = classrooms.expert_uuid
  ))
  
  OR
  
  (community_uuid IS NOT NULL AND auth.uid() IN (
    SELECT e.user_uuid
    FROM experts e
    JOIN communities c ON c.expert_uuid = e.expert_uuid
    WHERE c.community_uuid = classrooms.community_uuid
  ))
  
  OR
  
  (expert_uuid IS NULL AND community_uuid IS NOT NULL AND auth.uid() IN (
    SELECT e.user_uuid
    FROM experts e
    JOIN communities c ON c.expert_uuid = e.expert_uuid
    WHERE c.community_uuid = classrooms.community_uuid
  ))
);
