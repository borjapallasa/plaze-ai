// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://jbibqnxjagmgocqjtdim.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpiaWJxbnhqYWdtZ29jcWp0ZGltIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzY0MjA4NTksImV4cCI6MjA1MTk5Njg1OX0.PAm7UyVvfoFClP1ASNxFiezfNyu1LeaBOMlfKFE9TrY";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);