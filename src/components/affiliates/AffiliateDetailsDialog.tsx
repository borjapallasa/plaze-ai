
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Transaction {
  template: string;
  amount: string;
  multiplier: number;
  affiliateFee: string;
  date: string;
}

interface AffiliateDetailsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  affiliate: {
    name: string;
    status: string;
    activeTemplates: number;
    totalSales: string;
    affiliateFees: string;
  };
}

const transactions: Transaction[] = [
  {
    template: "Zoom Meeting Summarizer & Transcripter",
    amount: "$39.95",
    multiplier: 0.03,
    affiliateFee: "$1.20",
    date: "2/11/2024, 3:58 PM"
  },
  {
    template: "Automated Onboarding (Contract, Payments & Channels) Process to Discord",
    amount: "$59.95",
    multiplier: 0.03,
    affiliateFee: "$1.80",
    date: "2/16/2024, 5:33 PM"
  },
  {
    template: "Automated SEO Article Writer to Shopify And Wordpress With Airtable Interface",
    amount: "$99.95",
    multiplier: 0.03,
    affiliateFee: "$3.00",
    date: "3/28/2024, 9:58 AM"
  },
  {
    template: "IG Lead Qualification Chatbot With Manychat Poll",
    amount: "$59.95",
    multiplier: 0.03,
    affiliateFee: "$1.80",
    date: "3/28/2024, 10:41 PM"
  }
];

export function AffiliateDetailsDialog({ isOpen, onClose, affiliate }: AffiliateDetailsDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] flex flex-col p-8">
        <div className="space-y-12 flex-1 overflow-y-auto">
          <div className="space-y-2">
            <h2 className="text-4xl font-bold">{affiliate.name}</h2>
            <p className="text-muted-foreground text-lg">{affiliate.status}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">Active Templates</h3>
              <p className="text-3xl font-semibold">{affiliate.activeTemplates}</p>
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">Total Sales</h3>
              <p className="text-3xl font-semibold">{affiliate.totalSales}</p>
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">Affiliate Fees</h3>
              <p className="text-3xl font-semibold">{affiliate.affiliateFees}</p>
            </div>
          </div>

          <Tabs defaultValue="affiliates" className="space-y-6">
            <TabsList className="w-full justify-start">
              <TabsTrigger value="affiliates">Affiliates</TabsTrigger>
              <TabsTrigger value="transactions">Transactions</TabsTrigger>
              <TabsTrigger value="partnerships">Partnerships</TabsTrigger>
              <TabsTrigger value="payouts">Payouts</TabsTrigger>
            </TabsList>

            <TabsContent value="affiliates" className="space-y-6">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                <Input
                  placeholder="Type here to search"
                  className="pl-12 py-4 text-base"
                />
              </div>

              <div className="overflow-auto border rounded-lg">
                <div className="min-w-[800px]">
                  <div className="sticky top-0 bg-muted/50 z-10">
                    <div className="grid grid-cols-5 gap-6 p-4">
                      <div className="font-medium text-base">Template</div>
                      <div className="font-medium text-right text-base">Transaction Amount</div>
                      <div className="font-medium text-right text-base">Multiplier</div>
                      <div className="font-medium text-right text-base">Affiliate Fee</div>
                      <div className="font-medium text-right text-base">Transaction Date</div>
                    </div>
                  </div>
                  <div className="divide-y">
                    {transactions.map((transaction, index) => (
                      <div key={index} className="grid grid-cols-5 gap-6 p-4 hover:bg-muted/50">
                        <div className="truncate text-base">{transaction.template}</div>
                        <div className="text-right text-base">{transaction.amount}</div>
                        <div className="text-right text-base">{transaction.multiplier}</div>
                        <div className="text-right text-base">{transaction.affiliateFee}</div>
                        <div className="text-right text-base">{transaction.date}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="transactions" className="min-h-[300px] flex items-center justify-center text-muted-foreground">
              Transactions tab content
            </TabsContent>

            <TabsContent value="partnerships" className="min-h-[300px] flex items-center justify-center text-muted-foreground">
              Partnerships tab content
            </TabsContent>

            <TabsContent value="payouts" className="min-h-[300px] flex items-center justify-center text-muted-foreground">
              Payouts tab content
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}
