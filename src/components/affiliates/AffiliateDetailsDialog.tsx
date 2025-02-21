
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

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
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
        <div className="space-y-8 flex-1 overflow-y-auto">
          <div>
            <h2 className="text-3xl font-bold">{affiliate.name}</h2>
            <p className="text-muted-foreground">{affiliate.status}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Active Templates</h3>
              <p className="text-2xl font-semibold">{affiliate.activeTemplates}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Total Sales</h3>
              <p className="text-2xl font-semibold">{affiliate.totalSales}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Affiliate Fees</h3>
              <p className="text-2xl font-semibold">{affiliate.affiliateFees}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Type here to search"
                className="pl-10"
              />
            </div>

            <div className="overflow-auto border rounded-lg">
              <div className="min-w-[800px]">
                <div className="sticky top-0 bg-muted/50 z-10">
                  <div className="grid grid-cols-5 gap-4 p-3">
                    <div className="font-medium">Template</div>
                    <div className="font-medium text-right">Transaction Amount</div>
                    <div className="font-medium text-right">Multiplier</div>
                    <div className="font-medium text-right">Affiliate Fee</div>
                    <div className="font-medium text-right">Transaction Date</div>
                  </div>
                </div>
                <div className="divide-y">
                  {transactions.map((transaction, index) => (
                    <div key={index} className="grid grid-cols-5 gap-4 p-3 hover:bg-muted/50">
                      <div className="truncate">{transaction.template}</div>
                      <div className="text-right">{transaction.amount}</div>
                      <div className="text-right">{transaction.multiplier}</div>
                      <div className="text-right">{transaction.affiliateFee}</div>
                      <div className="text-right">{transaction.date}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
