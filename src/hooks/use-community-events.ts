
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useCommunityEvents(communityId: string) {
  return useQuery({
    queryKey: ['community-events', communityId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('events')
        .select('event_uuid, name, description, date, type, location, community_uuid, expert_uuid')
        .eq('community_uuid', communityId)
        .order('date', { ascending: true });

      if (error) {
        console.error('Error fetching community events:', error);
        throw error;
      }

      return data.map(event => ({
        event_uuid: event.event_uuid,
        title: event.name || '',
        description: event.description || '',
        date: new Date(event.date || ''),
        type: event.type || '',
        location: event.location || '',
        community_uuid: event.community_uuid,
        expert_uuid: event.expert_uuid
      }));
    },
    enabled: !!communityId,
  });
}
