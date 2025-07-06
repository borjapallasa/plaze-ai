
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { CheckCircle, XCircle, Pause, User, DollarSign, Calendar, MoreHorizontal } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

interface Affiliate {
  id: number;
  affiliate_uuid: string;
  user_uuid: string | null;
  email: string | null;
  status: string | null;
  affiliate_code: string | null;
  paypal: string | null;
  commissions_made: number | null;
  commissions_available: number | null;
  commissions_paid: number | null;
  created_at: string;
}

interface AffiliatesListProps {
  affiliates: Affiliate[];
  sortField: keyof Affiliate;
  sortDirection: "asc" | "desc";
  onSort: (field: keyof Affiliate) => void;
}

export function AffiliatesList({ affiliates }: AffiliatesListProps) {
  const queryClient = useQueryClient();

  const getStatusBadge = (status: string | null) => {
    switch (status) {
      case 'active':
        return <Badge variant="secondary" className="bg-green-100 text-green-800">Active</Badge>;
      case 'inactive':
        return <Badge variant="secondary" className="bg-red-100 text-red-800">Inactive</Badge>;
      case 'new':
        return <Badge variant="secondary" className="bg-orange-100 text-orange-800">New</Badge>;
      case 'accepted':
        return <Badge variant="secondary" className="bg-green-100 text-green-800">Accepted</Badge>;
      case 'rejected':
        return <Badge variant="secondary" className="bg-red-100 text-red-800">Rejected</Badge>;
      case 'suspended':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Suspended</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const handleUpdateStatus = async (affiliateUuid: string, newStatus: 'accepted' | 'rejected' | 'suspended') => {
    try {
      const { error } = await supabase
        .from('affiliates')
        .update({ status: newStatus })
        .eq('affiliate_uuid', affiliateUuid);

      if (error) {
        console.error('Error updating affiliate status:', error);
        toast.error("Failed to update affiliate status");
        return;
      }

      toast.success(`Affiliate status updated to ${newStatus}`);
      queryClient.invalidateQueries({ queryKey: ['admin-affiliates'] });
    } catch (error) {
      console.error('Error updating affiliate status:', error);
      toast.error("An unexpected error occurred");
    }
  };

  if (affiliates.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No affiliates found
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {affiliates.map((affiliate) => (
        <div
          key={affiliate.id}
          className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
        >
          <div className="flex items-center gap-4 flex-1">
            <div className="bg-gray-100 p-2 rounded-full">
              <User className="h-5 w-5 text-gray-600" />
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-1">
                <h3 className="font-semibold text-sm">
                  {affiliate.email || 'N/A'}
                </h3>
                {getStatusBadge(affiliate.status)}
              </div>
              
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <code className="bg-muted px-2 py-1 rounded text-xs">
                  {affiliate.affiliate_code || 'N/A'}
                </code>
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  <span>Joined {new Date(affiliate.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            <div className="hidden sm:flex items-center gap-6 text-sm">
              <div className="flex items-center gap-1">
                <DollarSign className="h-4 w-4 text-green-600" />
                <div>
                  <p className="text-muted-foreground text-xs">Made</p>
                  <p className="font-medium">${affiliate.commissions_made?.toFixed(2) || '0.00'}</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <DollarSign className="h-4 w-4 text-blue-600" />
                <div>
                  <p className="text-muted-foreground text-xs">Available</p>
                  <p className="font-medium">${affiliate.commissions_available?.toFixed(2) || '0.00'}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 ml-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() => handleUpdateStatus(affiliate.affiliate_uuid, 'accepted')}
                  className="text-green-600"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Approve
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleUpdateStatus(affiliate.affiliate_uuid, 'rejected')}
                  className="text-red-600"
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Reject
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleUpdateStatus(affiliate.affiliate_uuid, 'suspended')}
                  className="text-yellow-600"
                >
                  <Pause className="h-4 w-4 mr-2" />
                  Suspend
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      ))}
    </div>
  );
}
