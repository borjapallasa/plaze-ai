
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CreditCard, Save } from "lucide-react";
import { useAffiliateData } from "@/hooks/use-affiliate-data";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";

interface PaymentSettingsDialogProps {
  children: React.ReactNode;
}

export function PaymentSettingsDialog({ children }: PaymentSettingsDialogProps) {
  const [open, setOpen] = useState(false);
  const [paypal, setPaypal] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const { data: affiliateData, refetch } = useAffiliateData();

  const handleSave = async () => {
    if (!user?.id) {
      toast.error("User not authenticated");
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('affiliates')
        .update({ paypal })
        .eq('user_uuid', user.id);

      if (error) {
        console.error('Error updating PayPal:', error);
        toast.error("Failed to update PayPal information");
      } else {
        toast.success("PayPal information updated successfully");
        refetch();
        setOpen(false);
      }
    } catch (error) {
      console.error('Error updating PayPal:', error);
      toast.error("Failed to update PayPal information");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (newOpen && affiliateData?.paypal) {
      setPaypal(affiliateData.paypal);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Payment Settings
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="paypal">PayPal Email</Label>
            <Input
              id="paypal"
              type="email"
              placeholder="your-paypal@email.com"
              value={paypal}
              onChange={(e) => setPaypal(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Enter your PayPal email address to receive affiliate payments
            </p>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={isLoading}>
              <Save className="h-4 w-4 mr-2" />
              {isLoading ? "Saving..." : "Save"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
