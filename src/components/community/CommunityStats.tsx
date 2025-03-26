
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";
import { Label } from "@/components/ui/label";
import { CommunityDangerZone } from "./CommunityDangerZone";
import { EditCommunityRelatedProducts } from "./EditCommunityRelatedProduts";

export interface Community {
  community_uuid: string | null
  product_count?: number | null;
  classroom_count?: number | null;
  post_count?: number | null;
  monthly_recurring_revenue?: number | null;
  total_revenue?: number | null;
  paid_member_count?: number | null;
  member_count?: number | null;
  expert_uuid?: string | null;
}
interface CommunityStatsProps {
  paymentLink: string;
  onCopyPaymentLink: () => void;
  hasCopied: boolean;
  webhook: string;
  setWebhook: (value: string) => void;
  community: Community;
  showDeleteDialog: boolean;
  setShowDeleteDialog: (show: boolean) => void;
  isDeleting: boolean;
  onDeleteCommunity: (redirectUrl: string) => void;
  communityName: string; // Add communityName as a separate prop
}

export function CommunityStats({
  paymentLink,
  onCopyPaymentLink,
  hasCopied,
  webhook,
  setWebhook,
  community,
  showDeleteDialog,
  setShowDeleteDialog,
  isDeleting,
  onDeleteCommunity,
  communityName // Use the new prop
}: CommunityStatsProps) {
  const formatNumber = (num: number | null | undefined) => {
    if (num === null || num === undefined) return '0';
    return num.toLocaleString();
  };

  const formatCurrency = (amount: number | null | undefined) => {
    if (amount === null || amount === undefined) return '$0';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <div className="space-y-4">
      <Card className="p-4 sm:p-6 border border-border/40 bg-card/40">
        <h2 className="text-lg font-semibold tracking-tight mb-4">Community Information</h2>
        <div className="space-y-6">
          <div>
            <p className="text-sm text-muted-foreground mb-2">Payment Link</p>
            <div className="flex items-center gap-2">
              <Input
                value={paymentLink}
                readOnly
                className="h-9 text-sm font-medium bg-muted"
              />
              <Button
                size="sm"
                variant="outline"
                className="shrink-0"
                onClick={onCopyPaymentLink}
              >
                {hasCopied ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <p className="text-sm text-muted-foreground">Products</p>
              <p className="text-xl font-semibold">{formatNumber(community?.product_count)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Classrooms</p>
              <p className="text-xl font-semibold">{formatNumber(community?.classroom_count)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Posts</p>
              <p className="text-xl font-semibold">{formatNumber(community?.post_count)}</p>
            </div>
          </div>

          <div className="pt-2 border-t">
            <div className="grid grid-cols-2 gap-x-4 gap-y-3">
              <div>
                <p className="text-sm text-muted-foreground">Monthly Revenue</p>
                <p className="text-xl font-semibold">
                  {formatCurrency(community?.monthly_recurring_revenue)}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
                <p className="text-xl font-semibold">
                  {formatCurrency(community?.total_revenue)}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Paid Members</p>
                <p className="text-xl font-semibold">{formatNumber(community?.paid_member_count)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Members</p>
                <p className="text-xl font-semibold">{formatNumber(community?.member_count)}</p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Add community related products section here */}
      <Card className="p-4 sm:p-6 border border-border/40 bg-card/40">
        <h2 className="text-lg font-semibold tracking-tight mb-4">Related Community Products</h2>
        <EditCommunityRelatedProducts community={community} />
      </Card>

      <Card className="p-4 sm:p-6 border border-border/40 bg-card/40">
        <h2 className="text-lg font-semibold tracking-tight mb-4">Advanced Settings</h2>
        <div>
          <Label htmlFor="webhook" className="text-sm font-medium mb-1 block">
            Webhook URL
          </Label>
          <p className="text-sm text-muted-foreground mb-2">
            We'll send notifications about new members to this webhook URL
          </p>
          <Input
            id="webhook"
            placeholder="Enter webhook URL"
            value={webhook}
            onChange={(e) => setWebhook(e.target.value)}
            className="h-9"
          />
        </div>

        {/* Danger Zone component */}
        <CommunityDangerZone
          communityName={communityName} // Use the communityName prop instead of community.name
          isDeleting={isDeleting}
          showDeleteDialog={showDeleteDialog}
          sellerUuid={community?.expert_uuid || ""}
          setShowDeleteDialog={setShowDeleteDialog}
          onDeleteCommunity={onDeleteCommunity}
        />
      </Card>
    </div>
  );
}
