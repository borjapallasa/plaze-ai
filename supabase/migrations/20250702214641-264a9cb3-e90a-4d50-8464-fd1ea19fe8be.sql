
-- First, let's check if the user exists and update their admin status
UPDATE users 
SET is_admin = true 
WHERE email = 'admin@mrktgxxi.com';

-- If the user doesn't exist yet, let's also make sure any user with this email gets admin access
-- by creating a trigger or updating existing records
UPDATE users 
SET is_admin = true 
WHERE email ILIKE '%admin@mrktgxxi.com%';
