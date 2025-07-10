
import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Copy, XCircle } from "lucide-react";
import { useAffiliatePartnerships } from "@/hooks/use-affiliate-partnerships";
import { useToast } from "@/hooks/use-toast";
import { useDeactivatePartnership } from "@/hooks/use-deactivate-partnership";
import { DeactivatePartnershipDialog } from "@/components/partnerships/DeactivatePartnershipDialog";
import { toStartCase } from "@/lib/utils";

export function PartnershipsTab() {
  const { data: partnerships = [], isLoading, error } = useAffiliatePartnerships();
  const { toast } = useToast();
  const deactivatePartnership = useDeactivatePartnership();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedPartnership, setSelectedPartnership] = useState<{
    uuid: string;
    name: string;
  } | null>(null);

  // Filter out rejected partnerships
  const filteredPartnerships = partnerships.filter(
    partnership => partnership.status?.toLowerCase() !== 'rejected'
  );

  const getTypeBadge = (type: string) => {
    const formattedType = toStartCase(type);
    switch (type.toLowerCase()) {
      case "product":
        return <Badge variant="default">{formattedType}</Badge>;
      case "community":
        return <Badge variant="default">{formattedType}</Badge>;
      case "service":
        return <Badge variant="secondary">Service</Badge>;
      case "expert":
        return <Badge variant="outline">Expert</Badge>;
      default:
        return <Badge variant="secondary">{formattedType}</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case "active":
        return <Badge variant="default">Active</Badge>;
      case "pending":
        return <Badge variant="warning">Pending</Badge>;
      case "inactive":
        return <Badge variant="secondary">Inactive</Badge>;
      default:
        return <Badge variant="secondary">{status || 'Unknown'}</Badge>;
    }
  };

  const copyAffiliateLink = async (link: string) => {
    if (!link) {
      toast({
        title: "No link available",
        description: "This partnership doesn't have an affiliate link yet",
        variant: "destructive",
      });
      return;
    }

    try {
      await navigator.clipboard.writeText(link);
      toast({
        title: "Link copied!",
        description: "Affiliate link has been copied to your clipboard",
      });
    } catch (err) {
      console.error('Failed to copy affiliate link:', err);
      toast({
        title: "Copy failed",
        description: "Failed to copy affiliate link to clipboard",
        variant: "destructive",
      });
    }
  };

  const handleDeactivateClick = (partnership: any) => {
    setSelectedPartnership({
      uuid: partnership.affiliate_partnership_uuid,
      name: partnership.name
    });
    setDialogOpen(true);
  };

  const handleConfirmDeactivate = () => {
    if (selectedPartnership) {
      deactivatePartnership.mutate(selectedPartnership.uuid, {
        onSuccess: () => {
          setDialogOpen(false);
          setSelectedPartnership(null);
        }
      });
    }
  };

  if (isLoading) {
    return (
      <div className="rounded-md border">
        <div className="p-8 text-center text-muted-foreground">
          Loading partnerships...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-md border">
        <div className="p-8 text-center text-red-500">
          Error loading partnerships: {error.message}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[15%]">Name</TableHead>
              <TableHead className="w-[10%]">Type</TableHead>
              <TableHead className="w-[12%]">Split</TableHead>
              <TableHead className="w-[10%]">Status</TableHead>
              <TableHead className="w-[12%]">Created</TableHead>
              <TableHead className="w-[12%] text-center">Revenue</TableHead>
              <TableHead className="w-[20%]">Affiliate Link</TableHead>
              <TableHead className="w-[9%]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPartnerships.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                  No partnerships found
                </TableCell>
              </TableRow>
            ) : (
              filteredPartnerships.map((partnership) => (
                <TableRow key={partnership.affiliate_partnership_uuid}>
                  <TableCell className="w-[15%]">
                    <div className="font-medium">{partnership.name}</div>
                  </TableCell>
                  <TableCell className="w-[10%]">{getTypeBadge(partnership.type)}</TableCell>
                  <TableCell className="w-[12%]">
                    <div className="font-mono text-sm">
                      {partnership.expert_split ? `${(partnership.expert_split * 100).toFixed(0)}%` : 'N/A'}
                    </div>
                  </TableCell>
                  <TableCell className="w-[10%]">{getStatusBadge(partnership.status)}</TableCell>
                  <TableCell className="w-[12%]">{partnership.created_at}</TableCell>
                  <TableCell className="w-[12%] text-center font-mono">
                    ${partnership.revenue.toLocaleString()}
                  </TableCell>
                  <TableCell className="w-[20%]">
                    {partnership.affiliate_link ? (
                      <div className="flex items-center gap-2">
                        <code className="text-xs bg-muted px-2 py-1 rounded flex-1 truncate">
                          {partnership.affiliate_link}
                        </code>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyAffiliateLink(partnership.affiliate_link)}
                          className="flex items-center gap-1 px-2 shrink-0"
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    ) : (
                      <span className="text-muted-foreground text-sm">No link</span>
                    )}
                  </TableCell>
                  <TableCell className="w-[9%]">
                    {partnership.status?.toLowerCase() === 'active' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeactivateClick(partnership)}
                        className="flex items-center gap-1 px-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <XCircle className="h-3 w-3" />
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <DeactivatePartnershipDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onConfirm={handleConfirmDeactivate}
        partnershipName={selectedPartnership?.name || ""}
        isLoading={deactivatePartnership.isPending}
      />
    </>
  );
}
