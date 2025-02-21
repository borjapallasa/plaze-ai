
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";

export function AffiliateDashboard() {
  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-6">
          <div className="space-y-4 w-full">
            <p className="text-lg mb-2">info@optimalpath.ai</p>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Your Affiliate Link</p>
                <p className="font-medium break-all">https://nocodeclick.com/sign-up?ref=BorjaLBLY</p>
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
          <div className="flex flex-col gap-2 w-full md:w-auto mt-4 md:mt-0">
            <Button className="w-full md:w-auto">Request Payout</Button>
            <Button variant="ghost" size="icon" className="hidden md:inline-flex">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
