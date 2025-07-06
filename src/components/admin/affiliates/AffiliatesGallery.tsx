
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { CheckCircle, XCircle, User, DollarSign, Calendar } from "lucide-react";
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

interface AffiliatesGalleryProps {
  affiliates: Affiliate[];
  sortField: keyof Affiliate;
  sortDirection: "asc" | "desc";
  onSort: (field: keyof Affiliate) => void;
}

export function AffiliatesGallery({ affiliates }: AffiliatesGalleryProps) {
  const queryClient = useQueryClient();

  const getStatusBadge = (status: string | null) => {
    switch (status) {
      case 'active':
        return <Badge variant="secondary" className="bg-green-100 text-green-800">Active</Badge>;
      case 'inactive':
        return <Badge variant="secondary" className="bg-red-100 text-red-800">Inactive</Badge>;
      case 'new':
        return <Badge variant="secondary" className="bg-orange-100 text-orange-800">New</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const handleUpdateStatus = async (affiliateUuid: string, newStatus: 'active' | 'inactive') => {
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {affiliates.map((affiliate) => (
        <Card key={affiliate.id} className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-gray-100 p-2 rounded-full">
                  <User className="h-5 w-5 text-gray-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">
                    {affiliate.email || 'N/A'}
                  </h3>
                  <code className="text-xs bg-muted px-2 py-1 rounded">
                    {affiliate.affiliate_code || 'N/A'}
                  </code>
                </div>
              </div>
              {getStatusBadge(affiliate.status)}
            </div>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-green-600" />
                <div>
                  <p className="text-muted-foreground text-xs">Made</p>
                  <p className="font-medium">${affiliate.commissions_made?.toFixed(2) || '0.00'}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-blue-600" />
                <div>
                  <p className="text-muted-foreground text-xs">Available</p>
                  <p className="font-medium">${affiliate.commissions_available?.toFixed(2) || '0.00'}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>Joined {new Date(affiliate.created_at).toLocaleDateString()}</span>
            </div>

            <div className="flex items-center gap-2 pt-2">
              {affiliate.status === 'new' && (
                <>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleUpdateStatus(affiliate.affiliate_uuid, 'active')}
                    className="text-green-600 border-green-600 hover:bg-green-50 flex-1"
                  >
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleUpdateStatus(affiliate.affiliate_uuid, 'inactive')}
                    className="text-red-600 border-red-600 hover:bg-red-50 flex-1"
                  >
                    <XCircle className="h-4 w-4 mr-1" />
                    Reject
                  </Button>
                </>
              )}
              {affiliate.status === 'active' && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleUpdateStatus(affiliate.affiliate_uuid, 'inactive')}
                  className="text-red-600 border-red-600 hover:bg-red-50 w-full"
                >
                  <XCircle className="h-4 w-4 mr-1" />
                  Deactivate
                </Button>
              )}
              {affiliate.status === 'inactive' && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleUpdateStatus(affiliate.affiliate_uuid, 'active')}
                  className="text-green-600 border-green-600 hover:bg-green-50 w-full"
                >
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Activate
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
