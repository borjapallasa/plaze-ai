
import React from "react";
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
import { Copy } from "lucide-react";
import { useAffiliatePartnerships } from "@/hooks/use-affiliate-partnerships";
import { useToast } from "@/hooks/use-toast";

export function PartnershipsTab() {
  const { data: partnerships = [], isLoading, error } = useAffiliatePartnerships();
  const { toast } = useToast();

  const getTypeBadge = (type: string) => {
    switch (type.toLowerCase()) {
      case "product":
        return <Badge variant="default">Product</Badge>;
      case "service":
        return <Badge variant="secondary">Service</Badge>;
      case "expert":
        return <Badge variant="outline">Expert</Badge>;
      default:
        return <Badge variant="secondary">{type}</Badge>;
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
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Expert UUID</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="text-right">Revenue</TableHead>
            <TableHead>Affiliate Link</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {partnerships.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                No partnerships found
              </TableCell>
            </TableRow>
          ) : (
            partnerships.map((partnership) => (
              <TableRow key={partnership.affiliate_partnership_uuid}>
                <TableCell>
                  <div className="font-medium">{partnership.name}</div>
                </TableCell>
                <TableCell>{getTypeBadge(partnership.type)}</TableCell>
                <TableCell>
                  <code className="text-xs font-mono bg-muted px-2 py-1 rounded">
                    {partnership.expert_uuid ? partnership.expert_uuid.slice(0, 8) + '...' : 'N/A'}
                  </code>
                </TableCell>
                <TableCell>{partnership.created_at}</TableCell>
                <TableCell className="text-right font-mono">
                  ${partnership.revenue.toLocaleString()}
                </TableCell>
                <TableCell>
                  {partnership.affiliate_link ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyAffiliateLink(partnership.affiliate_link)}
                      className="flex items-center gap-2"
                    >
                      <Copy className="h-4 w-4" />
                      Copy Link
                    </Button>
                  ) : (
                    <span className="text-muted-foreground text-sm">No link</span>
                  )}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
