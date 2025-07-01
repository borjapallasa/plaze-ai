
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface ExpertPartnership {
  affiliate_partnership_uuid: string;
  name: string;
  type: string;
  status: string;
  created_at: string;
  affiliate_split: number;
  expert_split: number;
  revenue: number;
  affiliate_link: string;
  message: string;
  questions_answered: Array<{
    question: string;
    answer: string;
  }>;
}

export function useExpertPartnerships(expertUuid: string | undefined) {
  return useQuery({
    queryKey: ['expert-partnerships', expertUuid],
    queryFn: async (): Promise<ExpertPartnership[]> => {
      if (!expertUuid) {
        return [];
      }

      const { data, error } = await supabase
        .from('affiliate_partnerships')
        .select('*')
        .eq('expert_uuid', expertUuid)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching expert partnerships:', error);
        throw error;
      }

      return data?.map(partnership => ({
        affiliate_partnership_uuid: partnership.affiliate_partnership_uuid,
        name: partnership.name || 'Unnamed Partnership',
        type: partnership.type || 'product',
        status: partnership.status || 'pending',
        created_at: partnership.created_at,
        affiliate_split: partnership.affiliate_split || 0,
        expert_split: partnership.expert_split || 0,
        revenue: partnership.revenue || 0,
        affiliate_link: partnership.affiliate_link || '',
        message: partnership.message || '',
        questions_answered: Array.isArray(partnership.questions_answered) 
          ? partnership.questions_answered.map((qa: any) => ({
              question: qa.question || '',
              answer: qa.answer || ''
            }))
          : []
      })) || [];
    },
    enabled: !!expertUuid,
  });
}
