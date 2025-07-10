
-- Drop the existing update policy
DROP POLICY IF EXISTS "Allow status update by classroom or community expert" ON classrooms;

-- Create a more robust update policy for classrooms
CREATE POLICY "Allow classroom updates by owner" ON classrooms
FOR UPDATE 
USING (
  auth.uid() IN (
    -- Direct classroom expert ownership
    SELECT e.user_uuid 
    FROM experts e 
    WHERE e.expert_uuid = classrooms.expert_uuid
    
    UNION
    
    -- Community expert ownership (classroom belongs to expert's community)
    SELECT e.user_uuid
    FROM experts e
    JOIN communities c ON c.expert_uuid = e.expert_uuid
    WHERE c.community_uuid = classrooms.community_uuid
  )
)
WITH CHECK (
  auth.uid() IN (
    -- Direct classroom expert ownership
    SELECT e.user_uuid 
    FROM experts e 
    WHERE e.expert_uuid = classrooms.expert_uuid
    
    UNION
    
    -- Community expert ownership (classroom belongs to expert's community)
    SELECT e.user_uuid
    FROM experts e
    JOIN communities c ON c.expert_uuid = e.expert_uuid
    WHERE c.community_uuid = classrooms.community_uuid
  )
);
