
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface AffiliateData {
  affiliate_uuid: string;
  user_uuid: string;
  affiliate_code: string;
  status: string;
  commissions_made: number;
  commissions_available: number;
  commissions_paid: number;
  affiliate_count: number;
  email: string;
  paypal: string | null;
  created_at: string;
  // Extended fields for display
  user_name?: string;
  joined_at?: string;
  active_templates?: number;
  multiplier?: number;
  fees?: string;
  total_sales?: string;
}

export function useAffiliates() {
  return useQuery({
    queryKey: ['affiliates'],
    queryFn: async (): Promise<AffiliateData[]> => {
      console.log('Fetching affiliates data...');
      
      const { data, error } = await supabase
        .from('affiliates')
        .select(`
          *,
          users!inner(
            first_name,
            last_name,
            email
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching affiliates:', error);
        throw error;
      }

      console.log('Affiliates data:', data);

      return (data || []).map(affiliate => ({
        affiliate_uuid: affiliate.affiliate_uuid,
        user_uuid: affiliate.user_uuid,
        affiliate_code: affiliate.affiliate_code,
        status: affiliate.status,
        commissions_made: affiliate.commissions_made || 0,
        commissions_available: affiliate.commissions_available || 0,
        commissions_paid: affiliate.commissions_paid || 0,
        affiliate_count: affiliate.affiliate_count || 0,
        email: affiliate.email,
        paypal: affiliate.paypal,
        created_at: affiliate.created_at,
        user_name: affiliate.users ? `${affiliate.users.first_name} ${affiliate.users.last_name}`.trim() : 'Unknown',
        joined_at: new Date(affiliate.created_at).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: 'numeric',
          minute: '2-digit'
        }),
        active_templates: Math.floor(Math.random() * 20), // Mock data for now
        multiplier: affiliate.status === 'accepted' ? 0.03 : null,
        fees: `$${(affiliate.commissions_made || 0).toFixed(2)}`,
        total_sales: `$${((affiliate.commissions_made || 0) / 0.03).toFixed(2)}`
      }));
    }
  });
}
