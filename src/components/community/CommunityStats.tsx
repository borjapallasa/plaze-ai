
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Copy, ExternalLink, Settings, Trash2 } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/dialog";

interface CommunityStatsProps {
  paymentLink: string;
  onCopyPaymentLink: () => void;
  hasCopied: boolean;
  webhook: string;
  setWebhook: (value: string) => void;
  community: any;
  showDeleteDialog: boolean;
  setShowDeleteDialog: (show: boolean) => void;
  isDeleting: boolean;
  onDeleteCommunity: (redirectUrl: string) => void;
  communityName: string;
  affiliateSection: React.ReactNode;
  communityStatus?: string;
  setCommunityStatus?: (status: string) => void;
  onSave?: () => void;
  isSaving?: boolean;
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
  communityName,
  affiliateSection,
  communityStatus,
  setCommunityStatus,
  onSave,
  isSaving
}: CommunityStatsProps) {
  return (
    <div className="space-y-6">
      {/* Community Status Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Community Status</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex-1">
              <Label htmlFor="status" className="text-sm font-medium">
                Status
              </Label>
              <Select value={communityStatus || "visible"} onValueChange={setCommunityStatus}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="visible">Visible</SelectItem>
                  <SelectItem value="not visible">Not Visible</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex-shrink-0 sm:ml-3">
              <Button
                onClick={onSave}
                disabled={isSaving}
                className="w-full sm:w-auto"
              >
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Community Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Community Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Members</p>
              <p className="text-2xl font-bold">{community?.member_count || 0}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Revenue</p>
              <p className="text-2xl font-bold">${community?.total_revenue || 0}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Products</p>
              <p className="text-2xl font-bold">{community?.product_count || 0}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Classrooms</p>
              <p className="text-2xl font-bold">{community?.classroom_count || 0}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Link Section */}
      {paymentLink && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Payment Link</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                value={paymentLink}
                readOnly
                className="flex-1"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={onCopyPaymentLink}
                className="flex-shrink-0"
              >
                <Copy className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => window.open(paymentLink, '_blank')}
                className="flex-shrink-0"
              >
                <ExternalLink className="h-4 w-4" />
              </Button>
            </div>
            {hasCopied && (
              <p className="text-sm text-green-600">Payment link copied to clipboard!</p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Webhook Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Webhook URL</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="webhook">Webhook URL</Label>
            <Input
              id="webhook"
              value={webhook}
              onChange={(e) => setWebhook(e.target.value)}
              placeholder="Enter webhook URL"
            />
            <p className="text-sm text-muted-foreground">
              This URL will receive notifications about community events.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Affiliate Section */}
      {affiliateSection}

      {/* Danger Zone */}
      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-destructive">Danger Zone</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Delete Community</h4>
              <p className="text-sm text-muted-foreground">
                Permanently delete this community and all its data.
              </p>
            </div>
            <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Community</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete "{communityName}"? This action cannot be undone and will permanently remove all community data, members, and content.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => onDeleteCommunity('/account/communities')}
                    disabled={isDeleting}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    {isDeleting ? "Deleting..." : "Delete Community"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
