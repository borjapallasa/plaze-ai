
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";

export function AffiliateDashboard() {
  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-8">
          <div>
            <p className="text-lg mb-2">info@optimalpath.ai</p>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Your Affiliate Link</p>
                <p className="font-medium">https://nocodeclick.com/sign-up?ref=BorjaLBLY</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Number Of Affiliates</p>
                <p className="font-medium">4</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Commissions</p>
                <p className="font-medium">$121.14</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Available Commissions</p>
                <p className="font-medium">$121.14</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Paid Out Commissions</p>
                <p className="font-medium">$0.00</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Paypal Account</p>
                <p className="font-medium">-</p>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button>Request Payout</Button>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
