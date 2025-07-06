
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ArrowUpDown, CheckCircle, XCircle, Pause, MoreHorizontal } from "lucide-react";
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

interface AffiliatesTableProps {
  affiliates: Affiliate[];
  sortField: keyof Affiliate;
  sortDirection: "asc" | "desc";
  onSort: (field: keyof Affiliate) => void;
}

export function AffiliatesTable({ 
  affiliates, 
  sortField, 
  sortDirection, 
  onSort 
}: AffiliatesTableProps) {
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
      // Refetch the data
      queryClient.invalidateQueries({ queryKey: ['admin-affiliates'] });
    } catch (error) {
      console.error('Error updating affiliate status:', error);
      toast.error("An unexpected error occurred");
    }
  };

  const SortButton = ({ field, children }: { field: keyof Affiliate; children: React.ReactNode }) => (
    <Button
      variant="ghost"
      onClick={() => onSort(field)}
      className="h-auto p-0 font-medium hover:bg-transparent"
    >
      {children}
      <ArrowUpDown className="ml-2 h-4 w-4" />
    </Button>
  );

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>
              <SortButton field="email">Email</SortButton>
            </TableHead>
            <TableHead>
              <SortButton field="affiliate_code">Affiliate Code</SortButton>
            </TableHead>
            <TableHead>
              <SortButton field="status">Status</SortButton>
            </TableHead>
            <TableHead>
              <SortButton field="commissions_made">Commissions Made</SortButton>
            </TableHead>
            <TableHead>
              <SortButton field="commissions_available">Available</SortButton>
            </TableHead>
            <TableHead>
              <SortButton field="created_at">Created At</SortButton>
            </TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {affiliates.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                No affiliates found
              </TableCell>
            </TableRow>
          ) : (
            affiliates.map((affiliate) => (
              <TableRow key={affiliate.id}>
                <TableCell className="font-medium">
                  {affiliate.email || 'N/A'}
                </TableCell>
                <TableCell>
                  <code className="text-sm bg-muted px-2 py-1 rounded">
                    {affiliate.affiliate_code || 'N/A'}
                  </code>
                </TableCell>
                <TableCell>
                  {getStatusBadge(affiliate.status)}
                </TableCell>
                <TableCell>
                  ${affiliate.commissions_made?.toFixed(2) || '0.00'}
                </TableCell>
                <TableCell>
                  ${affiliate.commissions_available?.toFixed(2) || '0.00'}
                </TableCell>
                <TableCell>
                  {new Date(affiliate.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell>
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
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
